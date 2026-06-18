
    // تلوين التواريخ المستقبلية
    const today = new Date();
    const dateCells = document.querySelectorAll(".date-cell");

    dateCells.forEach((cell) => {
        const dateText = cell.textContent.trim();
        const [year, month, day] = dateText.split("-").map(Number);
        const cellDate = new Date(year, month - 1, day);

        // إذا كان التاريخ في المستقبل
        if (cellDate > today) {
        cell.style.color = "";
        cell.style.fontWeight = "bold";
        }
        // إذا كان التاريخ هو اليوم
        else if (cellDate.toDateString() === today.toDateString()) {
        cell.style.backgroundColor = "";
        cell.style.color = "#a0d2db";
        cell.style.borderRadius = "4px";
        }
    });

    // تحديث التاريخ الحالي في التذييل
    const todayElement = document.createElement("p");
    todayElement.textContent = `تاريخ الزيارة: ${today.toLocaleDateString(
        "ar-EG"
    )}`;
    todayElement.style.marginTop = "10px";
    todayElement.style.fontSize = "0.8rem";
    document.querySelector(".copyright").appendChild(todayElement);

