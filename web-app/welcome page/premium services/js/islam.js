
    document.addEventListener("DOMContentLoaded", function () {
        // Mobile Menu Toggle
        const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
        const navLinks = document.querySelector(".nav-links");

        mobileMenuBtn.addEventListener("click", function () {
            navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
        });

        // Adjust nav links display on window resize
        window.addEventListener("resize", function () {
            if (window.innerWidth > 992) {
                navLinks.style.display = "flex";
            } else {
                navLinks.style.display = "none";
            }
        });


        // Card type items hover effect
        const cardTypeItems = document.querySelectorAll(".card-type-item");

        cardTypeItems.forEach((item) => {
            item.addEventListener("mouseenter", function () {
                const header = this.querySelector(".card-type-header");
                if (header) {
                    header.style.background = "linear-gradient(135deg, #0a2335 0%, #0ef 100%)";
                }
            });

            item.addEventListener("mouseleave", function () {
                const header = this.querySelector(".card-type-header");
                if (header) {
                    header.style.background = "linear-gradient(135deg, #1e3a5c 0%, #2a5e8b 100%)";
                }
            });
        });

        // Benefit items animation
        const benefitItems = document.querySelectorAll(".benefits-list li");

        benefitItems.forEach((item, index) => {
            // Add delay for staggered animation
            item.style.transitionDelay = `${index * 0.1}s`;
        });

        // Table row hover effect
        const tableRows = document.querySelectorAll(".limits-table tr, .fees-table tr");

        tableRows.forEach((row) => {
            row.addEventListener("mouseenter", function () {
                if (!this.querySelector("th")) {
                    this.style.backgroundColor = "rgba(0, 238, 255, 0.08)";
                }
            });

            row.addEventListener("mouseleave", function () {
                if (!this.querySelector("th")) {
                    this.style.backgroundColor = "";
                }
            });
        });
    });


            const applicationForm = document.getElementById("cardApplicationForm");

            if (applicationForm) {
            applicationForm.addEventListener("submit", function (e) {
                e.preventDefault();

                // Get form values
                const fullName = document.getElementById("fullName").value;
                const cardTypeSelect = document.getElementById("cardType");
                const cardType =
                cardTypeSelect.options[cardTypeSelect.selectedIndex].text;

                // Show success message
                alert(
                `شكرًا ${fullName}! تم استلام طلبك للحصول على ${cardType} بنجاح. سيتم التواصل معك خلال 48 ساعة.`
                );

                // Reset form
                applicationForm.reset();
            });
            } else {
            console.error("Form with ID 'cardApplicationForm' not found!");
            }