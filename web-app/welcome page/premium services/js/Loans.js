    // Filter Loans Functionality
    document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const loans = document.querySelectorAll(".loan-item");

    filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to clicked button
        this.classList.add("active");

        const filterValue = this.getAttribute("data-filter");

        // Show/hide loans based on filter
        loans.forEach((loan) => {
            if (
            filterValue === "all" ||
            loan.getAttribute("data-type") === filterValue
            ) {
            loan.style.display = "flex";
            setTimeout(() => {
                loan.style.opacity = "1";
                loan.style.transform = "translateY(0)";
            }, 100);
            } else {
            loan.style.opacity = "0";
            loan.style.transform = "translateY(20px)";
            setTimeout(() => {
                loan.style.display = "none";
            }, 300);
            }
        });
        });
    });

    // Loan Calculator Functionality
    const loanAmountSlider = document.getElementById("loanAmount");
    const loanTermSlider = document.getElementById("loanTerm");
    const interestRateSlider = document.getElementById("interestRate");

    const loanAmountValue = document.getElementById("loanAmountValue");
    const loanTermValue = document.getElementById("loanTermValue");
    const interestRateValue = document.getElementById("interestRateValue");

    const calculateBtn = document.getElementById("calculateBtn");

    // Update display values when sliders change
    loanAmountSlider.addEventListener("input", function () {
        const value = parseInt(this.value).toLocaleString();
        loanAmountValue.textContent = `${value} جنيه`;
        updateResults();
    });

    loanTermSlider.addEventListener("input", function () {
        const value = this.value;
        loanTermValue.textContent = `${value} سنوات`;
        updateResults();
    });

    interestRateSlider.addEventListener("input", function () {
        const value = this.value;
        interestRateValue.textContent = `${value}%`;
        updateResults();
    });

    // Calculate loan function
    function calculateLoan(principal, years, annualRate) {
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = years * 12;

        // Calculate monthly payment using the formula: P * r * (1+r)^n / ((1+r)^n - 1)
        const monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - principal;

        return {
        monthly: monthlyPayment,
        total: totalPayment,
        interest: totalInterest,
        };
    }

    // Update results display
    function updateResults() {
        const principal = parseInt(loanAmountSlider.value);
        const years = parseInt(loanTermSlider.value);
        const annualRate = parseFloat(interestRateSlider.value);

        const results = calculateLoan(principal, years, annualRate);

        // Update results in the UI
        document.getElementById(
        "resultAmount"
        ).textContent = `${principal.toLocaleString()} جنيه`;
        document.getElementById("resultTerm").textContent = `${years} سنوات`;
        document.getElementById("resultRate").textContent = `${annualRate}%`;
        document.getElementById("resultMonthly").textContent = `${results.monthly
        .toFixed(0)
        .toLocaleString()} جنيه`;
        document.getElementById("resultInterest").textContent = `${results.interest
        .toFixed(0)
        .toLocaleString()} جنيه`;
        document.getElementById("resultTotal").textContent = `${results.total
        .toFixed(0)
        .toLocaleString()} جنيه`;
    }

    // Initial calculation
    updateResults();

    // Calculate button event
    calculateBtn.addEventListener("click", updateResults);

    // Loan Application Form
    const loanApplicationForm = document.getElementById("loanApplicationForm");

    loanApplicationForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get form values
        const fullName = document.getElementById("appFullName").value;
        const loanType = document.getElementById("appLoanType").value;
        const amount = document.getElementById("appAmount").value;

        // Show success message
        alert(
        `شكرًا ${fullName}! تم استلام طلبك للحصول على ${loanType} بقيمة ${parseInt(
            amount
        ).toLocaleString()} جنيه بنجاح. سيتم التواصل معك خلال 24 ساعة.`
        );

        // Reset form
        loanApplicationForm.reset();
    });

    // Apply for loan buttons
    const applyButtons = document.querySelectorAll(".loan-btn");

    applyButtons.forEach((button) => {
        button.addEventListener("click", function () {
        const loanName =
            this.closest(".loan-item").querySelector(".loan-name").textContent;

        // Scroll to application form
        document.querySelector(".application-section").scrollIntoView({
            behavior: "smooth",
        });

        // Set loan type in form dropdown
        const loanTypeSelect = document.getElementById("appLoanType");
        const loanTypeOptions = Array.from(loanTypeSelect.options);

        // Try to match loan type based on the loan name
        if (loanName.includes("شخصي")) {
            loanTypeSelect.value = "personal";
        } else if (loanName.includes("سيارة") || loanName.includes("سيارات")) {
            loanTypeSelect.value = "auto";
        } else if (loanName.includes("عقاري")) {
            loanTypeSelect.value = "real-estate";
        } else if (loanName.includes("تعليم") || loanName.includes("دراسة")) {
            loanTypeSelect.value = "education";
        } else if (loanName.includes("طبي") || loanName.includes("علاج")) {
            loanTypeSelect.value = "medical";
        }

        // Focus on form
        document.getElementById("appFullName").focus();
        });
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
    });
