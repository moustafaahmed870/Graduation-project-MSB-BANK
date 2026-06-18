window.countryList = {
    "USD": "US",
    "EUR": "FR",
    "GBP": "GB",
    "CAD": "CA",
    "DKK": "DK",
    "CHF": "CH",
    "JPY": "JP",
    "AUD": "AU",
    "KWD": "KW",
    "SAR": "SA",
    "AED": "AE",
    "BHD": "BH",
    "OMR": "OM",
    "QAR": "QA",
    "JOD": "JO",
    "CNY": "CN",
    "EGP": "EG"
};

window.currencyNames = {
    "USD": "دولار أمريكي",
    "EUR": "يورو",
    "GBP": "جنيه إسترليني",
    "CAD": "دولار كندي",
    "DKK": "كرون دنماركي",
    "CHF": "فرنك سويسري",
    "JPY": "ين ياباني",
    "AUD": "دولار أسترالي",
    "KWD": "دينار كويتي",
    "SAR": "ريال سعودي",
    "AED": "درهم إماراتي",
    "BHD": "دينار بحريني",
    "OMR": "ريال عماني",
    "QAR": "ريال قطري",
    "JOD": "دينار أردني",
    "CNY": "يوان صيني",
    "EGP": "جنيه مصري"
};

window.orderedCurrencies = [
    "USD", 
    "EUR",
    "GBP", 
    "CAD", 
    "DKK",
    "CHF", 
    "JPY", 
    "AUD", 
    "KWD", 
    "SAR", 
    "AED", 
    "BHD", 
    "OMR", 
    "QAR",
    "JOD", 
    "CNY"
];

window.formatLocalizedDateTime = function(date = null, language = 'ar') {
    let dateObj;
    
    if (date) {
        dateObj = new Date(date);
    } else {
        dateObj = new Date();
    }
    
    const day = dateObj.getDate();
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();
    
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes().toString().padStart(2, '0');
    let seconds = dateObj.getSeconds().toString().padStart(2, '0');
    
    if (language === 'ar') {
        const arabicMonths = [
            "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
            "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
        ];
        
        let timePeriod = hours >= 12 ? 'مساءً' : 'صباحاً';
        
        if (hours > 12) {
            hours = hours - 12;
        } else if (hours === 0) {
            hours = 12;
        }
        
        hours = hours.toString().padStart(2, '0');
        
        return `${day} ${arabicMonths[monthIndex]} ${year} ${hours}:${minutes}:${seconds} ${timePeriod}`;
    } else {
        const englishMonths = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        const timePeriod = hours >= 12 ? 'PM' : 'AM';
        
        if (hours > 12) {
            hours = hours - 12;
        } else if (hours === 0) {
            hours = 12;
        }
        
        hours = hours.toString().padStart(2, '0');
        
        return `${day} ${englishMonths[monthIndex]} ${year} ${hours}:${minutes}:${seconds} ${timePeriod}`;
    }
};

window.formatArabicDateTime = function(date = null) {
    return window.formatLocalizedDateTime(date, 'ar');
};

window.updateCurrentDate = function() {
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        const language = window.i18next?.language || 'ar';
        const now = new Date();
        
        currentDateElement.textContent = window.formatLocalizedDateTime(now, language);
    }
    
    setTimeout(window.updateCurrentDate, 1000);
};

window.refreshPage = function(pageName) {
    if (window.app && typeof window.app.loadPage === 'function') {
        window.app.loadPage(pageName);
    }
};

window.goToHome = function() {
    if (window.app && typeof window.app.loadPage === 'function') {
        window.app.loadPage('rates');
    }
};