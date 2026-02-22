import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { Job } from "@/types/job";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = createAdminClient();
    const { id: userId } = await params;

    // Get the provider's metadata to find jobLeadsPaid and jobsQuoted
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(userId);

    if (userError) {
      console.error("Error fetching user:", userError);
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 },
      );
    }

    const metadata = userData.user.user_metadata || {};
    const jobLeadsPaid: Array<{ jobId: string }> = metadata.jobLeadsPaid || [];
    const jobsQuoted: Array<{ jobId: string }> = metadata.jobsQuoted || [];

    // Find job IDs that are in jobLeadsPaid but NOT in jobsQuoted
    const quotedJobIds = new Set(jobsQuoted.map((j) => j.jobId));
    const leadsJobIds = jobLeadsPaid
      .filter((j) => !quotedJobIds.has(j.jobId))
      .map((j) => j.jobId);

    // Fetch lead jobs details
    let leadsJobs: Job[] = [];
    if (leadsJobIds.length > 0) {
      const { data: leadsData, error: leadsError } = await supabase
        .from("jobs")
        .select("*")
        .in("id", leadsJobIds)
        .order("created_at", { ascending: false });

      if (!leadsError && leadsData) {
        leadsJobs = leadsData;
      }
    }

    // Fetch all jobs where this service provider is assigned
    const { data: jobs, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("assigned_provider_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching provider jobs:", error);
      return NextResponse.json(
        { error: "Failed to fetch provider jobs" },
        { status: 500 },
      );
    }

    // Fetch quotes from the quotes table with job details
    const { data: quotesData, error: quotesError } = await supabase
      .from("quotes")
      .select(`*,job:jobs(*)`)
      .eq("service_provider_id", userId)
      .order("created_at", { ascending: false });

    if (quotesError) {
      console.error("Error fetching quotes:", quotesError);
    }

    // Transform quotes to include job details at the top level,
    // with the quote nested as quotes[0] using camelCase field names
    const quotesWithJobDetails = (quotesData || []).map((quote) => {
      if (quote.job) {
        return {
          ...quote.job,
          quotes: [
            {
              id: quote.id,
              jobId: quote.job_id,
              serviceProviderId: quote.service_provider_id,
              providerName: quote.provider_name ?? "",
              providerAvatar: quote.provider_avatar ?? undefined,
              description: quote.description ?? "",
              status: (quote.status ?? "pending") as
                | "pending"
                | "accepted"
                | "rejected",
              createdAt: quote.created_at,
              minAmount: quote.min_amount ?? 0,
              maxAmount: quote.max_amount ?? 0,
              estimatedDuration: quote.estimated_duration ?? undefined,
            },
          ],
        };
      }
      return quote;
    });

    // Group jobs by status into the 4 categories
    const groupedJobs = {
      // Leads: Jobs paid for but not quoted yet
      leads: leadsJobs,
      // Quotes: From the quotes table with job details
      quotes: quotesWithJobDetails,
      // Active: accepted, in_progress, in_review
      active: (jobs || []).filter((job: Job) =>
        ["accepted", "in_progress", "in_review"].includes(job.status),
      ),
      // Completed: completed, cancelled
      completed: (jobs || []).filter((job: Job) =>
        ["completed", "cancelled"].includes(job.status),
      ),
    };

    return NextResponse.json(groupedJobs);
  } catch (error) {
    console.error("Error fetching provider jobs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
