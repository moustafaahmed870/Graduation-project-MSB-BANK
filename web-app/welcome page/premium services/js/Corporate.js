    // Filter Cards Functionality
    document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".card-item");

    filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to clicked button
        this.classList.add("active");

        const filterValue = this.getAttribute("data-filter");

        // Show/hide cards based on filter
        cards.forEach((card) => {
            if (
            filterValue === "all" ||
            card.getAttribute("data-type") === filterValue
            ) {
            card.style.display = "flex";
            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, 100);
            } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            setTimeout(() => {
                card.style.display = "none";
            }, 300);
            }
        });
        });
    });

    // Form Submission
    const applicationForm = document.getElementById("cardApplicationForm");

    applicationForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get form values
        const companyName = document.getElementById("companyName").value;
        const cardType = document.getElementById("cardType").value;
        const cardCount = document.getElementById("cardCount").value;

        // Show success message
        alert(
        `شكرًا ${companyName}! تم استلام طلبك للحصول على ${cardCount} بطاقة من نوع ${cardType} بنجاح. سيتم التواصل معك خلال 48 ساعة.`
        );

        // Reset form
        applicationForm.reset();
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");

    mobileMenuBtn.addEventListener("click", function () {
        navLinks.style.display =
        navLinks.style.display === "flex" ? "none" : "flex";
    });

    // Adjust nav links display on window resize
    window.addEventListener("resize", function () {
        if (window.innerWidth > 992) {
        navLinks.style.display = "flex";
        } else {
        navLinks.style.display = "none";
        }
    });

    // Apply button functionality
    const applyButtons = document.querySelectorAll(".card-btn");

    applyButtons.forEach((button) => {
        button.addEventListener("click", function () {
        const cardName =
            this.closest(".card-item").querySelector(".card-name").textContent;

        // Scroll to application form
        document.querySelector(".application-section").scrollIntoView({
            behavior: "smooth",
        });

        // Set card type in form dropdown
        const cardTypeSelect = document.getElementById("cardType");
        const cardTypeOptions = Array.from(cardTypeSelect.options);

        // Match card type based on the card name
        if (cardName.includes("VISA Business")) {
            cardTypeSelect.value = "visa_business";
        } else if (cardName.includes("Platinum")) {
            cardTypeSelect.value = "visa_platinum";
        } else if (cardName.includes("Signature")) {
            cardTypeSelect.value = "visa_signature";
        } else if (cardName.includes("MEEZA Business")) {
            cardTypeSelect.value = "meeza_business";
        } else if (cardName.includes("Deposit")) {
            cardTypeSelect.value = "deposit";
        } else if (cardName.includes("Prepaid")) {
            cardTypeSelect.value = "meeza_prepaid";
        }

        // Focus on form
        document.getElementById("companyName").focus();
        });
    });

    // Add hover effect to comparison table rows
    const tableRows = document.querySelectorAll(".comparison-table tr");
    tableRows.forEach((row) => {
        row.addEventListener("mouseenter", function () {
        this.style.backgroundColor = "rgba(0, 238, 255, 0.1)";
        });

        row.addEventListener("mouseleave", function () {
        if (!this.classList.contains("highlight")) {
            this.style.backgroundColor = "";
        }
        });
    });
});
