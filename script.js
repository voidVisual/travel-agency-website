function search() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const searchResults = document.getElementById('searchResults');
    const sections = ['destinations', 'hotels', 'activites'];
    let results = [];

    sections.forEach(section => {
        const sectionEl = document.getElementById(section);
        if (sectionEl) {
            const items = sectionEl.getElementsByClassName('destination-item');
            Array.from(items).forEach(item => {
                const title = item.getElementsByTagName('h3')[0].textContent.toLowerCase();
                const description = item.getElementsByTagName('p')[0].textContent.toLowerCase();
                
                if (title.includes(searchInput) || description.includes(searchInput)) {
                    results.push({
                        title: title,
                        section: section.charAt(0).toUpperCase() + section.slice(1)
                    });
                }
            });
        }
    });

    if (results.length > 0) {
        searchResults.innerHTML = '<h3>Search Results:</h3>' + 
            results.map(result => 
                `<p>${result.title} (${result.section})</p>`
            ).join('');
    } else {
        searchResults.innerHTML = searchInput ? '<p>No results found</p>' : '';
    }
}
