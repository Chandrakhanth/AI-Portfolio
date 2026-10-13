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

    const data = (typeof PORTFOLIO_DATA !== 'undefined' ? PORTFOLIO_DATA : (typeof window !== 'undefined' ? window.PORTFOLIO_DATA : null));
    const EngineClass = (typeof NLPEngine !== 'undefined' ? NLPEngine : (typeof window !== 'undefined' ? window.NLPEngine : null));

    if (EngineClass && data) {
      this.nlpEngine = new EngineClass();
      this.nlpEngine.initialize(data);
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
              <div class="bot-status"><span class="pulse-dot"></span> Online</div>
            </div>
          </div>
          <div class="chat-actions">
            <button class="chat-clear-btn" id="chat-clear-btn" title="Clear conversation">Clear</button>
          </div>
        </div>

        <div class="chat-body" id="chat-output" role="log" aria-live="polite"></div>

        <div class="chat-input-row">
          <span class="chat-prompt">chandy@ai-assistant:~$</span>
          <input type="text" id="chat-input" class="chat-input" autocomplete="off" spellcheck="false" placeholder="Type Here " aria-label="Ask a question in natural language" />
        </div>

        <div class="chat-quick-suggestions">
          <span class="sugg-label">TRY ASKING IN HUMAN LANGUAGE:</span>
          <button class="sugg-chip" data-cmd="Tell me shortly about him">👤 Shortly About Him</button>
          <button class="sugg-chip" data-cmd="What is his total year of experience?">💼 Total Experience</button>
          <button class="sugg-chip" data-cmd="How strong is he in SQL and PySpark?">📊 SQL &amp; PySpark Strength</button>
          <button class="sugg-chip" data-cmd="Explain about his project">⚙️ Flagship Project</button>
          <button class="sugg-chip" data-cmd="What are his main key points?">⭐ Main Key Points</button>
          <button class="sugg-chip" data-cmd="Show me the description of professional experience about Systech Solutions">🏢 Systech Solutions</button>
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
        case 'about_short':
          this.printShortAbout(meta);
          break;
        case 'total_experience':
          this.printTotalExperience(meta);
          break;
        case 'about':
          this.printAbout(meta);
          break;
        case 'current_role':
          this.printCurrentRole(meta);
          break;
        case 'why_hire':
          this.printWhyHire(meta);
          break;
        case 'sql_pyspark_strength':
          this.printSQLAndPySparkStrength(meta);
          break;
        case 'pyspark':
          this.printPysparkDeepDive(meta);
          break;
        case 'sql':
          this.printSqlDeepDive(meta);
          break;
        case 'fabric':
          this.printFabricDeepDive(meta);
          break;
        case 'airflow':
          this.printAirflowDeepDive(meta);
          break;
        case 'snowflake':
          this.printSnowflakeDeepDive(meta);
          break;
        case 'databricks':
          this.printDatabricksDeepDive(meta);
          break;
        case 'python':
          this.printPythonDeepDive(meta);
          break;
        case 'fullstack':
          this.printFullStackDeepDive(meta);
          break;
        case 'docker':
          this.printDockerDeepDive(meta);
          break;
        case 'azure':
          this.printAzureDeepDive(meta);
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
        case 'education':
          this.printEducation(meta);
          break;
        case 'contact':
          this.printContact(meta);
          break;
        case 'location':
          this.printLocation(meta);
          break;
        case 'linkedin':
          this.printLinkedIn(meta);
          break;
        case 'github':
          this.printGitHub(meta);
          break;
        case 'greeting':
          this.printGreetingReply();
          break;
        case 'pleasantry':
          this.printPleasantryReply();
          break;
        case 'thanks':
          this.printThanksReply();
          break;
        case 'goodbye':
          this.printGoodbyeReply();
          break;
        case 'bot_identity':
          this.printBotIdentity();
          break;
        case 'help':
          this.printHelp();
          break;
        case 'clear':
          this.clear();
          break;
        case 'context_match':
          this.printContextMatch(meta);
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
    if (this.nlpEngine) {
      const searchRes = this.nlpEngine.search(text, 0.12);
      if (!searchRes.isOutOfScope && searchRes.intent) {
        return { intent: searchRes.intent, meta: searchRes };
      }
    }

    // Direct fallback rule matcher if engine was uninitialized
    const clean = text.toLowerCase().trim();
    if (
      /tell\s+me\s+(shortly|briefly|short|quick)|short\s+(summary|bio|overview)|who\s+is\s+(he|chandrakhanth)|tell\s+me\s+about\s+him/i.test(clean) ||
      /^about\s+him$/i.test(clean)
    ) {
      return { intent: 'about_short', meta: null };
    }
    if (
      /(total|overall|how\s+many|number\s+of)?\s*(year|years|yoe)\s+(of\s+)?experience/i.test(clean) ||
      /how\s+(much|long)\s+experience/i.test(clean) ||
      /experience\s+(in\s+years|duration|timeline|years)/i.test(clean)
    ) {
      return { intent: 'total_experience', meta: null };
    }
    if (/sql/i.test(clean) && /pyspark|spark/i.test(clean)) return { intent: 'sql_pyspark_strength', meta: null };
    if (/execution|delivery|sla/i.test(clean)) return { intent: 'project_execution', meta: null };
    if (/key\s*point|highlights|strengths|manifesto/i.test(clean)) return { intent: 'key_points', meta: null };
    if (/project/i.test(clean)) return { intent: 'projects', meta: null };
    if (/systech/i.test(clean)) return { intent: 'systech', meta: null };
    if (/spb/i.test(clean)) return { intent: 'spb', meta: null };
    if (/iit|madras/i.test(clean)) return { intent: 'iit', meta: null };
    if (/certif|dp-?700/i.test(clean)) return { intent: 'certifications', meta: null };
    if (/skills?|stack|technolog/i.test(clean)) return { intent: 'skills', meta: null };
    if (/architect|pipeline/i.test(clean)) return { intent: 'architecture', meta: null };
    if (/contact|email|hire/i.test(clean)) return { intent: 'contact', meta: null };
    if (/education|college|university|degree/i.test(clean)) return { intent: 'education', meta: null };
    if (/where\s+does\s+he\s+live|location|remote/i.test(clean)) return { intent: 'location', meta: null };
    if (/why\s+hire/i.test(clean)) return { intent: 'why_hire', meta: null };

    return { intent: 'out_of_scope', meta: null };
  }

  renderNLPInspector(meta) {
    return '';
  }

  // 1. Short Bio / About Him (Solves "tell me shortly about him")
  printShortAbout(meta) {
    const p = PORTFOLIO_DATA.profile;
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>⚡ Quick Snapshot: Chandrakhanth K (Chandy)</strong></p>
        <p class="text-secondary text-sm mt-05">
          <strong>${p.title}</strong> at <em>${p.company}</em> in Chennai, India with <strong>~2+ Years</strong> of production software and data engineering experience delivering high-throughput lakehouse platforms.
        </p>

        <div class="chat-stat-grid mt-1">
          <div class="chat-stat-item">
            <div class="chat-stat-val">2+ Years</div>
            <div class="chat-stat-lbl">Production Software &amp; Data Engineering</div>
          </div>
          <div class="chat-stat-item">
            <div class="chat-stat-val">DP-700</div>
            <div class="chat-stat-lbl">Microsoft Fabric Certified Analytics Eng</div>
          </div>
          <div class="chat-stat-item">
            <div class="chat-stat-val">90% SLA</div>
            <div class="chat-stat-lbl">Airflow Daily Orchestration (100+ DAGs)</div>
          </div>
          <div class="chat-stat-item">
            <div class="chat-stat-val">100M+</div>
            <div class="chat-stat-lbl">Daily Distributed Records Processed</div>
          </div>
        </div>

        <div class="keypoint-item mt-1">
          <strong>🎯 Core Technical Highlights:</strong>
          <ul class="chat-list text-xs mt-05">
            <li><strong>Cloud Lakehouses:</strong> Microsoft Fabric OneLake, Snowflake star schemas, and Databricks Delta Lake.</li>
            <li><strong>Distributed Compute &amp; SQL:</strong> Advanced PySpark DataFrame transformations and MS SQL Server query optimization (T-SQL, indexing, stored procedures).</li>
            <li><strong>Production Ownership:</strong> Lead owner of Apache Airflow retail pipelines, cutting incident triage times by 65%.</li>
            <li><strong>Full-Stack Foundation:</strong> B.Tech in IT (Anna University) with full-stack background (Python, FastAPI, React, RESTful APIs).</li>
          </ul>
        </div>

        ${this.renderNLPInspector(meta)}

        <div class="journey-actions mt-1">
          <span class="text-xs text-muted">Explore further:</span>
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="What is his total year of experience?">💼 Total Experience</button>
            <button class="sugg-chip click-to-ask" data-query="How strong is he in SQL and PySpark?">📊 SQL &amp; PySpark Strength</button>
            <button class="sugg-chip click-to-ask" data-query="Explain about his project">⚙️ Flagship Project</button>
            <button class="sugg-chip click-to-ask" data-query="How can I contact Chandrakhanth for hire?">📬 Contact &amp; Hire</button>
          </div>
        </div>
      </div>
    `);

    this.bindClickToAsk();
  }

  // 2. Total Experience (Solves "total year of experience")
  printTotalExperience(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>💼 Chandrakhanth's Total Experience: ~2+ Years</strong></p>
        <p class="text-secondary text-sm mt-05">
          Chandrakhanth has <strong>~2+ years</strong> of continuous, progressive engineering experience delivering production data platforms, workflow orchestration, and full-stack software applications:
        </p>

        <div class="chat-stat-grid mt-1">
          <div class="chat-stat-item">
            <div class="chat-stat-val">2+ Years</div>
            <div class="chat-stat-lbl">Total Professional Experience</div>
          </div>
          <div class="chat-stat-item">
            <div class="chat-stat-val">3 Roles</div>
            <div class="chat-stat-lbl">Systech Solutions • SPB Corp • IIT Madras</div>
          </div>
          <div class="chat-stat-item">
            <div class="chat-stat-val">100M+</div>
            <div class="chat-stat-lbl">Daily Distributed Records Handled</div>
          </div>
          <div class="chat-stat-item">
            <div class="chat-stat-val">90%</div>
            <div class="chat-stat-lbl">Production SLA Maintained</div>
          </div>
        </div>

        <div class="journey-chat-list mt-1">
          <div class="journey-chat-item">
            <span class="pill-year">06/2025 — PRESENT</span>
            <strong>Data Engineer</strong> at <em>Systech Solutions, Inc.</em> (Chennai, India)
            <div class="text-secondary text-xs mt-05">Primary owner of daily Apache Airflow DAG orchestration, Databricks PySpark distributed transformations, Microsoft Fabric (DP-700) Lakehouse, and Snowflake data marts with 90% SLA adherence.</div>
          </div>
          <div class="journey-chat-item">
            <span class="pill-year">10/2024 — 04/2025 (7 Mos)</span>
            <strong>Software Engineer</strong> at <em>SPB CORP LTD</em> (United Kingdom Remote)
            <div class="text-secondary text-xs mt-05">Engineered full-stack web applications, Python (FastAPI/Django) microservices, React UIs, and MS SQL Server query optimization (reducing response times by 45%).</div>
          </div>
          <div class="journey-chat-item">
            <span class="pill-year">06/2024 — 08/2024 (3 Mos)</span>
            <strong>Software Engineer</strong> at <em>IIT Madras</em> (Chennai, India)
            <div class="text-secondary text-xs mt-05">Developed interactive computational web dashboards, Python (Flask/FastAPI), PostgreSQL relational schemas, and distributed batch parsing routines.</div>
          </div>
          <div class="journey-chat-item">
            <span class="pill-year">2020 — 2024</span>
            <strong>B.Tech in Information Technology</strong> at <em>Anna University</em>
            <div class="text-secondary text-xs mt-05">Solid academic foundation in distributed systems, database management, and data structures.</div>
          </div>
        </div>

        ${this.renderNLPInspector(meta)}

        <div class="journey-actions mt-1">
          <span class="text-xs text-muted">Inspect specific company:</span>
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="Show me the description of professional experience about Systech Solutions">🏢 Systech Deep Dive</button>
            <button class="sugg-chip click-to-ask" data-query="Tell me about his full stack development role at SPB Corp">💻 SPB Corp Role</button>
            <button class="sugg-chip click-to-ask" data-query="What did he do as a Software Engineer at IIT Madras?">🎓 IIT Madras Role</button>
            <button class="sugg-chip click-to-ask" data-query="What certifications does Chandrakhanth hold?">🏆 Certifications</button>
          </div>
        </div>
      </div>
    `);

    this.bindClickToAsk();
  }

  // 3. Current Role
  printCurrentRole(meta) {
    const p = PORTFOLIO_DATA.profile;
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>🏢 Current Role: Data Engineer</strong></p>
        <p class="text-secondary text-sm mt-05">
          Chandrakhanth currently works as a <strong>Data Engineer</strong> at <em>${p.company}</em> in Chennai, India.
        </p>
        <ul class="chat-list text-xs mt-05">
          <li><strong>Workflow Orchestration:</strong> Lead supervisor of daily Apache Airflow DAG executions, maintaining a 90% SLA adherence across 24+ retail pipelines.</li>
          <li><strong>Lakehouse Engineering:</strong> Building Microsoft Fabric (DP-700 Certified) OneLake pipelines and Databricks PySpark transformation clusters.</li>
          <li><strong>Warehouse Marts:</strong> Designing and tuning dimensional star schemas across Snowflake and MS SQL Server.</li>
        </ul>
        <div class="journey-actions mt-1">
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="Show me the description of professional experience about Systech Solutions">🏢 Systech Full Details</button>
            <button class="sugg-chip click-to-ask" data-query="Explain about his project">⚙️ Flagship Project</button>
          </div>
        </div>
      </div>
    `);
    this.bindClickToAsk();
  }

  // 4. Why Hire
  printWhyHire(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>⭐ Why Hire Chandrakhanth K?</strong></p>
        <p class="text-secondary text-sm mt-05">Here is what sets Chandrakhanth apart as an exceptional Data Engineering candidate:</p>
        <ul class="chat-list text-xs mt-05">
          <li><strong>Triple-Certified Production Rigor:</strong> Certified in Microsoft Fabric (DP-700), Astronomer Airflow DAG Authoring, and Databricks Data Engineer Associate.</li>
          <li><strong>Proven SLA Ownership:</strong> Successfully manages 100+ daily production DAG runs with a 90% SLA adherence record, reducing incident triage times by 65%.</li>
          <li><strong>Deep SQL &amp; PySpark Strength:</strong> Fluent in both relational query profiling (T-SQL, stored procedures, indexing) and large-scale distributed compute handling 100M+ daily records.</li>
          <li><strong>Full-Stack Software Engineering Foundation:</strong> Brings rare full-stack versatility (React, FastAPI, Docker, REST APIs) allowing him to bridge data pipelines with business applications.</li>
        </ul>
        <div class="journey-actions mt-1">
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="How can I contact Chandrakhanth for hire?">📬 Contact For Interview</button>
            <button class="sugg-chip click-to-ask" data-query="What is his total year of experience?">💼 Total Experience</button>
          </div>
        </div>
      </div>
    `);
    this.bindClickToAsk();
  }

  // 5. Tech Deep Dives
  printPysparkDeepDive(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>🔥 PySpark &amp; Distributed Processing Expertise:</strong></p>
        <p class="text-secondary text-sm mt-05">Certified Databricks Associate with extensive production experience running distributed Spark compute:</p>
        <ul class="chat-list text-xs mt-05">
          <li><strong>Scale:</strong> Processes and cleanses 100M+ daily distributed records across retail POS and inventory feeds.</li>
          <li><strong>DataFrame APIs &amp; Spark SQL:</strong> Authors optimized transformations, deduplication algorithms, and schema validation checks.</li>
          <li><strong>Delta Lake:</strong> Manages ACID transactions, time-travel querying, and Bronze-to-Silver curation in Databricks and Microsoft Fabric.</li>
        </ul>
        <div class="journey-actions mt-1">
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="How strong is he in SQL and PySpark?">📊 SQL &amp; PySpark Strength</button>
            <button class="sugg-chip click-to-ask" data-query="Explain about his project">⚙️ Flagship Project</button>
          </div>
        </div>
      </div>
    `);
    this.bindClickToAsk();
  }

  printSqlDeepDive(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>🗄️ MS SQL Server &amp; Relational Engineering:</strong></p>
        <p class="text-secondary text-sm mt-05">Chandrakhanth has advanced proficiency (93%) in MS SQL Server and analytical SQL dialects:</p>
        <ul class="chat-list text-xs mt-05">
          <li><strong>T-SQL Mastery:</strong> Authored high-complexity stored procedures, recursive CTEs, and window functions (<code>ROW_NUMBER()</code>, <code>LEAD()</code>/<code>LAG()</code>, <code>RANK()</code>).</li>
          <li><strong>Performance Profiling:</strong> Analyzed execution plans, missing index recommendations, and lock contention to accelerate batch cycles and API response times by 40–45%.</li>
          <li><strong>Dimensional Modeling:</strong> Designed production Star Schema and Snowflake Schema fact and dimension tables with slowly changing dimensions (SCD).</li>
        </ul>
        <div class="journey-actions mt-1">
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="How strong is he in SQL and PySpark?">📊 SQL &amp; PySpark Strength</button>
            <button class="sugg-chip click-to-ask" data-query="Show me the description of professional experience about Systech Solutions">🏢 Systech Role</button>
          </div>
        </div>
      </div>
    `);
    this.bindClickToAsk();
  }

  printFabricDeepDive(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>⚡ Microsoft Fabric Experience (DP-700 Certified):</strong></p>
        <p class="text-secondary text-sm mt-05">Officially certified <strong>Microsoft Fabric Analytics Engineer (DP-700)</strong> (2026):</p>
        <ul class="chat-list text-xs mt-05">
          <li><strong>OneLake &amp; Lakehouse:</strong> Built end-to-end lakehouses using Fabric Spark and Delta Lake tables.</li>
          <li><strong>Direct Lake Mode:</strong> Connected semantic models directly to OneLake Delta tables for instant Power BI reporting without import refreshes.</li>
          <li><strong>Data Factory in Fabric:</strong> Scheduled multi-source ingestion pipelines across disparate retail feeds.</li>
        </ul>
        <div class="journey-actions mt-1">
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="What certifications does Chandrakhanth hold?">🏆 Certifications</button>
            <button class="sugg-chip click-to-ask" data-query="Explain about his project">⚙️ Flagship Project</button>
          </div>
        </div>
      </div>
    `);
    this.bindClickToAsk();
  }

  printAirflowDeepDive(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>🌬️ Apache Airflow Orchestration Expertise:</strong></p>
        <p class="text-secondary text-sm mt-05">Astronomer Certified in <strong>DAG Authoring</strong> and <strong>Airflow Fundamentals</strong>:</p>
        <ul class="chat-list text-xs mt-05">
          <li><strong>Production Scale:</strong> Supervises 100+ daily production runs across 24+ retail DAGs at Systech Solutions.</li>
          <li><strong>Custom Architecture:</strong> Authors custom Python operators, sensors, dynamic task dependencies, and automated retry logic.</li>
          <li><strong>SLA &amp; Triage:</strong> Achieved 90% SLA adherence and 65% faster incident triage by inspecting XComs, execution logs, and metadata.</li>
        </ul>
        <div class="journey-actions mt-1">
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="How about his execution in projects?">🚀 Project Execution</button>
            <button class="sugg-chip click-to-ask" data-query="Show me the description of professional experience about Systech Solutions">🏢 Systech Role</button>
          </div>
        </div>
      </div>
    `);
    this.bindClickToAsk();
  }

  printSnowflakeDeepDive(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>❄️ Snowflake Cloud Data Warehouse Expertise:</strong></p>
        <p class="text-secondary text-sm mt-05">Proficient in Snowflake data modeling and virtual warehouse query management (92%):</p>
        <ul class="chat-list text-xs mt-05">
          <li><strong>Warehouse Architecture:</strong> Configured virtual warehouses, clustering keys, and SnowSQL scripts.</li>
          <li><strong>Data Marts:</strong> Curated high-performance analytical star schemas for executive retail reporting.</li>
          <li><strong>Features:</strong> Leveraged Time Travel, Zero-Copy Cloning, and partitioned staging zones.</li>
        </ul>
      </div>
    `);
  }

  printDatabricksDeepDive(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>🧱 Databricks &amp; Delta Lake Expertise:</strong></p>
        <p class="text-secondary text-sm mt-05">Certified <strong>Databricks Data Engineer Associate</strong> (2026–2028):</p>
        <ul class="chat-list text-xs mt-05">
          <li><strong>Cluster &amp; Job Management:</strong> Configured automated compute jobs and optimized Spark execution memory.</li>
          <li><strong>Delta Lake:</strong> Implemented schema enforcement, schema evolution, and ACID compliance across Bronze and Silver layers.</li>
        </ul>
      </div>
    `);
  }

  printPythonDeepDive(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>🐍 Python &amp; Backend Engineering:</strong></p>
        <p class="text-secondary text-sm mt-05">Proficient in Python for both high-throughput data engineering and web backend architectures:</p>
        <ul class="chat-list text-xs mt-05">
          <li><strong>Data Engineering:</strong> PySpark DataFrame scripts, Pandas ETL routines, automated data validation, and REST API ingestors.</li>
          <li><strong>Web Frameworks:</strong> Built RESTful microservices and asynchronous backend APIs using FastAPI, Django, and Flask at SPB Corp and IIT Madras.</li>
        </ul>
      </div>
    `);
  }

  printFullStackDeepDive(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>💻 Full-Stack Web Development Foundation:</strong></p>
        <p class="text-secondary text-sm mt-05">Chandrakhanth brings hands-on full-stack development experience from SPB Corp and IIT Madras:</p>
        <ul class="chat-list text-xs mt-05">
          <li><strong>Frontend:</strong> React, JavaScript, HTML5, CSS3, dynamic data-binding, and client-side state management.</li>
          <li><strong>Backend:</strong> Python (FastAPI/Django/Flask), RESTful APIs, JSON serialization, and Docker containerization.</li>
          <li><strong>Databases:</strong> MS SQL Server and PostgreSQL relational schema modeling.</li>
        </ul>
      </div>
    `);
  }

  printDockerDeepDive(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>🐳 Docker &amp; Containerization:</strong></p>
        <p class="text-secondary text-sm mt-05">Hands-on experience with Docker for reproducible local development and service isolation:</p>
        <ul class="chat-list text-xs mt-05">
          <li>Containerized local full-stack development environments at SPB CORP LTD.</li>
          <li>Automated build testing workflows and streamlined deployment consistency with CI/CD scripts.</li>
        </ul>
      </div>
    `);
  }

  printAzureDeepDive(meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>☁️ Microsoft Azure &amp; Azure Data Factory (ADF):</strong></p>
        <p class="text-secondary text-sm mt-05">Advanced proficiency (90%) across Microsoft Azure cloud data services:</p>
        <ul class="chat-list text-xs mt-05">
          <li><strong>Azure Data Factory (ADF):</strong> Built 12+ scheduled copy-data pipelines with tumbling triggers and linked services.</li>
          <li><strong>Azure Storage:</strong> ADLS Gen2 hierarchical storage, Azure Blob stores, and Azure Key Vault credential management.</li>
        </ul>
      </div>
    `);
  }

  printLocation(meta) {
    const p = PORTFOLIO_DATA.profile;
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>📍 Location &amp; Work Preferences:</strong></p>
        <p class="mt-05">Chandrakhanth is based in <strong>${p.location}</strong>.</p>
        <p class="text-secondary text-sm mt-05">He is open to high-impact <strong>Full-Time, Remote, Hybrid, or On-site</strong> Data Engineering opportunities.</p>
        <div class="journey-actions mt-1">
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="How can I contact Chandrakhanth for hire?">📬 Contact &amp; Connect</button>
          </div>
        </div>
      </div>
    `);
    this.bindClickToAsk();
  }

  printLinkedIn(meta) {
    const p = PORTFOLIO_DATA.profile;
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>🔗 LinkedIn Profile:</strong></p>
        <p class="mt-05">Connect with Chandrakhanth on LinkedIn: <a href="${p.linkedin}" target="_blank" class="chat-link">${p.linkedin}</a></p>
      </div>
    `);
  }

  printGitHub(meta) {
    const p = PORTFOLIO_DATA.profile;
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>⚡ GitHub Profile:</strong></p>
        <p class="mt-05">Explore his open-source code and project repositories: <a href="${p.github}" target="_blank" class="chat-link">${p.github}</a></p>
      </div>
    `);
  }

  printPleasantryReply() {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p>I'm doing fantastic, thank you for asking! 😊</p>
        <p class="mt-05">I'm here and ready to help you explore Chandrakhanth's data engineering experience, projects, or certifications. What would you like to know?</p>
      </div>
    `);
  }

  printThanksReply() {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p>You're very welcome! Glad I could help. 🙌</p>
        <p class="mt-05">Feel free to ask any other questions about Chandrakhanth's background, or reach out to him directly to connect!</p>
      </div>
    `);
  }

  printGoodbyeReply() {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p>Goodbye! Thank you for visiting Chandrakhanth's portfolio 👋</p>
        <p class="mt-05">Have a wonderful day ahead!</p>
      </div>
    `);
  }

  printBotIdentity() {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>🤖 About Me:</strong></p>
        <p class="mt-05">I am Chandrakhanth's interactive <strong>AI Portfolio Assistant</strong>! I run locally in your browser using natural language intent processing and vector embeddings.</p>
        <p class="text-secondary text-sm mt-05">My goal is to help recruiters, hiring managers, and engineers seamlessly explore Chandrakhanth's background, technical stack, certifications, and project deliveries.</p>
      </div>
    `);
  }

  printContextMatch(meta) {
    const entity = meta && meta.contextEntity ? meta.contextEntity : null;
    if (!entity) {
      this.printSkills(meta);
      return;
    }

    if (entity.type === 'skill' || entity.type === 'skill_tag') {
      this.printHTML(`
        <div class="chat-bubble bot-bubble">
          <p><strong>⚡ Technical Skill: ${this.escapeHTML(entity.title)}</strong></p>
          <div class="strength-card-chat mt-05">
            <div class="strength-header">
              <strong>${this.escapeHTML(entity.category || 'Skill')}</strong>
              <span class="strength-pct">${entity.level || 85}% Proficiency</span>
            </div>
            ${entity.tags && entity.tags.length ? `
              <div class="company-skills-tags mt-05">
                <span class="text-xs text-muted">Related Tags:</span>
                ${entity.tags.map(t => `<span class="tech-tag">${this.escapeHTML(t)}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          <p class="text-xs text-secondary mt-05">Chandrakhanth uses ${this.escapeHTML(entity.title)} in production data engineering pipelines and full-stack software development.</p>
          <div class="journey-actions mt-1">
            <div class="error-chip-row mt-05">
              <button class="sugg-chip click-to-ask" data-query="How strong is he in SQL and PySpark?">📊 SQL &amp; PySpark Strength</button>
              <button class="sugg-chip click-to-ask" data-query="What are his skills?">⚡ All Skills</button>
            </div>
          </div>
        </div>
      `);
    } else if (entity.type === 'experience_fact') {
      this.printHTML(`
        <div class="chat-bubble bot-bubble company-detail-bubble">
          <div class="chat-company-header">
            <span class="company-icon">🏢</span>
            <div>
              <div class="company-title"><strong>${this.escapeHTML(entity.company)}</strong></div>
              <div class="company-role-meta"><span class="pill-year">${this.escapeHTML(entity.period)}</span> <strong>${this.escapeHTML(entity.role)}</strong></div>
            </div>
          </div>
          <p class="mt-1 text-sm"><em>"${this.escapeHTML(entity.snippet)}"</em></p>
          <div class="journey-actions mt-1">
            <div class="error-chip-row mt-05">
              <button class="sugg-chip click-to-ask" data-query="What is his total year of experience?">💼 Total Experience</button>
            </div>
          </div>
        </div>
      `);
    } else {
      this.printSkills(meta);
    }
    this.bindClickToAsk();
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
            <button class="sugg-chip click-to-ask" data-query="What is his total year of experience?">💼 Total Experience</button>
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
            <button class="sugg-chip click-to-ask" data-query="What is his total year of experience?">💼 Total Experience</button>
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
            <button class="sugg-chip click-to-ask" data-query="What is his total year of experience?">💼 Total Experience</button>
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
          <li><strong>Familiar Tools &amp; Technologies:</strong> Snowflake, Databricks &amp; Delta Lake, Microsoft Fabric (DP-700 Certified), Apache Airflow (Astronomer Certified), Azure Data Factory (ADF), MS SQL Server, Greenplum Database, Power BI, Microsoft Azure, Docker, Git, Linux / Bash.</li>
        </ul>
        ${this.renderNLPInspector(meta)}
        <div class="journey-actions mt-1">
          <span class="text-xs text-muted">Deep dive into specific skills:</span>
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="How strong is he in SQL and PySpark?">📊 SQL &amp; PySpark Strength</button>
            <button class="sugg-chip click-to-ask" data-query="What is his experience in Microsoft Fabric?">⚡ Microsoft Fabric (DP-700)</button>
            <button class="sugg-chip click-to-ask" data-query="How does he use Apache Airflow?">🌬️ Apache Airflow</button>
          </div>
        </div>
      </div>
    `);
    this.bindClickToAsk();
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
          <div>💼 <strong>Total Experience:</strong> ${p.experienceYears || '2+ Years'} (Systech Solutions, SPB Corp, IIT Madras)</div>
          <div>🎓 <strong>Education:</strong> B.Tech in Information Technology (Anna University, 2020–2024)</div>
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
          <div>📍 Location: ${p.location}</div>
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
        <p class="mt-1">You can ask me questions like <em>"Tell me shortly about him"</em>, <em>"What is his total year of experience?"</em>, or <em>"How strong is he in SQL and PySpark?"</em></p>
      </div>
    `);
  }

  printHelp() {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>💡 You can ask anything in natural human language, such as:</strong></p>
        <ul class="chat-list mt-1 text-sm">
          <li><em>"Tell me shortly about him"</em></li>
          <li><em>"What is his total year of experience?"</em></li>
          <li><em>"How strong is he in SQL and PySpark?"</em></li>
          <li><em>"Explain about his flagship project"</em></li>
          <li><em>"How about his execution in projects and SLA?"</em></li>
          <li><em>"What are his main key points?"</em></li>
          <li><em>"Show me the description of professional experience about Systech Solutions"</em></li>
          <li><em>"Tell me about SPB Corp"</em> or <em>"What did he do at IIT Madras?"</em></li>
          <li><em>"What certifications does Chandrakhanth hold?"</em></li>
          <li><em>"How can I contact him for hire?"</em></li>
        </ul>
      </div>
    `);
  }

  printOutOfScopeError(rawCmd, meta) {
    this.printHTML(`
      <div class="chat-bubble bot-bubble">
        <p><strong>👋 I'm focused on Chandrakhanth's Engineering Background &amp; Portfolio!</strong></p>
        <p class="text-secondary text-sm mt-05">
          I'm dedicated to helping you explore Chandrakhanth's verified experience, data architecture, certifications, and technical stack.
        </p>
        <div class="error-suggestions mt-1">
          <span class="text-xs text-muted">💡 Try asking one of these popular questions:</span>
          <div class="error-chip-row mt-05">
            <button class="sugg-chip click-to-ask" data-query="Tell me shortly about him">👤 Shortly About Him</button>
            <button class="sugg-chip click-to-ask" data-query="What is his total year of experience?">💼 Total Experience (2+ Yrs)</button>
            <button class="sugg-chip click-to-ask" data-query="How strong is he in SQL and PySpark?">📊 SQL &amp; PySpark Strength</button>
            <button class="sugg-chip click-to-ask" data-query="Explain about his project">⚙️ Flagship Project</button>
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
    return String(str).replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

if (typeof window !== 'undefined') {
  window.initInteractiveTerminal = function (containerId = 'interactive-terminal-container') {
    return new FriendlyTerminalAssistant(containerId);
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FriendlyTerminalAssistant;
}
