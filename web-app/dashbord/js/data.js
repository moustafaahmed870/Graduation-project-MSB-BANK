// // بيانات المستخدم - بنك مصر الرقمية
// const BankData = {
//     user: {
//         id: 1,
//         name: 'أحمد محمد',
//         email: 'ahmed.mohamed@email.com',
//         phone: '+20 100 123 4567',
//         address: 'القاهرة، مصر',
//         nationalId: '29901011234567',
//         dob: '15 مارس 1985',
//         maritalStatus: 'متزوج',
//         occupation: 'مهندس برمجيات',
        
//         accountNumber: '001458796',
//         balance: 45750,
//         walletBalance: 1250,
//         currency: 'ج.م',
//         creditScore: 750,
//         rewardPoints: 1250,
//         rewardLevel: 'فضي',
        
//         accounts: [
//             { 
//                 id: 1, 
//                 name: 'الحساب الجاري', 
//                 number: '001458796', 
//                 balance: 45750, 
//                 type: 'current',
//                 currency: 'ج.م',
//                 icon: 'credit-card'
//             },
//             { 
//                 id: 2, 
//                 name: 'حساب التوفير', 
//                 number: '002458797', 
//                 balance: 15000, 
//                 type: 'saving',
//                 currency: 'ج.م',
//                 icon: 'piggy-bank'
//             },
//             { 
//                 id: 3, 
//                 name: 'حساب الاستثمار', 
//                 number: '003458798', 
//                 balance: 18500, 
//                 type: 'investment',
//                 currency: 'ج.م',
//                 icon: 'chart-line'
//             }
//         ],
        
//         cards: [
//             { 
//                 id: 1, 
//                 name: 'البطاقة الذهبية', 
//                 number: '4587', 
//                 type: 'visa', 
//                 status: 'active', 
//                 expiry: '12/25',
//                 creditLimit: 50000,
//                 usedLimit: 4250,
//                 availableBalance: 45750
//             },
//             { 
//                 id: 2, 
//                 name: 'البطاقة الأساسية', 
//                 number: '8921', 
//                 type: 'mastercard', 
//                 status: 'active', 
//                 expiry: '09/24',
//                 creditLimit: 30000,
//                 usedLimit: 1500,
//                 availableBalance: 28500
//             },
//             { 
//                 id: 3, 
//                 name: 'البطاقة الائتمانية', 
//                 number: '3456', 
//                 type: 'visa', 
//                 status: 'inactive', 
//                 expiry: '06/26',
//                 creditLimit: 20000,
//                 usedLimit: 0,
//                 availableBalance: 20000
//             }
//         ],
        
//         transactions: [
//             { id: 1, type: 'purchase', description: 'سوبرماركت كارفور', amount: -150, date: '2023-10-12', category: 'shopping', icon: 'shopping-cart', currency: 'ج.م' },
//             { id: 2, type: 'deposit', description: 'الراتب الشهري', amount: 8000, date: '2023-10-10', category: 'salary', icon: 'money-check-alt', currency: 'ج.م' },
//             { id: 3, type: 'transfer', description: 'تحويل من محمد أحمد', amount: 500, date: '2023-10-08', category: 'transfer-in', icon: 'user-friends', currency: 'ج.م' },
//             { id: 4, type: 'subscription', description: 'نتفليكس - اشتراك شهري', amount: -45, date: '2023-10-05', category: 'subscription', icon: 'film', currency: 'ج.م' },
//             { id: 5, type: 'purchase', description: 'محطة وقود', amount: -200, date: '2023-10-03', category: 'shopping', icon: 'gas-pump', currency: 'ج.م' },
//             { id: 6, type: 'transfer', description: 'تحويل إلى سارة خالد', amount: -1000, date: '2023-09-28', category: 'transfer-out', icon: 'paper-plane', currency: 'ج.م' },
//             { id: 7, type: 'deposit', description: 'إيداع نقدي', amount: 5000, date: '2023-09-25', category: 'deposit', icon: 'money-bill-wave', currency: 'ج.م' },
//             { id: 8, type: 'bill', description: 'فاتورة الكهرباء', amount: -320, date: '2023-09-20', category: 'bill', icon: 'bolt', currency: 'ج.م' },
//             { id: 9, type: 'transfer', description: 'تحويل إلى محمد أحمد', amount: -200, date: '2023-09-15', category: 'transfer-out', icon: 'paper-plane', currency: 'ج.م' },
//             { id: 10, type: 'purchase', description: 'مطعم', amount: -85, date: '2023-09-12', category: 'food', icon: 'utensils', currency: 'ج.م' }
//         ],
        
//         beneficiaries: [
//             { id: 1, name: 'محمد أحمد', accountNumber: '001234567', bank: 'البنك الأهلي المصري', type: 'internal' },
//             { id: 2, name: 'سارة خالد', accountNumber: '002345678', bank: 'بنك القاهرة', type: 'external' },
//             { id: 3, name: 'أحمد علي', accountNumber: '003456789', bank: 'البنك التجاري الدولي', type: 'external' }
//         ],
        
//         bills: [
//             { id: 1, name: 'كهرباء', amount: 320, dueDate: '2023-10-25', status: 'pending', icon: 'bolt' },
//             { id: 2, name: 'مياه', amount: 85, dueDate: '2023-10-28', status: 'pending', icon: 'tint' },
//             { id: 3, name: 'اتصالات', amount: 150, dueDate: '2023-10-30', status: 'paid', icon: 'phone' },
//             { id: 4, name: 'إنترنت', amount: 299, dueDate: '2023-11-05', status: 'pending', icon: 'wifi' }
//         ],
        
//         notifications: [
//             { id: 1, text: 'تم سحب 150 ج.م من بطاقتك', time: 'منذ 5 دقائق', read: false, type: 'transaction', icon: 'credit-card' },
//             { id: 2, text: 'تم إيداع راتبك البالغ 8,000 ج.م', time: 'منذ يومين', read: true, type: 'deposit', icon: 'money-bill-wave' },
//             { id: 3, text: 'تمت مصادقة جهاز جديد على حسابك', time: 'منذ 4 أيام', read: true, type: 'security', icon: 'shield-alt' },
//             { id: 4, text: 'فواتير قادمة: الكهرباء 320 ج.م', time: 'منذ 6 أيام', read: true, type: 'bill', icon: 'bolt' },
//             { id: 5, text: 'تم تحديث شروط الخدمة', time: 'منذ أسبوع', read: true, type: 'system', icon: 'info-circle' }
//         ],
        
//         investments: [
//             { id: 1, name: 'صندوق الأسهم المصرية', amount: 8500, change: 2.3, type: 'stocks', icon: 'chart-line' },
//             { id: 2, name: 'صندوق السندات الحكومية', amount: 5000, change: 1.2, type: 'bonds', icon: 'file-contract' },
//             { id: 3, name: 'صندوق الذهب', amount: 3000, change: -0.5, type: 'gold', icon: 'gem' },
//             { id: 4, name: 'صندوق العقارات', amount: 2000, change: 3.1, type: 'realEstate', icon: 'building' }
//         ],
        
//         savingsGoals: [
//             { id: 1, name: 'شراء سيارة', target: 100000, current: 65000, icon: 'car' },
//             { id: 2, name: 'العمرة', target: 50000, current: 25000, icon: 'kaaba' },
//             { id: 3, name: 'تعليم الأطفال', target: 200000, current: 75000, icon: 'graduation-cap' }
//         ],
        
//         smartSavings: [
//             { id: 1, name: 'تقريب المشتريات', active: true, savings: 850 },
//             { id: 2, name: 'توفير يومي', active: true, amount: 5, savings: 450 },
//             { id: 3, name: 'توفير نسبة من الراتب', active: false, percentage: 10 }
//         ]
//     },
    
//     appState: {
//         isAuthenticated: true,
//         currentLanguage: 'ar',
//         currentPage: 'index'
//     }
// };

// // دوال مساعدة
// BankData.formatCurrency = function(amount) {
//     return amount.toLocaleString('ar-EG') + ' ج.م';
// };

// BankData.getUnreadNotificationsCount = function() {
//     return this.user.notifications.filter(n => !n.read).length;
// };

// BankData.getTotalBalance = function() {
//     return this.user.accounts.reduce((total, account) => total + account.balance, 0);
// };

// // جعل البيانات متاحة عالمياً
// window.BankData = BankData;