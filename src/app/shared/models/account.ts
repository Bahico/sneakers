export interface Account {
  id: number;
  last_login: Date;
  first_name: string;
  last_name: string;
  email: string;
  telegram_id: string;
  password: string;
  user_permissions: number[];
}
