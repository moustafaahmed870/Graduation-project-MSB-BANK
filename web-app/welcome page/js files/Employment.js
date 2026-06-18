    document.getElementById("showMoreBtn").addEventListener("click", function () {
    alert(
        "سيتم عرض المزيد من التفاصيل حول عملية التوظيف في نافذة منبثقة جديدة. يمكن إضافة المزيد من المحتوى التفصيلي هنا."
    );
    });

    document
    .getElementById("startProcessBtn")
    .addEventListener("click", function () {
        alert(
        "تهانينا! لقد بدأت عملية التوظيف. ستتلقى إشعارات بكل خطوة من الخطوات المذكورة أعلاه."
        );
    });

    // إضافة تأثيرات تفاعلية إضافية
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-8px) scale(1.01)";
    });

    card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
    });
    });

    // إضافة تأثيرات للخطوات عند النقر
    const steps = document.querySelectorAll(".process-steps li");
    steps.forEach((step) => {
    step.addEventListener("click", function () {
        this.style.padding = "20px";
        this.style.borderRadius = "8px";
        this.style.transition = "all 0.3s ease";
        this.style.cursor = "pointer";

        // إزالة التأثير من الخطوات الأخرى
        steps.forEach((s) => {
        if (s !== this) {
            s.style.backgroundColor = "";
            s.style.padding = "";
            s.style.borderRadius = "";
        }
        });
    });
    });

        const list = document.querySelectorAll(".tips-list li");
        list.forEach((list) => {
        list.addEventListener("click", function () {
            this.style.padding = "20px";
            this.style.borderRadius = "8px";
            this.style.transition = "all 0.3s ease";
            this.style.cursor = "pointer";

            // إزالة التأثير من الخطوات الأخرى
            list.forEach((l) => {
            if (l !== this) {
                l.style.backgroundColor = "";
                l.style.padding = "";
                l.style.borderRadius = "";
            }
            });
        });
        });
