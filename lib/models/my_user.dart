class MyUserModel {
  final String uid;
  final String fullName;
  final String nationalId;
  final String dateOfBirth;
  final String gender;
  final String phone;
  final String email;
  final String address;
  final String city;
  final String postalCode;
  final String accountType;
  final double initialDeposit;

  MyUserModel({
    required this.uid,
    required this.fullName,
    required this.nationalId,
    required this.dateOfBirth,
    required this.gender,
    required this.phone,
    required this.email,
    required this.address,
    required this.city,
    required this.postalCode,
    required this.accountType,
    required this.initialDeposit,
  });

  factory MyUserModel.fromJson(Map<String, dynamic> json) {
    return MyUserModel(
      uid: json['uid'] ?? '',
      fullName: json['fullName'] ?? '',
      nationalId: json['nationalId'] ?? '',
      dateOfBirth: json['dateOfBirth'] ?? '',
      gender: json['gender'] ?? '',
      phone: json['phone'] ?? '',
      email: json['email'] ?? '',
      address: json['address'] ?? '',
      city: json['city'] ?? '',
      postalCode: json['postalCode'] ?? '',
      accountType: json['accountType'] ?? '',
      initialDeposit: (json['initialDeposit'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'uid': uid,
      'fullName': fullName,
      'nationalId': nationalId,
      'dateOfBirth': dateOfBirth,
      'gender': gender,
      'phone': phone,
      'email': email,
      'address': address,
      'city': city,
      'postalCode': postalCode,
      'accountType': accountType,
      'initialDeposit': initialDeposit,
    };
  }
}