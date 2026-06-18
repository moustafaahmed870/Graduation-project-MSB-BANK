// إضافة تأثيرات تفاعلية
    document.querySelectorAll(".board-member").forEach((member) => {
    member.addEventListener("mouseenter", function () {
        this.style.zIndex = "10";
    });

    member.addEventListener("mouseleave", function () {
        this.style.zIndex = "1";
    });
    });

