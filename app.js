const output = document.getElementById('output');
const input = document.getElementById('command-input');
const inputLine = document.getElementById('input-line');
const terminalBody = document.getElementById('terminal-body');

let commandHistory = [];
let historyIndex = -1;
let activeCmd = null;
let isAnimating = false;
let animationCancel = null;

// ── Data ──────────────────────────────────────────────────

const COMMANDS = {
    help: {
        description: 'List available commands',
        run: cmdHelp,
    },
    whoami: {
        description: 'About me',
        run: cmdWhoami,
    },
    experience: {
        description: 'Work experience timeline',
        run: cmdExperience,
    },
    skills: {
        description: 'Technical skills',
        run: cmdSkills,
    },
    projects: {
        description: 'Key projects and contributions',
        run: cmdProjects,
    },
    education: {
        description: 'Education background',
        run: cmdEducation,
    },
    clear: {
        description: 'Clear the terminal',
        run: cmdClear,
    },
};

// ── Command implementations ───────────────────────────────

function cmdHelp() {
    let html = '<div class="line bold color-cyan">Available Commands:</div>\n<div class="line">&nbsp;</div>';
    for (const [name, cmd] of Object.entries(COMMANDS)) {
        html += '<div class="line">  <span class="help-cmd">' + name + '</span> <span class="help-desc">' + cmd.description + '</span></div>';
    }
    html += '\n<div class="line color-dim">Tip: Use Tab for autocomplete, arrow keys for history.</div>';
    return html;
}

function cmdWhoami() {
    return '\
<div class="line bold color-green">Hong Yin Yu (Jerry)</div>\
<div class="line color-blue">DevOps Engineer</div>\
<div class="line">&nbsp;</div>\
<div class="line">Infrastructure engineer with 5+ years of experience at Crypto.com,</div>\
<div class="line">specializing in cloud infrastructure, Kubernetes orchestration, and</div>\
<div class="line">security automation across AWS and Azure environments.</div>\
<div class="line">&nbsp;</div>\
<div class="line">Passionate about building reliable, scalable infrastructure through</div>\
<div class="line">Infrastructure as Code, GitOps workflows, and zero-trust security.</div>';
}

function cmdExperience() {
    return '\
<div class="section-header">Work Experience</div>\
<div class="line">&nbsp;</div>\
\
<div class="timeline-item">\
  <div class="role">Engineer, Infra DevOps</div>\
  <div class="company">Crypto.com</div>\
  <div class="date">Jan 2023 - Mar 2025 | London, UK</div>\
  <div class="line">&nbsp;</div>\
  <div class="detail"><span class="color-cyan">\u2022</span> Architected multi-region Teleport zero-trust platform across 3 AWS regions (US, Singapore, Tokyo) and 16 production clusters serving 2,633 RBAC roles</div>\
  <div class="detail"><span class="color-cyan">\u2022</span> Built AWS account provisioning pipeline managing 100+ production and 92 staging accounts with automated CloudTrail, Config &amp; GuardDuty</div>\
  <div class="detail"><span class="color-cyan">\u2022</span> Managed centralized Helm chart repository (13 charts) for security applications</div>\
  <div class="detail"><span class="color-cyan">\u2022</span> Designed Teleport role management pipeline with Okta auto-provisioning, dual-approval governance, and self-service templates via Spacelift</div>\
  <div class="detail"><span class="color-cyan">\u2022</span> Provisioned multi-environment EKS infrastructure (v1.33) with Karpenter + HPA autoscaling, Flux CD GitOps, and 16+ Helm releases per cluster</div>\
  <div class="detail"><span class="color-cyan">\u2022</span> Built serverless metrics pipeline (Lambda + Python) processing Okta login analytics with automated visualization and S3 reporting</div>\
  <div class="detail"><span class="color-cyan">\u2022</span> Implemented dynamic IP allowlisting via GitHub webhooks with automated PR creation across all regions</div>\
  <div class="detail"><span class="color-cyan">\u2022</span> Managed RDS Aurora (MySQL/PostgreSQL), ElastiCache Redis, CockroachDB, and OpenSearch with IAM authentication and PII-level access controls</div>\
  <div class="detail"><span class="color-cyan">\u2022</span> Deployed FortiGate &amp; Palo Alto firewalls with GWLB on AWS</div>\
</div>\
\
<div class="timeline-item">\
  <div class="role">Engineer, Security Assurance and Resilience</div>\
  <div class="company">Crypto.com</div>\
  <div class="date">Nov 2021 - Jan 2023 | Hong Kong</div>\
  <div class="line">&nbsp;</div>\
  <div class="detail"><span class="color-cyan">\u2022</span> Collaborated with cross-functional teams on security protocols</div>\
  <div class="detail"><span class="color-cyan">\u2022</span> Supported troubleshooting and information dissemination</div>\
</div>\
\
<div class="timeline-item">\
  <div class="role">Quality Assurance Engineer</div>\
  <div class="company">Crypto.com</div>\
  <div class="date">Nov 2020 - Nov 2021 | Hong Kong</div>\
</div>\
\
<div class="timeline-item">\
  <div class="role">Senior QA Specialist</div>\
  <div class="company">Crypto.com</div>\
  <div class="date">Aug 2020 - Nov 2020 | Hong Kong</div>\
</div>\
\
<div class="timeline-item">\
  <div class="role">QA Specialist</div>\
  <div class="company">Crypto.com</div>\
  <div class="date">Feb 2018 - Aug 2020 | Hong Kong</div>\
</div>';
}

function cmdSkills() {
    var categories = {
        'Cloud': ['AWS', 'Azure'],
        'IaC & GitOps': ['Terraform', 'Spacelift', 'Flux CD', 'Kustomize', 'Ansible'],
        'Containers': ['Kubernetes (EKS/AKS)', 'Docker', 'Helm', 'Karpenter'],
        'Security': ['Teleport', 'Okta OIDC', 'GuardDuty', 'CloudTrail', 'AWS Config'],
        'Languages': ['Terraform HCL', 'Python', 'Bash'],
        'CI/CD': ['Spacelift', 'GitHub Actions', 'Flux CD', 'GitOps'],
        'Monitoring': ['Datadog', 'Prometheus', 'Grafana', 'Fluentd', 'CloudWatch'],
    };

    var html = '<div class="section-header">Technical Skills</div>\n<div class="line">&nbsp;</div>';
    for (var cat in categories) {
        html += '<div class="line"><span class="bold color-yellow">' + cat + '</span></div>';
        html += '<div class="line">';
        for (var i = 0; i < categories[cat].length; i++) {
            html += '<span class="skill-tag">' + categories[cat][i] + '</span>';
        }
        html += '</div><div class="line">&nbsp;</div>';
    }
    return html;
}

function cmdProjects() {
    var projects = {
        'Teleport Zero-Trust Platform': [
            ['Multi-Region Infrastructure', '3 AWS regions (US/SG/TK), 2 envs, EKS + VPC + Flux CD GitOps'],
            ['RBAC Pipeline', '2,633 roles across 16 prod clusters, Okta auto-provisioning, dual-approval governance'],
            ['Metrics Pipeline', 'Lambda (Python) processing Okta login data into analytics dashboards on S3'],
            ['IP Allowlisting', 'GitHub webhook-driven dynamic security group updates across all regions'],
            ['Slack Bot Integration', 'Automated access request approval with SQS and IRSA'],
        ],
        'AWS Account Provisioning': [
            ['Account Factory', 'Terraform pipeline provisioning 100+ prod & 92 staging AWS accounts'],
            ['Security Compliance', 'Automated CloudTrail, AWS Config (CIS Benchmark), GuardDuty across 5 regions'],
            ['Import Automation', 'Bash/Python tooling to discover and import existing resources into Terraform state'],
            ['IAM Policies', 'Cross-account assume roles with least-privilege for provisioning operations'],
        ],
        'Kubernetes & Helm': [
            ['EKS Clusters', 'Multi-env (prod/stag/dev) with Karpenter + HPA autoscaling, IRSA, KMS encryption'],
            ['Helm Chart Repository', '13 production charts'],
            ['GitOps Pipeline', 'Flux CD with GitHub Actions for automated chart packaging & versioning'],
        ],
        'AWS General Infrastructure': [
            ['Multi-Region VPC', 'Transit Gateway networking, NAT, security groups across SG & Korea regions'],
            ['Application Platform', '13+ apps deployed via Helm/Flux'],
            ['RDS IAM Module', 'Custom Terraform module for automated MySQL user provisioning with PII controls'],
            ['Observability', 'Thanos, Prometheus, Grafana, Fluentd, Datadog, CloudWatch integration'],
        ],
    };

    var html = '<div class="section-header">Key Projects</div>\n<div class="line">&nbsp;</div>';
    for (var cat in projects) {
        html += '<div class="project-category">[' + cat + ']</div>';
        for (var i = 0; i < projects[cat].length; i++) {
            var name = projects[cat][i][0];
            var desc = projects[cat][i][1];
            html += '<div class="project-item"><span class="color-green">' + name + '</span> <span class="color-dim">- ' + desc + '</span></div>';
        }
        html += '<div class="line">&nbsp;</div>';
    }
    return html;
}

function cmdEducation() {
    return '\
<div class="section-header">Education</div>\
<div class="line">&nbsp;</div>\
<div class="timeline-item">\
  <div class="role">Bachelor\'s Degree - Information Engineering</div>\
  <div class="company">City University of Hong Kong</div>\
  <div class="date">Hong Kong</div>\
</div>';
}

function cmdClear() {
    output.innerHTML = '';
    activeCmd = null;
    updateButtonStates();
    return null;
}

// ── Engine ────────────────────────────────────────────────

function appendOutput(html) {
    if (html === null) return;
    var div = document.createElement('div');
    div.innerHTML = html;
    output.appendChild(div);
}

function appendPromptLine(cmd) {
    var div = document.createElement('div');
    div.classList.add('line');
    div.innerHTML = '<span class="prompt">visitor@jerry.dev:~$&nbsp;</span><span class="typed-command">' + escapeHtml(cmd) + '</span>';
    output.appendChild(div);
}

function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ── Animation helpers ─────────────────────────────────────

function cancelAnimation() {
    if (animationCancel) {
        animationCancel();
        animationCancel = null;
    }
}

function streamContent(htmlString, durationMs, onDone) {
    var cancelled = false;
    var cancel = function() { cancelled = true; };

    var temp = document.createElement('div');
    temp.innerHTML = htmlString;
    var elements = Array.from(temp.children);

    if (elements.length === 0) {
        onDone();
        return cancel;
    }

    var elementDelay = Math.floor(durationMs / elements.length);
    var elIndex = 0;

    function showNext() {
        if (cancelled) return;
        if (elIndex < elements.length) {
            output.appendChild(elements[elIndex]);
            elIndex++;
            scrollToBottom();
            setTimeout(showNext, elementDelay);
        } else {
            onDone();
        }
    }

    showNext();
    return cancel;
}

function animateCommand(cmd, resultHtml, skipTyping, onDone) {
    cancelAnimation();

    var cancelled = false;
    var streamCancel = null;

    animationCancel = function() {
        cancelled = true;
        if (streamCancel) streamCancel();
    };

    inputLine.classList.add('hidden');
    isAnimating = true;

    function finishAnimation() {
        isAnimating = false;
        animationCancel = null;
        inputLine.classList.remove('hidden');
        scrollToBottom();
        if (onDone) onDone();
    }

    function finishImmediately() {
        if (streamCancel) streamCancel();
        appendPromptLine(cmd);
        appendOutput(resultHtml);
        finishAnimation();
    }

    if (skipTyping) {
        appendPromptLine(cmd);
        if (cancelled) { finishImmediately(); return; }
        streamCancel = streamContent(resultHtml, 4500, finishAnimation);
    } else {
        var promptDiv = document.createElement('div');
        promptDiv.classList.add('line');
        var promptSpan = document.createElement('span');
        promptSpan.className = 'prompt';
        promptSpan.innerHTML = 'visitor@jerry.dev:~$&nbsp;';
        var cmdSpan = document.createElement('span');
        cmdSpan.className = 'typed-command typing-cursor';
        promptDiv.appendChild(promptSpan);
        promptDiv.appendChild(cmdSpan);
        output.appendChild(promptDiv);

        var typeDelay = Math.floor(500 / cmd.length);
        var charIndex = 0;

        function typeNextChar() {
            if (cancelled) { output.innerHTML = ''; finishImmediately(); return; }
            if (charIndex < cmd.length) {
                cmdSpan.textContent += cmd[charIndex];
                charIndex++;
                scrollToBottom();
                setTimeout(typeNextChar, typeDelay);
            } else {
                cmdSpan.classList.remove('typing-cursor');
                setTimeout(function() {
                    if (cancelled) { output.innerHTML = ''; finishImmediately(); return; }
                    streamCancel = streamContent(resultHtml, 4300, finishAnimation);
                }, 200);
            }
        }

        typeNextChar();
    }
}

// ── Typed commands (keyboard) ─────────────────────────────

function processCommand(raw) {
    var cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    cancelAnimation();

    commandHistory.push(raw);
    historyIndex = commandHistory.length;

    if (COMMANDS[cmd]) {
        var result = COMMANDS[cmd].run();
        if (cmd === 'clear') return;
        output.innerHTML = '';
        activeCmd = null;
        updateButtonStates();
        animateCommand(cmd, result, true, null);
    } else {
        appendPromptLine(raw);
        if (cmd === 'sudo' || cmd.startsWith('sudo ')) {
            appendOutput('<div class="line color-red">Nice try. You don\'t have sudo privileges here.</div>');
        } else if (cmd === 'ls') {
            appendOutput('<div class="line">whoami.txt  experience.log  skills.conf  projects/  education.md  contact.json</div>');
        } else if (cmd === 'cat' || cmd.startsWith('cat ')) {
            appendOutput('<div class="line color-dim">Try one of the commands instead. Type <span class="color-green">help</span> for a list.</div>');
        } else if (cmd === 'exit' || cmd === 'quit') {
            appendOutput('<div class="line color-dim">Thanks for visiting! Closing terminal...</div>');
            setTimeout(function() {
                document.getElementById('terminal').style.opacity = '0';
                document.getElementById('terminal').style.transition = 'opacity 0.5s';
            }, 800);
            setTimeout(function() {
                document.getElementById('terminal').style.display = 'none';
                document.body.innerHTML = '<div style="color:#3fb950;font-family:monospace;display:flex;justify-content:center;align-items:center;height:100vh;font-size:18px;">Session ended. Refresh to reconnect.</div>';
            }, 1400);
        } else {
            appendOutput('<div class="line"><span class="color-red">Command not found:</span> ' + escapeHtml(cmd) + '. Type <span class="color-green">help</span> for available commands.</div>');
        }
        activeCmd = null;
        updateButtonStates();
        scrollToBottom();
    }
}

// ── Button toggle with animation ──────────────────────────

function toggleCommand(cmd) {
    cancelAnimation();

    if (activeCmd === cmd) {
        output.innerHTML = '';
        activeCmd = null;
        inputLine.classList.remove('hidden');
    } else {
        output.innerHTML = '';
        activeCmd = cmd;
        var result = COMMANDS[cmd].run();
        animateCommand(cmd, result, false, null);
    }
    updateButtonStates();
    scrollToBottom();
}

function updateButtonStates() {
    document.querySelectorAll('.cmd-btn').forEach(function(btn) {
        if (btn.dataset.cmd === activeCmd) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// ── Tab autocomplete ──────────────────────────────────────

function tabComplete(partial) {
    var matches = Object.keys(COMMANDS).filter(function(c) { return c.startsWith(partial.toLowerCase()); });
    if (matches.length === 1) {
        return matches[0];
    }
    return null;
}

// ── Event listeners ───────────────────────────────────────

input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        var cmd = input.value;
        input.value = '';
        processCommand(cmd);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            input.value = '';
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        var result = tabComplete(input.value);
        if (result) input.value = result;
    } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        cmdClear();
    }
});

terminalBody.addEventListener('click', function() { input.focus(); });

// ── Command button clicks ────────────────────────────────

document.querySelectorAll('.cmd-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var cmd = btn.dataset.cmd;
        if (cmd === 'clear') {
            cancelAnimation();
            cmdClear();
            inputLine.classList.remove('hidden');
        } else {
            toggleCommand(cmd);
        }
        input.focus();
    });
});

// ── Boot sequence ─────────────────────────────────────────

function boot() {
    var welcomeHtml = '<div class="line color-dim">Last login: ' + new Date().toDateString() + ' on ttys000</div>' +
        '<div class="line">&nbsp;</div>' +
        '<div class="line">Welcome! Click a command above or type below.</div>' +
        '<div class="line">&nbsp;</div>';

    appendOutput(welcomeHtml);
    scrollToBottom();
    input.focus();
}

boot();

// ── Floating background tech keywords ─────────────────────

var TECH_WORDS = [
    'AWS', 'Azure', 'Terraform', 'Spacelift', 'Ansible',
    'Kubernetes', 'Docker', 'Helm', 'EKS', 'AKS', 'Flux CD',
    'Teleport', 'Gatekeeper', 'FortiGate', 'Palo Alto',
    'Python', 'Bash', 'Lambda',
    'GitHub Actions', 'GitOps', 'CI/CD', 'CloudTrail',
    'OPA', 'IAM', 'VPC', 'S3', 'Okta', 'Slack API',
];

var FLOAT_COLORS = [
    '#7ee787',
    '#79c0ff',
    '#76e4f0',
    '#e3b341',
    '#d2a8ff',
    '#ffa198',
];

function spawnFloatingWord() {
    var word = TECH_WORDS[Math.floor(Math.random() * TECH_WORDS.length)];
    var color = FLOAT_COLORS[Math.floor(Math.random() * FLOAT_COLORS.length)];
    var el = document.createElement('span');
    el.className = 'floating-word';
    el.textContent = word;
    el.style.color = color;

    el.style.left = Math.random() * 90 + 5 + '%';
    el.style.top = Math.random() * 90 + 5 + '%';

    var dx = (Math.random() - 0.5) * 60;
    var dy = (Math.random() - 0.5) * 40;
    el.style.setProperty('--dx', dx + 'px');
    el.style.setProperty('--dy', dy + 'px');

    var duration = 4 + Math.random() * 4;
    el.style.animationDuration = duration + 's';

    document.body.appendChild(el);
    setTimeout(function() { el.remove(); }, duration * 1000);
}

function scheduleNext() {
    var delay = 1500 + Math.random() * 1500;
    setTimeout(function() {
        spawnFloatingWord();
        scheduleNext();
    }, delay);
}

for (var i = 0; i < 3; i++) {
    setTimeout(spawnFloatingWord, i * 600);
}
scheduleNext();
