class DataArchitectureExplorer {
  constructor(containerId = 'architecture-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.selectedStageIndex = 1; 

    this.stages = [
      {
        id: "ingest",
        label: "Source & Ingestion",
        category: "EXTRACT & INGEST",
        tech: "SQL Server • Azure Blob • REST APIs",
        throughput: "12.4M records/hr",
        latency: "< 2 mins",
        icon: "📥",
        color: "#0284c7",
        summary: "High-throughput extraction and change data capture (CDC) from enterprise relational systems and external partner feeds.",
        details: [
          "Batch & Micro-batch ingestion pipelines loading raw JSON, CSV, and Parquet feeds into Azure Data Lake.",
          "Automated schema inference and landing zone quarantine for corrupt payloads.",
          "Secure credential vaulting with Azure Key Vault and parameterized connection pools."
        ],
        codeSnippet: `# Ingestion Config (Python / Azure SDK)
source_conn = get_secure_connection("SQL_PROD_RETAIL")
cdc_records = source_conn.extract_cdc_stream(
    table="sales_transactions",
    watermark="2026-09-21T00:00:00Z"
)`
      },
      {
        id: "transform",
        label: "Distributed Processing",
        category: "CLEANSE & MODEL",
        tech: "PySpark • Databricks • Python",
        throughput: "45,000 rec/sec",
        latency: "< 4 mins",
        icon: "⚡",
        color: "#ff3621",
        summary: "Distributed PySpark processing on Databricks clusters performing Source System Analysis (SSA), deduplication, and standardization.",
        details: [
          "Elimination of multi-source duplicates using robust composite hashing and window functions.",
          "Currency harmonization, timezone UTC realignment, and standardized customer key synthesis.",
          "Optimized shuffle partitions and broadcast joins reducing transformation runtimes by 42%."
        ],
        codeSnippet: `# PySpark Cleanse & Deduplication (Databricks)
df_clean = (df_raw
    .filter(col("transaction_id").isNotNull())
    .withColumn("standard_utc_ts", to_utc_timestamp("local_time", col("store_tz")))
    .dropDuplicates(["transaction_id", "store_id"])
)`
      },
      {
        id: "lakehouse",
        label: "Fabric Lakehouse",
        category: "ONE LAKE & DELTA",
        tech: "Microsoft Fabric (DP-700) • Delta Lake",
        throughput: "Bronze -> Silver -> Gold",
        latency: "ACID Guaranteed",
        icon: "🪟",
        color: "#0078d4",
        summary: "Unified Medallion Lakehouse architecture leveraging Microsoft Fabric OneLake and Delta Parquet storage format.",
        details: [
          "Bronze layer: Immutable raw ingestion history with partition pruning.",
          "Silver layer: Curated, cleansed, and conformed enterprise datasets.",
          "Gold layer: Aggregated dimensional models ready for high-performance direct querying."
        ],
        codeSnippet: `-- Delta Lake Medallion Merge (Fabric SQL)
MERGE INTO gold.fact_sales AS target
USING silver.stg_sales AS source
ON target.sale_id = source.sale_id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *`
      },
      {
        id: "warehouse",
        label: "Cloud Data Warehouse",
        category: "STAR SCHEMA & MARTS",
        tech: "Snowflake • MS SQL Server",
        throughput: "Sub-second queries",
        latency: "Real-time sync",
        icon: "❄️",
        color: "#38bdf8",
        summary: "Enterprise-grade cloud data warehousing with conformed star schemas, SCD Type-2 dimensions, and clustered fact tables.",
        details: [
          "Optimized warehouse sizing with auto-suspend and clustering keys for maximum cost efficiency.",
          "Role-based access control (RBAC) and row-level security for sensitive customer dimensions.",
          "Daily automated reconciliation checks ensuring zero record loss across source-to-target."
        ],
        codeSnippet: `-- Snowflake Star Schema Consumption
SELECT d.fiscal_quarter, p.category, SUM(f.net_revenue) AS total_revenue
FROM RETAIL_DW.MART.FACT_DAILY_SALES f
JOIN RETAIL_DW.MART.DIM_DATE d ON f.date_key = d.date_key
JOIN RETAIL_DW.MART.DIM_PRODUCT p ON f.product_key = p.product_key
GROUP BY 1, 2`
      },
      {
        id: "bi_analytics",
        label: "Semantic Layer & BI",
        category: "ANALYTICS & SERVING",
        tech: "Power BI • Direct Lake • DAX",
        throughput: "50+ Active Stakeholders",
        latency: "Instant Refresh",
        icon: "📊",
        color: "#10b981",
        summary: "Direct Lake semantic models powering responsive executive KPI dashboards, inventory forecasting, and business decisions.",
        details: [
          "High-performance DAX measure calculations for year-over-year revenue, margin analysis, and inventory velocity.",
          "Direct Lake mode on Fabric bypassing traditional dataset import overhead.",
          "Automated alert thresholds for supply chain variances and pipeline SLA status."
        ],
        codeSnippet: `// DAX Measure (Power BI Semantic Model)
YoY_Revenue_Growth = 
VAR CurrentRevenue = [Total_Net_Revenue]
VAR PriorRevenue = CALCULATE([Total_Net_Revenue], SAMEPERIODLASTYEAR('Dim_Date'[FullDate]))
RETURN DIVIDE(CurrentRevenue - PriorRevenue, PriorRevenue, 0)`
      }
    ];

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="arch-explorer-card glass-card">
        <div class="arch-top-bar">
          <div class="arch-title-wrap">
            <span class="arch-badge"><span class="pulse-dot"></span> End-to-End Platform</span>
            <h3 class="arch-heading">Modern Enterprise Data Architecture</h3>
            <p class="arch-sub">From raw ingestion to distributed PySpark transformations, Fabric Lakehouse, and Snowflake serving.</p>
          </div>

          <div class="arch-kpi-cluster">
            <div class="arch-kpi-pill">
              <span class="kpi-label">DAILY VOLUME</span>
              <span class="kpi-value text-sky">100M+ Rows</span>
            </div>
            <div class="arch-kpi-pill">
              <span class="kpi-label">PIPELINE SLA</span>
              <span class="kpi-value text-emerald">90% Adherence</span>
            </div>
            <div class="arch-kpi-pill">
              <span class="kpi-label">PROCESSING ENGINE</span>
              <span class="kpi-value text-cyan">PySpark &amp; Fabric</span>
            </div>
          </div>
        </div>

        <div class="arch-flow-wrapper">
          <div class="arch-nodes-grid" id="arch-nodes-list" role="tablist">
            ${this.renderNodesHTML()}
          </div>
        </div>

        <div class="arch-inspector" id="arch-inspector">
          ${this.renderInspectorHTML()}
        </div>
      </div>
    `;
  }

  renderNodesHTML() {
    return this.stages.map((stage, idx) => {
      const isSelected = idx === this.selectedStageIndex;
      return `
        <div class="arch-node-card ${isSelected ? 'active' : ''}" 
             data-stage-idx="${idx}" 
             role="tab" 
             aria-selected="${isSelected}"
             tabindex="0">
          <div class="node-step-pill">0${idx + 1}</div>
          <div class="node-icon" style="color: ${stage.color};">${stage.icon}</div>
          <div class="node-info">
            <span class="node-category">${stage.category}</span>
            <h4 class="node-label">${stage.label}</h4>
            <span class="node-tech">${stage.tech}</span>
          </div>
          <div class="node-connector" aria-hidden="true"></div>
        </div>
      `;
    }).join('');
  }

  renderInspectorHTML() {
    const s = this.stages[this.selectedStageIndex] || this.stages[0];
    return `
      <div class="inspector-grid">
        <div class="inspector-specs">
          <div class="spec-header">
            <div class="spec-category">${s.category}</div>
            <h4 class="spec-title">${s.icon} ${s.label}</h4>
            <p class="spec-summary">${s.summary}</p>
          </div>

          <div class="spec-metrics-row">
            <div class="metric-box">
              <span class="metric-label">THROUGHPUT</span>
              <span class="metric-val text-sky">${s.throughput}</span>
            </div>
            <div class="metric-box">
              <span class="metric-label">LATENCY</span>
              <span class="metric-val text-emerald">${s.latency}</span>
            </div>
            <div class="metric-box">
              <span class="metric-label">CORE STACK</span>
              <span class="metric-val text-indigo">${s.tech}</span>
            </div>
          </div>

          <div class="spec-bullets">
            <span class="bullet-heading">Engineering Highlights &amp; Standards:</span>
            <ul>
              ${s.details.map(d => `<li><span class="bullet-check">✓</span> ${d}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="inspector-code">
          <div class="code-header">
            <span class="code-title">Production Logic Snapshot</span>
            <span class="code-lang">Data Engineering Spec</span>
          </div>
          <pre class="code-block"><code>${this.escapeHTML(s.codeSnippet)}</code></pre>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const nodeCards = this.container.querySelectorAll('.arch-node-card');
    nodeCards.forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-stage-idx'), 10);
        this.selectStage(idx);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = parseInt(card.getAttribute('data-stage-idx'), 10);
          this.selectStage(idx);
        }
      });
    });
  }

  selectStage(idx) {
    if (idx === this.selectedStageIndex) return;
    this.selectedStageIndex = idx;

    const nodeCards = this.container.querySelectorAll('.arch-node-card');
    nodeCards.forEach((card, i) => {
      const active = i === idx;
      card.classList.toggle('active', active);
      card.setAttribute('aria-selected', active);
    });

    const inspectorEl = this.container.querySelector('#arch-inspector');
    if (inspectorEl) {
      inspectorEl.innerHTML = this.renderInspectorHTML();
    }

    if (window.playSfx) window.playSfx('click');
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

window.initArchitectureExplorer = function (containerId = 'architecture-container') {
  return new DataArchitectureExplorer(containerId);
};
