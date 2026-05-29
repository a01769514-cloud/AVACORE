export type Role = "admin" | "client";

export interface UserProfile {
  id: string;
  role: Role;
  cliente_id: string | null;
  full_name: string | null;
  created_at: string;
}

export interface Cliente {
  cliente_id: string;
  company_name: string;
  company_slug: string;
  contact_email: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  lead_id: string;
  contact_id: string | null;
  lead_name: string | null;
  platform: string | null;
  phone: string | null;
  lead_source: string | null;
  lead_context: string | null;
  lead_temperature: string | null;
  lead_status: string | null;
  cliente_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  project_id: string;
  lead_id: string | null;
  lead_name: string | null;
  lead_source: string | null;
  lead_context: string | null;
  project_type: string | null;
  project_description: string | null;
  intent_to_proceed: string | null;
  urgency_level: string | null;
  project_location: string | null;
  meeting_type: string | null;
  meeting_datetime: string | null;
  project_status: string | null;
  cliente_id: string | null;
  created_at: string;
  updated_at: string;
  quote_step: string | null;
  quote_step_updated_at: string | null;
  booking_flow: string | null;
}

export interface Meeting {
  meeting_id: string;
  project_id: string | null;
  lead_id: string | null;
  meeting_type: string | null;
  meeting_datetime: string | null;
  meeting_date: string | null;
  meeting_time: string | null;
  meeting_status: string | null;
  meeting_link_or_address: string | null;
  reminder_sent: string | null;
  calendar_event_id: string | null;
  cliente_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Brief {
  brief_id: string;
  project_id: string | null;
  lead_id: string | null;
  lead_name: string | null;
  lead_source: string | null;
  phone: string | null;
  lead_context: string | null;
  project_type: string | null;
  project_description: string | null;
  intent_to_proceed: string | null;
  urgency_level: string | null;
  project_location: string | null;
  meeting_type: string | null;
  meeting_datetime: string | null;
  meeting_status: string | null;
  cliente_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MockCampaign {
  id: string;
  cliente_id: string | null;
  campaign_name: string | null;
  platform: string | null;
  investment: number | null;
  clicks: number | null;
  impressions: number | null;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
}

export interface DashboardStats {
  totalLeads: number;
  scheduledMeetings: number;
  cancelledMeetings: number;
  activeProjects: number;
}

export interface InsightBlock {
  type: "strength" | "optimization";
  message: string;
}
