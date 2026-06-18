async function loadComponent(elementId, filePath) {
    try {
        console.log(`📂 جاري تحميل ${filePath} للعنصر ${elementId}`);
        
        const cleanPath = filePath.replace(/\/\//g, '/');
        
        const response = await fetch(cleanPath);
        
        if (!response.ok) {
            console.warn(`⚠️ المسار الأول فشل: ${cleanPath}`);
            
            const absolutePath = window.location.origin + cleanPath;
            const altResponse = await fetch(absolutePath);
            
            if (!altResponse.ok) {
                throw new Error(`HTTP error! status: ${response.status} للمسار: ${cleanPath}`);
            }
            
            const html = await altResponse.text();
            injectComponent(elementId, html);
            return;
        }
        
        const html = await response.text();
        injectComponent(elementId, html);
        
    } catch (error) {
        console.error(`❌ خطأ في تحميل ${filePath}:`, error);
        showComponentError(elementId, error);
    }
}

function injectComponent(elementId, html) {
    const container = document.getElementById(elementId);
    
    if (container) {
        container.innerHTML = html;
        if (elementId === 'navbar-container') {
            initNavbar();
            if (typeof updateContent === 'function') {
                setTimeout(() => {
                    try {
                        updateContent();
                    } catch (e) {
                        console.error('خطأ في تحديث المحتوى:', e);
                    }
                }, 200);
            }
        }
        
        console.log(`✅ تم تحميل ${elementId} بنجاح`);
    }
}

function showComponentError(elementId, error) {
    const container = document.getElementById(elementId);
    if (container) {
        container.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #ff6b6b; border: 1px solid #ff6b6b; border-radius: 8px; margin: 10px;">
                <h3><i class="fas fa-exclamation-triangle"></i> خطأ في تحميل ${elementId}</h3>
                <p>الخطأ: ${error.message}</p>
                <p>المسار المحاول: ${window.location.origin}${getCurrentPath()}</p>
                <button onclick="retryLoadComponents()" style="margin-top: 10px; padding: 8px 16px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}

function getCurrentPath() {
    return window.location.pathname;
}

function retryLoadComponents() {
    console.log('🔄 إعادة تحميل المكونات...');
    loadAllComponents();
}

function initNavbar() {
    console.log('🔧 تهيئة النافبار...');
    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (hamburger) {
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                const dropdown = this.nextElementSibling;
                if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                    e.preventDefault();
                    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                }
            }
        });
    });
    
    highlightActivePage();
    
    // ⭐⭐ إضافة تحريك الناف بار مع التمرير ⭐⭐
    initNavbarScrollEffect();
    
    console.log('✅ تم تهيئة النافبار');
}

function highlightActivePage() {
    try {
        const currentPath = getCurrentPath();
        console.log('📍 الصفحة الحالية:', currentPath);
        
        const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if (linkHref) {
                const cleanLink = linkHref.replace(/^\.\.\//g, '');
                const cleanCurrent = currentPath.replace(/^\/|\/$/g, '');
                
                if (cleanCurrent.includes(cleanLink) || 
                    (currentPath === '/' && linkHref === 'index.html') ||
                    (currentPath.endsWith('index.html') && linkHref === '../index.html')) {
                    
                    link.classList.add('active');
                    
                    if (link.classList.contains('dropdown-item')) {
                        const parentNavItem = link.closest('.nav-item');
                        if (parentNavItem) {
                            const parentLink = parentNavItem.querySelector('.nav-link');
                            if (parentLink) {
                                parentLink.classList.add('active');
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('خطأ في تسليط الضوء على الصفحة النشطة:', error);
    }
}

function initNavbarScrollEffect() {
    console.log('🌀 تهيئة تأثير التمرير للنافبار...');
    
    const navbar = document.querySelector('nav');
    if (!navbar) {
        console.log('⚠️ لم يتم العثور على عنصر nav');
        return;
    }
    
    // إضافة أنماط CSS المطلوبة
    const style = document.createElement('style');
    style.textContent = `
        .navbar-fixed {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            z-index: 1030 !important;
            background-color: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(10px) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
            animation: navbarSlideDown 0.3s ease-out !important;
            transition: all 0.3s ease-in-out !important;
        }
        
        .navbar-hidden {
            transform: translateY(-100%) !important;
            transition: transform 0.3s ease-in-out !important;
        }
        
        .navbar-visible {
            transform: translateY(0) !important;
            transition: transform 0.3s ease-in-out !important;
        }
        
        @keyframes navbarSlideDown {
            from {
                transform: translateY(-100%);
                opacity: 0.8;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        /* إضافة padding للجسم لمنع اختفاء المحتوى تحت النافبار الثابت */
        body.navbar-is-fixed {
            padding-top: 80px;
        }
        
        @media (max-width: 768px) {
            body.navbar-is-fixed {
                padding-top: 70px;
            }
            .navbar-fixed {
                padding: 10px 15px !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // متغيرات التتبع
    let lastScrollTop = 0;
    let scrollTimeout = null;
    const scrollThreshold = 0; // بدء التثبيت بعد التمرير 100px
    const navbarHeight = navbar.offsetHeight;
    
    // دالة التعامل مع التمرير
    function handleScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > scrollThreshold) {
            // إضافة كلاس التثبيت وإضافة padding للجسم
            if (!navbar.classList.contains('navbar-fixed')) {
                navbar.classList.add('navbar-fixed', 'navbar-visible');
                document.body.classList.add('navbar-is-fixed');
                
                // ضبط padding للجسم بناءً على ارتفاع النافبار
                document.body.style.paddingTop = navbarHeight + 'px';
            }
            
            // التحكم في إظهار/إخفاء النافبار بناءً على اتجاه التمرير
            if (currentScroll > lastScrollTop && currentScroll > navbarHeight) {
                // التمرير لأسفل - إخفاء النافبار
                navbar.classList.add('navbar-hidden');
                navbar.classList.remove('navbar-visible');
            } else {
                // التمرير لأعلى - إظهار النافبار
                navbar.classList.remove('navbar-hidden');
                navbar.classList.add('navbar-visible');
            }
        } else {
            // إزالة التثبيت عند العودة للأعلى
            if (navbar.classList.contains('navbar-fixed')) {
                navbar.classList.remove('navbar-fixed', 'navbar-hidden', 'navbar-visible');
                document.body.classList.remove('navbar-is-fixed');
                document.body.style.paddingTop = '';
            }
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        
        // إلغاء المهلة السابقة وضبط مهلة جديدة
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // إظهار النافبار بعد توقف التمرير
        scrollTimeout = setTimeout(() => {
            navbar.classList.remove('navbar-hidden');
            navbar.classList.add('navbar-visible');
        }, 150);
    }
    
    // إضافة مستمعي الأحداث
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', function() {
        // تحديث ارتفاع النافبار عند تغيير حجم النافذة
        const newHeight = navbar.offsetHeight;
        if (navbar.classList.contains('navbar-fixed')) {
            document.body.style.paddingTop = newHeight + 'px';
        }
    });
    
    // تشغيل الدالة مرة عند التحميل لمعالجة الحالة الأولية
    setTimeout(handleScroll, 100);
    
    // إضافة زر العودة للأعلى (اختياري)
    addBackToTopButton();
    
    console.log('✅ تم تهيئة تأثير التمرير للنافبار');
}

// دالة إضافة زر العودة للأعلى (اختيارية)
function addBackToTopButton() {
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopButton.id = 'back-to-top';
    backToTopButton.title = 'العودة للأعلى';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        width: 50px;
        height: 50px;
        background-color: #3a8d93;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        font-size: 20px;
        transition: all 0.3s ease;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(backToTopButton);
    
    backToTopButton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#0056b3';
        this.style.transform = 'scale(1.1)';
    });
    
    backToTopButton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#007bff';
        this.style.transform = 'scale(1)';
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // التحكم في إظهار/إخفاء زر العودة للأعلى
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'flex';
        } else {
            backToTopButton.style.display = 'none';
        }
    }
);
}

function calculateComponentPaths() {
    const currentPath = getCurrentPath();
    console.log('📍 حساب المسارات للمسار:', currentPath);
    
    const pathParts = currentPath.split('/').filter(part => part && !part.includes('.html'));
    
    if (pathParts.length === 0 || currentPath === '/' || currentPath === '/index.html') {
        return {
            navbar: 'navbar.html',
            footer: 'footer.html',
            basePath: ''
        };
    }
    
    if (currentPath.includes('currencyconverter-rate')) {
        return {
            navbar: '../../navbar.html',
            footer: '../../footer.html',
            basePath: '../../'
        };
    }
    
    if (currentPath.includes('pages/navbar pages')) {
        return {
            navbar: '../navbar.html',
            footer: '../footer.html',
            basePath: '../'
        };
    }
    
    const depth = pathParts.length;
    let basePath = '';
    for (let i = 0; i < depth; i++) {
        basePath += '../';
    }
    
    return {
        navbar: basePath + 'navbar.html',
        footer: basePath + 'footer.html',
        basePath: basePath
    };
}

function loadAllComponents() {
    console.log('🚀 بدء تحميل جميع المكونات...');
    
    const paths = calculateComponentPaths();
    console.log('📁 المسارات المحسوبة:', paths);
    
    loadComponent('navbar-container', paths.navbar);
    loadComponent('footer-container', paths.footer);
}

function waitForI18next() {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (typeof i18next !== 'undefined' && i18next.isInitialized) {
                clearInterval(checkInterval);
                console.log('🌐 i18next جاهز');
                resolve();
            }
        }, 100);
        
        setTimeout(() => {
            clearInterval(checkInterval);
            console.log('⚠️ انتهت مهلة الانتظار لـ i18next، الاستمرار...');
            resolve();
        }, 3000);
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 الصفحة محملة، بدء تحميل المكونات...');
    
    try {
        await waitForI18next();
        
        loadAllComponents();
        
    } catch (error) {
        console.error('❌ خطأ في تحميل المكونات:', error);
    }
});
// إصلاح ديناميكي لمشكلة التمرير الأفقي
function fixHorizontalScroll() {
    console.log('🔧 إصلاح التمرير الأفقي...');
    
    // 1. التأكد من أن body لا يتجاوز العرض
    document.body.style.maxWidth = '100vw';
    document.body.style.overflowX = 'hidden';
}

// تشغيل عند تحميل الصفحة وتغيير الحجم
window.addEventListener('load', fixHorizontalScroll);
window.addEventListener('resize', fixHorizontalScroll);

// يمكنك استدعاؤها يدوياً إذا لزم الأمر
window.fixHorizontalScroll = fixHorizontalScroll;

// جعل الدوال متاحة عالمياً
window.loadComponent = loadComponent;
window.loadAllComponents = loadAllComponents;
window.initNavbar = initNavbar;
window.highlightActivePage = highlightActivePage;
window.retryLoadComponents = retryLoadComponents;
window.calculateComponentPaths = calculateComponentPaths;
window.initNavbarScrollEffect = initNavbarScrollEffect;
window.addBackToTopButton = addBackToTopButton;