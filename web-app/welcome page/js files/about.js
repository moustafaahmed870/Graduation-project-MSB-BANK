document.addEventListener('DOMContentLoaded', function() {
    console.log('تم تحميل صفحة about.html');
    
    document.querySelectorAll(".accordion-header").forEach((header) => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            document.querySelectorAll(".accordion-item").forEach((otherItem) => {
                if (otherItem !== item) otherItem.classList.remove("active");
            });
            item.classList.toggle("active");
        });
    });
    
    setTimeout(() => {
        if (typeof checkAboutPageTranslation === 'function') {
            checkAboutPageTranslation();
        }
        
        if (typeof updateContent === 'function') {
            updateContent();
        }
        
        if (typeof highlightActivePage === 'function') {
            setTimeout(highlightActivePage, 300);
        }
    }, 1500);
});

if (typeof i18next !== 'undefined') {
    i18next.on('languageChanged', () => {
        document.querySelectorAll(".accordion-item").forEach(item => {
            item.classList.remove("active");
        });
    });
}