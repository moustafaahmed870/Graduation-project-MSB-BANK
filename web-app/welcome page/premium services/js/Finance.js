    // Service card interaction
    document.addEventListener("DOMContentLoaded", function () {
    const serviceCards = document.querySelectorAll(".service-card");
    const serviceButtons = document.querySelectorAll(".service-btn");

    // Add click effect to service cards
    serviceCards.forEach((card) => {
        card.addEventListener("click", function (e) {
        if (!e.target.classList.contains("service-btn")) {
            this.style.transform = "translateY(-8px)";
            setTimeout(() => {
            this.style.transform = "translateY(-12px)";
            }, 150);
        }
        });
    });

    // Add animation to service buttons
    serviceButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Get the service name
        const serviceName =
            this.closest(".service-card").querySelector("h3").textContent;

  
        

        // Add visual feedback
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
            this.style.transform = "scale(1)";
        }, 200);
        });
    });

    // Pulse animation for the VIP badge
    const vipBadge = document.querySelector(".vip-badge");
    let pulseCount = 0;
    const pulseInterval = setInterval(() => {
        vipBadge.style.boxShadow = `0 0 ${
        15 + (pulseCount % 10)
        }px rgba(0, 238, 255, 0.7)`;
        pulseCount++;
    }, 500);

    // Phone number interaction
    const contactPhone = document.querySelector(".contact-phone");
    contactPhone.addEventListener("click", function () {
        const phoneNumber = this.textContent;

        // Visual feedback
        this.style.backgroundColor = "rgba(42, 94, 139, 0.6)";
        this.style.color = "#d4af37";

        // In a real application, this would initiate a phone call
        alert(`سيتم الاتصال بالرقم: ${phoneNumber}`);

        setTimeout(() => {
        this.style.backgroundColor = "rgba(42, 94, 139, 0.2)";
        this.style.color = "#0ef";
        }, 1000);
    });

    // Mission items hover effect
    const missionItems = document.querySelectorAll(".mission-item");
    missionItems.forEach((item) => {
        item.addEventListener("mouseenter", function () {
        this.style.borderLeftColor = "#0ef";
        this.style.transform = "translateX(-5px)";
        });

        item.addEventListener("mouseleave", function () {
        this.style.borderLeftColor = "#d4af37";
        this.style.transform = "translateX(0)";
        });
    });

    // Contact cards hover effect
    const contactCards = document.querySelectorAll(".contact-card");
    contactCards.forEach((card) => {
        card.addEventListener("mouseenter", function () {
        const icon = this.querySelector(".contact-icon");
        if (icon) {
            icon.style.transform = "rotate(10deg) scale(1.1)";
            icon.style.transition = "transform 0.3s ease";
        }
        });

        card.addEventListener("mouseleave", function () {
        const icon = this.querySelector(".contact-icon");
        if (icon) {
            icon.style.transform = "rotate(0) scale(1)";
        }
        });
    });

    // Smooth scroll for anchor links
    const footerLinks = document.querySelectorAll(".footer-link");
    footerLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
        e.preventDefault();

        // In a real multi-page application, this would navigate to the page
        const pageName = this.textContent;
        alert(`سيتم توجيهك إلى صفحة "${pageName}"`);
        });
    });
});
