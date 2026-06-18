// بيانات الفروع من الصفحة الأصلية
const branchesData = [
  {
    branch: "El Mosky",
    governate: "Cairo",
    address: "64 Alazhar St. - Almoski - Cairo",
  },
  {
    branch: "Al Hussein - Islamic",
    governate: "Cairo",
    address: "Cross Port Said St. And Alazhar St. Cairo",
  },
  {
    branch: "El Nozha",
    governate: "Cairo",
    address: "1 Adli Kafafi St. - Saint Fatima Sq.",
  },
  { branch: "Roxy", governate: "Cairo", address: "21 Ibrahim Allaqany St." },
  { branch: "Heliopolis", governate: "Cairo", address: "11 Alhram St." },
  {
    branch: "El-Kholafa El-Rashedeen",
    governate: "Cairo",
    address: "30 Beirut St. Cairo",
  },
  {
    branch: "Orouba",
    governate: "Cairo",
    address: "Sheraton Buildings Misr Leltaamir Buildings",
  },
  {
    branch: "Beirut St.",
    governate: "Cairo",
    address: "7 Alahram St. Heliopolis",
  },
  {
    branch: "Masr El Gedida",
    governate: "Cairo",
    address: "Seven Buildings Sq.",
  },
  {
    branch: "Ammar Ibn Yasser",
    governate: "Cairo",
    address: "14 Amar bin Yasser St. Faculty Of Armed Force Heliopolis",
  },
  {
    branch: "Al Nozha Al Gadida",
    governate: "Cairo",
    address: "New Nozha Branch",
  },
  {
    branch: "Farid Simaika",
    governate: "Cairo",
    address: "111 Farid Smieka St. - Heliopolis",
  },
  { branch: "Nasr City", governate: "Cairo", address: "192 Altyaran St." },
  {
    branch: "Al-Thawra",
    governate: "Cairo",
    address: "113 El Thawra St. Almaza",
  },
  {
    branch: "City Stars",
    governate: "Cairo",
    address: "City Stars Mall in front of Gate 6",
  },
  {
    branch: "Al Ahly Club - Nasr City",
    governate: "Cairo",
    address: "Alahly Club Nasr City",
  },
  {
    branch: "Abbas Al-Akkad",
    governate: "Cairo",
    address: "45 Abbas Alakad St. Nasr City Cairo",
  },
  {
    branch: "Makram Ebeid",
    governate: "Cairo",
    address: "54 Makram Ebeid St. Nasr City - in front of The Child Garden",
  },
  {
    branch: "City Center Almaza",
    governate: "Cairo",
    address:
      "Unit No. A1-06 inside Almaza City Center Mall - next to Almaza Airport - Sheraton Airport - Cairo City",
  },
  {
    branch: "Mustafa Al-Nahhas St.",
    governate: "Cairo",
    address: "54 Ali Amin St. - from Mostafa Al Nahas St. - Nasr City",
  },
  {
    branch: "Garden City",
    governate: "Cairo",
    address: "6 Mohamed Naguib St. - Garden City",
  },
  {
    branch: "Zamalek",
    governate: "Cairo",
    address: "10 Kamel Mohamed St. Alzamalek",
  },
  {
    branch: "Abu El Feda",
    governate: "Cairo",
    address: "27 Abo Al Feda St. in front of Engineers Club - Zamalek",
  },
  {
    branch: "Al Gazirah",
    governate: "Cairo",
    address: "6A Hassan Sabry St. Zamalek",
  },
  {
    branch: "Al-Mansour Mohamed",
    governate: "Cairo",
    address: "3 Mansour Mohamed St.",
  },
  {
    branch: "Abbasia",
    governate: "Cairo",
    address: "13 El Ganzoury St. - El Giesh Square",
  },
  {
    branch: "Aga Khan",
    governate: "Cairo",
    address: "Aghakhan Towers St. Nile Cornich",
  },
  {
    branch: "Al-Nile",
    governate: "Cairo",
    address: "Cairo Plaza building Nile Cornich - Cairo",
  },
  {
    branch: "Ain Shams University",
    governate: "Cairo",
    address: "Inside Ain Shams Univesity - Abbasiya",
  },
  {
    branch: "Mansheya El-Bakry",
    governate: "Cairo",
    address: "Gesr AlSuez St. Mansheiet AlBakri Hospital",
  },
  {
    branch: "Salah Salem",
    governate: "Cairo",
    address: "Insurance and pensions building AlFangary St.",
  },
  {
    branch: "Gesr Al Suez",
    governate: "Cairo",
    address: "172 Gesr Alsuez Almataria Zaitoun Section",
  },
  {
    branch: "Helwan",
    governate: "Cairo",
    address: "35 Mustafa Al Maraghi St. - Helwan",
  },
  {
    branch: "Maadi",
    governate: "Cairo",
    address: "No.42 Rd.7 - Maadi - infront of old Maadi Central",
  },
  {
    branch: "Al-Rawdh",
    governate: "Cairo",
    address: "58 Al Manial St. - old Cairo",
  },
  {
    branch: "Al-Manial Al-Jamei",
    governate: "Cairo",
    address: "Inside Al Manial Specialized University Hospital",
  },
  {
    branch: "New Maadi",
    governate: "Cairo",
    address: "50 Rd. 79 Intersection of Rd. 24 - New Maadi",
  },
  {
    branch: "Maadi Corniche",
    governate: "Cairo",
    address: "28 Nile Cornich St. Sama Towers Maadi",
  },
  {
    branch: "Zahraa Al Maadi",
    governate: "Cairo",
    address: "Borg Alarabia 1 Piece 3 Block 86 Zahraa AlMaadi",
  },
  {
    branch: "New Maadi Central",
    governate: "Cairo",
    address: "New Club St. - Maadi Central Building 2 - Alqamar Alsenaay",
  },
  {
    branch: "Court Yard",
    governate: "Cairo",
    address:
      "Court Yard Center - Plot No. (2P) - Felstein St. District 9 - New Maadi - Cairo",
  },
  {
    branch: "Sarayat Maadi",
    governate: "Cairo",
    address: "(69) 9St. Sarayat Almaadi",
  },
  {
    branch: "El Shorouk",
    governate: "Cairo",
    address: "First Neighborhood, Eighth District - Mubarak St.",
  },
  {
    branch: "El Mokattam",
    governate: "Cairo",
    address: "Alnafora Sq. - Mokattam",
  },
  {
    branch: "Madinaty",
    governate: "Cairo",
    address:
      "No. 2 Ground floor Banks Complex Northern Sector Administrative Buildings District Phase One of Madinaty Project",
  },
  {
    branch: "Town Stars - Obour",
    governate: "Cairo",
    address:
      "Town Star Mall - 7th District - Obour City - Qalyoubia Governorate",
  },
  {
    branch: "Les Rois",
    governate: "Cairo",
    address: "Slot 14 - Pearl Les Rois Compound - Fifth Settlement - New Cairo",
  },
  {
    branch: "Katameya Heights",
    governate: "Cairo",
    address: "Katameya Heights Compound - Fifth Settlement - New Cairo",
  },
  {
    branch: "Arabella Plaza",
    governate: "Cairo",
    address: "Arabella Plaza Mall - Fifth Settlement - Cairo",
  },
  {
    branch: "New Administrative Capital",
    governate: "Cairo",
    address: "Slot A2-23 / Financial district - New Administrative Capital",
  },
  {
    branch: "Al Rehab",
    governate: "Cairo",
    address: "Al Rehab City - Banks Area",
  },
  {
    branch: "El-Sabeen",
    governate: "Cairo",
    address: "Plot 141 First Sector City Center New Cairo",
  },
  {
    branch: "Waterway",
    governate: "Cairo",
    address: "Plot 22 A New Cairo Water Way Compound",
  },
  {
    branch: "Teseen street",
    governate: "Cairo",
    address: "Tessein St. Fifth Settlement",
  },
  {
    branch: "Emerald",
    governate: "Cairo",
    address: "Lulu Hyper Mall in front of the Police Academy Altgmoa Alawal",
  },
  {
    branch: "Mirage Residence",
    governate: "Cairo",
    address: "Mirage Mall - Suez Road - First Settlement Cairo",
  },
  { branch: "Cairo", governate: "Cairo", address: "151 Mohamed Farid St." },
  {
    branch: "Dokki",
    governate: "Giza",
    address:
      "29 Mohy El Din Abou El Ezz St. Intersection Of Mossadak St. -Dokki - Giza",
  },
  {
    branch: "Mohamed Hafez",
        governate: "Giza",
        address: "Abo AlFotouh Tower Gamaet Aldewal St.",
    },
    { branch: "Al-Masaha", governate: "Giza", address: "24 Mesaha St. Dokki" },
    { branch: "Wadi El Nile", governate: "Giza", address: "15 Wadi Alnile St." },
    {
        branch: "Syria Street",
        governate: "Giza",
        address: "56 Syria St. AlMohandsin",
    },
    {
        branch: "El-Batal Ahmed Abd El-Aziz",
        governate: "Giza",
        address: "39 El Batal Ahmed Abdel Aziz St. - Mohandeseen - Giza",
    },
    {
        branch: "Giza",
        governate: "Giza",
        address: "511 Al Ahram St. - Al Nasr Building - Giza Square",
    },
    {
        branch: "Al Haram",
        governate: "Giza",
        address: "3 Al Haram St. - Besides Giza International Hospital",
    },
    {
        branch: "Qasr Al Haram",
        governate: "Giza",
        address: "171 Al Haram St. - Crossroad with Ezz Eldin Omar St.",
    },
    {
        branch: "El Maryotia",
        governate: "Giza",
        address: "5AlMariotia Alsharqy St. AlRehab Tower Sama AlMariotia City",
    },
    {
        branch: "Egyptian Museum",
        governate: "Giza",
        address:
        "Cairo Pyramids Hotel - Cairo Alexandria Desert Road - in front of the Grand Egyptian Museum",
    },
    {
        branch: "Industrial Zone - 6th of October",
        governate: "Giza",
        address: "Plot 3/1 Fourth Industrial Zone Industrial Area",
    },
    {
        branch: "Sheikh Zayed",
        governate: "Giza",
        address: "Sheikh Zayed City - AlNada District - Inside AlNada Center",
    },
    {
        branch: "Financial District",
        governate: "Giza",
        address:
        "Financial district in the smart village the beginning of the Cairo-Alexandria Desert Road",
    },
    {
        branch: "West Somid",
        governate: "Giza",
        address:
        "Unit No. 3 Banks Complex - Neighborhood 9 10 Services Center - Gharb Sumed - 6 of October City - Giza Governorate",
    },
    {
        branch: "Beverly Hills",
        governate: "Giza",
        address: "Block 4 A Strip Mall Sheikh Zayed",
    },
    {
        branch: "Mall of Egypt",
        governate: "Giza",
        address: "6th of October AlWahat Road After Dream Land",
    },
    {
        branch: "Concordia",
        governate: "Giza",
        address:
        "Mega banks complex Concordia Plaza Real Estate - Eastern Expansions Area",
    },
    {
        branch: "Arkan",
        governate: "Giza",
        address:
        "Arkan Mall - Sheikh Zayed Entrance 2 - in front of the Urban Communities Authority - Central Axis - 6th of October - Giza Governorate.",
    },
    {
        branch: "Fifth District",
        governate: "Giza",
        address:
        "Comercial Market Building - second Neighboring - Fifth district - Shiekh Zayed - Giza",
    },
    {
        branch: "Walk of Cairo",
        governate: "Giza",
        address:
        "Walk Of Cairo mall - west Sodic - Shiekh Zayed - 6th of October - Giza",
    },
    {
        branch: "Marsa Matrouh",
        governate: "alex",
        address: "18 Algalaa St. Matrouh",
    },
    {
        branch: "Abu El Abbas - Islamic",
        governate: "alex",
        address: "mosques Sq. Algomrok",
    },
    {
        branch: "Al Amreya - Alexandria",
        governate: "alex",
        address: "Alaamiria - Asmaa Bint Abo Bakr St.",
    },
    {
        branch: "Borg El-Silsla",
        governate: "alex",
        address: "95 26 July Road - Azarita Alexandria",
    },
    {
        branch: "Roushy Alexandria",
        governate: "Alex",
        address: "51 El-Orouba St., Heliopolis",
    },
    { branch: "Sesostris", governate: "Alex", address: "17 Sesostris St." },
    { branch: "Isis", governate: "Alex", address: "463 Alhoriea Road Bolkley" },
    {
        branch: "Louran",
        governate: "Alex",
        address: "449 Gamal Abd Alnasser St.",
    },
    {
        branch: "Al Ibrahimiyyah",
        governate: "Alex",
        address: "190 Gamal Abd Alnasser Road",
    },
    {
        branch: "Smouha",
        governate: "Alex",
        address:
        "47 Victor Emmanuel St. - Association Division - Smouha - in front of Zahran Mall",
    },
    { branch: "Al Horeya", governate: "Alex", address: "12 Syria St. Roushdy" },
    {
        branch: "Saba Basha",
        governate: "Alex",
        address: "336 Algish Road - Saba Pasha - Alexandria",
    },
    {
        branch: "Camp Shezar",
        governate: "Alex",
        address: "Camp Shizar - Alexandria",
    },
    {
        branch: "Miami",
        governate: "Alex",
        address: "652 Algish road - Corner of Ibn Sokra St. - Miami Alexandria",
    },
    {
        branch: "Mohamed Naguib",
        governate: "Alex",
        address: "108 Mohamed Farid Street / Cairo",
    },
    {
        branch: "Talaat Harb - Alexandria",
        governate: "Alex",
        address:
        "47 Victor Emmanuel St. - Association Division - Smouha - in front of Zahran Mall",
    },
    {
        branch: "Banha",
        governate: "Al Qalyubia",
        address: "Banha Saad Zaghloul St.",
    },
    {
        branch: "City Heights - Obour",
        governate: "Al Qalyubia",
        address: "City Heights Mall - Obour City - Al Qalyubia",
    },
    {
        branch: "Beni Suef",
        governate: "Beni Suef",
        address: "Beni Suef Riyad St.",
    },
    {
        branch: "Beni Suef - Islamic",
        governate: "Beni Suef",
        address: "Hafez St. behind Beni Suef Central",
    },
    {
        branch: "Rashid",
        governate: "Albuhaira",
        address:
        "Albahr St. - Rasheed - Beside the school complex Ali Algarem School",
    },
    {
        branch: "Damanhour",
        governate: "Al-buhaira",
        address:
        "Banque Misr Damanhour Branch - 1 Saad Zaghloul St. Damanhour Albuhaira",
    },
    {
        branch: "Mansoura - Islamic",
        governate: "AL-Dakahlia",
        address: "197 Algomhoria St.",
    },
    {
        branch: "Mansoura",
        governate: "AL-Dakahlia",
        address: "197 Al Gomhorya St. - Mansoura",
    },
    {
        branch: "Mit Ghamr",
        governate: "AL-Dakahlia",
        address: "5 Al Horya St. - Mit Ghamr",
    },
    {
        branch: "Suez Canal - Mansoura",
        governate: "AL-Dakahlia",
        address: "City Plaza Tower - Suez Canal St. - Mansoura",
    },
    {
        branch: "Fayoum",
        governate: "Al-Fayoum",
        address: "AlFayoum 45 AlHorreya St. Fayoum",
    },
    {
        branch: "El Mahalla El Kubra",
        governate: "Al-gharbia",
        address: "Almahalla Alkobra",
    },
    {
        branch: "El Mahalla 23 July",
        governate: "Al-gharbia",
        address: "23 July St. Almahala",
    },
    {
        branch: "Ali Mubarak - Tanta",
        governate: "Al-gharbia",
        address: "Cross Alfateh St. and Ali Mubarak St. - Tanta",
    },
    {
        branch: "Mohamed Farid - Tanta",
        governate: "Al-gharbia",
        address: "Mohamed Farid St. - Tanta",
    },
    { branch: "Ismailia", governate: "AL-Ismalia", address: "Alqantara Gharb" },
    { branch: "Minya", governate: "Al-Menia", address: "AlGeish Sq." },
    {
        branch: "Mallawi",
        governate: "Al-Menia",
        address: "Mallawi Banque Misr St.",
    },
    {
        branch: "Shebeen El-Kom",
        governate: "Al-Monofia",
        address: "78 Gamal Abd AlNasir St. - Shebin ALKom",
    },
    {
        branch: "10th of Ramadan",
        governate: "Al-sharkia",
        address: "10 of Ramadan",
    },
    { branch: "Zagazig", governate: "Al-sharkia", address: "29 Talaat Harb St." },
    {
        branch: "Zagazig - Islamic",
        governate: "Al-sharkia",
        address: "Zagazig 75 A Saad Zaghloul St. in front of the governorate",
    },
    { branch: "Asyut", governate: "Assiut", address: "Saad Zaghloul St. Assiut" },
    {
        branch: "Banking Field - Asyut",
        governate: "Assiut",
        address: "Assiut Cement Company",
    },
    {
        branch: "Damietta",
        governate: "Domiatta",
        address: "35 Saad Zaghloul St.",
    },
    {
        branch: "Kafr El-Sheikh",
        governate: "Kafr al-shik",
        address: "Salah Salem St.",
    },
    { branch: "Luxor", governate: "Luxor", address: "Karnak Temple St." },
    {
        branch: "Sultan Hussein - Port Said",
        governate: "Port-Saaid",
        address: "Sultan Hussain St. Alfribor Building",
    },
    {
        branch: "Manshiya Square - Port Said",
        governate: "Port-Saaid",
        address: "18 Al Gomhoria St. - Port Said Governorate",
    },
    { branch: "Qena", governate: "Qena", address: "Port Said St. - Qena" },
    {
        branch: "Hurghada",
        governate: "Red Sea",
        address: "Nasser St. - Aldahar - Hurghada",
    },
    { branch: "El Gouna", governate: "Red Sea", address: "Elgouna - Hurghada" },
    {
        branch: "Bank District - Hurghada",
        governate: "Red Sea",
        address: "Airport Road - Banks District",
    },
    {
        branch: "Sharm El-Sheikh",
        governate: "Sinai",
        address: "Om Alsied Hill banking complex",
    },
    {
        branch: "Al Balyana",
        governate: "Sohag",
        address: "Canal Umm Altabboul St. - AlBalina Sohag",
    },
    { branch: "Sohag", governate: "Sohag", address: "17 Qaisairia St - Sohag" },
    {
        branch: "Girga",
        governate: "Sohag",
        address: "Saad Zaghloul Street - Gerga",
    },
    ];

    // دالة لعرض الفروع في الجدول
    function displayBranches(filteredBranches) {
    const tableBody = document.getElementById("branchesTableBody");
    const noResults = document.getElementById("noResults");
    const totalBranches = document.getElementById("totalBranches");

    // تحديث عدد الفروع
    totalBranches.textContent = filteredBranches.length;

    // إفراغ الجدول
    tableBody.innerHTML = "";

    // إذا لم توجد نتائج
    if (filteredBranches.length === 0) {
        tableBody.style.display = "none";
        noResults.style.display = "block";
        return;
    }

    // إظهار الجدول وإخفاء رسالة عدم العثور على نتائج
    tableBody.style.display = "table-row-group";
    noResults.style.display = "none";

    // إضافة الفروع إلى الجدول
    filteredBranches.forEach((branch) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                        <td>
                            <div class="branch-name">${branch.branch}</div>
                        </td>
                        <td>
                            <div class="governate-badge">${branch.governate}</div>
                        </td>
                        <td>
                            <div class="branch-address">${branch.address}</div>
                        </td>
                    `;

        tableBody.appendChild(row);
    });
    }

    // دالة للبحث والتصفية
    function filterBranches() {
    const searchTerm = document
        .getElementById("branchSearch")
        .value.toLowerCase();
    const governateFilter = document.getElementById("governateFilter").value;

    let filtered = branchesData;

    // تطبيق فلتر المحافظة
    if (governateFilter !== "all") {
        filtered = filtered.filter(
        (branch) => branch.governate === governateFilter
        );
    }

    // تطبيق البحث النصي
    if (searchTerm) {
        filtered = filtered.filter(
        (branch) =>
            branch.branch.toLowerCase().includes(searchTerm) ||
            branch.governate.toLowerCase().includes(searchTerm) ||
            branch.address.toLowerCase().includes(searchTerm)
        );
    }

    // عرض الفروع المصفاة
    displayBranches(filtered);
    }

    // تهيئة الصفحة عند التحميل
    document.addEventListener("DOMContentLoaded", function () {
    // عرض جميع الفروع عند التحميل
    displayBranches(branchesData);

    // إضافة مستمعي الأحداث للبحث والتصفية
    document
        .getElementById("branchSearch")
        .addEventListener("input", filterBranches);
    document
        .getElementById("governateFilter")
        .addEventListener("change", filterBranches);

    // إضافة السنة الحالية في التذييل
    document.getElementById("currentYear").textContent = new Date().getFullYear();



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

    // Highlight table rows on hover
    document.addEventListener("mouseover", function (e) {
        if (
        e.target.tagName === "TR" &&
        e.target.parentElement.tagName === "TBODY"
        ) {
        e.target.style.backgroundColor = "rgba(212, 175, 55, 0.1)";
        }
    });

    document.addEventListener("mouseout", function (e) {
        if (
        e.target.tagName === "TR" &&
        e.target.parentElement.tagName === "TBODY"
        ) {
        const rowIndex = Array.from(e.target.parentElement.children).indexOf(
            e.target
        );
        if (rowIndex % 2 === 0) {
            e.target.style.backgroundColor = "var(--light-gray)";
        } else {
            e.target.style.backgroundColor = "var(--white)";
        }
        }
    });
    });
