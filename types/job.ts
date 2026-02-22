export interface Job {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  preferred_date?: string;
  preferred_time?: string;
  budget?: number;
  project_size?: "small" | "medium" | "big";
  priority?: "low" | "medium" | "high";
  images?: string[];
  status:
    | "draft"
    | "open"
    | "quoted"
    | "accepted"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "in_review";
  assigned_provider_id?: string;
  created_at: string;
  updated_at: string;
  job_credits: number;
  category_name_en?: string;
  category_name_it?: string;
  quotes?: Quote[];
  job_started_time?: string;
  reviews?: unknown;
}

export interface JobWithQuotes extends Job {
  quotes: Quote[];
}

export interface Quote {
  id: string;
  jobId: string;
  serviceProviderId: string;
  providerName: string;
  providerAvatar?: string;
  description: string;
  estimatedDuration?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  minAmount: number;
  maxAmount: number;
}

export interface JobsResponse {
  open: Job[];
  active: Job[];
  completed: Job[];
}
