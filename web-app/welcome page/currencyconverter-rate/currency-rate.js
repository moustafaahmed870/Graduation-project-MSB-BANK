const RATES_BASE_URL = "https://v6.exchangerate-api.com/v6/2716de5c3f6b8c810edc61e5/latest/EGP";

function updateDateAndTimeRates(apiDate = null) {
    const updateElement = document.getElementById('updateTimestamp');
    if (updateElement) {
        const language = window.i18next?.language || 'ar';
        const formattedDate = window.formatLocalizedDateTime ? 
            window.formatLocalizedDateTime(apiDate, language) : 
            window.formatArabicDateTime(apiDate);
        updateElement.textContent = formattedDate;
    }
}

async function loadExchangeRates() {
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
                
                const currencyName = window.translateCurrencyName ? 
                    window.translateCurrencyName(currency, language) : 
                    (window.currencyNames?.[currency] || currency);
                
                row.innerHTML = `
                    <td>
                        <div class="currency-cell">
                            <img src="https://flagsapi.com/${window.countryList[currency]}/flat/64.png" alt="${currency}" class="currency-flag">
                            <div class="currency-name" data-currency="${currency}">${currencyName}</div>
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

        updateDateAndTimeRates(apiUpdateDate);

        setTimeout(loadExchangeRates, 5 * 60 * 1000);

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
        
        updateDateAndTimeRates(new Date());
    }
}

window.loadExchangeRates = window.loadExchangeRatesWithTranslation || loadExchangeRates;