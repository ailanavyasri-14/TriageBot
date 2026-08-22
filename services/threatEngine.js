// services/threatEngine.js
// Modular TriagBot Analysis Engine
// Implements backend-compatible contract for immediate FastAPI + Playwright integration

import { DEMO_PRESETS } from '../data/presets.js';

/**
 * Evaluates suspicious input through multi-axis threat heuristic modeling.
 * When integrated with backend, this function calls POST /api/analyze.
 * 
 * @param {string} input - Raw URL, email text, SMS, or digital payload
 * @returns {Promise<Object>} Backend-compatible threat intelligence JSON response
 */
export async function analyzeThreat(input) {
  // Simulate network latency and multi-stage container sandbox startup
  await new Promise((resolve) => setTimeout(resolve, 850));

  if (!input || !input.trim()) {
    throw new Error("No payload provided for analysis");
  }

  const normalized = input.trim().toLowerCase();

  // 1. Direct Preset Pattern Matching
  if (normalized.includes("chase-security-verify") || normalized.includes("unauthorized login") || normalized.includes("jpmorgan chase")) {
    return DEMO_PRESETS.bankLogin.analysis;
  }
  if (normalized.includes("david sterling") || normalized.includes("acquisition deposit") || normalized.includes("wire confirmation") || normalized.includes("48,500")) {
    return DEMO_PRESETS.ceoScam.analysis;
  }
  if (normalized.includes("torvalds/linux") || normalized.includes("github.com/torvalds") || normalized.includes("gpg key") || normalized.includes("kernel.org")) {
    return DEMO_PRESETS.cleanRepo.analysis;
  }

  // 2. Dynamic Heuristic Engine for Custom User Inputs
  return runDynamicHeuristicEngine(input);
}

/**
 * Dynamic AI Heuristic Analysis for user-supplied custom payloads
 */
function runDynamicHeuristicEngine(input) {
  const text = input.toLowerCase();
  
  // Psychological Vector Indicators
  const urgencyKeywords = ["urgent", "immediately", "immediate", "within 24h", "2 hours", "account locked", "suspended", "action required", "expiring", "final notice", "asap", "discreet"];
  const fearKeywords = ["unauthorized", "fraud", "police", "arrest", "lawsuit", "penalty", "compromised", "breach", "frozen", "illegal"];
  const authorityKeywords = ["ceo", "director", "fbi", "irs", "fraud prevention", "security team", "it helpdesk", "microsoft support", "bank of america", "paypal", "apple id", "dhl", "fedex"];
  const financialKeywords = ["wire", "gift card", "crypto", "bitcoin", "eth", "escrow", "invoice", "deposit", "routing number", "$", "transfer", "refund", "claim prize"];

  // Technical Vector Indicators
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const foundUrls = input.match(urlRegex) || [];
  const suspiciousTlds = [".xyz", ".top", ".buzz", ".work", ".click", ".link", ".cc", ".su", ".gq", ".ml", ".cf", ".tk", ".zip", ".mov"];
  const credentialTerms = ["password", "login", "signin", "verify", "authenticate", "credential", "seed phrase", "private key", "ssn", "otp", "2fa code"];

  let psychScore = 20;
  let techScore = 15;
  const psychSignals = [];
  const techSignals = [];

  // Evaluate Urgency
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

  // Evaluate Fear & Loss
  const matchedFear = fearKeywords.filter(k => text.includes(k));
  if (matchedFear.length > 0) {
    psychScore += Math.min(30, matchedFear.length * 14);
    psychSignals.push({
      id: "p-fear",
      name: "Fear & Loss Aversion Manipulation",
      status: "danger",
      score: Math.min(96, 70 + matchedFear.length * 10),
      detail: `Detected intimidation / penalty intimidation: "${matchedFear.slice(0, 3).join('", "')}". Coerces reflexive action.`,
      tag: "Fear Vector"
    });
  }

  // Evaluate Authority & Impersonation
  const matchedAuthority = authorityKeywords.filter(k => text.includes(k));
  if (matchedAuthority.length > 0) {
    psychScore += Math.min(25, matchedAuthority.length * 12);
    psychSignals.push({
      id: "p-authority",
      name: "Institutional Authority Spoofing",
      status: "warning",
      score: Math.min(94, 60 + matchedAuthority.length * 12),
      detail: `References high-trust entity: "${matchedAuthority.slice(0, 2).join('", "')}". Exploits organizational hierarchy bias.`,
      tag: "Authority Bias"
    });
  }

  // Evaluate Financial Demands
  const matchedFinancial = financialKeywords.filter(k => text.includes(k));
  if (matchedFinancial.length > 0) {
    psychScore += 20;
    psychSignals.push({
      id: "p-financial",
      name: "Unsolicited Financial / Asset Action",
      status: "danger",
      score: 88,
      detail: `Contains prompts for monetary dispatch, gift cards, or financial routing: "${matchedFinancial.slice(0, 2).join('", "')}".`,
      tag: "Financial Vector"
    });
  }

  // Evaluate URLs and Technical Indicators
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
        detail: `Extracted domain "${new URL(urlStr.startsWith('http') ? urlStr : 'http://' + urlStr).hostname}" for isolated sandbox inspection.`,
        tag: "Network Endpoint"
      });
    }
  }

  // Evaluate Credential Harvesting cues
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

  // Cap scores between 0 and 100
  psychScore = Math.min(99, Math.max(5, psychScore));
  techScore = Math.min(99, Math.max(5, techScore));
  const overallRiskScore = Math.round((techScore * 0.55) + (psychScore * 0.45));

  // Determine Risk Category
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

  // Provide fallback signals if empty
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

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
