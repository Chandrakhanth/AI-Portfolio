class NLPEngine {
  constructor() {
    
    this.stopWords = new Set([
      'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
      'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
      'can', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for',
      'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
      'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn', 'it', 'its', 'itself', 'just', 'me',
      'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or',
      'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some',
      'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these',
      'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn',
      'we', 'were', 'weren', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with',
      'you', 'your', 'yours', 'yourself', 'yourselves'
    ]);

    this.synonyms = {
      'work': 'experience',
      'job': 'experience',
      'employment': 'experience',
      'career': 'experience',
      'history': 'experience',
      'background': 'experience',
      'company': 'experience',
      'companies': 'experience',
      'roles': 'experience',
      'role': 'experience',
      'skill': 'skills',
      'stack': 'skills',
      'technologies': 'skills',
      'tools': 'skills',
      'cert': 'certifications',
      'certs': 'certifications',
      'certificate': 'certifications',
      'credential': 'certifications',
      'degree': 'education',
      'college': 'education',
      'university': 'education',
      'btech': 'education',
      'school': 'education',
      'email': 'contact',
      'phone': 'contact',
      'reach': 'contact',
      'hire': 'contact',
      'touch': 'contact',
      'pipeline': 'architecture',
      'flow': 'architecture',
      'lakehouse': 'architecture',
      'medallion': 'architecture',
      'etl': 'architecture',
      'execution': 'project_execution',
      'delivery': 'project_execution',
      'sla': 'project_execution',
      'triage': 'project_execution',
      'performance': 'project_execution',
      'highlight': 'key_points',
      'highlights': 'key_points',
      'points': 'key_points',
      'point': 'key_points',
      'strengths': 'key_points',
      'strength': 'sql_pyspark_strength',
      'philosophy': 'key_points',
      'principles': 'key_points',
      'pyspark': 'pyspark',
      'spark': 'pyspark',
      'sql': 'sql',
      'tsql': 'sql',
      'systech': 'systech',
      'spb': 'spb',
      'iit': 'iit',
      'madras': 'iit'
    };

    this.vocabulary = [];
    this.vocabIndex = new Map();
    this.knowledgeChunks = [];
    this.chunkEmbeddings = [];

    this.isInitialized = false;
  }

  tokenize(rawText) {
    if (!rawText || typeof rawText !== 'string') return [];

    const clean = rawText
      .toLowerCase()
      .replace(/[^a-z0-9\s_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words = clean.split(' ').filter(w => w.length > 1);

    const tokens = [];
    for (const w of words) {
      if (!this.stopWords.has(w)) {
        tokens.push(w);
        
        if (this.synonyms[w] && this.synonyms[w] !== w) {
          tokens.push(this.synonyms[w]);
        }
      }
    }

    return tokens;
  }

  embed(input) {
    const tokens = Array.isArray(input) ? input : this.tokenize(input);
    const vector = new Array(this.vocabulary.length).fill(0);

    if (tokens.length === 0 || this.vocabulary.length === 0) {
      return vector;
    }

    const tokenFreq = new Map();
    for (const token of tokens) {
      tokenFreq.set(token, (tokenFreq.get(token) || 0) + 1);
    }

    let sumSquares = 0;
    for (const [token, count] of tokenFreq.entries()) {
      const idx = this.vocabIndex.get(token);
      if (idx !== undefined) {
        
        let weight = count;
        if ([
          'sql', 'pyspark', 'spark', 'systech', 'spb', 'iit', 'project', 'projects',
          'sla', 'fabric', 'airflow', 'databricks', 'certifications', 'certification',
          'credential', 'credentials', 'execution', 'key', 'points', 'strengths'
        ].includes(token)) {
          weight *= 2.5;
        }

        vector[idx] = weight;
        sumSquares += weight * weight;
      }
    }

    if (sumSquares > 0) {
      const magnitude = Math.sqrt(sumSquares);
      for (let i = 0; i < vector.length; i++) {
        vector[i] = Number((vector[i] / magnitude).toFixed(6));
      }
    }

    return vector;
  }

  cosineSimilarity(vectorA, vectorB) {
    if (!vectorA || !vectorB || vectorA.length !== vectorB.length) return 0;

    let dotProduct = 0;
    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
    }

    return Math.max(0, Math.min(1, dotProduct));
  }

  initialize(portfolioData) {
    if (!portfolioData || this.isInitialized) return;

    this.knowledgeChunks = this.buildKnowledgeChunks(portfolioData);

    const vocabSet = new Set();
    this.knowledgeChunks.forEach(chunk => {
      const tokens = this.tokenize(chunk.text + ' ' + (chunk.keywords || []).join(' '));
      tokens.forEach(t => vocabSet.add(t));
    });

    this.vocabulary = Array.from(vocabSet).sort();
    this.vocabIndex = new Map();
    this.vocabulary.forEach((word, idx) => {
      this.vocabIndex.set(word, idx);
    });

    this.chunkEmbeddings = this.knowledgeChunks.map(chunk => {
      return {
        chunkId: chunk.id,
        category: chunk.category,
        vector: this.embed(chunk.text + ' ' + (chunk.keywords || []).join(' '))
      };
    });

    this.isInitialized = true;
    console.log(`[NLPEngine] Initialized Vector Store: ${this.knowledgeChunks.length} documents, ${this.vocabulary.length}-D vector space.`);
  }

  buildKnowledgeChunks(data) {
    const chunks = [];

    chunks.push({
      id: 'sql_pyspark_strength',
      category: 'skills',
      title: 'SQL & PySpark Strength and Proficiency',
      text: 'SQL PySpark MS SQL Server T-SQL stored procedures query optimization indexing window functions CTE star schema dimensional modeling Databricks PySpark Delta Lake distributed compute 100M daily records SSA source system analysis data validation deduplication',
      keywords: ['sql', 'pyspark', 'spark', 'strong', 'proficiency', 'level', 'database', 'optimization']
    });

    chunks.push({
      id: 'project_execution',
      category: 'execution',
      title: 'Project Execution, Delivery & Incident Triage',
      text: 'execution in projects project delivery SLA adherence 90% 100 daily DAGs 65% faster incident triage query acceleration 40% proactive monitoring XCom logs Apache Airflow automated retries dependable delivery production ownership',
      keywords: ['execution', 'execute', 'delivery', 'sla', 'triage', 'results', 'metrics', 'performance']
    });

    chunks.push({
      id: 'key_points',
      category: 'overview',
      title: 'Main Key Points & Engineering Philosophy',
      text: 'main key points summary core strengths highlights manifesto engineering philosophy peaceful predictable pipelines data integrity comes first empathy for downstream consumers DP-700 Microsoft Fabric Databricks Airflow certified full stack foundation',
      keywords: ['key', 'points', 'main', 'highlights', 'summary', 'strengths', 'manifesto', 'principles']
    });

    chunks.push({
      id: 'projects',
      category: 'projects',
      title: 'Enterprise Data Pipeline & Workflow Orchestration Platform',
      text: 'flagship project explain about his project enterprise data pipeline workflow orchestration platform Systech Solutions multi-source ingestion Databricks PySpark cleansing Airflow DAG orchestration Snowflake Microsoft Fabric lakehouse Power BI Direct Lake 90% SLA',
      keywords: ['project', 'projects', 'aurastream', 'orchestration', 'platform', 'explain']
    });

    chunks.push({
      id: 'systech',
      category: 'experience',
      title: 'Systech Solutions Experience (06/2025 - Present)',
      text: 'Systech Solutions Data Engineer Chennai timeline 06/2025 Present Apache Airflow workflow orchestration multi-tier ingestion Python PySpark SQL Server Microsoft Fabric Snowflake Databricks Delta Lake SSA incident triage',
      keywords: ['systech', 'solutions', 'experience', 'present']
    });

    chunks.push({
      id: 'spb',
      category: 'experience',
      title: 'SPB CORP LTD Software Engineer',
      text: 'SPB Corp Software Engineer full stack development Python FastAPI Django React JavaScript MS SQL Server RESTful APIs microservices state management Docker CI CD',
      keywords: ['spb', 'corp', 'software', 'engineer', 'react', 'fastapi', 'fullstack']
    });

    chunks.push({
      id: 'iit',
      category: 'experience',
      title: 'IIT Madras Software Engineer',
      text: 'IIT Madras Software Engineer full stack research dashboards Python Flask FastAPI PostgreSQL JavaScript data visualization REST APIs compute optimization Linux',
      keywords: ['iit', 'madras', 'research', 'dashboards', 'computational', 'software']
    });

    chunks.push({
      id: 'certifications',
      category: 'credentials',
      title: 'Industry Certifications & Credentials',
      text: 'certifications credentials Microsoft Fabric Analytics Engineer DP-700 Astronomer Apache Airflow DAG Authoring Airflow Fundamentals Databricks Data Engineer Associate Anna University B.Tech IT degree',
      keywords: ['certifications', 'cert', 'fabric', 'dp-700', 'airflow', 'databricks', 'credentials']
    });

    chunks.push({
      id: 'architecture',
      category: 'architecture',
      title: 'Modern End-to-End Data Architecture Flow',
      text: 'architecture data flow pipeline medallion lakehouse Bronze Silver Gold Azure Data Lake ADF Databricks PySpark Airflow DAG orchestration Snowflake star schema Power BI Direct Lake',
      keywords: ['architecture', 'pipeline', 'flow', 'medallion', 'lakehouse']
    });

    chunks.push({
      id: 'skills',
      category: 'skills',
      title: 'Core Technical Competencies & Tech Stack',
      text: 'skills technical stack tools languages Python SQL PySpark MS SQL Server Snowflake Greenplum Microsoft Fabric Azure Data Factory Power BI DAX Linux Bash Git Docker',
      keywords: ['skills', 'stack', 'technologies', 'tools']
    });

    chunks.push({
      id: 'about',
      category: 'bio',
      title: 'About Chandrakhanth K & Education',
      text: 'who is Chandrakhanth bio profile background education B.Tech Information Technology Anna University C.Abdul Hakeem College Chennai Data Engineer',
      keywords: ['about', 'who', 'education', 'degree', 'college', 'university', 'btech']
    });

    chunks.push({
      id: 'contact',
      category: 'contact',
      title: 'Contact Information & Hiring Opportunities',
      text: 'contact email chandrakhanth07@gmail.com linkedin github phone reach hire connect message send touch',
      keywords: ['contact', 'email', 'linkedin', 'github', 'hire', 'reach']
    });

    return chunks;
  }

  search(userQuery, threshold = 0.18) {
    if (!this.isInitialized) {
      console.warn('[NLPEngine] Engine not yet initialized with data.');
      return { isOutOfScope: true, topMatch: null, results: [] };
    }

    const tokens = this.tokenize(userQuery);
    const queryVector = this.embed(tokens);

    const scores = this.chunkEmbeddings.map(item => {
      const score = this.cosineSimilarity(queryVector, item.vector);
      const chunk = this.knowledgeChunks.find(c => c.id === item.chunkId);
      return {
        chunkId: item.chunkId,
        title: chunk ? chunk.title : item.chunkId,
        score: Number((score * 100).toFixed(2)), 
        rawScore: score
      };
    });

    scores.sort((a, b) => b.rawScore - a.rawScore);

    const topMatch = scores[0];
    const isOutOfScope = !topMatch || topMatch.rawScore < threshold;

    return {
      query: userQuery,
      tokens: tokens,
      queryVectorSample: queryVector.slice(0, 10), 
      vocabularySize: this.vocabulary.length,
      topMatch: topMatch,
      isOutOfScope: isOutOfScope,
      allScores: scores
    };
  }
}

if (typeof window !== 'undefined') {
  window.NLPEngine = NLPEngine;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NLPEngine;
}
