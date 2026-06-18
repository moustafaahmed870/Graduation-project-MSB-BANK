window.currencyTranslations = {
    ar: {
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
    },
    en: {
        "USD": "US Dollar",
        "EUR": "Euro",
        "GBP": "British Pound",
        "CAD": "Canadian Dollar",
        "DKK": "Danish Krone",
        "CHF": "Swiss Franc",
        "JPY": "Japanese Yen",
        "AUD": "Australian Dollar",
        "KWD": "Kuwaiti Dinar",
        "SAR": "Saudi Riyal",
        "AED": "UAE Dirham",
        "BHD": "Bahraini Dinar",
        "OMR": "Omani Rial",
        "QAR": "Qatari Riyal",
        "JOD": "Jordanian Dinar",
        "CNY": "Chinese Yuan",
        "EGP": "Egyptian Pound"
    }
};

window.translateCurrencyName = function(currencyCode, language = null) {
    if (!language) {
        language = window.i18next?.language || 'ar';
    }
    
    if (window.currencyTranslations[language] && window.currencyTranslations[language][currencyCode]) {
        return window.currencyTranslations[language][currencyCode];
    }
    
    return window.currencyNames?.[currencyCode] || currencyCode;
};

window.updateCurrencyNames = function() {
    const language = window.i18next?.language || 'ar';
    
    document.querySelectorAll('.currency-name').forEach(element => {
        const currencyCode = element.dataset.currency || 
                            element.textContent.match(/[A-Z]{3}/)?.[0];
        
        if (currencyCode) {
            element.textContent = window.translateCurrencyName(currencyCode, language);
        }
    });
    
    document.querySelectorAll('select option').forEach(option => {
        const currencyCode = option.value;
        if (currencyCode && currencyCode.length === 3) {
            const translatedName = window.translateCurrencyName(currencyCode, language);
            option.textContent = translatedName;
            
            option.dataset.currency = currencyCode;
        }
    });
    
    if (window.updateCurrentDate) {
        window.updateCurrentDate();
    }
    
    const updateElement = document.getElementById('updateTimestamp');
    if (updateElement) {
        const now = new Date();
        const language = window.i18next?.language || 'ar';
        updateElement.textContent = window.formatLocalizedDateTime(now, language);
    }
};

window.loadExchangeRatesWithTranslation = async function() {
    const RATES_BASE_URL = "https://v6.exchangerate-api.com/v6/2716de5c3f6b8c810edc61e5/latest/EGP";
    
    const loading = document.getElementById('loading');
    const table = document.getElementById('exchange-table');
    const errorContainer = document.getElementById('error-container');
    const tbody = document.getElementById('exchange-rates');

    if (!tbody) return;

    try {
        const response = await fetch(`${RATES_BASE_URL}`);
        if (!response.ok) throw new Error('فشل في جلب البيانات من الخادم');
        
        const data = await response.json();
        const rates = data.conversion_rates;
        
        let apiUpdateDate = null;
        if (data.time_last_update_utc) {
            apiUpdateDate = data.time_last_update_utc;
        } else {
            const responseDate = response.headers.get('date');
            if (responseDate) {
                apiUpdateDate = new Date(responseDate);
            }
        }

        tbody.innerHTML = '';
        const language = window.i18next?.language || 'ar';

        window.orderedCurrencies.forEach(currency => {
            if (rates[currency]) {
                const ratePerOneForeignCurrency = (1 / rates[currency]).toFixed(2);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="currency-cell">
                            <img src="https://flagsapi.com/${window.countryList[currency]}/flat/64.png" alt="${currency}" class="currency-flag">
                            <div class="currency-name" data-currency="${currency}">
                                ${window.translateCurrencyName(currency, language)}
                            </div>
                        </div>
                    </td>
                    <td class="exchange-rate">${ratePerOneForeignCurrency}</td>
                `;
                
                tbody.appendChild(row);
            }
        });

        if (loading) loading.style.display = 'none';
        if (table) table.style.display = 'table';
        if (errorContainer) errorContainer.style.display = 'none';
        const updateElement = document.getElementById('updateTimestamp');
        if (updateElement) {
            updateElement.textContent = window.formatLocalizedDateTime(apiUpdateDate || new Date(), language);
        }

        setTimeout(window.loadExchangeRatesWithTranslation, 5 * 60 * 1000);

    } catch (error) {
        console.error('خطأ في جلب الأسعار:', error);
        if (loading) loading.style.display = 'none';
        if (errorContainer) {
            errorContainer.style.display = 'block';
            errorContainer.innerHTML = `
                <div class="error-message">
                    حدث خطأ في تحميل أسعار الصرف. 
                    <br>
                    <small>${error.message}</small>
                </div>
            `;
        }
        
        const updateElement = document.getElementById('updateTimestamp');
        if (updateElement) {
            const language = window.i18next?.language || 'ar';
            updateElement.textContent = window.formatLocalizedDateTime(new Date(), language);
        }
    }
};
if (!window.loadExchangeRates) {
    window.loadExchangeRates = window.loadExchangeRatesWithTranslation;
}