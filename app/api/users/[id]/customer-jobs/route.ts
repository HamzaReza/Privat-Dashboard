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

    // Fetch all jobs for the user
    const { data: jobs, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error);
      return NextResponse.json(
        { error: "Failed to fetch jobs" },
        { status: 500 },
      );
    }

    // Group jobs by status into the 3 categories
    const groupedJobs = {
      // Open: draft, open, quoted
      open: (jobs || []).filter((job: Job) =>
        ["draft", "open", "quoted"].includes(job.status),
      ),
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
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
