// app.js - TriagBot.ai Controller with Modern Light SaaS Hero & Scanner
// Orchestrates navigation, centered hero CTA, URL scan, circular risk score gauge, SafeGlass Window, and Recent Scans

import { DEMO_PRESETS } from './data/presets.js';
import { triageArtifactAPI } from './services/api.js';

/* ==========================================================================
   STATE & DOM REFERENCES
   ========================================================================== */
const STATE = {
  activeMode: 'url',
  activeView: 'visual',
  selectedFile: null,
  isScanning: false,
  currentAnalysis: null,
  auditLog: []
};

const DOM = {
  // Mode Tabs
  tabUrl: document.getElementById('tab-mode-url'),
  tabText: document.getElementById('tab-mode-text'),
  tabFile: document.getElementById('tab-mode-file'),

  // Containers
  inputContainerUrl: document.getElementById('input-container-url'),
  inputContainerText: document.getElementById('input-container-text'),
  inputContainerFile: document.getElementById('input-container-file'),

  // Input Fields
  urlInput: document.getElementById('url-input'),
  textInput: document.getElementById('text-input'),
  fileDropzone: document.getElementById('file-dropzone'),
  fileInputHidden: document.getElementById('file-input-hidden'),
  fileSelectedIndicator: document.getElementById('file-selected-indicator'),
  selectedFilename: document.getElementById('selected-filename'),
  clearFileBtn: document.getElementById('clear-file-btn'),

  // Presets
  presetBankBtn: document.getElementById('preset-bank-btn'),
  presetGiftcardBtn: document.getElementById('preset-giftcard-btn'),
  presetGithubBtn: document.getElementById('preset-github-btn'),

  // Scan CTA
  scanBtn: document.getElementById('scan-btn'),
  scanBtnText: document.getElementById('scan-btn-text'),
  scanBtnIcon: document.getElementById('scan-btn-icon'),

  // Results Panel (Dual Grid)
  resultsPanel: document.getElementById('results-panel'),
  riskBadge: document.getElementById('risk-badge'),
  riskBadgeText: document.getElementById('risk-badge-text'),
  artifactTypeTag: document.getElementById('artifact-type-tag'),
  targetArtifactTitle: document.getElementById('target-artifact-title'),
  riskScoreNum: document.getElementById('risk-score-num'),
  scoreRingProgress: document.getElementById('score-ring-progress'),
  plainExplanationP: document.getElementById('plain-explanation-p'),

  // SafeGlass Sandbox Viewport
  safeglassUrlBar: document.getElementById('safeglass-url-bar'),
  safeglassStatusPill: document.getElementById('safeglass-status-pill'),
  viewVisualBtn: document.getElementById('view-mode-visual'),
  viewRawBtn: document.getElementById('view-mode-raw'),
  sandboxVisualContent: document.getElementById('sandbox-visual-content'),
  sandboxRawContent: document.getElementById('sandbox-raw-content'),
  sandboxDomPre: document.getElementById('sandbox-dom-pre'),

  // Guardrail Action
  guardrailCard: document.getElementById('guardrail-card'),
  guardrailLabelBadge: document.getElementById('guardrail-label-badge'),
  guardrailDesc: document.getElementById('guardrail-desc'),
  executeGuardrailBtn: document.getElementById('execute-guardrail-btn'),
  guardrailBtnText: document.getElementById('guardrail-btn-text'),

  // Recent Scans Table
  auditLogTbody: document.getElementById('audit-log-tbody'),
  clearHistoryBtn: document.getElementById('clear-history-btn'),

  // Toast
  toast: document.getElementById('cyber-toast'),
  toastMessage: document.getElementById('toast-message')
};

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initLucideIcons();
  setupTabEvents();
  setupPresetEvents();
  setupFileEvents();
  setupScanAction();
  setupGuardrailAction();
  setupViewModeToggle();
  setupAuditLog();

  // Populate initial demo presets in the audit trail for immediate richness
  initInitialAuditLog();

  // Trigger initial preset analysis (Spoofed Bank URL) on load
  setTimeout(() => {
    applyPreset('bankUrl');
  }, 250);
});

function initLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/* ==========================================================================
   TAB & INPUT NAVIGATION
   ========================================================================== */
function setupTabEvents() {
  DOM.tabUrl.addEventListener('click', () => switchInputMode('url'));
  DOM.tabText.addEventListener('click', () => switchInputMode('text'));
  DOM.tabFile.addEventListener('click', () => switchInputMode('file'));
}

function switchInputMode(mode) {
  STATE.activeMode = mode;
  const tabs = [
    { el: DOM.tabUrl, target: 'url' },
    { el: DOM.tabText, target: 'text' },
    { el: DOM.tabFile, target: 'file' }
  ];

  tabs.forEach(t => {
    if (t.target === mode) {
      t.el.className = 'mode-tab px-3.5 py-1.5 rounded-lg bg-white text-cyan-700 font-bold shadow-sm border border-slate-200 flex items-center gap-1.5';
    } else {
      t.el.className = 'mode-tab px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5';
    }
  });

  DOM.inputContainerUrl.classList.toggle('hidden', mode !== 'url');
  DOM.inputContainerText.classList.toggle('hidden', mode !== 'text');
  DOM.inputContainerFile.classList.toggle('hidden', mode !== 'file');

  if (mode === 'url') DOM.urlInput.focus();
  if (mode === 'text') DOM.textInput.focus();
  initLucideIcons();
}

/* ==========================================================================
   PRESET TRIGGERS
   ========================================================================== */
function setupPresetEvents() {
  DOM.presetBankBtn.addEventListener('click', () => applyPreset('bankUrl'));
  DOM.presetGiftcardBtn.addEventListener('click', () => applyPreset('giftCardEmail'));
  DOM.presetGithubBtn.addEventListener('click', () => applyPreset('cleanGithub'));
}

function applyPreset(presetKey) {
  const preset = DEMO_PRESETS[presetKey];
  if (!preset) return;

  if (preset.type === 'URL') {
    switchInputMode('url');
    DOM.urlInput.value = preset.input;
  } else if (preset.type === 'Text') {
    switchInputMode('text');
    DOM.textInput.value = preset.input;
  }

  executeTriage(preset.input, preset.type.toLowerCase());
}

/* ==========================================================================
   FILE DROPZONE & UPLOAD
   ========================================================================== */
function setupFileEvents() {
  DOM.fileDropzone.addEventListener('click', () => DOM.fileInputHidden.click());

  DOM.fileInputHidden.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0].name);
    }
  });

  ['dragenter', 'dragover'].forEach(name => {
    DOM.fileDropzone.addEventListener(name, (e) => {
      e.preventDefault();
      DOM.fileDropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    DOM.fileDropzone.addEventListener(name, (e) => {
      e.preventDefault();
      DOM.fileDropzone.classList.remove('drag-over');
    });
  });

  DOM.fileDropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0].name);
    }
  });

  DOM.clearFileBtn.addEventListener('click', () => {
    STATE.selectedFile = null;
    DOM.fileSelectedIndicator.classList.add('hidden');
    DOM.fileDropzone.classList.remove('hidden');
  });
}

function handleFileSelected(filename) {
  STATE.selectedFile = filename;
  DOM.selectedFilename.textContent = filename;
  DOM.fileSelectedIndicator.classList.remove('hidden');
  DOM.fileDropzone.classList.add('hidden');
  initLucideIcons();
}

/* ==========================================================================
   TRIAGE SCAN EXECUTION
   ========================================================================== */
function setupScanAction() {
  DOM.scanBtn.addEventListener('click', () => {
    let payload = '';
    let mode = STATE.activeMode;

    if (mode === 'url') {
      payload = DOM.urlInput.value.trim();
    } else if (mode === 'text') {
      payload = DOM.textInput.value.trim();
    } else if (mode === 'file') {
      payload = STATE.selectedFile || 'sample_untrusted_payload.pdf.exe';
    }

    if (!payload) {
      showToast("Please enter a URL or provide an artifact to scan.");
      return;
    }

    executeTriage(payload, mode);
  });

  // Enter key trigger
  [DOM.urlInput, DOM.textInput].forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || el.tagName === 'INPUT')) {
        e.preventDefault();
        DOM.scanBtn.click();
      }
    });
  });
}

async function executeTriage(input, mode) {
  if (STATE.isScanning) return;
  STATE.isScanning = true;

  setScanLoadingState(true);

  try {
    const analysis = await triageArtifactAPI(input, mode);
    STATE.currentAnalysis = analysis;

    renderTriageResults(analysis);
    appendAuditLogEntry(analysis);

    DOM.resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) {
    console.error("Triage failed:", err);
    showToast(`Triage failed: ${err.message}`);
  } finally {
    setScanLoadingState(false);
    STATE.isScanning = false;
  }
}

function setScanLoadingState(isLoading) {
  if (isLoading) {
    DOM.scanBtn.disabled = true;
    DOM.scanBtn.classList.add('opacity-75', 'cursor-wait');
    DOM.scanBtnText.textContent = "Analyzing...";
    DOM.scanBtnIcon.setAttribute('data-lucide', 'loader-2');
    DOM.scanBtnIcon.classList.add('animate-spin');
  } else {
    DOM.scanBtn.disabled = false;
    DOM.scanBtn.classList.remove('opacity-75', 'cursor-wait');
    DOM.scanBtnText.textContent = "Analyze URL →";
    DOM.scanBtnIcon.setAttribute('data-lucide', 'shield-alert');
    DOM.scanBtnIcon.classList.remove('animate-spin');
  }
  initLucideIcons();
}

/* ==========================================================================
   RENDER RESULTS PANEL (Dual Grid: Risk Score & SafeGlass Window)
   ========================================================================== */
function renderTriageResults(analysis) {
  const {
    targetArtifact,
    type,
    risk,
    riskScore,
    plainExplanation,
    guardrailAction,
    preview
  } = analysis;

  // 1. Risk Output & Status Badge
  DOM.artifactTypeTag.textContent = `Type: ${type}`;
  DOM.targetArtifactTitle.textContent = targetArtifact;
  DOM.plainExplanationP.textContent = plainExplanation;

  // Circular Score Ring calculation (Circumference of r=40 is 2 * PI * 40 ≈ 251.2)
  const circumference = 251.2;
  const offset = circumference - (riskScore / 100) * circumference;
  if (DOM.scoreRingProgress) {
    DOM.scoreRingProgress.style.strokeDasharray = `${circumference}`;
    DOM.scoreRingProgress.style.strokeDashoffset = `${offset}`;
  }

  if (risk === 'dangerous') {
    DOM.riskBadge.className = "px-4 py-1.5 rounded-full text-xs font-mono font-extrabold tracking-wide uppercase bg-red-100 text-red-800 border border-red-200 inline-flex items-center gap-2 shadow-sm";
    DOM.riskBadgeText.textContent = "🔴 HIGH RISK / DANGEROUS";
    DOM.riskScoreNum.className = "font-heading font-extrabold text-4xl text-red-600";
    if (DOM.scoreRingProgress) DOM.scoreRingProgress.setAttribute('stroke', '#DC2626');
  } else if (risk === 'suspicious') {
    DOM.riskBadge.className = "px-4 py-1.5 rounded-full text-xs font-mono font-extrabold tracking-wide uppercase bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-2 shadow-sm";
    DOM.riskBadgeText.textContent = "🟡 MEDIUM RISK / SUSPICIOUS";
    DOM.riskScoreNum.className = "font-heading font-extrabold text-4xl text-amber-600";
    if (DOM.scoreRingProgress) DOM.scoreRingProgress.setAttribute('stroke', '#D97706');
  } else {
    DOM.riskBadge.className = "px-4 py-1.5 rounded-full text-xs font-mono font-extrabold tracking-wide uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-2 shadow-sm";
    DOM.riskBadgeText.textContent = "🟢 SAFE / LOW RISK";
    DOM.riskScoreNum.className = "font-heading font-extrabold text-4xl text-emerald-600";
    if (DOM.scoreRingProgress) DOM.scoreRingProgress.setAttribute('stroke', '#16A34A');
  }

  animateValue(DOM.riskScoreNum, 0, riskScore, 600);

  // 2. SafeGlass Window Sandbox Viewport
  renderSafeGlassSandbox(preview, risk, targetArtifact);

  // 3. Simulated Guardrail Action
  renderGuardrailAction(guardrailAction);

  initLucideIcons();
}

function renderSafeGlassSandbox(preview, risk, targetArtifact) {
  if (DOM.safeglassUrlBar) {
    DOM.safeglassUrlBar.textContent = targetArtifact || "https://protected-preview.isolated";
  }

  if (DOM.safeglassStatusPill) {
    if (risk === 'dangerous') {
      DOM.safeglassStatusPill.className = "text-[10px] text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-bold";
      DOM.safeglassStatusPill.textContent = "🚨 Malicious Threat";
    } else if (risk === 'suspicious') {
      DOM.safeglassStatusPill.className = "text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold";
      DOM.safeglassStatusPill.textContent = "⚠️ Suspicious Link";
    } else {
      DOM.safeglassStatusPill.className = "text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold";
      DOM.safeglassStatusPill.textContent = "✓ Verified Safe";
    }
  }

  if (!preview) return;

  let visualHtml = '';

  if (preview.screenshotType === 'bank_phish') {
    visualHtml = `
      <div class="space-y-3 font-sans text-xs">
        <div class="flex items-center justify-between pb-2 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span class="font-bold text-slate-800">Chase Commercial Gateway</span>
          </div>
          <span class="px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 font-mono text-[10px] font-semibold">FLAGGED SPOOF</span>
        </div>
        <div class="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[11px] flex items-center gap-2 font-medium">
          <i data-lucide="clock" class="w-3.5 h-3.5 text-red-600"></i>
          <span>Account Restricted: 01:59:42 remaining before suspension</span>
        </div>
        <div class="threat-bbox p-3 rounded-lg space-y-2">
          <span class="text-[10px] font-mono text-red-700 block font-bold">[CREDENTIAL HARVESTING FORM HOOK]</span>
          <input type="text" disabled placeholder="Username" class="w-full bg-white border border-red-200 rounded p-1.5 text-slate-600 text-xs font-mono" value="victim.user@company.com" />
          <input type="password" disabled placeholder="Password" class="w-full bg-white border border-red-200 rounded p-1.5 text-slate-600 text-xs font-mono" value="••••••••••••" />
          <button disabled class="w-full py-1.5 bg-blue-600 text-white rounded font-medium text-xs">Unlock Account</button>
        </div>
      </div>
    `;
  } else if (preview.screenshotType === 'bec_email') {
    visualHtml = `
      <div class="space-y-2.5 font-sans text-xs">
        <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 font-mono">
          <div class="text-slate-600 text-[11px]">From: "David Sterling" &lt;david.sterling.exec-office@gmail.com&gt;</div>
          <div class="text-slate-900 font-bold">Subject: URGENT: Client gift cards needed before 3:00 PM</div>
        </div>
        <div class="threat-bbox p-3 rounded-lg text-slate-800 font-mono text-[11px] space-y-1">
          <span class="text-amber-800 font-bold block">[SOCIAL ENGINEERING COERCION DETECTED]</span>
          <p class="leading-relaxed">"...locked in an off-site investor board meeting and cannot take calls... urgently purchase 5x $100 Gift Cards before 3:00 PM today..."</p>
        </div>
      </div>
    `;
  } else if (preview.screenshotType === 'github_clean') {
    visualHtml = `
      <div class="space-y-2.5 font-sans text-xs">
        <div class="flex items-center justify-between pb-2 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <i data-lucide="git-branch" class="w-4 h-4 text-emerald-600"></i>
            <span class="font-bold text-slate-900">torvalds / linux</span>
          </div>
          <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-semibold">VERIFIED GPG SIGNED</span>
        </div>
        <div class="threat-bbox-safe p-3 rounded-lg font-mono text-emerald-900 space-y-1 text-xs">
          <div class="font-bold">[VERIFIED ARTIFACT: CLEAN GITHUB REPOSITORY]</div>
          <p class="text-slate-600 text-[11px]">SSL Certificate: DigiCert High Assurance EV | Global Reputation: Whitelisted</p>
        </div>
      </div>
    `;
  } else if (preview.screenshotType === 'file_threat') {
    visualHtml = `
      <div class="space-y-2 font-mono text-xs">
        <div class="p-2.5 rounded-lg bg-red-100 border border-red-200 text-red-900 flex items-center justify-between">
          <span class="font-bold">[CRITICAL FILE EXTENSION DECEPTION]</span>
          <span class="text-[10px] bg-red-600 px-2 py-0.5 rounded text-white font-mono">.pdf.exe</span>
        </div>
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-slate-700 text-[11px]">
          <p>Disguised executable binary posing as a benign PDF document.</p>
          <p class="text-red-700 font-semibold">Execution blocked by SafeGlass zero-execution container.</p>
        </div>
      </div>
    `;
  } else {
    visualHtml = `
      <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 space-y-1">
        <div class="font-bold text-slate-900">[SAFEGLASS ISOLATED CONTAINER]</div>
        <p class="text-slate-500">Read-only virtual rendering. Destination URL / payload evaluated with zero endpoint risk.</p>
      </div>
    `;
  }

  DOM.sandboxVisualContent.innerHTML = visualHtml;
  DOM.sandboxDomPre.textContent = preview.rawDomSnippet || "<!-- Sandboxed DOM sanitized by TriageBot -->";
}

function renderGuardrailAction(guardrail) {
  if (!guardrail) return;

  DOM.guardrailDesc.textContent = guardrail.description;
  DOM.guardrailBtnText.textContent = guardrail.buttonText;

  if (guardrail.level === 'dangerous') {
    DOM.guardrailCard.className = "p-4 rounded-xl bg-red-50 border border-red-200 space-y-2.5 shadow-sm";
    DOM.guardrailLabelBadge.className = "px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-100 text-red-800 border border-red-200";
    DOM.guardrailLabelBadge.textContent = guardrail.label;
    DOM.executeGuardrailBtn.className = "w-full py-2.5 px-3 rounded-lg text-xs font-mono font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors cursor-pointer text-center";
  } else if (guardrail.level === 'suspicious') {
    DOM.guardrailCard.className = "p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2.5 shadow-sm";
    DOM.guardrailLabelBadge.className = "px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200";
    DOM.guardrailLabelBadge.textContent = guardrail.label;
    DOM.executeGuardrailBtn.className = "w-full py-2.5 px-3 rounded-lg text-xs font-mono font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors cursor-pointer text-center";
  } else {
    DOM.guardrailCard.className = "p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2.5 shadow-sm";
    DOM.guardrailLabelBadge.className = "px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200";
    DOM.guardrailLabelBadge.textContent = guardrail.label;
    DOM.executeGuardrailBtn.className = "w-full py-2.5 px-3 rounded-lg text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer text-center";
  }
}

function setupGuardrailAction() {
  DOM.executeGuardrailBtn.addEventListener('click', () => {
    if (!STATE.currentAnalysis) return;
    const actionName = STATE.currentAnalysis.guardrailAction?.actionName || "Guardrail Enforcement";
    showToast(`Guardrail Executed: ${actionName} applied successfully.`);
  });
}

function setupViewModeToggle() {
  DOM.viewVisualBtn.addEventListener('click', () => {
    STATE.activeView = 'visual';
    DOM.viewVisualBtn.className = "px-3 py-1 rounded-md bg-white text-cyan-800 font-semibold shadow-sm border border-slate-200";
    DOM.viewRawBtn.className = "px-3 py-1 rounded-md text-slate-600 hover:text-slate-900 transition-colors";
    DOM.sandboxVisualContent.classList.remove('hidden');
    DOM.sandboxRawContent.classList.add('hidden');
  });

  DOM.viewRawBtn.addEventListener('click', () => {
    STATE.activeView = 'raw';
    DOM.viewRawBtn.className = "px-3 py-1 rounded-md bg-white text-cyan-800 font-semibold shadow-sm border border-slate-200";
    DOM.viewVisualBtn.className = "px-3 py-1 rounded-md text-slate-600 hover:text-slate-900 transition-colors";
    DOM.sandboxVisualContent.classList.add('hidden');
    DOM.sandboxRawContent.classList.remove('hidden');
  });
}

/* ==========================================================================
   RECENT SCANS / AUDIT LOG TABLE (AUDIT TRAIL)
   ========================================================================== */
function setupAuditLog() {
  DOM.clearHistoryBtn.addEventListener('click', () => {
    STATE.auditLog = [];
    DOM.auditLogTbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400 font-mono">No recent scan history logged.</td></tr>`;
    showToast("Scan history cleared.");
  });
}

function initInitialAuditLog() {
  const initialItems = [
    {
      timestamp: formatTime(new Date(Date.now() - 360000)),
      targetArtifact: "https://chase-security-verify.net/auth/login",
      type: "URL",
      riskScore: 94,
      risk: "dangerous",
      actionTaken: "Blocked & Quarantined",
      analysisData: DEMO_PRESETS.bankUrl.analysis
    },
    {
      timestamp: formatTime(new Date(Date.now() - 720000)),
      targetArtifact: "Email: david.sterling.exec-office@gmail.com",
      type: "Text",
      riskScore: 89,
      risk: "dangerous",
      actionTaken: "Blocked & Flagged CEO Fraud",
      analysisData: DEMO_PRESETS.giftCardEmail.analysis
    },
    {
      timestamp: formatTime(new Date(Date.now() - 1080000)),
      targetArtifact: "https://github.com/torvalds/linux",
      type: "URL",
      riskScore: 4,
      risk: "safe",
      actionTaken: "Access Allowed",
      analysisData: DEMO_PRESETS.cleanGithub.analysis
    }
  ];

  STATE.auditLog = initialItems;
  renderAuditLogTable();
}

function appendAuditLogEntry(analysis) {
  const entry = {
    timestamp: formatTime(new Date()),
    targetArtifact: analysis.targetArtifact,
    type: analysis.type,
    riskScore: analysis.riskScore || 0,
    risk: analysis.risk,
    actionTaken: analysis.guardrailAction?.actionName || "Triage Completed",
    analysisData: analysis
  };

  STATE.auditLog.unshift(entry);
  if (STATE.auditLog.length > 15) STATE.auditLog.pop();

  renderAuditLogTable();
}

function renderAuditLogTable() {
  if (STATE.auditLog.length === 0) {
    DOM.auditLogTbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400 font-mono">No recent scan history logged.</td></tr>`;
    return;
  }

  DOM.auditLogTbody.innerHTML = STATE.auditLog.map((item, idx) => `
    <tr class="hover:bg-slate-50 transition-colors cursor-pointer group" data-log-index="${idx}">
      <td class="py-3 px-4 text-slate-500 font-mono">${escapeHtml(item.timestamp)}</td>
      <td class="py-3 px-4 font-semibold text-slate-900 group-hover:text-cyan-600 truncate max-w-xs transition-colors">${escapeHtml(item.targetArtifact)}</td>
      <td class="py-3 px-4 text-slate-600 font-mono">${escapeHtml(item.type)}</td>
      <td class="py-3 px-4 font-mono font-bold ${getScoreColorClass(item.risk)}">${item.riskScore} / 100</td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${getVerdictBadgeClass(item.risk)}">
          ${getVerdictText(item.risk)}
        </span>
      </td>
      <td class="py-3 px-4 text-slate-700 font-medium font-mono">${escapeHtml(item.actionTaken)}</td>
    </tr>
  `).join('');

  // Add click listeners to rows to reload previous analysis
  DOM.auditLogTbody.querySelectorAll('tr[data-log-index]').forEach(row => {
    row.addEventListener('click', () => {
      const idx = parseInt(row.getAttribute('data-log-index'), 10);
      const entry = STATE.auditLog[idx];
      if (entry && entry.analysisData) {
        STATE.currentAnalysis = entry.analysisData;
        renderTriageResults(entry.analysisData);
        DOM.resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast(`Loaded scan record: ${entry.targetArtifact.slice(0, 28)}...`);
      }
    });
  });
}

function getScoreColorClass(risk) {
  if (risk === 'dangerous') return 'text-red-600';
  if (risk === 'suspicious') return 'text-amber-600';
  return 'text-emerald-600';
}

function getVerdictText(risk) {
  if (risk === 'dangerous') return '🔴 High Risk';
  if (risk === 'suspicious') return '🟡 Medium Risk';
  return '🟢 Safe';
}

function getVerdictBadgeClass(risk) {
  if (risk === 'dangerous') return 'bg-red-50 text-red-700 border border-red-200';
  if (risk === 'suspicious') return 'bg-amber-50 text-amber-700 border border-amber-200';
  return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
}

function formatTime(date) {
  return date.toTimeString().split(' ')[0];
}

function showToast(msg) {
  DOM.toastMessage.textContent = msg;
  DOM.toast.classList.add('show');
  setTimeout(() => {
    DOM.toast.classList.remove('show');
  }, 2500);
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
