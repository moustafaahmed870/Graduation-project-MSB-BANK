const { admin, db } = require('../config/firebase');

// ============= حفظ FCM Token واللغة =============
const saveFcmToken = async (req, res) => {
  try {
    const { token, language, platform } = req.body;
    const uid = req.user.uid;

    if (!token) {
      return res.status(400).json({ success: false, message: 'FCM token مطلوب' });
    }

    const validLanguages = ['ar', 'en'];
    const lang = validLanguages.includes(language) ? language : 'ar';

    // حفظ في collection خاصة fcm_tokens
    await db.collection('fcm_tokens').doc(uid).set({
      token,
      language: lang,
      platform: platform || 'android',
      uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log(`✅ FCM token saved for user ${uid} | lang: ${lang}`);
    res.json({ success: true, message: 'تم حفظ الـ token بنجاح' });

  } catch (error) {
    console.error('❌ saveFcmToken error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= حذف FCM Token عند تسجيل الخروج =============
const deleteFcmToken = async (req, res) => {
  try {
    const uid = req.user.uid;

    await db.collection('fcm_tokens').doc(uid).delete();

    console.log(`🗑️ FCM token deleted for user ${uid}`);
    res.json({ success: true, message: 'تم حذف الـ token' });

  } catch (error) {
    console.error('❌ deleteFcmToken error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= إرسال إشعار لمستخدم معين =============
const sendNotificationToUser = async (uid, {
  titleAr,
  titleEn,
  bodyAr,
  bodyEn,
  type = 'info',
  icon = 'bell',
  data = {}
}) => {
  try {
    // جيب الـ token واللغة من fcm_tokens
    const tokenDoc = await db.collection('fcm_tokens').doc(uid).get();

    if (!tokenDoc.exists) {
      console.log(`⚠️ No FCM token for user ${uid}`);
      return false;
    }

    const { token, language } = tokenDoc.data();
    const lang = language || 'ar';

    // حدد العنوان والجسم على حسب اللغة
    const title = lang === 'ar' ? titleAr : titleEn;
    const body  = lang === 'ar' ? bodyAr  : bodyEn;

    // حفظ الإشعار في Firestore داخل بيانات المستخدم (عربي وإنجليزي)
    const userRef = db.collection('MyUser').doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      let notifications = userData.notifications || [];

      const newNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        title_ar: titleAr,
        title_en: titleEn,
        body_ar: bodyAr,
        body_en: bodyEn,
        // للتوافق مع الشاشات الحالية
        title: title,
        message: body,
        type,
        icon,
        read: false,
        time: new Date().toISOString(),
        data,
      };

      notifications.unshift(newNotification);
      if (notifications.length > 50) notifications = notifications.slice(0, 50);

      await userRef.update({ notifications });
    }

    // إرسال FCM push notification
    if (token) {
      const message = {
        token,
        notification: { title, body },
        data: {
          type,
          icon,
          uid,
          title,
          body,
          titleAr,
          titleEn,
          bodyAr,
          bodyEn,
          ...Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, String(v)])
          ),
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'default_channel',
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              alert: { title, body },
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      console.log(`✅ FCM sent to ${uid}: ${response}`);
    }

    return true;

  } catch (error) {
    console.error(`❌ sendNotificationToUser error for ${uid}:`, error);
    return false;
  }
};

// ============= إرسال إشعار لكل المشرفين =============
const sendNotificationToAdmins = async ({
  titleAr,
  titleEn,
  bodyAr,
  bodyEn,
  type = 'warning',
  icon = 'bell',
  data = {}
}) => {
  try {
    const adminsSnapshot = await db.collection('MyUser')
      .where('role', '==', 'admin')
      .get();

    const promises = adminsSnapshot.docs.map(doc =>
      sendNotificationToUser(doc.id, { titleAr, titleEn, bodyAr, bodyEn, type, icon, data })
    );

    await Promise.allSettled(promises);
    console.log(`✅ Notifications sent to ${adminsSnapshot.docs.length} admins`);

  } catch (error) {
    console.error('❌ sendNotificationToAdmins error:', error);
  }
};

// ============= جلب إشعارات المستخدم =============
const getNotifications = async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection('MyUser').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }

    const notifications = userDoc.data().notifications || [];
    res.json({ success: true, notifications });

  } catch (error) {
    console.error('❌ getNotifications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= تحديد إشعار كمقروء =============
const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const userRef = db.collection('MyUser').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }

    const notifications = (userDoc.data().notifications || []).map(n =>
      n.id === id ? { ...n, read: true } : n
    );

    await userRef.update({ notifications });
    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= تحديد كل الإشعارات كمقروءة =============
const markAllNotificationsRead = async (req, res) => {
  try {
    const uid = req.user.uid;

    const userRef = db.collection('MyUser').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }

    const notifications = (userDoc.data().notifications || []).map(n => ({
      ...n, read: true
    }));

    await userRef.update({ notifications });
    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= حذف إشعار =============
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const userRef = db.collection('MyUser').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }

    const notifications = (userDoc.data().notifications || []).filter(n => n.id !== id);
    await userRef.update({ notifications });

    res.json({ success: true, message: 'تم حذف الإشعار' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  saveFcmToken,
  deleteFcmToken,
  sendNotificationToUser,
  sendNotificationToAdmins,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
};