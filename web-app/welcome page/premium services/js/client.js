    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");

    mobileMenuBtn.addEventListener("click", function () {
    if (navLinks.style.display === "flex") {
        navLinks.style.display = "none";
    } else {
        navLinks.style.display = "flex";
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "100%";
        navLinks.style.right = "0";
        navLinks.style.backgroundColor = "white";
        navLinks.style.width = "280px";
        navLinks.style.boxShadow = "0 15px 40px rgba(0,0,0,0.15)";
        navLinks.style.padding = "25px";
        navLinks.style.borderRadius = "15px";
        navLinks.style.zIndex = "1000";
        navLinks.style.gap = "15px";

        const links = navLinks.querySelectorAll("li");
        links.forEach((link) => {
        link.style.margin = "0";
        link.style.width = "100%";
        });
    }
    });

    // Language selector
    document.querySelectorAll(".language-selector a").forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        document
        .querySelectorAll(".language-selector a")
        .forEach((a) => a.classList.remove("active"));
        this.classList.add("active");
    });
    });

    // Login button
    document.querySelector(".login-btn").addEventListener("click", function () {
    alert("سيتم توجيهك إلى صفحة تسجيل الدخول الخاصة بعملاء BMVIP");
    });

    // Gold buttons
    document.querySelectorAll(".gold-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();
        alert(
        "شكرًا لاهتمامك بخدمات بنك مصر VIP. سيتم توجيهك إلى نموذج تقديم الطلب."
        );
    });
    });

    // Transparent buttons
    document.querySelectorAll(".transparent-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();
        alert("ستنتقل الآن إلى صفحة التعريف بخدمات VIP التفصيلية.");
    });
    });

    // Benefit links
    document.querySelectorAll(".benefit-link").forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const serviceName = this.closest(
        ".benefit-card, .service-card"
        ).querySelector("h3").textContent;
        alert(`سيتم توجيهك إلى صفحة التفاصيل الكاملة لـ ${serviceName}`);
    });
    });

    // Newsletter subscription
    document
    .querySelector(".newsletter-btn")
    .addEventListener("click", function () {
        const emailInput = document.querySelector(".newsletter-input");
        if (emailInput.value && emailInput.value.includes("@")) {
        alert(
            "شكرًا لاشتراكك في نشرتنا الإخبارية! ستتلقى تأكيدًا على بريدك الإلكتروني قريبًا."
        );
        emailInput.value = "";
        } else {
        alert("الرجاء إدخال بريد إلكتروني صحيح.");
        emailInput.focus();
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
    if (
        !navLinks.contains(e.target) &&
        !mobileMenuBtn.contains(e.target) &&
        window.innerWidth <= 992
    ) {
        navLinks.style.display = "none";
    }
    });

    // Add active class to clicked nav link
    document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        document
        .querySelectorAll(".nav-links a")
        .forEach((a) => a.classList.remove("active"));
        this.classList.add("active");

        // Close mobile menu after selection
        if (window.innerWidth <= 992) {
        navLinks.style.display = "none";
        }
    });
    });

    // Update header on scroll
    window.addEventListener("scroll", function () {
    const header = document.querySelector(".main-header");
    if (window.scrollY > 100) {
        header.style.boxShadow = "0 5px 25px rgba(0, 0, 0, 0.15)";
    } else {
        header.style.boxShadow = "0 2px 15px rgba(0, 0, 0, 0.1)";
    }
    });
