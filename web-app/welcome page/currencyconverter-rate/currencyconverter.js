const CONVERTER_BASE_URL = "https://v6.exchangerate-api.com/v6/2716de5c3f6b8c810edc61e5/latest/";

function initConverterPage() {
    console.log("بدء تهيئة صفحة المحول...");
    
    const checkInterval = setInterval(() => {
        const fromCurr = document.querySelector(".from select");
        const toCurr = document.querySelector(".to select");
        const convertBtn = document.getElementById("convert-btn");
        const swapBtn = document.getElementById("swap-btn");
        
        if (fromCurr && toCurr && convertBtn && swapBtn) {
            clearInterval(checkInterval);
            initializeConverter();
        }
    }, 100);
}

function initializeConverter() {
    const dropdowns = document.querySelectorAll(".dropdown select");
    const convertBtn = document.getElementById("convert-btn");
    const fromCurr = document.querySelector(".from select");
    const toCurr = document.querySelector(".to select");
    const msg = document.querySelector(".msg");
    const swapBtn = document.getElementById("swap-btn");
    const amountInput = document.getElementById("amountInput");

    console.log("تم العثور على جميع العناصر");

    function initDropdowns() {
        if (dropdowns.length === 0) return;
        
        const language = window.i18next?.language || 'ar';

        for (let select of dropdowns) {
            select.innerHTML = '';
            
            for (let currCode in window.countryList) {
                let newOption = document.createElement("option");
                newOption.innerText = window.translateCurrencyName ? 
                    window.translateCurrencyName(currCode, language) : 
                    (window.currencyNames?.[currCode] || currCode);
                newOption.value = currCode;
                newOption.dataset.currency = currCode;

                if (select.name === "from" && currCode === "USD") {
                    newOption.selected = "selected";
                } else if (select.name === "to" && currCode === "EGP") {
                    newOption.selected = "selected";
                }
                
                select.append(newOption);
            }
            
            select.addEventListener("change", (evt) => {
                updateFlag(evt.target);
                updateExchangeRate();
            });
        }
    }

    function updateFlag(element) {
        if (!element) return;
        
        let currCode = element.value;
        let countryCode = window.countryList[currCode];
        if (!countryCode) return;
        
        let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
        let img = element.parentElement.querySelector("img");
        if (img) {
            img.src = newSrc;
        }
    }

    function swapCurrencies() {
        let temp = fromCurr.value;
        fromCurr.value = toCurr.value;
        toCurr.value = temp;
        
        updateFlag(fromCurr);
        updateFlag(toCurr);
        updateExchangeRate();
    }

    async function updateExchangeRate() {
        if (!amountInput || !fromCurr || !toCurr || !msg) {
            console.error('عناصر DOM مفقودة');
            return;
        }
        
        let amtVal = parseFloat(amountInput.value);
        
        if (isNaN(amtVal) || amtVal < 0) {
            amtVal = 0;
        }
        
        const URL = `${CONVERTER_BASE_URL}${fromCurr.value}`;
        
        try {            
            let response = await fetch(URL);
            if (!response.ok) throw new Error('فشل في جلب البيانات من الخادم');
            
            let data = await response.json();
            
            let rate = data.conversion_rates[toCurr.value];
            
            if (!rate) {
                throw new Error('العملة غير مدعومة');
            }
            
            let finalAmount = amtVal * rate;
            
            const fromName = window.translateCurrencyName ? 
                window.translateCurrencyName(fromCurr.value) : fromCurr.value;
            const toName = window.translateCurrencyName ? 
                window.translateCurrencyName(toCurr.value) : toCurr.value;
            
            msg.innerText = `${amtVal.toFixed(2)} ${fromName} = ${finalAmount.toFixed(2)} ${toName}`;
            
        } catch (error) {
            console.error("Error fetching exchange rate:", error);
            if (msg) {
                msg.innerText = "حدث خطأ في جلب سعر الصرف";
            }
        }
    }

    function initEvents() {
        if (swapBtn) {
            swapBtn.addEventListener("click", (evt) => {
                evt.preventDefault();
                swapCurrencies();
            });
        }

        if (convertBtn) {
            convertBtn.addEventListener("click", (evt) => {
                evt.preventDefault();
                updateExchangeRate();
            });
        }

        if (amountInput) {
            amountInput.addEventListener("input", updateExchangeRate);
        }
    }

    initDropdowns();
    initEvents();
    updateFlag(fromCurr);
    updateFlag(toCurr);
    updateExchangeRate();
}

window.initConverterPage = initConverterPage;