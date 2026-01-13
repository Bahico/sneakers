
export interface ReferralLink {
  id: string;
  name: string;
  code: string;
  link: string;
  is_active: boolean;
  clicks: number;
  unique_clients: number;
  orders: number;
  conversion_rate: number;
  total_revenue: string;
  created_at?: Date;
  updated_at?: Date;
}


