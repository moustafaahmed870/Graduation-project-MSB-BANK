    // Simple script to handle phone number click
    document.querySelector(".contact-phone").addEventListener("click", function () {
    const phoneNumber = this.textContent.trim();
    if (confirm(`هل تريد الاتصال بالرقم ${phoneNumber}؟`)) {
        window.location.href = `tel:${phoneNumber}`;
    }
    });

    // Add some interactivity to service cards
    document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", function () {
        const serviceName = this.querySelector("h3").textContent;
        alert(`خدمة ${serviceName} - هذه الخدمة متاحة لعملاء BMVIP و BMVIP PLUS`);
    });
    });
