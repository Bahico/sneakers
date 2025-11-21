export interface Profile {
  "password": string;
  "last_login": Date;
  "is_superuser": boolean;
  "username": string;
  "first_name": string;
  "last_name": string;
  "is_staff": boolean;
  "date_joined": Date;
  "phone": string;
  "email": string;
  "surname": string;
  "telegram_id": string;
  "login_hash": string;
  "login_hash_expires": Date;
  "is_active": boolean;
  "code_expires": Date;
  "verification_code": string;
  "groups": number[];
  "user_permissions": number[]
}
