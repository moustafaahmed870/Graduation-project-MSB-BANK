// js/main.js
// النسخة النهائية - مع دعم الاستثمارات

const BankApp = {
    // بيانات المستخدم
    user: {
        uid: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        nationalId: '',
        dob: '',
        balance: 0,
        walletBalance: 0,
        rewardsLevel: '',
        accounts: [],
        cards: [],
        transactions: [],
        bills: [],
        notifications: [],
        investments: [],
        loans: [],
        beneficiaries: []
    },

    // متغيرات للتحديث التلقائي
    pollingInterval: null,
    updateUITimeout: null,
    refreshTimeout: null,

    // ========================================
    // API Calls
    // ========================================
    apiCall: async function(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:3000/api/dashboard${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
                ...options.headers
            }
        });
        
        const data = await response.json();
        if (!response.ok) {
            if (response.status === 401) {
                this.logout();
            }
            throw new Error(data.message || 'Request failed');
        }
        return data;
    },

    // شاشة تحميل
    showLoader: function(show, message = 'جاري التحميل...') {
        let loader = document.getElementById('appLoader');
        if (show) {
            if (!loader) {
                loader = document.createElement('div');
                loader.id = 'appLoader';
                loader.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(8,27,41,0.95);z-index:10000;display:flex;align-items:center;justify-content:center;flex-direction:column';
                loader.innerHTML = `
                    <div style="width:50px;height:50px;border:3px solid rgba(160,210,219,0.3);border-top:3px solid #4fc3f7;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px;"></div>
                    <div style="color:#a0d2db;" id="loaderMessage">${message}</div>
                    <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
                `;
                document.body.appendChild(loader);
            } else {
                const msgEl = document.getElementById('loaderMessage');
                if (msgEl) msgEl.textContent = message;
                loader.style.display = 'flex';
            }
        } else {
            if (loader) loader.style.display = 'none';
        }
    },

    // ========================================
    // تحميل جميع البيانات من API
    // ========================================
    loadData: async function(showLoader = true) {
        if (showLoader) {
            this.showLoader(true, 'جاري تحميل بياناتك...');
        }
        
        try {
            console.log('🔄 [loadData] Starting data load...');
            
            // 1. جلب الملف الشخصي
            const profileData = await this.apiCall('/profile');
            if (profileData.profile) {
                this.user.uid = profileData.profile.uid || '';
                this.user.name = profileData.profile.fullName || '';
                this.user.email = profileData.profile.email || '';
                this.user.phone = profileData.profile.phone || '';
                this.user.address = profileData.profile.address || '';
                this.user.nationalId = profileData.profile.nationalId || '';
                this.user.dob = profileData.profile.dateOfBirth || '';
            }
            console.log('✅ Profile loaded');
            
            // 2. جلب الحسابات
            const accountsData = await this.apiCall('/accounts');
            this.user.accounts = accountsData.accounts || [];
            this.user.balance = this.user.accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
            console.log('✅ Accounts loaded:', this.user.accounts.length);
            
            // 3. جلب البطاقات
            const cardsData = await this.apiCall('/cards');
            this.user.cards = cardsData.cards || [];
            console.log('✅ Cards loaded:', this.user.cards.length);
            
            // 4. جلب المعاملات
            const transactionsData = await this.apiCall('/transactions');
            this.user.transactions = transactionsData.transactions || [];
            console.log('✅ Transactions loaded:', this.user.transactions.length);
            
            // 5. جلب الفواتير
            const billsData = await this.apiCall('/payments/bills');
            this.user.bills = billsData.bills || [];
            console.log('✅ Bills loaded:', this.user.bills.length);
            
            // 6. جلب الإشعارات
            const notifsData = await this.apiCall('/notifications');
            this.user.notifications = notifsData.notifications || [];
            console.log('✅ Notifications loaded:', this.user.notifications.length);
            
            // 7. جلب بيانات المحفظة
            const walletData = await this.apiCall('/wallet');
            this.user.walletBalance = walletData.wallet?.balance || 0;
            console.log('✅ Wallet loaded:', this.user.walletBalance);
            
            // 8. جلب المستفيدين
            const beneficiariesData = await this.apiCall('/beneficiaries');
            this.user.beneficiaries = beneficiariesData.beneficiaries || [];
            console.log('✅ Beneficiaries loaded:', this.user.beneficiaries.length);
            
            // 9. جلب القروض
            const loansData = await this.apiCall('/loans');
            this.user.loans = loansData.loans || [];
            console.log('✅ Loans loaded:', this.user.loans.length);
            
            // 10. ✅ جلب الاستثمارات (الأهم)
            const investmentsData = await this.apiCall('/investments');
            this.user.investments = investmentsData.investments || [];
            console.log('✅ Investments loaded:', this.user.investments.length);
            if (this.user.investments.length > 0) {
                console.log('📊 Investments details:', this.user.investments);
            }
            
            // 11. حساب مستوى المكافآت
            this.user.rewardsLevel = this.user.balance > 50000 ? 'ذهبي' : this.user.balance > 10000 ? 'فضي' : 'برونزي';
            
            // 12. تحديث واجهة المستخدم
            this.updateUI();
            
            console.log('✅ All data loaded successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Load data error:', error);
            if (showLoader) {
                this.showErrorMessage('فشل في تحميل البيانات. يرجى تحديث الصفحة.');
            }
            return false;
        } finally {
            if (showLoader) {
                this.showLoader(false);
            }
        }
    },

    // تحديث البيانات بدون شاشة تحميل
    refreshDataSilently: async function() {
        try {
            const notifsData = await this.apiCall('/notifications');
            if (notifsData.notifications) {
                const oldCount = this.user.notifications.filter(n => !n.read).length;
                this.user.notifications = notifsData.notifications;
                this.updateNotifications();
                
                const newCount = this.user.notifications.filter(n => !n.read).length;
                if (newCount > oldCount && this.user.notifications.length > 0) {
                    const newNotif = this.user.notifications[0];
                    if (newNotif && BankUtils) {
                        BankUtils.showAlert(newNotif.message, 'info');
                    }
                }
            }
            
            const accountsData = await this.apiCall('/accounts');
            if (accountsData.accounts) {
                this.user.accounts = accountsData.accounts;
                this.user.balance = this.user.accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
                this.updateBalances();
                
                if (typeof updateAccountsGridWithActions === 'function') {
                    updateAccountsGridWithActions();
                }
                if (typeof updateMainAccountDisplay === 'function') {
                    updateMainAccountDisplay();
                }
                if (typeof refreshAllPageData === 'function') {
                    refreshAllPageData();
                }
            }
            
            const walletData = await this.apiCall('/wallet');
            if (walletData.wallet) {
                this.user.walletBalance = walletData.wallet?.balance || 0;
                const walletBalanceEl = document.getElementById('walletBalance');
                if (walletBalanceEl) {
                    walletBalanceEl.innerHTML = `${this.user.walletBalance.toLocaleString()} <span data-i18n="currency.egp">${I18n.t('currency.egp')}</span>`;
                }
            }
            
            // ✅ تحديث الاستثمارات
            const investmentsData = await this.apiCall('/investments');
            if (investmentsData.investments) {
                this.user.investments = investmentsData.investments;
                console.log('🔄 Investments refreshed:', this.user.investments.length);
            }
            
            return true;
        } catch (error) {
            console.error('Silent refresh error:', error);
            return false;
        }
    },

    // بدء التحديث التلقائي
    startNotificationPolling: function() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        
        console.log('🔄 بدء التحديث التلقائي (كل 10 ثواني)');
        
        this.pollingInterval = setInterval(async () => {
            try {
                await this.refreshDataSilently();
            } catch (error) {
                console.error('خطأ في التحديث التلقائي:', error);
            }
        }, 10000);
    },

    // إيقاف التحديث التلقائي
    stopNotificationPolling: function() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
            console.log('⏹️ تم إيقاف التحديث التلقائي');
        }
    },

    showErrorMessage: function(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#ef4444;color:white;padding:12px 24px;border-radius:8px;z-index:10001;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.2)';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    },

    // ========================================
    // تحديث واجهة المستخدم
    // ========================================
    
    updateUI: function() {
        if (this.updateUITimeout) {
            clearTimeout(this.updateUITimeout);
        }
        
        this.updateUITimeout = setTimeout(() => {
            this.updateUserInfo();
            this.updateBalances();
            this.updateTransactionsList();
            this.updateAccountsGrid();
            this.updateCardsList();
            this.updateBillsList();
            this.updateNotifications();
            this.updateSavingsGoals();
            
            if (typeof refreshAccountsPage === 'function') {
                refreshAccountsPage();
            }
            if (typeof updateMainAccountDisplay === 'function') {
                updateMainAccountDisplay();
            }
        }, 50);
    },

    updateUserInfo: function() {
        const userNameElement = document.getElementById('userName');
        const userNameText = document.getElementById('userNameText');
        const accountNumberElement = document.getElementById('accountNumber');
        const accountNumberText = document.getElementById('accountNumberText');
        const rewardsLevelElement = document.getElementById('rewardsLevel');

        const displayName = this.user.name || 'مستخدم';
        
        if (userNameElement && userNameText) {
            userNameElement.innerHTML = `<span data-i18n="hello">${I18n.t('hello')}</span>، <span id="userNameText">${displayName}</span>!`;
        } else if (userNameElement) {
            userNameElement.innerHTML = `<span data-i18n="hello">${I18n.t('hello')}</span>، ${displayName}!`;
        }
        
        if (accountNumberElement && this.user.accounts.length > 0) {
            const mainAccount = this.user.accounts.find(acc => acc.type === 'current') || this.user.accounts[0];
            if (accountNumberText) {
                accountNumberText.textContent = mainAccount.number;
            } else {
                accountNumberElement.innerHTML = `<span data-i18n="accounts.account_number">${I18n.t('accounts.account_number')}</span>: ${mainAccount.number}`;
            }
        }
        
        if (rewardsLevelElement) {
            rewardsLevelElement.textContent = this.user.rewardsLevel;
        }
    },

    updateBalances: function() {
        const balanceElement = document.getElementById('balanceAmount');
        const walletBalanceElement = document.getElementById('walletBalance');
        
        if (balanceElement) {
            balanceElement.innerHTML = `${this.user.balance.toLocaleString()} <span data-i18n="currency.egp">${I18n.t('currency.egp')}</span>`;
        }
        if (walletBalanceElement) {
            walletBalanceElement.innerHTML = `${this.user.walletBalance.toLocaleString()} <span data-i18n="currency.egp">${I18n.t('currency.egp')}</span>`;
        }
    },

    updateTransactionsList: function() {
        const list = document.getElementById('transactionsList');
        if (list) {
            if (this.user.transactions.length === 0) {
                list.innerHTML = '<div class="text-center p-3"><span data-i18n="no_transactions">لا توجد معاملات</span></div>';
            } else {
                list.innerHTML = this.user.transactions.slice(0, 5).map(t => {
                    const amountClass = t.amount >= 0 ? 'positive' : 'negative';
                    const amountPrefix = t.amount >= 0 ? '+' : '';
                    let displayIcon = t.icon || 'exchange-alt';
                    let displayDescription = t.description;
                    
                    if (t.amount > 0 && t.category === 'transfer') {
                        if (!displayDescription.includes('استلام')) {
                            displayDescription = `استلام تحويل من ${t.fromUserName || 'مستخدم'}`;
                            displayIcon = 'arrow-down';
                        }
                    }
                    
                    if (t.amount < 0 && t.category === 'transfer') {
                        if (!displayDescription.includes('تحويل إلى')) {
                            displayDescription = `تحويل إلى ${t.toUserName || 'حساب آخر'}`;
                            displayIcon = 'paper-plane';
                        }
                    }
                    
                    return `
                        <li class="transaction-item">
                            <div class="transaction-info">
                                <div class="transaction-icon ${amountClass}">
                                    <i class="fas fa-${displayIcon}"></i>
                                </div>
                                <div class="transaction-details">
                                    <div class="transaction-name">${displayDescription}</div>
                                    <div class="transaction-date">${BankUtils.formatDate(t.date)}</div>
                                </div>
                            </div>
                            <div class="transaction-amount ${amountClass}">
                                ${amountPrefix}${Math.abs(t.amount).toLocaleString()} <span>${I18n.t('currency.egp')}</span>
                            </div>
                        </li>
                    `;
                }).join('');
            }
        }
        
        const transfersList = document.getElementById('transfersList');
        if (transfersList) {
            const transfers = this.user.transactions.filter(t => t.category === 'transfer' || t.category === 'transfer-external' || t.category === 'transfer-received');
            if (transfers.length === 0) {
                transfersList.innerHTML = '<div class="text-center p-3"><span data-i18n="no_transactions">لا توجد تحويلات</span></div>';
            } else {
                transfersList.innerHTML = transfers.slice(0, 10).map(t => `
                    <div class="transaction-item">
                        <div class="transaction-info">
                            <div class="transaction-icon outgoing">
                                <i class="fas fa-${t.icon || 'exchange-alt'}"></i>
                            </div>
                            <div>
                                <h4>${t.description}</h4>
                                <p>${BankUtils.formatDate(t.date)}</p>
                            </div>
                        </div>
                        <div class="transaction-amount negative">
                            ${Math.abs(t.amount).toLocaleString()} ${I18n.t('currency.egp')}
                        </div>
                    </div>
                `).join('');
            }
        }
    },

    updateAccountsGrid: function() {
        const grid = document.getElementById('accountsGrid');
        if (!grid) return;
        
        if (this.user.accounts.length === 0) {
            grid.innerHTML = '<div class="text-center p-3"><span data-i18n="no_accounts">لا توجد حسابات</span></div>';
            return;
        }
        
        grid.innerHTML = this.user.accounts.map(account => `
            <div class="account-card">
                <div class="account-header">
                    <div class="account-icon ${account.type}">
                        <i class="fas fa-${account.icon || 'credit-card'}"></i>
                    </div>
                    <div class="account-info">
                        <h3>${account.name}</h3>
                        <p class="account-number">${I18n.t('accounts.account_number')}: ${account.number}</p>
                    </div>
                </div>
                <div class="account-balance">
                    <div class="balance-amount">${account.balance.toLocaleString()} ${I18n.t('currency.egp')}</div>
                    <div class="balance-label" data-i18n="available_balance">${I18n.t('available_balance')}</div>
                </div>
                <div class="account-actions">
                    <button class="btn btn-sm btn-primary" onclick="BankApp.showSendMoneyModal('${account.id}')">
                        <i class="fas fa-paper-plane"></i> ${I18n.t('send')}
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="BankApp.viewAccountDetails('${account.id}')">
                        <i class="fas fa-info-circle"></i> ${I18n.t('details')}
                    </button>
                </div>
            </div>
        `).join('');
    },

    updateCardsList: function() {
        const grid = document.getElementById('cardsGrid');
        if (!grid) return;
        
        if (this.user.cards.length === 0) {
            grid.innerHTML = '<div class="text-center p-3"><span data-i18n="no_cards">لا توجد بطاقات</span></div>';
            return;
        }
        
        grid.innerHTML = this.user.cards.map(card => `
            <div class="card-item">
                <div class="card-item-header">
                    <div class="card-icon ${card.type}">
                        <i class="fab fa-${card.type === 'virtual' ? 'cc-visa' : 'cc-mastercard'}"></i>
                    </div>
                    <div class="card-item-info">
                        <h4>${card.name}</h4>
                        <p class="card-number">**** **** **** ${card.number}</p>
                    </div>
                </div>
                <div class="card-item-details">
                    <span>${I18n.t('cards.available')}: ${card.available.toLocaleString()} ${I18n.t('currency.egp')}</span>
                    <span class="status ${card.status}">${I18n.t(card.status || 'active')}</span>
                </div>
                <div class="card-actions">
                    <button class="btn btn-sm btn-primary" onclick="BankApp.manageCard('${card.id}')">
                        <i class="fas fa-cog"></i> ${I18n.t('manage')}
                    </button>
                </div>
            </div>
        `).join('');
    },

    updateBillsList: function() {
        const list = document.getElementById('billsList');
        if (!list) return;
        
        const pendingBills = this.user.bills.filter(b => b.status === 'pending');
        
        if (pendingBills.length === 0) {
            list.innerHTML = '<div class="text-center p-3"><span data-i18n="no_bills">لا توجد فواتير مستحقة</span></div>';
            return;
        }
        
        list.innerHTML = pendingBills.map(bill => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon outgoing">
                        <i class="fas fa-${bill.icon || 'file-invoice'}"></i>
                    </div>
                    <div>
                        <h4>${bill.name}</h4>
                        <p>${I18n.t('due_date')}: ${BankUtils.formatDate(bill.dueDate)}</p>
                    </div>
                </div>
                <div class="transaction-amount negative">
                    ${bill.amount.toLocaleString()} ${I18n.t('currency.egp')}
                </div>
                <button class="btn btn-sm btn-primary" onclick="BankApp.payBill('${bill.id}')">
                    ${I18n.t('pay_now')}
                </button>
            </div>
        `).join('');
    },

    updateSavingsGoals: function() {
        const list = document.getElementById('savingsGoalsList');
        if (!list) return;

        const goals = [
            { name: I18n.t('car'), current: 0, target: 50000, icon: 'car' },
            { name: I18n.t('vacation'), current: 0, target: 20000, icon: 'umbrella-beach' },
            { name: I18n.t('emergency_fund'), current: 0, target: 30000, icon: 'shield-alt' }
        ];

        list.innerHTML = goals.map(goal => {
            const percentage = Math.round((goal.current / goal.target) * 100);
            return `
                <div class="goal-item">
                    <div class="goal-icon">
                        <i class="fas fa-${goal.icon}"></i>
                    </div>
                    <div class="goal-info">
                        <div class="goal-name">${goal.name}</div>
                        <div class="goal-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${percentage}%"></div>
                            </div>
                            <span class="goal-percentage">${percentage}%</span>
                        </div>
                        <small>${goal.current.toLocaleString()} / ${goal.target.toLocaleString()} ${I18n.t('currency.egp')}</small>
                    </div>
                </div>
            `;
        }).join('');
    },

    updateNotifications: function() {
        const list = document.getElementById('notificationList');
        const badge = document.getElementById('notificationBadge');
        
        if (!list) return;
        
        const unreadCount = this.user.notifications.filter(n => !n.read).length;
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
        
        if (this.user.notifications.length === 0) {
            list.innerHTML = '<div class="text-center p-3"><span data-i18n="no_notifications">لا توجد إشعارات</span></div>';
            return;
        }
        
        list.innerHTML = this.user.notifications.slice(0, 5).map(n => `
            <div class="notification-item ${!n.read ? 'unread' : ''}" onclick="BankApp.markNotificationRead('${n.id}')">
                <div class="notification-content">
                    <div class="notification-icon">
                        <i class="fas fa-${n.icon || 'info-circle'}"></i>
                    </div>
                    <div class="notification-text">
                        <h5>${n.title}</h5>
                        <p>${n.message}</p>
                        <div class="notification-time">
                            <i class="far fa-clock"></i>
                            <span>${BankUtils.timeAgo(n.time)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    },

    // ========================================
    // دوال المعاملات المالية
    // ========================================

    showSendMoneyModal: function(accountId) {
        BankUtils.closeAllModals();
        
        let selectedAccountId = accountId;
        if (!selectedAccountId && this.user.accounts.length > 0) {
            selectedAccountId = this.user.accounts[0].id;
        }
        
        const account = this.user.accounts.find(acc => acc.id === selectedAccountId);
        
        const accountsOptions = this.user.accounts.map(acc => 
            `<option value="${acc.id}" ${acc.id === selectedAccountId ? 'selected' : ''}>${acc.name} - ${acc.number} (${acc.balance.toLocaleString()} ${I18n.t('currency.egp')})</option>`
        ).join('');
        
        const modalHTML = `
            <div class="modal" id="sendMoneyModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-paper-plane"></i> ${I18n.t('send_money')} ${account ? `من ${account.name}` : ''}</h3>
                        <button class="modal-close" onclick="BankUtils.closeAllModals()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="sendMoneyForm" onsubmit="BankApp.processSendMoney(event)">
                            <div class="form-group">
                                <label class="form-label" data-i18n="form.amount">${I18n.t('form.amount')} (${I18n.t('currency.egp')})</label>
                                <input type="number" class="form-control" id="sendAmount" min="10" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">رقم حساب المستلم</label>
                                <input type="text" class="form-control" id="sendToAccountNumber" required placeholder="أدخل رقم حساب المستلم">
                            </div>
                            <div class="form-group">
                                <label class="form-label" data-i18n="form.from">${I18n.t('form.from')}</label>
                                <select class="form-control" id="sendFromAccount" required>${accountsOptions}</select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" data-i18n="form.reason">${I18n.t('form.reason')} (${I18n.t('form.optional')})</label>
                                <input type="text" class="form-control" id="sendReason">
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="confirmSend" required>
                                    <span data-i18n="form.confirm_data">${I18n.t('form.confirm_data')}</span>
                                </label>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">
                                <i class="fas fa-paper-plane"></i>
                                ${I18n.t('confirm_send')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('sendMoneyModal').style.display = 'block';
    },

    processSendMoney: async function(event) {
        event.preventDefault();
        
        const amount = parseFloat(document.getElementById('sendAmount').value);
        const toAccountNumber = document.getElementById('sendToAccountNumber').value;
        const fromAccountId = document.getElementById('sendFromAccount').value;
        const description = document.getElementById('sendReason').value;
        
        if (!amount || amount <= 0) {
            BankUtils.showAlert('يرجى إدخال مبلغ صحيح', 'error');
            return;
        }
        
        if (!toAccountNumber) {
            BankUtils.showAlert('يرجى إدخال رقم حساب المستلم', 'error');
            return;
        }
        
        const account = this.user.accounts.find(a => a.id === fromAccountId);
        if (amount > (account?.balance || 0)) {
            BankUtils.showAlert(I18n.t('alert.insufficient_balance'), 'error');
            return;
        }
        
        BankUtils.showLoading(true, I18n.t('sending_money'));
        
        try {
            const result = await this.apiCall('/transfers/internal', {
                method: 'POST',
                body: JSON.stringify({
                    fromAccountId: fromAccountId,
                    toAccountNumber: toAccountNumber,
                    amount: amount,
                    description: description || `تحويل إلى حساب ${toAccountNumber}`
                })
            });
            
            if (result.data && result.data.newBalance !== undefined) {
                const accountToUpdate = this.user.accounts.find(a => a.id === fromAccountId);
                if (accountToUpdate) {
                    accountToUpdate.balance = result.data.newBalance;
                }
            }
            
            const newTransaction = {
                id: `trans_${Date.now()}`,
                description: description || `تحويل إلى ${result.data?.toUserName || toAccountNumber}`,
                amount: -amount,
                category: 'transfer',
                icon: 'paper-plane',
                status: 'completed',
                date: new Date().toISOString()
            };
            
            this.user.transactions.unshift(newTransaction);
            
            this.updateTransactionsList();
            this.updateBalances();
            this.updateAccountsGrid();
            
            if (typeof refreshAllPageData === 'function') {
                refreshAllPageData();
            }
            if (typeof updateAccountTransactions === 'function') {
                updateAccountTransactions();
            }
            
            BankUtils.showLoading(false);
            BankUtils.closeAllModals();
            BankUtils.showAlert(result.message || I18n.t('alert.transfer_success'), 'success');
            
        } catch (error) {
            BankUtils.showLoading(false);
            BankUtils.showAlert(error.message, 'error');
        }
    },

    payBill: async function(billId) {
        const bill = this.user.bills.find(b => b.id === billId);
        if (!bill) return;
        
        const mainAccount = this.user.accounts.find(acc => acc.type === 'current') || this.user.accounts[0];
        if (!mainAccount) {
            BankUtils.showAlert('لا يوجد حساب لدفع الفاتورة', 'error');
            return;
        }
        
        if (bill.amount > mainAccount.balance) {
            BankUtils.showAlert(I18n.t('alert.insufficient_balance'), 'error');
            return;
        }
        
        BankUtils.showLoading(true, I18n.t('processing_payment'));
        
        try {
            await this.apiCall('/payments/bill', {
                method: 'POST',
                body: JSON.stringify({
                    billId: billId,
                    fromAccountId: mainAccount.id
                })
            });
            
            BankUtils.showLoading(false);
            await this.loadData(false);
            BankUtils.showAlert(`تم دفع فاتورة ${bill.name} بنجاح`, 'success');
        } catch (error) {
            BankUtils.showLoading(false);
            BankUtils.showAlert(error.message, 'error');
        }
    },

    // ========================================
    // دوال البطاقات
    // ========================================
    
    manageCard: function(cardId) {
        const card = this.user.cards.find(c => c.id === cardId);
        if (!card) return;
        
        const modalHTML = `
            <div class="modal" id="cardManageModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-credit-card"></i> إدارة البطاقة: ${card.name}</h3>
                        <button class="modal-close" onclick="BankUtils.closeAllModals()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="detail-item"><strong>نوع البطاقة:</strong> ${card.type === 'gold' ? 'ذهبية' : card.type === 'silver' ? 'فضية' : 'عادية'}</div>
                        <div class="detail-item"><strong>الحد الائتماني:</strong> ${card.creditLimit.toLocaleString()} ${I18n.t('currency.egp')}</div>
                        <div class="detail-item"><strong>المستخدم:</strong> ${card.used.toLocaleString()} ${I18n.t('currency.egp')}</div>
                        <div class="detail-item"><strong>المتاح:</strong> ${card.available.toLocaleString()} ${I18n.t('currency.egp')}</div>
                        <div class="detail-item"><strong>الحالة:</strong> ${card.status === 'active' ? 'نشطة' : card.status === 'frozen' ? 'مجمدة' : 'مفقودة'}</div>
                        <hr>
                        <div class="card-actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
                            ${card.status !== 'frozen' ? `<button class="btn btn-warning" onclick="BankApp.freezeCard('${card.id}')"><i class="fas fa-snowflake"></i> تجميد</button>` : `<button class="btn btn-success" onclick="BankApp.unfreezeCard('${card.id}')"><i class="fas fa-play"></i> إلغاء التجميد</button>`}
                            ${card.status !== 'lost' ? `<button class="btn btn-danger" onclick="BankApp.reportLostCard('${card.id}')"><i class="fas fa-exclamation-triangle"></i> الإبلاغ عن ضياع</button>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('cardManageModal').style.display = 'block';
    },
    
    freezeCard: async function(cardId) {
        try {
            await this.apiCall(`/cards/${cardId}/freeze`, { method: 'PUT' });
            await this.loadData(false);
            BankUtils.closeAllModals();
            BankUtils.showAlert(I18n.t('alert.card_frozen'), 'success');
        } catch (error) {
            BankUtils.showAlert(error.message, 'error');
        }
    },
    
    unfreezeCard: async function(cardId) {
        try {
            await this.apiCall(`/cards/${cardId}/unfreeze`, { method: 'PUT' });
            await this.loadData(false);
            BankUtils.closeAllModals();
            BankUtils.showAlert(I18n.t('alert.card_unfrozen'), 'success');
        } catch (error) {
            BankUtils.showAlert(error.message, 'error');
        }
    },
    
    reportLostCard: async function(cardId) {
        if (confirm('هل أنت متأكد من الإبلاغ عن فقدان البطاقة؟ سيتم إلغاؤها وإصدار بديلة.')) {
            try {
                await this.apiCall(`/cards/${cardId}/report-lost`, { method: 'PUT' });
                await this.loadData(false);
                BankUtils.closeAllModals();
                BankUtils.showAlert(I18n.t('alert.card_lost_reported'), 'warning');
            } catch (error) {
                BankUtils.showAlert(error.message, 'error');
            }
        }
    },

    // ========================================
    // دوال الحسابات
    // ========================================
    
    viewAccountDetails: function(accountId) {
        const account = this.user.accounts.find(a => a.id === accountId);
        if (!account) return;
        
        const modalHTML = `
            <div class="modal" id="accountDetailsModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-info-circle"></i> تفاصيل الحساب: ${account.name}</h3>
                        <button class="modal-close" onclick="BankUtils.closeAllModals()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="detail-item"><strong>رقم الحساب:</strong> ${account.number}</div>
                        <div class="detail-item"><strong>نوع الحساب:</strong> ${account.name}</div>
                        <div class="detail-item"><strong>الرصيد الحالي:</strong> ${account.balance.toLocaleString()} ${I18n.t('currency.egp')}</div>
                        <div class="detail-item"><strong>الحالة:</strong> ${account.status === 'active' ? 'نشط' : 'غير نشط'}</div>
                        ${account.createdAt ? `<div class="detail-item"><strong>تاريخ الإنشاء:</strong> ${BankUtils.formatDate(account.createdAt)}</div>` : ''}
                    </div>
                    <div class="modal-footer" style="display: flex; gap: 10px; margin-top: 20px;">
                        <button class="btn btn-primary" onclick="BankUtils.closeAllModals(); BankApp.showSendMoneyModal('${account.id}')">
                            <i class="fas fa-paper-plane"></i> إرسال نقود
                        </button>
                        <button class="btn btn-secondary" onclick="BankUtils.closeAllModals()">
                            <i class="fas fa-times"></i> إغلاق
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('accountDetailsModal').style.display = 'block';
    },

    // ========================================
    // دوال حذف الحساب
    // ========================================

deleteAccount: async function(accountId) {
    const account = this.user.accounts.find(acc => acc.id === accountId);
    if (!account) {
        BankUtils.showAlert('الحساب غير موجود', 'error');
        return;
    }
    
    if (account.balance !== 0 && account.balance > 0) {
        BankUtils.showAlert(`لا يمكن حذف الحساب "${account.name}" لأنه يحتوي على رصيد (${account.balance.toLocaleString()} ج.م). يرجى تحويل الرصيد إلى حساب آخر أولاً.`, 'error');
        return;
    }
    
    // ✅ استخدام مودال مخصص
    if (window.showCustomConfirmModal) {
        window.showCustomConfirmModal({
            title: '⚠️ حذف الحساب',
            message: `هل أنت متأكد من حذف الحساب "<strong style="color: #f59e0b;">${account.name}</strong>" (رقم: ${account.number})؟<br><br><strong style="color: #ef4444;">لا يمكن استرجاع الحساب بعد الحذف!</strong>`,
            confirmText: 'حذف نهائي',
            cancelText: 'إلغاء',
            confirmColor: '#ef4444',
            icon: 'trash-alt',
            warning: '⚠️ هذا الإجراء لا يمكن التراجع عنه!',
            onConfirm: async () => {
                BankUtils.showLoading(true, 'جاري حذف الحساب...');
                
                try {
                    await this.apiCall(`/accounts/${accountId}`, { method: 'DELETE' });
                    
                    BankUtils.showLoading(false);
                    await this.loadData(false);
                    
                    if (this.user.accounts.length > 0) {
                        const newMainAccount = this.user.accounts.find(acc => acc.type === 'current') || this.user.accounts[0];
                        if (window.currentMainAccountId === accountId || !window.currentMainAccountId) {
                            window.currentMainAccountId = newMainAccount.id;
                        }
                    } else {
                        window.currentMainAccountId = null;
                    }
                    
                    this.updateUI();
                    
                    if (typeof updateAccountsGridWithActions === 'function') {
                        updateAccountsGridWithActions();
                    }
                    if (typeof updateMainAccountDisplay === 'function') {
                        updateMainAccountDisplay();
                    }
                    if (typeof updateAccountTransactions === 'function') {
                        updateAccountTransactions();
                    }
                    
                    BankUtils.showAlert(`✅ تم حذف الحساب "${account.name}" بنجاح`, 'success');
                    
                } catch (error) {
                    BankUtils.showLoading(false);
                    BankUtils.showAlert(error.message || 'فشل في حذف الحساب', 'error');
                }
            }
        });
    } else {
        // fallback إذا كانت الدالة غير موجودة
        if (!confirm(`⚠️ هل أنت متأكد من حذف الحساب "${account.name}"؟ لا يمكن التراجع!`)) return;
        // ... الكود القديم
    }
},

transferBalanceAndDelete: async function(fromAccountId, toAccountId) {
    const fromAccount = this.user.accounts.find(acc => acc.id === fromAccountId);
    const toAccount = this.user.accounts.find(acc => acc.id === toAccountId);
    
    if (!fromAccount || !toAccount) {
        BankUtils.showAlert('حساب غير موجود', 'error');
        return;
    }
    
    if (fromAccountId === toAccountId) {
        BankUtils.showAlert('لا يمكن تحويل الرصيد إلى نفس الحساب', 'error');
        return;
    }
    
    if (fromAccount.balance === 0) {
        this.deleteAccount(fromAccountId);
        return;
    }
    
    const amount = fromAccount.balance;
    
    // ✅ استخدام مودال مخصص
    if (window.showCustomConfirmModal) {
        window.showCustomConfirmModal({
            title: 'تحويل الرصيد وحذف الحساب',
            message: `الحساب "<strong style="color: #f59e0b;">${fromAccount.name}</strong>" يحتوي على رصيد (<strong style="color: #10b981;">${amount.toLocaleString()}</strong> ج.م).<br><br>هل تريد تحويل الرصيد إلى حساب "<strong style="color: #0ef;">${toAccount.name}</strong>" ثم حذف الحساب؟`,
            confirmText: 'تحويل وحذف',
            cancelText: 'إلغاء',
            confirmColor: '#f59e0b',
            icon: 'exchange-alt',
            warning: '⚠️ تحذير: لا يمكن استرجاع الحساب بعد الحذف!',
            onConfirm: async () => {
                BankUtils.showLoading(true, 'جاري تحويل الرصيد وحذف الحساب...');
                
                try {
                    await this.apiCall('/transfers/internal', {
                        method: 'POST',
                        body: JSON.stringify({
                            fromAccountId: fromAccountId,
                            toAccountNumber: toAccount.number,
                            amount: amount,
                            description: `تحويل رصيد من حساب ${fromAccount.name} إلى ${toAccount.name} قبل الحذف`
                        })
                    });
                    
                    await this.apiCall(`/accounts/${fromAccountId}`, { method: 'DELETE' });
                    
                    BankUtils.showLoading(false);
                    await this.loadData(false);
                    
                    if (this.user.accounts.length > 0) {
                        const newMainAccount = this.user.accounts.find(acc => acc.type === 'current') || this.user.accounts[0];
                        if (window.currentMainAccountId === fromAccountId || !window.currentMainAccountId) {
                            window.currentMainAccountId = newMainAccount.id;
                        }
                    } else {
                        window.currentMainAccountId = null;
                    }
                    
                    this.updateUI();
                    
                    if (typeof updateAccountsGridWithActions === 'function') {
                        updateAccountsGridWithActions();
                    }
                    if (typeof updateMainAccountDisplay === 'function') {
                        updateMainAccountDisplay();
                    }
                    if (typeof updateAccountTransactions === 'function') {
                        updateAccountTransactions();
                    }
                    
                    BankUtils.showAlert(`✅ تم تحويل رصيد ${amount.toLocaleString()} ج.م إلى "${toAccount.name}" وحذف الحساب "${fromAccount.name}"`, 'success');
                    
                } catch (error) {
                    BankUtils.showLoading(false);
                    BankUtils.showAlert(error.message || 'فشلت عملية التحويل', 'error');
                }
            }
        });
    } else {
        // fallback إذا كانت الدالة غير موجودة
        if (!confirm(`⚠️ الحساب "${fromAccount.name}" يحتوي على رصيد (${amount.toLocaleString()} ج.م).\n\nهل تريد تحويل الرصيد إلى حساب "${toAccount.name}" ثم حذف الحساب؟`)) return;
        // ... الكود القديم
    }
},

    // ========================================
    // دوال الإشعارات
    // ========================================
    
    addNotification: function(notification) {
        const newNotification = {
            id: `notif_${Date.now()}`,
            title: notification.title,
            message: notification.message,
            time: new Date().toISOString(),
            icon: notification.icon || 'info-circle',
            type: notification.type || 'info',
            read: false
        };
        this.user.notifications.unshift(newNotification);
        this.updateNotifications();
        BankUtils.showAlert(newNotification.message, newNotification.type);
    },
    
    markNotificationRead: async function(id) {
        try {
            await this.apiCall(`/notifications/${id}/read`, { method: 'PUT' });
            const notification = this.user.notifications.find(n => n.id === id);
            if (notification) {
                notification.read = true;
                this.updateNotifications();
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    },
    
    markAllNotificationsRead: async function() {
        try {
            await this.apiCall('/notifications/read-all', { method: 'PUT' });
            this.user.notifications.forEach(n => n.read = true);
            this.updateNotifications();
            BankUtils.showAlert(I18n.t('all_marked_read'), 'success');
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    },

    // ========================================
    // دوال عامة
    // ========================================
// ============= تسجيل الخروج =============
logout: function() {
    // ✅ استخدام مودال مخصص بدلاً من confirm()
    this.showLogoutConfirmModal();
},

showLogoutConfirmModal: function() {
    // إزالة أي مودال موجود مسبقاً
    const existingModal = document.getElementById('logoutConfirmModal');
    if (existingModal) existingModal.remove();
    
    const modalHTML = `
        <div class="modal" id="logoutConfirmModal" style="display: flex;">
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header" style="border-bottom-color: var(--border-color);">
                    <h3 style="color: var(--text-color);">
                        <i class="fas fa-sign-out-alt" style="color: #f59e0b;"></i>
                        تأكيد تسجيل الخروج
                    </h3>
                    <button class="modal-close" onclick="BankUtils.closeAllModals()" style="color: var(--text-color);">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <i class="fas fa-question-circle" style="font-size: 48px; color: #f59e0b;"></i>
                    </div>
                    <p style="text-align: center; color: var(--text-color); font-size: 16px; margin-bottom: 20px;">
                        هل أنت متأكد من تسجيل الخروج؟
                    </p>
                    <div style="background: rgba(239, 68, 68, 0.1); border-radius: 12px; padding: 12px; margin-bottom: 20px; border-right: 3px solid #ef4444;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-info-circle" style="color: #ef4444;"></i>
                            <span style="color: var(--text-color); font-size: 13px;">
                                سيتم إنهاء جلستك الحالية وستحتاج إلى تسجيل الدخول مرة أخرى.
                            </span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="display: flex; gap: 10px; justify-content: flex-end; border-top-color: var(--border-color);">
                    <button class="btn btn-secondary" onclick="BankUtils.closeAllModals()" style="flex: 1;">
                        <i class="fas fa-times"></i>
                        إلغاء
                    </button>
                    <button class="btn btn-danger" id="confirmLogoutBtn" style="flex: 1; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                        <i class="fas fa-sign-out-alt"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // إضافة حدث لزر تأكيد تسجيل الخروج
    const confirmBtn = document.getElementById('confirmLogoutBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            BankUtils.closeAllModals();
            this.performLogout();
        });
    }
},

performLogout: function() {
    this.stopNotificationPolling();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
},
    init: async function() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        
        this.setupEventListeners();
        
        await this.loadData(true);
        
        this.startNotificationPolling();
        
        document.addEventListener('languageChanged', () => this.updateUI());
        
        console.log('✅ BankApp initialized');
    },
    
    setupEventListeners: function() {
        const menuToggle = document.getElementById('menuToggle');
        const navList = document.getElementById('navList');
        if (menuToggle && navList) {
            menuToggle.addEventListener('click', () => navList.classList.toggle('mobile-active'));
        }
        
        document.addEventListener('click', function(event) {
            if (navList && navList.classList.contains('mobile-active') && 
                !navList.contains(event.target) && 
                !menuToggle.contains(event.target)) {
                navList.classList.remove('mobile-active');
            }
        });
        
        const yearElement = document.querySelector('.current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
};

// ========================================
// فتح المساعد الذكي - في نفس الصفحة
// ========================================

BankApp.openAIAssistant = function() {
    // التحقق من تسجيل الدخول
    if (!BankApp.user || !BankApp.user.uid) {
        // محاولة جلب من localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsed = JSON.parse(userData);
                if (parsed && parsed.email) {
                    BankApp.user = {
                        ...BankApp.user,
                        uid: parsed.uid || parsed.id,
                        email: parsed.email,
                        name: parsed.fullName || parsed.name
                    };
                }
            } catch(e) {}
        }
        
        if (!BankApp.user || !BankApp.user.uid) {
            BankUtils.showAlert('⚠️ يرجى تسجيل الدخول أولاً لاستخدام المساعد الذكي', 'warning');
            return;
        }
    }
    
    // جلب بيانات المستخدم
    const email = BankApp.user.email || '';
    const name = BankApp.user.name || BankApp.user.fullName || 'مستخدم';
    const uid = BankApp.user.uid || '';
    
    console.log('📤 Opening AI Assistant for user:', email);
    
    // بناء الرابط
    const chatUrl = `http://localhost:5000?uid=${encodeURIComponent(uid)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
    
    // ✅ فتح في نفس الصفحة (مودال)
    openChatInPage(chatUrl, name);
};

// ========================================
// فتح الشات بوت في نفس الصفحة
// ========================================

function openChatInPage(chatUrl, userName) {
    // إزالة أي مودال موجود
    const existingModal = document.getElementById('chatModalContainer');
    if (existingModal) {
        existingModal.remove();
        return;
    }
    
    // إنشاء المودال
    const modalHTML = `
        <div id="chatModalContainer" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 400px;
            height: 580px;
            max-width: 95vw;
            max-height: 80vh;
            background: #081b29;
            border-radius: 16px;
            border: 2px solid rgba(0, 238, 255, 0.3);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
            z-index: 999999;
            overflow: hidden;
            animation: slideUp 0.3s ease;
            display: flex;
            flex-direction: column;
        ">
            <!-- رأس المودال -->
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 16px;
                background: rgba(10, 36, 56, 0.95);
                border-bottom: 1px solid rgba(0, 238, 255, 0.2);
                flex-shrink: 0;
            ">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-robot" style="color: #0ef; font-size: 20px;"></i>
                    <span style="color: #a0d2db; font-weight: 600; font-size: 15px;">المساعد الذكي</span>
                    <span style="
                        color: #10b981;
                        font-size: 10px;
                        background: rgba(16, 185, 129, 0.15);
                        padding: 2px 8px;
                        border-radius: 10px;
                    ">
                        <i class="fas fa-check-circle"></i> ${userName || 'مستخدم'}
                    </span>
                </div>
                <button onclick="closeChatInPage()" style="
                    background: rgba(239, 68, 68, 0.15);
                    border: 1px solid #ef4444;
                    color: #ef4444;
                    padding: 4px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    transition: all 0.3s ease;
                ">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
            
            <!-- iframe -->
            <iframe 
                src="${chatUrl}" 
                style="
                    width: 100%;
                    height: 100%;
                    border: none;
                    background: #081b29;
                    flex: 1;
                "
            ></iframe>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // إضافة أنماط الـ animation (مرة واحدة)
    if (!document.getElementById('chatModalStyles')) {
        const style = document.createElement('style');
        style.id = 'chatModalStyles';
        style.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            @keyframes slideDown {
                from {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// إغلاق الشات بوت من نفس الصفحة
// ========================================

function closeChatInPage() {
    const modal = document.getElementById('chatModalContainer');
    if (modal) {
        modal.style.animation = 'slideDown 0.25s ease forwards';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}
// ========================================
// دالة مساعدة للتحقق من تسجيل الدخول
// ========================================

BankApp.isLoggedIn = function() {
    return !!(BankApp.user?.uid && BankApp.user?.email);
};

// ========================================
// دالة مساعدة للتحقق من تسجيل الدخول
// ========================================

BankApp.isLoggedIn = function() {
    return !!(BankApp.user?.uid && BankApp.user?.email);
};
// ========================================
// BankUtils - دوال مساعدة
// ========================================
window.BankUtils = {
    formatDate: function(date) {
        if (!date) return '';
        const d = new Date(date);
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return d.toLocaleDateString(I18n.currentLang === 'ar' ? 'ar-EG' : 'en-US', options);
    },
    
    timeAgo: function(date) {
        if (!date) return '';
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);
        
        if (I18n.currentLang === 'ar') {
            if (diffInSeconds < 60) return 'الآن';
            if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
            if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
            if (diffInSeconds < 604800) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
            return this.formatDate(date);
        } else {
            if (diffInSeconds < 60) return 'now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
            if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
            return this.formatDate(date);
        }
    },
    
    closeAllModals: function() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
            modal.remove();
        });
    },
    
    showLoading: function(show, message = I18n.t('loading')) {
        let overlay = document.getElementById('loadingOverlay');
        if (show) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'loadingOverlay';
                overlay.className = 'loading-overlay';
                overlay.innerHTML = `
                    <div class="loading-content">
                        <div class="loading-spinner"></div>
                        <div class="loading-text" id="loadingMessage">${message}</div>
                    </div>
                `;
                document.body.appendChild(overlay);
            } else {
                const msgElement = document.getElementById('loadingMessage');
                if (msgElement) msgElement.textContent = message;
                overlay.style.display = 'flex';
            }
        } else {
            if (overlay) overlay.style.display = 'none';
        }
    },
    
    showAlert: function(message, type = 'info', duration = 5000) {
        const existingAlert = document.querySelector('.alert-message');
        if (existingAlert) existingAlert.remove();
        
        const alert = document.createElement('div');
        alert.className = `alert-message alert-${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        else if (type === 'error') icon = 'exclamation-circle';
        else if (type === 'warning') icon = 'exclamation-triangle';
        
        alert.innerHTML = `
            <div class="alert-content">
                <div class="alert-icon"><i class="fas fa-${icon}"></i></div>
                <div class="alert-text">${message}</div>
                <button class="alert-close" onclick="this.parentElement.parentElement.remove()"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        document.body.appendChild(alert);
        
        if (duration > 0) {
            setTimeout(() => { if (alert.parentNode) alert.remove(); }, duration);
        }
    }
};

// تفعيل الرابط النشط
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) link.classList.add('active');
    });
}

// تصدير الكائنات
window.BankApp = BankApp;

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', async function() {
    await BankApp.init();
    setActiveNavLink();
});