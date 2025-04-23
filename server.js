require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using HTTPS
}));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
    
    // Create tables if they don't exist
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    const createBookingsTable = `
        CREATE TABLE IF NOT EXISTS bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            destination VARCHAR(100) NOT NULL,
            booking_date DATE NOT NULL,
            num_travelers INT DEFAULT 1,
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `;

    const createContactsTable = `
        CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.query(createUsersTable);
    db.query(createBookingsTable);
    db.query(createContactsTable);
});

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.render('signup', { error: 'Username or email already exists' });
                }
                res.redirect('/login');
            }
        );
    } catch (error) {
        res.render('signup', { error: 'Error creating account' });
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, results) => {
            if (err || results.length === 0) {
                return res.render('login', { error: 'Invalid credentials' });
            }
            
            const match = await bcrypt.compare(password, results[0].password);
            if (!match) {
                return res.render('login', { error: 'Invalid credentials' });
            }
            
            req.session.userId = results[0].id;
            req.session.username = results[0].username;
            res.redirect('/dashboard');
        }
    );
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    db.query(
        'SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC',
        [req.session.userId],
        (err, bookings) => {
            if (err) {
                console.error(err);
                return res.render('dashboard', { 
                    username: req.session.username,
                    bookings: [],
                    error: 'Error fetching bookings'
                });
            }
            res.render('dashboard', {
                username: req.session.username,
                bookings: bookings
            });
        }
    );
});

app.get('/book', isAuthenticated, (req, res) => {
    // Get destinations from your database or use static list
    const destinations = [
        'Taj Mahal, Agra',
        'Golden Temple, Amritsar',
        'Lakshadweep Islands',
        'Taj Lake Palace, Udaipur',
        'Kumarakom Lake Resort'
    ];
    
    res.render('booking', {
        username: req.session.username,
        destinations: destinations
    });
});

app.post('/book', isAuthenticated, (req, res) => {
    const { destination, booking_date, num_travelers } = req.body;
    
    db.query(
        'INSERT INTO bookings (user_id, destination, booking_date, num_travelers) VALUES (?, ?, ?, ?)',
        [req.session.userId, destination, booking_date, num_travelers],
        (err) => {
            if (err) {
                console.error(err);
                return res.render('booking', {
                    username: req.session.username,
                    error: 'Error creating booking'
                });
            }
            res.redirect('/dashboard');
        }
    );
});

app.post('/contact', (req, res) => {
    const { name, email, textarea: message } = req.body;
    
    db.query(
        'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
        [name, email, message],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error submitting contact form' });
            }
            res.redirect('/#contact');
        }
    );
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/Dongle', express.static(path.join(__dirname, 'Dongle')));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
