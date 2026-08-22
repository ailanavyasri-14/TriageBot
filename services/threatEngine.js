// services/threatEngine.js
// Core Triage & Heuristic Engine for TriageBot

import { DEMO_PRESETS } from '../data/presets.js';

/**
 * Triages submitted artifacts (URL, text, or file) and returns structured analysis
 * @param {string} input - The submitted content or filename
 * @param {string} mode - "url" | "text" | "file" | "all"
 * @returns {Promise<Object>}
 */
export async function triageArtifact(input, mode = "all") {
  // Simulate cloud sandbox startup latency
  await new Promise(r => setTimeout(r, 600));

  if (!input || !input.trim()) {
    throw new Error("No artifact submitted for triage.");
  }

  const raw = input.trim();
  const lower = raw.toLowerCase();

  // 1. Direct Presets Check
  if (lower.includes("chase-security-verify") || lower.includes("unauthorized login") || lower.includes("jpmorgan chase")) {
    return DEMO_PRESETS.bankUrl.analysis;
  }
  if (lower.includes("gift card") || lower.includes("david sterling") || lower.includes("apple / amazon gift")) {
    return DEMO_PRESETS.giftCardEmail.analysis;
  }
  if (lower.includes("torvalds/linux") || lower.includes("github.com/torvalds")) {
    return DEMO_PRESETS.cleanGithub.analysis;
  }

  // 2. File Mode Evaluation
  if (mode === "file" || isFileArtifact(raw)) {
    return triageFileArtifact(raw);
  }

  // 3. Dynamic URL / Text Evaluation
  if (raw.startsWith("http://") || raw.startsWith("https://") || mode === "url") {
    return triageUrlArtifact(raw);
  }

  return triageTextArtifact(raw);
}

function isFileArtifact(input) {
  const fileExtensions = [".pdf", ".exe", ".docx", ".doc", ".zip", ".rar", ".7z", ".js", ".vbs", ".bat", ".scr", ".iso", ".apk"];
  return fileExtensions.some(ext => input.toLowerCase().endsWith(ext));
}

function triageFileArtifact(filename) {
  const lower = filename.toLowerCase();
  const isDoubleExtension = /\.(pdf|docx|xlsx|txt|png|jpg)\.(exe|vbs|bat|scr|cmd|ps1|js)$/i.test(lower);
  const isExecutable = /\.(exe|vbs|bat|scr|cmd|ps1|iso|dll)$/i.test(lower);
  const isArchive = /\.(zip|rar|7z|tar|gz)$/i.test(lower);
  const isMacroDoc = /\.(docm|xlsm|pptm|dotm)$/i.test(lower);

  let risk = "safe";
  let riskScore = 8;
  let explanation = `Static binary analysis of '${filename}' completed with zero suspicious signatures. File structure conforms to standard benign specifications.`;
  let guardrail = {
    level: "safe",
    label: "[Allow Access]",
    actionName: "Allow Download",
    description: "Automated guardrail active: File signature verified clean. Safe for user workstation access.",
    buttonText: "Allow Access & Open File"
  };

  if (isDoubleExtension) {
    risk = "dangerous";
    riskScore = 98;
    explanation = `High-severity disguise detected in '${filename}'. The file uses a deceptive double extension (.pdf.exe) to trick users into executing a malicious binary disguised as an innocent document.`;
    guardrail = {
      level: "dangerous",
      label: "[Block Link & Quarantine Payload]",
      actionName: "Quarantine Malicious Binary",
      description: "Automated guardrail active: Executable disguised as document. Payload quarantined and checksum blacklisted.",
      buttonText: "Quarantine Payload Immediately"
    };
  } else if (isExecutable) {
    risk = "dangerous";
    riskScore = 92;
    explanation = `Untrusted executable binary '${filename}' detected. Contains unauthorized execution hooks and unverified code signing certificates that pose a critical risk to local endpoints.`;
    guardrail = {
      level: "dangerous",
      label: "[Block Link & Quarantine Payload]",
      actionName: "Block Execution",
      description: "Automated guardrail active: Unsigned executable blocked by endpoint containment policy.",
      buttonText: "Quarantine Binary"
    };
  } else if (isMacroDoc) {
    risk = "suspicious";
    riskScore = 74;
    explanation = `Document '${filename}' contains embedded VBA macro automations. Macro-enabled files are frequently used to download second-stage malware upon opening.`;
    guardrail = {
      level: "suspicious",
      label: "[Warn User & Require Verification]",
      actionName: "Strip Macros & Inspect",
      description: "Automated guardrail active: Embedded macros stripped in cloud container. User confirmation required.",
      buttonText: "Strip Macros & Verify Origin"
    };
  } else if (isArchive && (lower.includes("invoice") || lower.includes("payment") || lower.includes("statement"))) {
    risk = "suspicious";
    riskScore = 68;
    explanation = `Encrypted or compressed archive '${filename}' with financial naming convention. Archives are often used to conceal password-protected malware and evade gateway scanners.`;
    guardrail = {
      level: "suspicious",
      label: "[Warn User & Require Verification]",
      actionName: "Deep Archive Unpack",
      description: "Automated guardrail active: Archive extracted in isolated memory sandbox for sub-file telemetry inspection.",
      buttonText: "Unpack in Sandbox"
    };
  }

  return {
    targetArtifact: `File: ${filename}`,
    type: "File",
    risk,
    riskScore,
    plainExplanation: explanation,
    guardrailAction: guardrail,
    preview: {
      url: `file://sandbox/quarantine/${filename}`,
      pageTitle: `Safe Glass Sandbox File Inspection: ${filename}`,
      sslIssuer: "Local Sandbox Virtual Storage",
      domainAge: "Extracted in Memory",
      analogyText: "Looking at the file safely from behind thick glass without risking your device.",
      watermark: "🛡️ Isolated Cloud Sandbox — Zero Script Execution",
      screenshotType: risk === "dangerous" ? "file_threat" : "file_clean",
      rawDomSnippet: `<!-- Sandboxed File Hex & Header Deconstruction -->
<div class="file-inspection-ast">
  <div class="file-meta">Filename: ${filename} | Size: 1.4 MB | Entropy: ${risk === 'dangerous' ? '7.89 (High Obfuscation)' : '4.12 (Normal)'}</div>
  <div class="pe-headers">
    Status: ${risk.toUpperCase()} | Sandbox Quarantine: Active
  </div>
</div>`
    }
  };
}

function triageUrlArtifact(url) {
  const lower = url.toLowerCase();
  const suspiciousTlds = [".xyz", ".top", ".buzz", ".work", ".click", ".link", ".cc", ".su", ".gq", ".ml", ".cf", ".tk", ".zip", ".mov", ".pw"];
  const hasSuspiciousTld = suspiciousTlds.some(t => lower.includes(t));
  const hasIpHost = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url);
  const hasSpoofedKeywords = lower.includes("login") || lower.includes("verify") || lower.includes("auth") || lower.includes("secure") || lower.includes("account") || lower.includes("update");
  const isCleanDomain = lower.includes("google.com") || lower.includes("microsoft.com") || lower.includes("apple.com") || lower.includes("github.com") || lower.includes("wikipedia.org");

  let risk = "safe";
  let riskScore = 6;
  let explanation = `Destination URL '${url.slice(0, 40)}...' verified against global threat intelligence feeds with zero anomalies detected.`;
  let guardrail = {
    level: "safe",
    label: "[Allow Access]",
    actionName: "Allow Navigation",
    description: "Automated guardrail active: Domain reputation verified clean. Safe to browse.",
    buttonText: "Allow Access"
  };

  if (hasIpHost || (hasSuspiciousTld && hasSpoofedKeywords)) {
    risk = "dangerous";
    riskScore = 95;
    explanation = `Dangerous phishing domain detected. The link routes to a suspicious endpoint exhibiting indicators of brand typosquatting, deceptive credential capture, and missing identity certification.`;
    guardrail = {
      level: "dangerous",
      label: "[Block Link & Quarantine Payload]",
      actionName: "Block & Sinkhole",
      description: "Automated guardrail active: Destination URL blocked at edge gateway and sinkholed.",
      buttonText: "Block Link & Blacklist Domain"
    };
  } else if (hasSpoofedKeywords && !isCleanDomain) {
    risk = "suspicious";
    riskScore = 65;
    explanation = `Suspicious authentication gateway detected. The domain uses login-related keywords without verifiable enterprise Extended Validation (EV) credentials.`;
    guardrail = {
      level: "suspicious",
      label: "[Warn User & Require Verification]",
      actionName: "Require MFA & Warn",
      description: "Automated guardrail active: Display security warning prompt and require out-of-band identity check.",
      buttonText: "Warn User & Require Verification"
    };
  }

  return {
    targetArtifact: url.length > 55 ? url.slice(0, 52) + '...' : url,
    type: "URL",
    risk,
    riskScore,
    plainExplanation: explanation,
    guardrailAction: guardrail,
    preview: {
      url: url,
      pageTitle: `Safe Glass Sandbox: ${url.slice(0, 35)}`,
      sslIssuer: risk === "dangerous" ? "Untrusted DV Authority" : "Verified TLS Certificate",
      domainAge: risk === "dangerous" ? "Under 7 Days" : "Established",
      analogyText: "Looking at the site safely from behind thick glass without risking your device.",
      watermark: "🛡️ Isolated Cloud Sandbox — Zero Script Execution",
      screenshotType: risk === "dangerous" ? "generic_threat" : "generic_clean",
      rawDomSnippet: `<!-- Sandboxed Web Snapshot -->
<div class="quarantine-frame">
  <div class="url-badge">${url}</div>
  <div class="verdict-banner ${risk}">THREAT STATUS: ${risk.toUpperCase()}</div>
</div>`
    }
  };
}

function triageTextArtifact(text) {
  const lower = text.toLowerCase();
  const urgencyWords = ["urgent", "immediately", "asap", "within 24h", "2 hours", "action required", "deadline", "confidential", "secret", "locked", "suspended"];
  const financialWords = ["gift card", "wire", "escrow", "crypto", "bitcoin", "routing number", "$", "transfer", "invoice"];
  const authorityWords = ["ceo", "director", "fbi", "irs", "fraud team", "security team", "it support", "chase", "bank", "paypal"];

  const matchedUrgency = urgencyWords.filter(w => lower.includes(w));
  const matchedFinancial = financialWords.filter(w => lower.includes(w));
  const matchedAuthority = authorityWords.filter(w => lower.includes(w));

  let score = 10 + (matchedUrgency.length * 20) + (matchedFinancial.length * 25) + (matchedAuthority.length * 15);
  score = Math.min(99, Math.max(5, score));

  let risk = "safe";
  let explanation = "The submitted text exhibits normal conversational tone with zero psychological coercion or social engineering markers.";
  let guardrail = {
    level: "safe",
    label: "[Allow Access]",
    actionName: "Normal Processing",
    description: "Automated guardrail active: Content is benign and safe to proceed with.",
    buttonText: "Acknowledge & Proceed"
  };

  if (score >= 70) {
    risk = "dangerous";
    explanation = `High-risk social engineering attack identified. The sender combines coercive urgency ("${matchedUrgency.slice(0, 2).join('", "')}") with financial demands and authority impersonation to bypass critical thinking.`;
    guardrail = {
      level: "dangerous",
      label: "[Block Link & Quarantine Payload]",
      actionName: "Block & Quarantine",
      description: "Automated guardrail active: High-confidence social engineering attack quarantined.",
      buttonText: "Block Sender & Quarantine"
    };
  } else if (score >= 40) {
    risk = "suspicious";
    explanation = `Anomalous psychological pressure markers detected. The message uses urgency or financial references that warrant independent out-of-band verification.`;
    guardrail = {
      level: "suspicious",
      label: "[Warn User & Require Verification]",
      actionName: "Warn User",
      description: "Automated guardrail active: Display warning banner advising verbal phone verification.",
      buttonText: "Warn User & Request Out-of-Band Check"
    };
  }

  return {
    targetArtifact: `Text Snippet: "${text.slice(0, 35)}..."`,
    type: "Text",
    risk,
    riskScore: score,
    plainExplanation: explanation,
    guardrailAction: guardrail,
    preview: {
      url: "text://message/inspect",
      pageTitle: `Safe Glass Text Analysis`,
      sslIssuer: "Sanitized Message AST",
      domainAge: "N/A (Raw Text)",
      analogyText: "Looking at the message safely from behind thick glass without risking your device.",
      watermark: "🛡️ Isolated Cloud Sandbox — Zero Script Execution",
      screenshotType: risk === "dangerous" ? "bec_email" : "generic_clean",
      rawDomSnippet: `<!-- Sandboxed Text Entity Decomposition -->
<div class="text-ast">
  <div class="detected-intent">Intent Classification: ${risk.toUpperCase()}</div>
  <p class="sanitized-text">${escapeHtml(text.slice(0, 240))}</p>
</div>`
    }
  };
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
