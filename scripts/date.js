// Date functionality for footer
document.addEventListener('DOMContentLoaded', function() {
    
    // Set current year in footer
    const currentYearElement = document.getElementById('currentyear');
    if (currentYearElement) {
        const currentYear = new Date().getFullYear();
        currentYearElement.textContent = currentYear;
    }
    
    // Set last modified date
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        const lastModified = document.lastModified;
        lastModifiedElement.textContent = `Last modified: ${lastModified}`;
    }
});
