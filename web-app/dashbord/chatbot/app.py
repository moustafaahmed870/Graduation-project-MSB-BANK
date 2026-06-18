from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
from chatbot_logic import ChatBot
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime
import json
import urllib.parse

app = Flask(__name__)
app.secret_key = 'msb_bank_secret_key_2024'
CORS(app)

# ============================================
# تهيئة Firebase
# ============================================

try:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("✅ Firebase initialized successfully!")
except Exception as e:
    print(f"❌ Firebase initialization error: {e}")
    db = None

chatbot = ChatBot(db)

# ============================================
# Route الرئيسي - استقبال بيانات المستخدم من الـ URL
# ============================================

@app.route('/')
def index():
    # جلب بيانات المستخدم من الـ URL
    user_uid = request.args.get('uid', '')
    user_email = request.args.get('email', '')
    user_name = request.args.get('name', '')
    
    # فك التشفير إذا كانت البيانات مشفرة
    if user_email:
        user_email = urllib.parse.unquote(user_email)
    if user_name:
        user_name = urllib.parse.unquote(user_name)
    
    print("=" * 50)
    print("📥 NEW CHAT SESSION")
    print(f"📧 Email from URL: {user_email}")
    print(f"👤 Name from URL: {user_name}")
    print(f"🆔 UID from URL: {user_uid}")
    print("=" * 50)
    
    # تخزين بيانات المستخدم في الجلسة
    if user_email:
        session['user_email'] = user_email
        session['user_uid'] = user_uid
        session['user_name'] = user_name
        session['is_logged_in'] = True
        print(f"✅ User saved in session: {user_email}")
    else:
        session['is_logged_in'] = False
        print("⚠️ No user data received - Guest mode")
    
    return render_template('chatbot.html')

# ============================================
# API - جلب بيانات المستخدم الحالي
# ============================================

@app.route('/api/current-user', methods=['GET'])
def get_current_user():
    """جلب بيانات المستخدم الحالي من الجلسة"""
    if session.get('is_logged_in') and session.get('user_email'):
        return jsonify({
            'uid': session.get('user_uid', ''),
            'email': session.get('user_email', ''),
            'name': session.get('user_name', ''),
            'is_logged_in': True
        })
    return jsonify({
        'is_logged_in': False,
        'email': '',
        'name': ''
    })

# ============================================
# API - الشات بوت
# ============================================

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        # جلب البريد من الجلسة
        user_email = session.get('user_email', '')
        
        # لو مفيش بريد في الجلسة، استخدم اللي في الطلب
        if not user_email:
            user_email = data.get('email', '')
        
        print(f"💬 Chat - User: {user_email or 'Guest'}")
        print(f"💬 Message: {user_message[:50]}...")
        
        if not user_message:
            return jsonify({'error': 'الرجاء إدخال رسالة'}), 400
        
        # الحصول على رد من الشات بوت
        response = chatbot.get_response(user_message, user_email)
        sentiment = chatbot.analyze_sentiment(user_message)
        
        # حفظ المحادثة في Firebase
        if db:
            try:
                chat_ref = db.collection('ChatHistory').document()
                chat_ref.set({
                    'message': user_message,
                    'response': response,
                    'sentiment': sentiment,
                    'user_email': user_email,
                    'user_uid': session.get('user_uid', ''),
                    'user_name': session.get('user_name', ''),
                    'timestamp': firestore.SERVER_TIMESTAMP
                })
            except Exception as e:
                print(f"⚠️ Error saving chat: {e}")
        
        return jsonify({
            'response': response,
            'sentiment': sentiment,
            'user_email': user_email
        })
        
    except Exception as e:
        print(f"❌ Chat error: {e}")
        return jsonify({'error': str(e)}), 500

# ============================================
# تشغيل الخادم
# ============================================

if __name__ == '__main__':
    print("🚀 MSB Bank ChatBot Server Starting...")
    print("📍 Server running on: http://localhost:5000")
    print("📧 Make sure to open from main app to get user data")
    app.run(debug=True, host='0.0.0.0', port=5000)