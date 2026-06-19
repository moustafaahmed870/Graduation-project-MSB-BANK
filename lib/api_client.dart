// lib/core/api_client.dart

import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class ApiClient {
  static const String baseUrl = 'http://192.168.1.13:3000/api';

  static Future<Map<String, dynamic>> _request({
    required String method,
    required String endpoint,
    Map<String, dynamic>? body,
    String? token,
  }) async {
    final url = Uri.parse('$baseUrl$endpoint');

    final headers = {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };

    try {
      late http.Response response;

      switch (method.toUpperCase()) {
        case 'GET':
          response = await http.get(url, headers: headers);
          break;
        case 'POST':
          response = await http.post(url, headers: headers, body: jsonEncode(body));
          break;
        case 'PUT':
          response = await http.put(url, headers: headers, body: jsonEncode(body));
          break;
        case 'PATCH':
          response = await http.patch(url, headers: headers, body: jsonEncode(body));
          break;
        case 'DELETE':
          response = await http.delete(url, headers: headers);
          break;
        default:
          throw Exception('Method not supported');
      }

      print('📡 [ApiClient] Response status: ${response.statusCode}');
      print('📡 [ApiClient] Response body: ${response.body}');

      dynamic decoded;
      try {
        decoded = jsonDecode(response.body);
      } catch (e) {
        print('❌ [ApiClient] JSON decode error: $e');
        throw Exception('خطأ في البيانات المستلمة من السيرفر');
      }

      if (decoded is! Map<String, dynamic>) {
        throw Exception('Response is not a JSON object');
      }

      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw Exception(decoded['message'] ?? 'حدث خطأ، حاول مرة أخرى');
      }

      return decoded;
    } on SocketException {
      throw Exception('لا يوجد اتصال بالإنترنت، تحقق من الشبكة');
    } on FormatException catch (e) {
      print('❌ [ApiClient] FormatException: $e');
      throw Exception('خطأ في البيانات المستلمة من السيرفر');
    }
  }

  static Future<Map<String, dynamic>> get({
    required String endpoint,
    String? token,
  }) async {
    return await _request(method: 'GET', endpoint: endpoint, token: token);
  }

  static Future<Map<String, dynamic>> post({
    required String endpoint,
    required Map<String, dynamic> body,
    String? token,
  }) async {
    return await _request(method: 'POST', endpoint: endpoint, body: body, token: token);
  }

  static Future<Map<String, dynamic>> put({
    required String endpoint,
    required Map<String, dynamic> body,
    String? token,
  }) async {
    return await _request(method: 'PUT', endpoint: endpoint, body: body, token: token);
  }

  static Future<Map<String, dynamic>> patch({
    required String endpoint,
    required Map<String, dynamic> body,
    String? token,
  }) async {
    return await _request(method: 'PATCH', endpoint: endpoint, body: body, token: token);
  }

  static Future<Map<String, dynamic>> delete({
    required String endpoint,
    String? token,
  }) async {
    return await _request(method: 'DELETE', endpoint: endpoint, token: token);
  }
}