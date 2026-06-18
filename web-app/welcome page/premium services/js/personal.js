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
            card.style.display = "block";
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
        const fullName = document.getElementById("fullName").value;
        const cardType = document.getElementById("cardType").value;

        // Show success message
        alert(
        `شكرًا ${fullName}! تم استلام طلبك للحصول على ${cardType} بنجاح. سيتم التواصل معك خلال 24 ساعة.`
        );

        // Reset form
        applicationForm.reset();
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
        const matchingOption = cardTypeOptions.find(
            (option) =>
            option.text.includes(cardName.split(" ")[1]) ||
            option.text.includes(cardName.split(" ")[2])
        );

        if (matchingOption) {
            cardTypeSelect.value = matchingOption.value;
        }

        // Focus on form
        document.getElementById("fullName").focus();
        });
    });
    });
