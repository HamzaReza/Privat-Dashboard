export interface RevenueRow {
  id: string;
  user_id: string;
  email: string;
  product_id: string;
  plan: string;
  status: string;
  amount: number;
  currency: string;
  started_at: string;
  expires_at?: string;
  renewal_at?: string;
  store: string;
  environment: string;
}

export interface RevenueStats {
  total_revenue: number;
  active_subscriptions: number;
  trial_subscriptions: number;
  cancelled_subscriptions: number;
  currency: string;
}

export interface SubscriptionListResponse {
  items: RevenueRow[];
  next_page?: string;
  stats: RevenueStats;
}
