const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// ============= تعريف التطبيق =============
const app = express();

// ============= استيراد المسارات =============
const authRoutes = require('./src/routes/auth.routes');
const forgotRoutes = require('./src/routes/forgot.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const adminRoutes = require('./src/routes/admin.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const requestMoneyRoutes = require('./src/routes/request_money.routes');

// ============= Middlewares =============
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ============= Routes =============
app.use('/api/auth', authRoutes);
app.use('/api/forgot', forgotRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/request-money', requestMoneyRoutes);

// ============= Route رئيسية للاختبار =============
app.get('/', (req, res) => {
    res.json({ message: '✅ MSB Bank API is running!' });
});

// ============= تشغيل السيرفر =============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});