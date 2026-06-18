    document.getElementById("dataForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // التحقق من صحة البيانات الأساسية
    const fullName = document.getElementById("fullName").value;
    const nationalId = document.getElementById("nationalId").value;
    const email = document.getElementById("email").value;

    if (!fullName || !nationalId || !email) {
        alert("يرجى ملء جميع الحقول الإجبارية");
        return;
    }

    // التحقق من صحة رقم الهاتف
    const phone = document.getElementById("phone").value;
    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
        alert("يرجى إدخال رقم هاتف محمول صحيح (مثال: 01001234567)");
        return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("يرجى إدخال بريد إلكتروني صحيح");
        return;
    }

    // عند النجاح، عرض رسالة تأكيد
    alert(
        "تم استلام بياناتك بنجاح!\n\nيرجى الآن إرسال الاستمارة مكتملة إلى البريد الإلكتروني:\nBM19019@BanqueMSB.com\n\nسيتم الرد عليك خلال يومي عمل."
    );

    });

    // إضافة تأثيرات تفاعلية للحقول
    const formInputs = document.querySelectorAll("input, select, textarea");
    formInputs.forEach((input) => {
    // عند التركيز على الحقل
    input.addEventListener("focus", function () {
        this.parentElement.style.transform = "translateY(-2px)";
    });

    // عند الخروج من الحقل
    input.addEventListener("blur", function () {
        this.parentElement.style.transform = "translateY(0)";
    });
    });
