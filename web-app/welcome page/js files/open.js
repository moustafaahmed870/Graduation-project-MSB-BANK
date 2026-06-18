
    // Form submission handling
    document.getElementById("accountForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const fullName = document.getElementById("fullName").value;
    const nationalId = document.getElementById("nationalId").value;
    const birthDate = document.getElementById("birthDate").value;
    const accountType = document.getElementById("accountType").value;

    // Validate age (15+)
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
        age--;
    }

    if (age < 15) {
        alert("عذرًا، يجب أن يكون عمر المتقدم 15 عامًا أو أكثر لفتح حساب.");
        return;
    }

    // Validate national ID (simplified)
    if (nationalId.length !== 14) {
        alert("رقم البطاقة الشخصية يجب أن يتكون من 14 رقمًا.");
        return;
    }

    // Show success message
    alert(
        `تم تقديم طلبك بنجاح!\n\nالاسم: ${fullName}\nرقم البطاقة: ${nationalId}\nنوع الحساب: ${accountType}\n\nسيتم التواصل معك لتحديد موعد زيارة الفرع.`
    );

    // Reset form
    document.getElementById("accountForm").reset();
    });

    // Add hover effects to feature and requirement items
    document
    .querySelectorAll(".features-list li, .requirements-list li")
    .forEach((item) => {
        item.addEventListener("mouseenter", function () {
        this.style.backgroundColor = "var(--light-gray)";
        this.style.paddingRight = "25px";
        this.style.transition = "all 0.3s ease";
        });

        item.addEventListener("mouseleave", function () {
        this.style.backgroundColor = "";
        this.style.paddingRight = "0";
        });
    });

