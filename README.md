# TAP Travel Agency

A modern travel agency web application built with Node.js, Express, and MySQL. Features user authentication, booking management, and a beautiful responsive UI.

![TAP Travel Agency](images/heroimage.jpg)

## 🚀 Features

- User Authentication (Login/Signup)
- Destination Browsing
- Booking Management
- Contact Form
- Responsive Design
- Admin Dashboard
- MySQL Database Integration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL](https://www.mysql.com/)
- [Docker](https://www.docker.com/) (optional)

## 🛠️ Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tap-travel-agency.git
cd tap-travel-agency
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=travel_agency
SESSION_SECRET=your_session_secret
```

4. Create the database and tables:
```bash
mysql -u root -p
CREATE DATABASE travel_agency;
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### 🐳 Docker Deployment

1. Using Docker Compose (Recommended):
```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

2. Using Docker directly:
```bash
# Build the image
docker build -t tap-travel-agency .

# Run the container
docker run -p 8080:8080 -d \
  -e DB_HOST=your_db_host \
  -e DB_USER=your_db_user \
  -e DB_PASSWORD=your_db_password \
  -e DB_NAME=travel_agency \
  -e SESSION_SECRET=your_session_secret \
  tap-travel-agency
```

## 📁 Project Structure

```
tap-travel-agency/
├── views/              # EJS templates
│   ├── login.ejs
│   ├── signup.ejs
│   ├── dashboard.ejs
│   └── booking.ejs
├── public/
│   ├── images/        # Image assets
│   ├── style.css      # Styles
│   └── script.js      # Client-side JavaScript
├── server.js          # Main application file
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── package.json       # Project dependencies
```

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| DB_HOST | MySQL database host |
| DB_USER | Database username |
| DB_PASSWORD | Database password |
| DB_NAME | Database name |
| SESSION_SECRET | Secret for session management |
| PORT | Server port (default: 8080) |

## 🚀 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /signup | Create new user account |
| POST | /login | Authenticate user |
| GET | /dashboard | View user bookings |
| POST | /book | Create new booking |
| POST | /contact | Submit contact form |

## 💻 Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## 🐳 Docker Commands

```bash
# Build image
docker build -t tap-travel-agency .

# Run container
docker run -p 8080:8080 tap-travel-agency

# View logs
docker logs -f container_name

# Stop container
docker stop container_name

# Remove container
docker rm container_name
```

## 🔧 Troubleshooting

1. **Database Connection Issues**
   - Verify MySQL is running
   - Check credentials in .env file
   - Ensure database exists

2. **Docker Issues**
   - Verify Docker daemon is running
   - Check container logs
   - Verify port availability

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## 🙏 Acknowledgments

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Docker](https://www.docker.com/)
- [Bootstrap](https://getbootstrap.com/)
