export interface PassportData {
  id: string,
  user_id: string,
  name: string,
  surname: string,
  f_name: string,
  date_of_birth: string,
  passport_number?: string,
  passport_series?: string,
  inn?: string,
  date_of_give?: string,
  created_at?: string,
  updated_at?: string
}

export interface UpdateUserProfileDto {
  username?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  surname?: string;
  telegram_id?: string;
  email?: string;
}

