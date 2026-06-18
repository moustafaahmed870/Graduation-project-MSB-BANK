
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
    const header = document.querySelector(".site-header");
    if (window.scrollY > 100) {
        header.style.boxShadow = "0 5px 25px rgba(0, 0, 0, 0.2)";
    } else {
        header.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
    }
    });


