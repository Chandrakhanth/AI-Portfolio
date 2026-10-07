class FriendlyTerminalAssistant {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.history = [];
    this.historyIndex = -1;
    this.nlpEngine = null;

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.printGreeting();

    if (typeof NLPEngine !== 'undefined' && typeof PORTFOLIO_DATA !== 'undefined') {
      this.nlpEngine = new NLPEngine();
      this.nlpEngine.initialize(PORTFOLIO_DATA);
    } else if (typeof window !== 'undefined' && window.NLPEngine && typeof PORTFOLIO_DATA !== 'undefined') {
      this.nlpEngine = new window.NLPEngine();
      this.nlpEngine.initialize(PORTFOLIO_DATA);
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="friendly-chat-window glass-card">
        <div class="chat-topbar">
          <div class="assistant-identity">
            <div class="bot-avatar"><img src="assets/ai-avatar.jpg" alt="Chandy AI" class="bot-avatar-img" /></div>
            <div>
              <div class="bot-name">Chandy's AI Portfolio Assistant</div>
              <div class="bot-status"><span class="pulse-dot"></span> Online • Powered by Vector Embeddings &amp; Semantic Retrieval</div>
            </div>
          </div>
          <div class="chat-actions">
            <button class="chat-clear-btn" id="chat-clear-btn" title="Clear conversation">Clear</button>
          </div>
        </div>

        <div class="chat-body" id="chat-output" role="log" aria-live="polite"></div>

        <div class="chat-input-row">
          <span class="chat-prompt">chandy@ai-assistant:~$</span>
          <input type="text" id="chat-input" class="chat-input" autocomplete="off" spellcheck="false" placeholder="Ask anything in human language (e.g. 'How strong is he in SQL and PySpark?')..." aria-label="Ask a question in natural language" />
        </div>

        <div class="chat-quick-suggestions">
          <span class="sugg-label">TRY ASKING IN HUMAN LANGUAGE:</span>
          <button class="sugg-chip" data-cmd="How strong is he in SQL and PySpark?">📊 SQL &amp; PySpark Strength</button>
          <button class="sugg-chip" data-cmd="Explain about his project">⚙️ Explain Project</button>
          <button class="sugg-chip" data-cmd="How about his execution in projects?">🚀 Project Execution</button>
          <button class="sugg-chip" data-cmd="What are his main key points?">⭐ Main Key Points</button>
          <button class="sugg-chip" data-cmd="Show me the description of professional experience about Systech Solutions">🏢 Systech Solutions</button>
          <button class="sugg-chip" data-cmd="Tell me about his full stack development role at SPB Corp">💻 SPB Corp Full Stack</button>
          <button class="sugg-chip" data-cmd="What certifications does Chandrakhanth hold?">🏆 Certifications (DP-700)</button>
          <button class="sugg-chip" data-cmd="How can I contact Chandrakhanth for hire?">📬 Contact &amp; Hire</button>
        </div>
      </div>
    `;

    this.output = this.container.querySelector('#chat-output');
    this.input = this.container.querySelector('#chat-input');
  }

  bindEvents() {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = this.input.value.trim();
        if (cmd) {
          this.execute(cmd);
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex] || '';
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      }
    });

    this.container.querySelectorAll('.sugg-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.dataset.cmd;
        this.input.value = cmd;
        this.execute(cmd);
        this.input.value = '';
      });
    });

    const clearBtn = this.container.querySelector('#chat-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clear());
    }
  }

  printGreeting() {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>Hi there! Welcome to Chandrakhanth's AI Assistant 👋</strong></p>
        <p>I understand natural human language queries! You don't need rigid terminal commands — simply ask in your own words</p>
      </div>
    `);
  }

  execute(rawCmd) {
    if (window.playSfx) window.playSfx('keystroke');

    const cmd = rawCmd.trim();
    if (!cmd) return;

    this.printHTML(`
      <div class="chat-bubble user-bubble">
        ${this.escapeHTML(cmd)}
      </div>
    `);

    setTimeout(() => {
      const { intent, meta } = this.detectIntent(cmd);

      switch (intent) {
        case 'sql_pyspark_strength':
          this.printSQLAndPySparkStrength(meta);
          break;
        case 'project_execution':
          this.printProjectExecution(meta);
          break;
        case 'key_points':
          this.printKeyPoints(meta);
          break;
        case 'projects':
          this.printProjectDetails(meta);
          break;
        case 'systech':
          this.printSystechDetails(meta);
          break;
        case 'spb':
          this.printSPBCorpDetails(meta);
          break;
        case 'iit':
          this.printIITMadrasDetails(meta);
          break;
        case 'experience':
          this.printJourney(meta);
          break;
        case 'certifications':
          this.printCertifications(meta);
          break;
        case 'skills':
          this.printSkills(meta);
          break;
        case 'architecture':
          this.showArchitecture(meta);
          break;
        case 'about':
          this.printAbout(meta);
          break;
        case 'education':
          this.printEducation(meta);
          break;
        case 'contact':
          this.printContact(meta);
          break;
        case 'greeting':
          this.printGreetingReply();
          break;
        case 'help':
          this.printHelp();
          break;
        case 'clear':
          this.clear();
          break;
        default:
          this.printOutOfScopeError(cmd, meta);
          break;
      }

      this.scrollToBottom();
      if (window.playSfx) window.playSfx('blip');
    }, 70);
  }

  detectIntent(text) {
    const clean = text.toLowerCase().trim();

    if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|sup|howdy)\b/i.test(clean)) {
      return { intent: 'greeting', meta: null };
    }
    if (/help|what\s*can\s*(you|i)\s*(do|ask)|menu|options|commands/i.test(clean)) {
      return { intent: 'help', meta: null };
    }
    if (clean === 'clear' || clean === 'cls') {
      return { intent: 'clear', meta: null };
    }

    if (this.nlpEngine) {
      const searchRes = this.nlpEngine.search(clean, 0.15);
      if (!searchRes.isOutOfScope && searchRes.topMatch) {
        return { intent: searchRes.topMatch.chunkId, meta: searchRes };
      }
      
      return { intent: 'out_of_scope', meta: searchRes };
    }

    if (/sql/i.test(clean) && /pyspark|spark/i.test(clean)) return { intent: 'sql_pyspark_strength', meta: null };
    if (/execution|delivery|sla/i.test(clean)) return { intent: 'project_execution', meta: null };
    if (/key\s*point|highlights|strengths|manifesto/i.test(clean)) return { intent: 'key_points', meta: null };
    if (/project/i.test(clean)) return { intent: 'projects', meta: null };
    if (/systech/i.test(clean)) return { intent: 'systech', meta: null };
    if (/spb/i.test(clean)) return { intent: 'spb', meta: null };
    if (/iit|madras/i.test(clean)) return { intent: 'iit', meta: null };
    if (/certif/i.test(clean)) return { intent: 'certifications', meta: null };
    if (/skill/i.test(clean)) return { intent: 'skills', meta: null };
    if (/architect|pipeline/i.test(clean)) return { intent: 'architecture', meta: null };
    if (/contact|email|hire/i.test(clean)) return { intent: 'contact', meta: null };

    return { intent: 'out_of_scope', meta: null };
  }

  renderNLPInspector(meta) {
    if (!meta || !meta.topMatch) return '';
    const sampleVec = meta.queryVectorSample && meta.queryVectorSample.length > 0 
      ? meta.queryVectorSample.map(n => n.toFixed(3)).join(', ') 
      : '0.000';

    return `
      <div class="nlp-inspect-wrap">
        <button type="button" class="nlp-badge-btn" onclick="this.nextElementSibling.classList.toggle('open')">
          <span>🧠 Vector Similarity Match: <strong>${meta.topMatch.score}%</strong></span>
          <span>(Click to inspect embedding)</span>
        </button>
        <div class="nlp-inspect-panel">
          <div class="nlp-inspect-row"><strong>1. Tokens Extracted:</strong> [${meta.tokens.map(t => `'${t}'`).join(', ')}]</div>
          <div class="nlp-inspect-row"><strong>2. Vector Dimensions:</strong> ${meta.vocabularySize}-D Semantic Embedding Space</div>
          <div class="nlp-inspect-row"><strong>3. Query Embedding Sample:</strong> [${sampleVec}, ...]</div>
          <div class="nlp-inspect-row"><strong>4. Cosine Similarity Formula:</strong> cos(θ) = (A · B) / (||A|| ||B||) = <strong>${meta.topMatch.rawScore.toFixed(4)}</strong></div>
          <div class="nlp-inspect-row"><strong>5. Retrieved Knowledge Document:</strong> <code>${meta.topMatch.chunkId}</code> ("${meta.topMatch.title}")</div>
        </div>
      </div>
    `;
  }

  printSQLAndPySparkStrength(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>⚡ Chandrakhanth's Strength in SQL &amp; PySpark:</strong></p>
        <p class="text-secondary text-sm">Chandrakhanth has advanced production engineering strength in both distributed data transformations (PySpark) and relational query optimization (SQL):</p>

        <div class="strength-card-chat mt-1">
          <div class="strength-header">
            <strong>🗄️ SQL Architecture &amp; Query Optimization</strong>
            <span class="strength-pct">96% Advanced</span>
          </div>
          <ul class="chat-list text-xs">
            <li><strong>MS SQL Server (93%):</strong> T-SQL expert, authoring complex stored procedures, multi-table indexing, and profiling execution plans (slashed API and batch load times by 40–45%).</li>
            <li><strong>Dimensional Modeling (92%):</strong> Star Schema and Snowflake Schema modeling with structured fact tables, slowly changing dimensions (SCD), and partitioned marts.</li>
            <li><strong>Complex Query Dialects:</strong> Advanced window functions (<code>ROW_NUMBER()</code>, <code>LEAD()</code>/<code>LAG()</code>, <code>RANK()</code>), recursive CTEs, and query optimization for high-concurrency workloads.</li>
            <li><strong>Cloud Warehouses:</strong> High-performance querying across Snowflake (92%) and Greenplum MPP (88%).</li>
          </ul>
        </div>

        <div class="strength-card-chat mt-1">
          <div class="strength-header">
            <strong>🔥 PySpark Distributed Data Processing</strong>
            <span class="strength-pct">92% Production</span>
          </div>
          <ul class="chat-list text-xs">
            <li><strong>Databricks Certified:</strong> Certified Data Engineer Associate with deep expertise in Databricks clusters, jobs, and Delta Lake lakehouse management.</li>
            <li><strong>Distributed Transformations:</strong> PySpark DataFrame APIs and Spark SQL for distributed cleansing, transformations, and aggregation across 100M+ daily records.</li>
            <li><strong>Source System Analysis (SSA):</strong> Built automated validation rules, schema enforcement, and deduplication routines handling multi-source feeds with 90% consistency.</li>
            <li><strong>Research &amp; Compute:</strong> Engineered distributed batch parsing and statistical modeling pipelines at IIT Madras and Systech Solutions.</li>
          </ul>
        </div>

        ${this.renderNLPInspector(meta)}

        <div class="journey-actions mt-1">
          <span class="text-xs text-muted">Related questions you can ask:</span>
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="How about his execution in projects?">🚀 Project Execution</button>
            <button class="sugg-chip click-to-ask" data-query="Explain about his project">⚙️ Explain His Project</button>
            <button class="sugg-chip click-to-ask" data-query="What are his main key points?">⭐ Main Key Points</button>
          </div>
        </div>
      </div>
    `);

    this.bindClickToAsk();
  }

  printProjectExecution(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>🚀 Chandrakhanth's Execution &amp; Delivery in Projects:</strong></p>
        <p class="text-secondary text-sm">Chandrakhanth emphasizes predictability, automation, and proactive monitoring over firefighting. Here is his execution record in production:</p>

        <div class="chat-stat-grid">
          <div class="chat-stat-item">
            <div class="chat-stat-val">90%</div>
            <div class="chat-stat-lbl">SLA Adherence Across 100+ DAGs</div>
          </div>
          <div class="chat-stat-item">
            <div class="chat-stat-val">65% Faster</div>
            <div class="chat-stat-lbl">Incident Triage via Log &amp; XCom Inspections</div>
          </div>
          <div class="chat-stat-item">
            <div class="chat-stat-val">40–45%</div>
            <div class="chat-stat-lbl">Query Acceleration via Index Profiling</div>
          </div>
          <div class="chat-stat-item">
            <div class="chat-stat-val">100M+</div>
            <div class="chat-stat-lbl">Daily Distributed Records Processed</div>
          </div>
        </div>

        <div class="keypoint-item mt-1">
          <strong>1. Workflow Orchestration (Apache Airflow):</strong>
          <p class="text-xs text-secondary mt-05">Primary owner of daily DAG executions at Systech Solutions. Authors custom operators and sensor logic with automated retry mechanisms to eliminate pipeline stalls.</p>
        </div>

        <div class="keypoint-item">
          <strong>2. Rapid Incident Triage:</strong>
          <p class="text-xs text-secondary mt-05">Proactively investigates failures by analyzing task metadata, execution logs, and XCom payloads, clearing bottlenecks before business SLA impact.</p>
        </div>

        <div class="keypoint-item">
          <strong>3. Rigorous SSA &amp; Data Integrity:</strong>
          <p class="text-xs text-secondary mt-05">Enforces Source System Analysis (SSA) and schema validations at the ingestion and silver layers, ensuring downstream executive BI reports are 100% dependable.</p>
        </div>

        <div class="keypoint-item">
          <strong>4. Full-Stack End-to-End Delivery:</strong>
          <p class="text-xs text-secondary mt-05">Bridges backend data engineering with front-end analytical interfaces (React, FastAPI, Power BI Direct Lake) for complete stakeholder value.</p>
        </div>

        ${this.renderNLPInspector(meta)}

        <div class="journey-actions mt-1">
          <span class="text-xs text-muted">Related questions you can ask:</span>
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="Explain about his project">⚙️ Explain His Project</button>
            <button class="sugg-chip click-to-ask" data-query="How strong is he in SQL and PySpark?">📊 SQL &amp; PySpark Strength</button>
            <button class="sugg-chip click-to-ask" data-query="What are his main key points?">⭐ Main Key Points</button>
          </div>
        </div>
      </div>
    `);

    this.bindClickToAsk();
  }

  printKeyPoints(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>⭐ Chandrakhanth's Main Key Points &amp; Core Highlights:</strong></p>
        <p class="text-secondary text-sm">Here is the executive summary of Chandrakhanth's profile, engineering philosophy, and capabilities:</p>

        <div class="keypoint-item">
          <strong>1. Cloud Lakehouse &amp; Multi-Certified Engineer:</strong>
          <p class="text-xs text-secondary mt-05">Certified in Microsoft Fabric Analytics Engineer (DP-700), Astronomer Apache Airflow DAG Authoring, and Databricks Associate.</p>
        </div>

        <div class="keypoint-item">
          <strong>2. Advanced Distributed Compute &amp; SQL:</strong>
          <p class="text-xs text-secondary mt-05">Proficient in PySpark, MS SQL Server (93%), Snowflake (92%), and Data Modeling (Star Schema), processing 100M+ daily records.</p>
        </div>

        <div class="keypoint-item">
          <strong>3. Proven Production Ownership:</strong>
          <p class="text-xs text-secondary mt-05">Primary owner of Apache Airflow orchestration at Systech Solutions, maintaining 90% SLA adherence across 24+ mission-critical retail DAGs.</p>
        </div>

        <div class="keypoint-item">
          <strong>4. Full-Stack Software Engineering Foundation:</strong>
          <p class="text-xs text-secondary mt-05">B.Tech in IT (Anna University) with hands-on full-stack engineering experience at SPB Corp and IIT Madras (Python/FastAPI, React, REST APIs, PostgreSQL).</p>
        </div>

        <div class="keypoint-item">
          <strong>5. Core Engineering Philosophy:</strong>
          <ul class="chat-list text-xs mt-05">
            <li><em>"Pipelines Should Be Peaceful &amp; Predictable"</em> — Clear DAG dependencies and proactive alerting eliminate 3 AM wake-ups.</li>
            <li><em>"Data Integrity Comes First"</em> — Speed without accuracy is making bad decisions faster.</li>
            <li><em>"Empathy for Downstream Consumers"</em> — Building dependable BI and data marts business partners can trust.</li>
          </ul>
        </div>

        ${this.renderNLPInspector(meta)}

        <div class="journey-actions mt-1">
          <span class="text-xs text-muted">Explore further:</span>
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="How strong is he in SQL and PySpark?">📊 SQL &amp; PySpark Strength</button>
            <button class="sugg-chip click-to-ask" data-query="How about his execution in projects?">🚀 Project Execution</button>
            <button class="sugg-chip click-to-ask" data-query="Explain about his project">⚙️ Explain His Project</button>
          </div>
        </div>
      </div>
    `);

    this.bindClickToAsk();
  }

  printProjectDetails(meta) {
    const proj = PORTFOLIO_DATA.projects[0];
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>⚙️ Flagship Project: ${proj.title}</strong></p>
        <p class="text-secondary text-sm mt-05">${proj.summary}</p>

        <div class="chat-stat-grid mt-1">
          ${proj.metrics.map(m => `
            <div class="chat-stat-item">
              <div class="chat-stat-val">${m.value}</div>
              <div class="chat-stat-lbl">${m.label}</div>
            </div>
          `).join('')}
        </div>

        <div class="keypoint-item mt-1">
          <strong class="text-amber">⚠️ Business &amp; Technical Problem:</strong>
          <p class="text-xs text-secondary mt-05">${proj.problem}</p>
        </div>

        <div class="keypoint-item mt-05">
          <strong class="text-emerald">💡 Engineering Solution:</strong>
          <p class="text-xs text-secondary mt-05">${proj.solution}</p>
        </div>

        <div class="keypoint-item mt-05">
          <strong>🏛️ End-to-End Pipeline Architecture:</strong>
          <ul class="chat-list text-xs mt-05">
            ${proj.architecture.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>

        <div class="company-skills-tags mt-1">
          <span class="text-xs text-muted">Tech Stack:</span>
          ${proj.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>

        ${this.renderNLPInspector(meta)}

        <div class="journey-actions mt-1">
          <span class="text-xs text-muted">Related questions:</span>
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="How about his execution in projects?">🚀 Project Execution</button>
            <button class="sugg-chip click-to-ask" data-query="How strong is he in SQL and PySpark?">📊 SQL &amp; PySpark Strength</button>
          </div>
        </div>
      </div>
    `);

    this.bindClickToAsk();
  }

  printSystechDetails(meta) {
    const exp = PORTFOLIO_DATA.experience.find(e => e.company.toLowerCase().includes('systech')) || PORTFOLIO_DATA.experience[0];
    this.printHTML(`
      <div class="chat-bubble bot-bubble company-detail-bubble">
        <div class="chat-company-header">
          <span class="company-icon">🏢</span>
          <div>
            <div class="company-title"><strong>${exp.company}</strong></div>
            <div class="company-role-meta"><span class="pill-year">${exp.period}</span> <strong>${exp.role}</strong> • 📍 ${exp.location}</div>
          </div>
        </div>
        <p class="company-highlight mt-1"><em>${exp.highlight}</em></p>
        <div class="company-bullets mt-1">
          <strong>Key Engineering Responsibilities &amp; Impact:</strong>
          <ul class="chat-list">
            ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
        <div class="company-skills-tags mt-1">
          <span class="text-xs text-muted">Core Stack:</span>
          ${exp.skills.map(s => `<span class="tech-tag">${s}</span>`).join('')}
        </div>
        ${this.renderNLPInspector(meta)}
      </div>
    `);
  }

  printSPBCorpDetails(meta) {
    const exp = PORTFOLIO_DATA.experience.find(e => e.company.toLowerCase().includes('spb')) || PORTFOLIO_DATA.experience[1];
    this.printHTML(`
      <div class="chat-bubble bot-bubble company-detail-bubble">
        <div class="chat-company-header">
          <span class="company-icon">💻</span>
          <div>
            <div class="company-title"><strong>${exp.company}</strong></div>
            <div class="company-role-meta"><span class="pill-year">${exp.period}</span> <strong>${exp.role}</strong> • 📍 ${exp.location}</div>
          </div>
        </div>
        <p class="company-highlight mt-1"><em>${exp.highlight}</em></p>
        <div class="company-bullets mt-1">
          <strong>Full-Stack Software Engineering Responsibilities &amp; Delivery:</strong>
          <ul class="chat-list">
            ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
        <div class="company-skills-tags mt-1">
          <span class="text-xs text-muted">Full-Stack Tech Stack:</span>
          ${exp.skills.map(s => `<span class="tech-tag">${s}</span>`).join('')}
        </div>
        ${this.renderNLPInspector(meta)}
      </div>
    `);
  }

  printIITMadrasDetails(meta) {
    const exp = PORTFOLIO_DATA.experience.find(e => e.company.toLowerCase().includes('iit')) || PORTFOLIO_DATA.experience[2];
    this.printHTML(`
      <div class="chat-bubble bot-bubble company-detail-bubble">
        <div class="chat-company-header">
          <span class="company-icon">🎓</span>
          <div>
            <div class="company-title"><strong>${exp.company}</strong></div>
            <div class="company-role-meta"><span class="pill-year">${exp.period}</span> <strong>${exp.role}</strong> • 📍 ${exp.location}</div>
          </div>
        </div>
        <p class="company-highlight mt-1"><em>${exp.highlight}</em></p>
        <div class="company-bullets mt-1">
          <strong>Full-Stack Research Engineering &amp; Computational Dashboards:</strong>
          <ul class="chat-list">
            ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
        <div class="company-skills-tags mt-1">
          <span class="text-xs text-muted">Core Stack:</span>
          ${exp.skills.map(s => `<span class="tech-tag">${s}</span>`).join('')}
        </div>
        ${this.renderNLPInspector(meta)}
      </div>
    `);
  }

  printJourney(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>💼 Chandrakhanth's Professional Experience:</strong></p>
        <div class="journey-chat-list mt-1">
          <div class="journey-chat-item">
            <span class="pill-year">06/2025 — PRESENT</span>
            <strong>Data Engineer</strong> at <em>Systech Solutions, Inc.</em>
            <div class="text-secondary text-xs mt-05">Data pipeline orchestration, Fabric (DP-700), Databricks, Snowflake &amp; Airflow.</div>
          </div>
          <div class="journey-chat-item">
            <span class="pill-year">10/2024 — 04/2025</span>
            <strong>Software Engineer</strong> at <em>SPB CORP LTD</em>
            <div class="text-secondary text-xs mt-05">Full-Stack web applications, FastAPI/Django, React, MS SQL Server &amp; REST APIs.</div>
          </div>
          <div class="journey-chat-item">
            <span class="pill-year">06/2024 — 08/2024</span>
            <strong>Software Engineer</strong> at <em>IIT Madras</em>
            <div class="text-secondary text-xs mt-05">Interactive research web dashboards, Flask/FastAPI, PostgreSQL &amp; computational models.</div>
          </div>
        </div>
        ${this.renderNLPInspector(meta)}
        <div class="journey-actions mt-1">
          <span class="text-xs text-muted">Inspect specific company:</span>
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="Show me the description of professional experience about Systech Solutions">🏢 Systech Deep Dive</button>
            <button class="sugg-chip click-to-ask" data-query="Tell me about his full stack development role at SPB Corp">💻 SPB Corp Role</button>
            <button class="sugg-chip click-to-ask" data-query="What did he do as a Software Engineer at IIT Madras?">🎓 IIT Madras Role</button>
          </div>
        </div>
      </div>
    `);

    this.bindClickToAsk();
  }

  printCertifications(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>🏆 Industry Certifications &amp; Credentials:</strong></p>
        <div class="cert-grid-chat mt-1">
          <div class="cert-chat-item">
            <span class="cert-icon" style="color: #0078d4;">🪟</span>
            <div>
              <strong>Microsoft Fabric Analytics Engineer (DP-700)</strong>
              <div class="text-secondary text-sm">Issued by <strong>Microsoft</strong> (2026) • DP-700 Certified</div>
            </div>
          </div>
          <div class="cert-chat-item">
            <span class="cert-icon" style="color: #0284c7;">🌬️</span>
            <div>
              <strong>Apache Airflow DAG Authoring</strong>
              <div class="text-secondary text-sm">Issued by <strong>Astronomer</strong> (2026) • Airflow Certified</div>
            </div>
          </div>
          <div class="cert-chat-item">
            <span class="cert-icon" style="color: #7c3aed;">⚡</span>
            <div>
              <strong>Apache Airflow Fundamentals</strong>
              <div class="text-secondary text-sm">Issued by <strong>Astronomer</strong> (2026) • Workflow Master</div>
            </div>
          </div>
          <div class="cert-chat-item">
            <span class="cert-icon" style="color: #ff3621;">🧱</span>
            <div>
              <strong>Databricks Data Engineer Associate</strong>
              <div class="text-secondary text-sm">Issued by <strong>Databricks</strong> (2026 – 2028) • Associate Certified</div>
            </div>
          </div>
          <div class="cert-chat-item">
            <span class="cert-icon" style="color: #8b5cf6;">🎓</span>
            <div>
              <strong>B.Tech in Information Technology</strong>
              <div class="text-secondary text-sm">C.Abdul Hakeem College (<strong>Anna University</strong>) • 2020 – 2024</div>
            </div>
          </div>
        </div>
        ${this.renderNLPInspector(meta)}
      </div>
    `);
  }

  printSkills(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>⚡ Core Technical Competencies &amp; Stack:</strong></p>
        <ul class="chat-list mt-1">
          <li><strong>Primary Skills &amp; Core Foundations:</strong> Python, SQL (Advanced &amp; T-SQL), PySpark, Data Modeling (Star/Snowflake Schema), Source System Analysis (SSA), DAX &amp; Power Query.</li>
          <li><strong>Familiar Tools &amp; Technologies:</strong> Snowflake, Databricks &amp; Delta Lake, Microsoft Fabric (DP-700 Certified), Apache Airflow (Astronomer Certified), Azure Data Factory (ADF), MS SQL Server, Greenplum Database, Power BI, Microsoft Azure, Git, Linux / Bash.</li>
        </ul>
        ${this.renderNLPInspector(meta)}
        <p class="text-xs text-muted mt-1"><em>Tip: You can also ask "How strong is he in SQL and PySpark?" for a deep dive!</em></p>
      </div>
    `);
  }

  showArchitecture(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble text-emerald">
        <p>🏛️ <strong>Modern Data Architecture Lifecycle:</strong></p>
        <p>Chandrakhanth engineers end-to-end platforms across 5 architectural tiers:</p>
        <ul class="chat-list mt-1">
          <li><strong>1. Ingestion:</strong> Multi-source transactional feeds via Python, REST APIs &amp; Azure Data Factory.</li>
          <li><strong>2. Distributed Processing:</strong> PySpark on Databricks clusters for deduplication, schema enforcement &amp; validation.</li>
          <li><strong>3. Medallion Lakehouse:</strong> Microsoft Fabric (DP-700) Delta Lake bronze, silver &amp; gold layers.</li>
          <li><strong>4. Cloud Warehouse:</strong> Snowflake &amp; MS SQL Server star schemas for sub-second analytical querying.</li>
          <li><strong>5. BI &amp; Direct Lake:</strong> Power BI semantic reporting and executive decision-making.</li>
        </ul>
        ${this.renderNLPInspector(meta)}
        <p class="mt-1"><a href="#architecture" class="chat-link">→ Jump to interactive Data Architecture Explorer</a></p>
      </div>
    `);

    const archSection = document.getElementById('architecture');
    if (archSection) {
      archSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  printAbout(meta) {
    const p = PORTFOLIO_DATA.profile;
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>${p.greeting}</strong></p>
        <p>${p.bio}</p>
        <div class="assistant-fact-list mt-1">
          <div>🏢 <strong>Current Role:</strong> Data Engineer at <em>${p.company}</em></div>
          <div>🎓 <strong>Education:</strong> B.Tech in Information Technology (2020–2024)</div>
          <div>🏆 <strong>Certifications:</strong> Microsoft Fabric DP-700, Astronomer Airflow DAG Authoring &amp; Databricks Associate</div>
          <div>📍 <strong>Location:</strong> ${p.location}</div>
        </div>
        ${this.renderNLPInspector(meta)}
      </div>
    `);
  }

  printEducation(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>🎓 Educational Background:</strong></p>
        <p><strong>Bachelor of Technology (B.Tech) in Information Technology</strong></p>
        <p class="text-secondary text-sm">Anna University (C.Abdul Hakeem College of Engineering &amp; Technology) • 2020 – 2024</p>
        <p class="mt-1">Core coursework included Distributed Systems, Database Management Systems (DBMS), Advanced SQL, Software Engineering, Algorithms &amp; Data Structures.</p>
        ${this.renderNLPInspector(meta)}
      </div>
    `);
  }

  printContact(meta) {
    const p = PORTFOLIO_DATA.profile;
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>📬 Let's Connect!</strong></p>
        <p>Chandrakhanth is open to high-impact Data Engineering, Lakehouse Architecture, and Full-Stack Engineering roles.</p>
        <div class="mt-1">
          <div>📧 Email: <a href="mailto:${p.email}" class="chat-link">${p.email}</a></div>
          <div>🔗 LinkedIn: <a href="${p.linkedin}" target="_blank" class="chat-link">linkedin.com/in/chandrakhanth</a></div>
          <div>⚡ GitHub: <a href="${p.github}" target="_blank" class="chat-link">github.com/chandrakhanth</a></div>
        </div>
        ${this.renderNLPInspector(meta)}
        <p class="mt-1"><a href="#contact" class="chat-link">→ Fill out the direct Contact Form below</a></p>
      </div>
    `);
  }

  printGreetingReply() {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p>Hello! 👋 I'm here and ready to help you explore Chandrakhanth's background.</p>
        <p class="mt-1">You can ask me questions like <em>"How strong is he in SQL and PySpark?"</em>, <em>"Explain about his project"</em>, or <em>"What are his main key points?"</em></p>
      </div>
    `);
  }

  printHelp() {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>💡 You can ask anything in natural human language, such as:</strong></p>
        <ul class="chat-list mt-1 text-sm">
          <li><em>"How strong is he in SQL and PySpark?"</em></li>
          <li><em>"Explain about his project"</em></li>
          <li><em>"How about his execution in projects?"</em></li>
          <li><em>"What are his main key points?"</em></li>
          <li><em>"Show me the description of professional experience about Systech Solutions"</em></li>
          <li><em>"Tell me about SPB Corp"</em> or <em>"What did he do at IIT Madras?"</em></li>
          <li><em>"What certifications does Chandrakhanth hold?"</em></li>
          <li><em>"How do I contact him?"</em></li>
        </ul>
      </div>
    `);
  }

  printOutOfScopeError(rawCmd, meta) {
    const topScoreStr = meta && meta.topMatch ? `(Top similarity: ${meta.topMatch.score}%, below 15% threshold)` : '';

    this.printHTML(`
      <div class="chat-bubble bot-bubble out-of-scope-error">
        <div class="error-header">
          <span class="error-badge">⚠️ OUT OF SCOPE QUERY [ERROR 404]</span>
        </div>
        <p class="error-message mt-05">
          The query <code class="error-query">"${this.escapeHTML(rawCmd)}"</code> is outside my verified portfolio knowledge base ${topScoreStr}.
        </p>
        <p class="error-desc text-secondary text-sm mt-05">
          I am Chandrakhanth's dedicated AI Portfolio Assistant. My knowledge engine is strictly restricted to Chandrakhanth's verified professional experience, skills, certifications, and projects.
        </p>
        <div class="error-allowed-box mt-1">
          <div class="text-xs font-semibold text-muted">TOPICS I CAN ANSWER:</div>
          <ul class="chat-list text-xs mt-05">
            <li><strong>SQL &amp; PySpark Strength:</strong> Advanced MS SQL Server, PySpark Distributed Compute, Delta Lake</li>
            <li><strong>Projects &amp; Execution:</strong> Flagship Enterprise Orchestration Platform, 90% SLA, 65% faster triage</li>
            <li><strong>Experience:</strong> Systech Solutions (Data Engineer), SPB Corp, IIT Madras</li>
            <li><strong>Certifications:</strong> Microsoft Fabric DP-700, Astronomer Airflow DAG Authoring, Databricks Associate</li>
          </ul>
        </div>

        ${this.renderNLPInspector(meta)}

        <div class="error-suggestions mt-1">
          <span class="text-xs text-muted">💡 Try asking in human language:</span>
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="How strong is he in SQL and PySpark?">📊 SQL &amp; PySpark Strength</button>
            <button class="sugg-chip click-to-ask" data-query="Explain about his project">⚙️ Explain Project</button>
            <button class="sugg-chip click-to-ask" data-query="How about his execution in projects?">🚀 Project Execution</button>
            <button class="sugg-chip click-to-ask" data-query="What are his main key points?">⭐ Main Key Points</button>
          </div>
        </div>
      </div>
    `);

    this.bindClickToAsk();
  }

  bindClickToAsk() {
    setTimeout(() => {
      this.output.querySelectorAll('.click-to-ask').forEach(btn => {
        btn.onclick = () => {
          const q = btn.dataset.query;
          this.input.value = q;
          this.execute(q);
          this.input.value = '';
        };
      });
    }, 50);
  }

  clear() {
    if (this.output) {
      this.output.innerHTML = '';
      this.printGreeting();
    }
  }

  printHTML(html) {
    if (!this.output) return;
    const div = document.createElement('div');
    div.className = 'chat-message-row';
    div.innerHTML = html;
    this.output.appendChild(div);
  }

  scrollToBottom() {
    if (this.output) {
      this.output.scrollTop = this.output.scrollHeight;
    }
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

window.initInteractiveTerminal = function (containerId = 'interactive-terminal-container') {
  return new FriendlyTerminalAssistant(containerId);
};
