export interface CreditHistory {
  type: string;
  amount: number;
  createdAt: string;
  description: string;
}

export interface JobQuoted {
  jobId: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  phone?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  referral_code?: string;
  referred_by?: string;
  subscription_status?: string;
  subscription_plan?: string;
  status?: string;
  credits?: number;
  latitude?: number;
  longitude?: number;
  categories?: string[];
  jobsQuoted?: JobQuoted[];
  serviceArea?: string;
  businessName?: string;
  document_url?: string;
  jobLeadsPaid?: JobQuoted[];
  businessPhone?: string;
  creditHistory?: CreditHistory[];
  email_verified?: boolean;
  phone_verified?: boolean;
  consent_background_check?: boolean;
  confirmed_at?: string;
  banned_until?: string | null;
}

export interface RawUserMetaData {
  full_name?: string;
  phone?: string;
  name?: string;
  avatar_url?: string;
  role?: string;
  referral_code?: string;
  referred_by?: string;
  status?: string;
  credits?: number;
  latitude?: number;
  longitude?: number;
  categories?: string[];
  jobsQuoted?: JobQuoted[];
  serviceArea?: string;
  businessName?: string;
  document_url?: string;
  jobLeadsPaid?: JobQuoted[];
  businessPhone?: string;
  creditHistory?: CreditHistory[];
  email_verified?: boolean;
  phone_verified?: boolean;
  consent_background_check?: boolean;
  [key: string]: unknown;
}

export interface RawAppMetaData {
  role?: string;
  provider?: string;
  providers?: string[];
  [key: string]: unknown;
}

export interface SupabaseAuthUser {
  id: string;
  email?: string;
  phone?: string;
  created_at: string;
  last_sign_in_at?: string;
  user_metadata: RawUserMetaData;
  app_metadata: RawAppMetaData;
}

export interface UserDetailsResponse {
  user: SupabaseAuthUser;
  referral_codes: ReferralCode[];
  subscription_history: SubscriptionHistoryItem[];
}

export interface ReferralCode {
  id: string;
  code: string;
  user_id: string;
  uses: number;
  max_uses?: number;
  created_at: string;
  expires_at?: string;
}

export interface SubscriptionHistoryItem {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  started_at: string;
  ended_at?: string;
  amount?: number;
  currency?: string;
}

export interface ReferralUser {
  id: string;
  email: string;
  created_at: string;
  referral_code: string;
  times_used: number;
  referred_users: number;
}
