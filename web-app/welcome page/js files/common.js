document.addEventListener('DOMContentLoaded', function() {
    console.log('تم تحميل الصفحة');
    
    if (typeof i18next !== 'undefined') {
        console.log('i18next جاهز');
    } else {
        console.warn('i18next غير معرّف');
    }
    
    window.toggleLang = function() {
        if (typeof switchLanguage === 'function') {
            switchLanguage(null);
            return true;
        }
        console.error('دالة switchLanguage غير موجودة');
        return false;
    };
});