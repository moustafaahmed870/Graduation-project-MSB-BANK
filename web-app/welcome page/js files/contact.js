    // تفعيل القائمة المتنقلة
    document.getElementById("mobileMenuBtn").addEventListener("click", function () {
    const nav = document.getElementById("mainNav");
    nav.classList.toggle("active");

    // تغيير الأيقونة
    const icon = this.querySelector("i");
    if (icon.classList.contains("fa-bars")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
    } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
    }
    });

    // إضافة تأثير عند التمرير
    window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
        header.style.padding = "10px 0";
        header.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.15)";
    } else {
        header.style.padding = "15px 0";
        header.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
    }
    });

    // إضافة تأثير النبض لرقم الهاتف كل 5 ثوانٍ
    setInterval(function () {
    const pulseElement = document.querySelector(".pulse");
    pulseElement.classList.remove("pulse");
    void pulseElement.offsetWidth; // إعادة التدفق لإعادة التشغيل
    setTimeout(function () {
        pulseElement.classList.add("pulse");
    }, 100);
    }, 5000);

    // إضافة تأثير للبطاقات عند التمرير عليها
    document
    .querySelectorAll(".service-category, .ivr-feature")
    .forEach((element) => {
        element.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px)";
        this.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.1)";
        });

        element.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "none";
        });
    });
