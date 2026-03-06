import nodemailer from "nodemailer";

export interface ProviderPendingEmailData {
  providerName: string;
  providerEmail: string;
  businessName: string;
  phone: string;
  serviceArea: string;
  userId: string;
  event: "registration" | "profile_update";
}

function buildAdminEmailHtml(data: ProviderPendingEmailData, dashboardUrl: string): string {
  const eventLabel = data.event === "registration" ? "New Provider Registration" : "Provider Profile Updated";
  const eventDescription =
    data.event === "registration"
      ? "A new service provider has registered and is awaiting your review."
      : "A service provider has updated their business details and is awaiting re-approval.";
  const reviewUrl = `${dashboardUrl}/admin-dashboard/user/${data.userId}`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${eventLabel} — Privat</title>
  <style>
    body {
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #faf8f3 0%, #f5f2eb 100%);
      color: #1a1a1a;
      margin: 0;
      padding: 40px 16px;
    }

    .container {
      background: rgba(255, 255, 255, 0.97);
      max-width: 580px;
      margin: 0 auto;
      border-radius: 24px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.07);
      overflow: hidden;
      padding: 50px 35px;
    }

    .header {
      text-align: center;
      margin-bottom: 35px;
    }

    .logo {
      font-size: 36px;
      font-weight: 800;
      color: #D4AF37;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }

    .subtitle {
      color: #6B6B6B;
      font-size: 15px;
      letter-spacing: 0.5px;
    }

    .badge {
      display: inline-block;
      background: #fff8e6;
      border: 1px solid #E8C468;
      color: #92700a;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      padding: 5px 14px;
      border-radius: 20px;
      margin-bottom: 18px;
    }

    .title {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      text-align: center;
      margin: 0 0 12px;
    }

    .message {
      font-size: 15px;
      color: #4b5563;
      line-height: 1.8;
      text-align: center;
      margin-bottom: 28px;
    }

    .info-card {
      background: linear-gradient(145deg, #fdfbf7, #faf6ed);
      border-radius: 16px;
      border: 1px solid #E8C468;
      padding: 24px 28px;
      margin: 24px 0;
      box-shadow: inset 0 2px 8px rgba(212, 175, 55, 0.1);
    }

    .info-card-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #9B8030;
      margin-bottom: 16px;
    }

    .info-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 12px;
      font-size: 14px;
      color: #374151;
    }

    .info-row:last-child {
      margin-bottom: 0;
    }

    .info-label {
      font-weight: 600;
      color: #1a1a1a;
      min-width: 120px;
      flex-shrink: 0;
    }

    .info-value {
      color: #4b5563;
      word-break: break-all;
    }

    .cta-wrapper {
      text-align: center;
      margin: 32px 0 24px;
    }

    .button {
      display: inline-block;
      background: linear-gradient(135deg, #D4AF37, #b8941e);
      color: #1a1a1a !important;
      padding: 16px 42px;
      text-decoration: none !important;
      border-radius: 12px;
      font-weight: 700;
      font-size: 15px;
      box-shadow: 0 8px 20px rgba(212, 175, 55, 0.35);
    }

    .instructions {
      background: #faf8f3;
      border-left: 4px solid #D4AF37;
      border-radius: 12px;
      padding: 16px 20px;
      color: #5c4a37;
      font-size: 14px;
      margin: 24px 0;
      line-height: 1.7;
    }

    .footer {
      margin-top: 40px;
      font-size: 13px;
      color: #9B9B9B;
      text-align: center;
      border-top: 1px solid #E0DDD5;
      padding-top: 22px;
      line-height: 1.6;
    }

    .footer strong {
      color: #D4AF37;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Privat</div>
      <div class="subtitle">Admin Notification</div>
    </div>

    <div style="text-align: center;">
      <span class="badge">Action Required</span>
    </div>

    <h1 class="title">${eventLabel}</h1>

    <div class="message">
      ${eventDescription}<br />
      Please review their details and <strong>approve</strong> or <strong>block</strong> the account.
    </div>

    <div class="info-card">
      <div class="info-card-title">Provider Details</div>
      <div class="info-row">
        <span class="info-label">Name</span>
        <span class="info-value">${escapeHtml(data.providerName)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email</span>
        <span class="info-value">${escapeHtml(data.providerEmail)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Business</span>
        <span class="info-value">${escapeHtml(data.businessName)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Phone</span>
        <span class="info-value">${escapeHtml(data.phone || "—")}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Service Area</span>
        <span class="info-value">${escapeHtml(data.serviceArea || "—")}</span>
      </div>
    </div>

    <div class="cta-wrapper">
      <a href="${reviewUrl}" class="button">Review Provider Account</a>
    </div>

    <div class="instructions">
      Go to the admin dashboard, open the provider's profile, and set their status to <strong>active</strong> to approve or <strong>blocked</strong> to reject their application.
    </div>

    <div class="footer">
      <p>Sent automatically by <strong>Privat</strong> — admin notification system</p>
      <p>This message was triggered by a provider account change on your platform.</p>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendAdminProviderNotification(data: ProviderPendingEmailData): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? `Privat Admin <${user}>`;
  const adminEmail = process.env.ADMIN_EMAIL;
  const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!host || !user || !pass || !adminEmail) {
    console.warn("[email] SMTP or ADMIN_EMAIL env vars not configured — skipping notification");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const eventLabel = data.event === "registration" ? "New Provider Registration" : "Provider Profile Updated";

  await transporter.sendMail({
    from,
    to: adminEmail,
    subject: `[Privat] ${eventLabel} — ${data.providerName} (${data.businessName})`,
    html: buildAdminEmailHtml(data, dashboardUrl),
  });
}
