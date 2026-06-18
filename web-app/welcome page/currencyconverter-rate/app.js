class SimpleApp {
    constructor() {
        this.currentPage = 'rates';
        this.app = document.getElementById('app');
        this.isInitialLoad = true;
        
        this.pageTemplates = {
            'rates': document.getElementById('rates-template'),
            'converter': document.getElementById('converter-template')
        };
        
        this.init();
    }
    
    init() {
        if (window.updateCurrentDate) {
            window.updateCurrentDate();
        }
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.loadPage(page);
            });
        });
        
        this.renderPage('rates');
    }
    
    loadPage(pageName) {
        if (this.currentPage === pageName) return;
        
        this.currentPage = pageName;
        this.updateActiveLinks(pageName);
        this.showLoading();
        
        setTimeout(() => {
            this.renderPage(pageName);
        }, 300);
    }
    
    renderPage(pageName) {
        const template = this.pageTemplates[pageName];
        if (template) {
            const content = document.importNode(template.content, true);
            this.app.innerHTML = '';
            this.app.appendChild(content);
            this.initializePage(pageName);
        } else {
            this.showError();
        }
    }
    
    updateActiveLinks(pageName) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    showLoading() {
        this.app.innerHTML = `
            <div class="container">
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>جاري تحميل المحتوى...</p>
                </div>
            </div>
        `;
    }
    
    showError() {
        this.app.innerHTML = `
            <div class="container">
                <div class="error-component">
                    <div class="card">
                        <h2>خطأ في تحميل المحتوى</h2>
                        <p>حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.</p>
                        <button onclick="app.loadPage('rates')" class="btn-primary">العودة للرئيسية</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    initializePage(pageName) {
    setTimeout(() => {
        if (window.updateContent) {
            window.updateContent();
        }
        
        if (pageName === 'rates') {
            if (window.updateCurrentDate) {
                window.updateCurrentDate();
            }
            
            const updateElement = document.getElementById('updateTimestamp');
            if (updateElement) {
                const language = window.i18next?.language || 'ar';
                updateElement.textContent = window.formatLocalizedDateTime ? 
                    window.formatLocalizedDateTime(new Date(), language) : 
                    'جارٍ التحميل...';
            }
            
            if (window.loadExchangeRatesWithTranslation) {
                window.loadExchangeRatesWithTranslation();
            } else if (window.loadExchangeRates) {
                window.loadExchangeRates();
            }
            
            setTimeout(() => {
                if (window.updateCurrencyNames) {
                    window.updateCurrencyNames();
                }
            }, 300);
            
        } else if (pageName === 'converter') {
            if (window.initializeConverterWithTranslation) {
                window.initializeConverterWithTranslation();
            } else if (window.initConverterPage) {
                window.initConverterPage();
            }
            
            setTimeout(() => {
                if (window.updateCurrencyNames) {
                    window.updateCurrencyNames();
                }
            }, 300);
        }
        
        this.app.style.opacity = '0';
        setTimeout(() => {
            this.app.style.opacity = '1';
        }, 50);
    }, 100);
    }
}
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SimpleApp();
    window.app = app;
});