/**
 * NLPEngine - Advanced Natural Language Processing Engine
 * Designed for Chandrakhanth's AI Portfolio Assistant.
 * 
 * Features:
 * - Intelligent contraction expansion & query normalization
 * - High-precision semantic intent classification for human language queries
 * - Fine-grained domain synonyms & token weighting
 * - TF-IDF Vector Space Model with Cosine Similarity
 * - Dynamic Contextual Entity Retrieval across full PORTFOLIO_DATA
 * - Graceful fallback with contextual suggestions
 */
class NLPEngine {
  constructor() {
    // Only strip pure grammatical function words, preserving domain & question words (e.g. 'about', 'him', 'who', 'year', 'shortly')
    this.stopWords = new Set([
      'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'from', 'as', 'is', 'am', 'are', 'was', 'were', 'been', 'being', 'have', 'has',
      'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'can', 'could',
      'may', 'might', 'must', 'that', 'this', 'these', 'those', 'there', 'here'
    ]);

    this.synonyms = {
      // Summary / Bio
      'shortly': 'about_short',
      'brief': 'about_short',
      'briefly': 'about_short',
      'short': 'about_short',
      'summary': 'about_short',
      'overview': 'about_short',
      'intro': 'about_short',
      'introduction': 'about_short',
      'snapshot': 'about_short',
      'him': 'about',
      'chandrakhanth': 'about',
      'chandy': 'about',
      'bio': 'about',
      'profile': 'about',

      // Experience & Duration
      'year': 'total_experience',
      'years': 'total_experience',
      'yoe': 'total_experience',
      'duration': 'total_experience',
      'tenure': 'total_experience',
      'timeline': 'total_experience',
      'work': 'experience',
      'job': 'experience',
      'employment': 'experience',
      'career': 'experience',
      'history': 'experience',
      'background': 'experience',
      'company': 'experience',
      'companies': 'experience',
      'role': 'experience',
      'roles': 'experience',

      // Skills & Tech
      'skill': 'skills',
      'skills': 'skills',
      'stack': 'skills',
      'technologies': 'skills',
      'technology': 'skills',
      'tools': 'skills',
      'languages': 'skills',
      'proficiency': 'skills',
      'competencies': 'skills',
      'spark': 'pyspark',
      'pyspark': 'pyspark',
      'sql': 'sql',
      'tsql': 'sql',
      'fabric': 'fabric',
      'dp700': 'fabric',
      'dp-700': 'fabric',
      'airflow': 'airflow',
      'astronomer': 'airflow',
      'snowflake': 'snowflake',
      'databricks': 'databricks',
      'delta': 'databricks',
      'fastapi': 'python',
      'django': 'python',
      'flask': 'python',
      'react': 'fullstack',
      'frontend': 'fullstack',
      'javascript': 'fullstack',
      'docker': 'docker',
      'container': 'docker',
      'azure': 'azure',
      'adf': 'azure',

      // Certifications & Education
      'cert': 'certifications',
      'certs': 'certifications',
      'certificate': 'certifications',
      'certificates': 'certifications',
      'credential': 'certifications',
      'credentials': 'certifications',
      'badge': 'certifications',
      'degree': 'education',
      'college': 'education',
      'university': 'education',
      'btech': 'education',
      'school': 'education',
      'study': 'education',
      'studied': 'education',
      'academics': 'education',

      // Contact & Hire
      'email': 'contact',
      'mail': 'contact',
      'phone': 'contact',
      'reach': 'contact',
      'hire': 'contact',
      'hiring': 'contact',
      'touch': 'contact',
      'connect': 'contact',
      'location': 'location',
      'city': 'location',
      'country': 'location',
      'remote': 'location',
      'chennai': 'location',

      // Architecture & Projects
      'pipeline': 'architecture',
      'flow': 'architecture',
      'lakehouse': 'architecture',
      'medallion': 'architecture',
      'etl': 'architecture',
      'project': 'projects',
      'projects': 'projects',
      'aurastream': 'projects',
      'orchestration': 'projects',

      // Execution & Performance
      'execution': 'project_execution',
      'delivery': 'project_execution',
      'sla': 'project_execution',
      'triage': 'project_execution',
      'reliability': 'project_execution',
      'performance': 'project_execution',

      // Philosophy & Strengths
      'strengths': 'key_points',
      'strength': 'sql_pyspark_strength',
      'highlights': 'key_points',
      'points': 'key_points',
      'philosophy': 'key_points',
      'principles': 'key_points',
      'manifesto': 'key_points',

      // Companies
      'systech': 'systech',
      'spb': 'spb',
      'iit': 'iit',
      'madras': 'iit'
    };

    this.vocabulary = [];
    this.vocabIndex = new Map();
    this.knowledgeChunks = [];
    this.chunkEmbeddings = [];
    this.portfolioData = null;

    this.isInitialized = false;
  }

  /**
   * Expand common English contractions to normalized forms
   */
  expandContractions(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/\bwho's\b/gi, 'who is')
      .replace(/\bwhat's\b/gi, 'what is')
      .replace(/\bwhere's\b/gi, 'where is')
      .replace(/\bhow's\b/gi, 'how is')
      .replace(/\bhe's\b/gi, 'he is')
      .replace(/\bit's\b/gi, 'it is')
      .replace(/\bi'm\b/gi, 'i am')
      .replace(/\bcan't\b/gi, 'cannot')
      .replace(/\bwon't\b/gi, 'will not')
      .replace(/\bdon't\b/gi, 'do not')
      .replace(/\bdoesn't\b/gi, 'does not')
      .replace(/\bdidn't\b/gi, 'did not')
      .replace(/\bthere's\b/gi, 'there is')
      .replace(/\byou're\b/gi, 'you are')
      .replace(/\bwe're\b/gi, 'we are')
      .replace(/\bthey're\b/gi, 'they are')
      .replace(/\bwhat're\b/gi, 'what are');
  }

  /**
   * Clean and normalize raw user text
   */
  cleanText(rawText) {
    if (!rawText || typeof rawText !== 'string') return '';
    const expanded = this.expandContractions(rawText);
    return expanded
      .toLowerCase()
      .replace(/[^a-z0-9\s_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Tokenize text with synonym enrichment
   */
  tokenize(rawText) {
    const clean = this.cleanText(rawText);
    if (!clean) return [];

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

  /**
   * High-precision semantic intent classifier based on human natural language patterns
   */
  classifyIntent(rawText) {
    const clean = this.cleanText(rawText);
    if (!clean) return null;

    // 1. Social & Conversational
    if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|sup|howdy|hola|namaste)\b/i.test(clean)) {
      return { intent: 'greeting', confidence: 0.99, source: 'pattern' };
    }
    if (/^(how\s+are\s+you|how\s+are\s+you\s+doing|hows\s+it\s+going|what\s+is\s+up)\b/i.test(clean)) {
      return { intent: 'pleasantry', confidence: 0.98, source: 'pattern' };
    }
    if (/^(thank\s*you|thanks|thx|awesome|great|cool|nice|perfect|super)\b/i.test(clean)) {
      return { intent: 'thanks', confidence: 0.98, source: 'pattern' };
    }
    if (/^(bye|goodbye|see\s*you|cya|take\s*care|adios)\b/i.test(clean)) {
      return { intent: 'goodbye', confidence: 0.98, source: 'pattern' };
    }
    if (/^(clear|cls)\b/i.test(clean)) {
      return { intent: 'clear', confidence: 1.0, source: 'pattern' };
    }
    if (/^(help|what\s+can\s+you\s+do|menu|options|commands|guide|instructions)\b/i.test(clean)) {
      return { intent: 'help', confidence: 0.98, source: 'pattern' };
    }
    if (/who\s+(are\s+you|created\s+you|built\s+you)|what\s+are\s+you/i.test(clean)) {
      return { intent: 'bot_identity', confidence: 0.98, source: 'pattern' };
    }

    // 2. Short Summary / Bio / Who is he? (Directly solves "tell me shortly about him")
    if (
      /tell\s+me\s+(shortly|briefly|short|quick|a\s+short|a\s+brief|in\s+short)\s+about\s+(him|chandrakhanth|chandy|the\s+engineer|the\s+author)/i.test(clean) ||
      /(short|brief|quick)\s+(summary|bio|overview|intro|introduction|description)\s*(of|about)?\s*(him|chandrakhanth|chandy)?/i.test(clean) ||
      /tell\s+me\s+shortly\s*(about\s*him)?/i.test(clean) ||
      /who\s+is\s+(he|chandrakhanth|chandy|this\s+person|this\s+guy)/i.test(clean) ||
      /tell\s+me\s+about\s+(him|chandrakhanth|chandy)/i.test(clean) ||
      /describe\s+(him|chandrakhanth|chandy)/i.test(clean) ||
      /introduce\s+(him|chandrakhanth|chandy)/i.test(clean) ||
      /^about\s+(him|chandrakhanth|chandy)$/i.test(clean) ||
      /^(bio|profile|summary|short\s+bio|overview)$/i.test(clean)
    ) {
      return { intent: 'about_short', confidence: 0.99, source: 'pattern' };
    }

    // 3. Total Years of Experience / Experience Duration (Directly solves "total year of experience")
    if (
      /(total|overall|how\s+many|number\s+of)?\s*(year|years|yoe)\s+(of\s+)?experience/i.test(clean) ||
      /experience\s+(in\s+years|duration|timeline|years|count)/i.test(clean) ||
      /how\s+(much|many\s+years\s+of)\s+experience/i.test(clean) ||
      /how\s+long\s+has\s+he\s+been\s+working/i.test(clean) ||
      /how\s+long\s+(is\s+his|of)\s+experience/i.test(clean) ||
      /(total|overall)\s+experience/i.test(clean) ||
      /how\s+many\s+years/i.test(clean) ||
      /years\s+in\s+industry/i.test(clean)
    ) {
      return { intent: 'total_experience', confidence: 0.99, source: 'pattern' };
    }

    // 4. Specific Companies (Check before general experience)
    if (/systech(\s+solutions)?/i.test(clean) || /current\s+(company|employer|job|workplace)/i.test(clean)) {
      return { intent: 'systech', confidence: 0.98, source: 'pattern' };
    }
    if (/spb(\s+corp)?/i.test(clean)) {
      return { intent: 'spb', confidence: 0.98, source: 'pattern' };
    }
    if (/iit(\s+madras)?/i.test(clean)) {
      return { intent: 'iit', confidence: 0.98, source: 'pattern' };
    }

    // 5. Overall Work History & Career Journey
    if (
      /(work|career|professional)\s+(history|journey|experience|background)/i.test(clean) ||
      /where\s+did\s+he\s+work/i.test(clean) ||
      /companies\s+(he\s+worked|worked\s+at|list)/i.test(clean) ||
      /employment\s+(history|record)/i.test(clean) ||
      /past\s+(roles|jobs|companies|work)/i.test(clean)
    ) {
      return { intent: 'experience', confidence: 0.95, source: 'pattern' };
    }

    // 6. Current Role / Designation
    if (
      /what\s+is\s+his\s+(current\s+)?(role|title|position|designation|job)/i.test(clean) ||
      /what\s+does\s+he\s+do\s+(currently|now|at\s+systech)/i.test(clean)
    ) {
      return { intent: 'current_role', confidence: 0.95, source: 'pattern' };
    }

    // 7. Why Hire / Candidate Strengths
    if (
      /why\s+(should\s+(we|i)\s+)?hire\s*(him)?/i.test(clean) ||
      /what\s+makes\s+him\s+(stand\s+out|unique|special|a\s+good\s+candidate)/i.test(clean) ||
      /why\s+choose\s+him/i.test(clean) ||
      /value\s+proposition/i.test(clean)
    ) {
      return { intent: 'why_hire', confidence: 0.95, source: 'pattern' };
    }

    // 8. SQL & PySpark Strength (Combined)
    if (
      (/sql/i.test(clean) && /pyspark|spark/i.test(clean)) ||
      /(how\s+strong|strength|proficiency).*(sql|pyspark|spark)/i.test(clean)
    ) {
      return { intent: 'sql_pyspark_strength', confidence: 0.98, source: 'pattern' };
    }

    // 9. Specific Technology Inquiries
    if (/pyspark|apache\s+spark|spark\s+sql/i.test(clean)) {
      return { intent: 'pyspark', confidence: 0.95, source: 'pattern' };
    }
    if (/(\bms\s+sql\b|\bt-sql\b|\bsql\s+server\b|stored\s+procedures|query\s+optimization|\bcte\b|indexing|databases?|\bdb\b|rdbms)/i.test(clean)) {
      return { intent: 'sql', confidence: 0.95, source: 'pattern' };
    }
    if (/microsoft\s+fabric|\bfabric\b|dp-?700|onelake|direct\s+lake/i.test(clean)) {
      return { intent: 'fabric', confidence: 0.95, source: 'pattern' };
    }
    if (/apache\s+airflow|\bairflow\b|astronomer|dag\s+authoring|\bdags?\b/i.test(clean)) {
      return { intent: 'airflow', confidence: 0.95, source: 'pattern' };
    }
    if (/snowflake|snowsql/i.test(clean)) {
      return { intent: 'snowflake', confidence: 0.95, source: 'pattern' };
    }
    if (/databricks|delta\s+lake/i.test(clean)) {
      return { intent: 'databricks', confidence: 0.95, source: 'pattern' };
    }
    if (/python|fastapi|django|flask/i.test(clean)) {
      return { intent: 'python', confidence: 0.93, source: 'pattern' };
    }
    if (/react|frontend|javascript|full\s*stack|html|css/i.test(clean)) {
      return { intent: 'fullstack', confidence: 0.93, source: 'pattern' };
    }
    if (/docker|container/i.test(clean)) {
      return { intent: 'docker', confidence: 0.93, source: 'pattern' };
    }
    if (/azure|azure\s+data\s+factory|\badf\b|adls/i.test(clean)) {
      return { intent: 'azure', confidence: 0.93, source: 'pattern' };
    }

    // 10. General Skills & Tech Stack
    if (/skills?|tech\s*stack|technologies|tools|languages|what\s+does\s+he\s+know|what\s+tech/i.test(clean)) {
      return { intent: 'skills', confidence: 0.95, source: 'pattern' };
    }

    // 11. Project Execution & SLA Delivery (Check before general projects)
    if (/execution|delivery|sla|triage|incident|reliability|90%|production\s+ownership/i.test(clean)) {
      return { intent: 'project_execution', confidence: 0.95, source: 'pattern' };
    }

    // 12. Projects
    if (/projects?|aurastream|flagship|what\s+did\s+he\s+build|explain\s+(about\s+)?his\s+project|portfolio\s+project/i.test(clean)) {
      return { intent: 'projects', confidence: 0.95, source: 'pattern' };
    }

    // 13. Data Architecture Flow
    if (/architect|pipeline|data\s*flow|medallion|lakehouse|data\s*lakehouse|bronze.*silver.*gold/i.test(clean)) {
      return { intent: 'architecture', confidence: 0.95, source: 'pattern' };
    }

    // 14. Certifications
    if (/certif|credential|badge|is\s+he\s+certified/i.test(clean)) {
      return { intent: 'certifications', confidence: 0.95, source: 'pattern' };
    }

    // 15. Education & Academics
    if (/education|degree|college|university|b\.?tech|graduat|anna\s+university|where\s+did\s+he\s+study/i.test(clean)) {
      return { intent: 'education', confidence: 0.95, source: 'pattern' };
    }

    // 16. Location & Remote
    if (/location|where\s+is\s+he\s+based|based\s+in|\bbased\b|where\s+does\s+he\s+(live|stay|reside)|chennai|remote|relocat/i.test(clean)) {
      return { intent: 'location', confidence: 0.95, source: 'pattern' };
    }

    // 17. Contact & Hiring
    if (/contact|email|phone|reach|touch|hire|message|how\s+to\s+connect|resume|\bcv\b/i.test(clean)) {
      return { intent: 'contact', confidence: 0.95, source: 'pattern' };
    }
    if (/linkedin/i.test(clean)) {
      return { intent: 'linkedin', confidence: 0.98, source: 'pattern' };
    }
    if (/github/i.test(clean)) {
      return { intent: 'github', confidence: 0.98, source: 'pattern' };
    }

    // 18. Key Points & Philosophy
    if (/key\s*points?|highlights?|principles|manifesto|philosophy|mindset/i.test(clean)) {
      return { intent: 'key_points', confidence: 0.95, source: 'pattern' };
    }

    return null;
  }

  /**
   * Search full portfolio dataset for exact entities or keywords (Dynamic Context Lookup)
   */
  searchContextData(rawQuery) {
    if (!this.portfolioData) return null;
    const clean = this.cleanText(rawQuery);
    const words = clean.split(' ').filter(w => w.length > 2 && !this.stopWords.has(w));
    if (words.length === 0) return null;

    // Search skills matrix tags
    for (const cat of (this.portfolioData.skills || [])) {
      for (const skill of (cat.skills || [])) {
        const skillNameLower = skill.name.toLowerCase();
        if (words.some(w => skillNameLower.includes(w))) {
          return {
            type: 'skill',
            title: skill.name,
            level: skill.level,
            category: cat.category,
            tags: skill.tags || [],
            source: 'skills'
          };
        }
        for (const tag of (skill.tags || [])) {
          if (words.some(w => tag.toLowerCase() === w)) {
            return {
              type: 'skill_tag',
              title: skill.name,
              matchedTag: tag,
              level: skill.level,
              category: cat.category,
              tags: skill.tags || [],
              source: 'skills'
            };
          }
        }
      }
    }

    // Search experience highlights & bullets
    for (const exp of (this.portfolioData.experience || [])) {
      for (const bullet of (exp.bullets || [])) {
        const bulletLower = bullet.toLowerCase();
        const matchCount = words.filter(w => bulletLower.includes(w)).length;
        if (matchCount >= 2 || (words.length === 1 && bulletLower.includes(words[0]))) {
          return {
            type: 'experience_fact',
            company: exp.company,
            role: exp.role,
            period: exp.period,
            snippet: bullet,
            source: 'experience'
          };
        }
      }
    }

    // Search certifications
    for (const cert of (this.portfolioData.certifications || [])) {
      const certTitle = cert.title.toLowerCase();
      if (words.some(w => certTitle.includes(w))) {
        return {
          type: 'certification_fact',
          title: cert.title,
          issuer: cert.issuer,
          year: cert.year,
          skills: cert.skills || [],
          source: 'certifications'
        };
      }
    }

    return null;
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
          'sla', 'fabric', 'airflow', 'snowflake', 'databricks', 'certifications',
          'experience', 'years', 'total_experience', 'about_short', 'about'
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
    this.portfolioData = portfolioData;

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
    console.log(`[NLPEngine] Initialized Knowledge Vector Store: ${this.knowledgeChunks.length} documents, ${this.vocabulary.length}-D vector space.`);
  }

  buildKnowledgeChunks(data) {
    const chunks = [];

    // Short Summary / Bio
    chunks.push({
      id: 'about_short',
      category: 'bio',
      title: 'Brief Bio & Elevator Summary',
      text: 'tell me shortly about him brief bio summary quick overview introduction snapshot who is Chandrakhanth Data Engineer at Systech Solutions Chennai India 2+ years experience DP-700 Fabric certified Databricks Airflow',
      keywords: ['shortly', 'brief', 'summary', 'overview', 'him', 'chandrakhanth', 'bio', 'intro', 'snapshot', 'who']
    });

    // Total Experience
    chunks.push({
      id: 'total_experience',
      category: 'experience',
      title: 'Total Years of Professional Experience',
      text: 'total year of experience total years of experience how many years experience duration career timeline 2+ years hands-on software and data engineering at Systech Solutions SPB Corp IIT Madras tenure overall experience',
      keywords: ['year', 'years', 'total', 'experience', 'duration', 'timeline', 'tenure', 'how', 'many']
    });

    // General Profile & Background
    chunks.push({
      id: 'about',
      category: 'bio',
      title: 'About Chandrakhanth K & Profile',
      text: 'who is Chandrakhanth bio profile background education B.Tech Information Technology Anna University C.Abdul Hakeem College Chennai Data Engineer Systech Solutions',
      keywords: ['about', 'who', 'education', 'degree', 'college', 'university', 'btech', 'profile', 'bio']
    });

    // Current Role
    chunks.push({
      id: 'current_role',
      category: 'experience',
      title: 'Current Role & Designation',
      text: 'what is his current role position job designation Data Engineer at Systech Solutions Inc Chennai 06/2025 present pipeline orchestration Airflow Fabric Snowflake',
      keywords: ['current', 'role', 'position', 'job', 'designation', 'title', 'now', 'present']
    });

    // Why Hire
    chunks.push({
      id: 'why_hire',
      category: 'overview',
      title: 'Why Hire Chandrakhanth / Key Value Proposition',
      text: 'why hire why should we hire candidate strengths stand out value proposition multi-certified DP-700 Airflow Databricks 90% SLA 65% faster incident triage dependable delivery',
      keywords: ['why', 'hire', 'candidate', 'strengths', 'stand', 'value', 'proposition']
    });

    // SQL & PySpark Strength
    chunks.push({
      id: 'sql_pyspark_strength',
      category: 'skills',
      title: 'SQL & PySpark Strength and Proficiency',
      text: 'SQL PySpark MS SQL Server T-SQL stored procedures query optimization indexing window functions CTE star schema dimensional modeling Databricks PySpark Delta Lake distributed compute 100M daily records SSA source system analysis data validation deduplication',
      keywords: ['sql', 'pyspark', 'spark', 'strong', 'proficiency', 'level', 'database', 'optimization']
    });

    // PySpark Deep Dive
    chunks.push({
      id: 'pyspark',
      category: 'skills',
      title: 'PySpark Distributed Processing Expertise',
      text: 'PySpark Apache Spark Databricks Associate certified distributed compute transformations DataFrame API Spark SQL 100M daily records deduplication validation SSA',
      keywords: ['pyspark', 'spark', 'databricks', 'distributed', 'compute']
    });

    // SQL Deep Dive
    chunks.push({
      id: 'sql',
      category: 'skills',
      title: 'MS SQL Server & T-SQL Relational Engineering',
      text: 'MS SQL Server T-SQL stored procedures indexing query optimization execution plans CTE window functions star schema Snowflake schema dimensional modeling 45% faster load',
      keywords: ['sql', 'tsql', 'indexing', 'stored', 'procedures', 'query', 'optimization']
    });

    // Microsoft Fabric
    chunks.push({
      id: 'fabric',
      category: 'skills',
      title: 'Microsoft Fabric Analytics Engineer (DP-700)',
      text: 'Microsoft Fabric DP-700 certified OneLake Direct Lake Fabric Spark Lakehouse medallion bronze silver gold pipelines Power BI semantic models',
      keywords: ['fabric', 'dp-700', 'dp700', 'onelake', 'lakehouse', 'microsoft']
    });

    // Apache Airflow
    chunks.push({
      id: 'airflow',
      category: 'skills',
      title: 'Apache Airflow DAG Workflow Orchestration',
      text: 'Apache Airflow Astronomer certified DAG authoring custom operators sensors XComs 24 daily DAGs 100+ production runs 90% SLA triage automated retries',
      keywords: ['airflow', 'astronomer', 'dag', 'dags', 'orchestration', 'sla']
    });

    // Snowflake
    chunks.push({
      id: 'snowflake',
      category: 'skills',
      title: 'Snowflake Cloud Data Warehouse & Marts',
      text: 'Snowflake SnowSQL virtual warehouses time travel zero-copy clone analytical data marts star schema medallion gold layer sub-minute querying',
      keywords: ['snowflake', 'snowsql', 'warehouse', 'marts']
    });

    // Databricks
    chunks.push({
      id: 'databricks',
      category: 'skills',
      title: 'Databricks & Delta Lake Architecture',
      text: 'Databricks Data Engineer Associate certified Delta Lake clusters jobs lakehouse compute optimization PySpark distributed batch processing',
      keywords: ['databricks', 'delta', 'lake', 'associate', 'clusters']
    });

    // Python & Full Stack
    chunks.push({
      id: 'python',
      category: 'skills',
      title: 'Python Scripting & Backend Engineering',
      text: 'Python scripting ETL pipelines automation FastAPI Django Flask RESTful APIs backend microservices object-oriented programming',
      keywords: ['python', 'fastapi', 'django', 'flask', 'scripting', 'backend']
    });

    // Full Stack (SPB / IIT Madras)
    chunks.push({
      id: 'fullstack',
      category: 'skills',
      title: 'Full Stack Web Engineering & React',
      text: 'React JavaScript frontend HTML5 CSS3 FastAPI Django RESTful APIs SPB Corp IIT Madras state management microservices Docker',
      keywords: ['react', 'fullstack', 'frontend', 'javascript', 'web']
    });

    // Docker & DevOps
    chunks.push({
      id: 'docker',
      category: 'skills',
      title: 'Docker & Containerization',
      text: 'Docker containers local development CI CD build scripts Git version control SPB Corp deployment reproducible environments',
      keywords: ['docker', 'container', 'containers', 'devops']
    });

    // Azure & ADF
    chunks.push({
      id: 'azure',
      category: 'skills',
      title: 'Microsoft Azure & Azure Data Factory',
      text: 'Microsoft Azure Azure Data Factory ADF copy data pipelines triggers linked services ADLS Gen2 Azure VMs Key Vault cloud lakehouse',
      keywords: ['azure', 'adf', 'cloud', 'adls']
    });

    // Project Execution & SLA
    chunks.push({
      id: 'project_execution',
      category: 'execution',
      title: 'Project Execution, Delivery & Incident Triage',
      text: 'execution in projects project delivery SLA adherence 90% 100 daily DAGs 65% faster incident triage query acceleration 40% proactive monitoring XCom logs Apache Airflow automated retries dependable delivery production ownership',
      keywords: ['execution', 'execute', 'delivery', 'sla', 'triage', 'results', 'metrics', 'performance']
    });

    // Main Key Points
    chunks.push({
      id: 'key_points',
      category: 'overview',
      title: 'Main Key Points & Engineering Philosophy',
      text: 'main key points summary core strengths highlights manifesto engineering philosophy peaceful predictable pipelines data integrity comes first empathy for downstream consumers DP-700 Microsoft Fabric Databricks Airflow certified full stack foundation',
      keywords: ['key', 'points', 'main', 'highlights', 'summary', 'strengths', 'manifesto', 'principles']
    });

    // Flagship Project
    chunks.push({
      id: 'projects',
      category: 'projects',
      title: 'Enterprise Data Pipeline & Workflow Orchestration Platform',
      text: 'flagship project explain about his project enterprise data pipeline workflow orchestration platform Systech Solutions multi-source ingestion Databricks PySpark cleansing Airflow DAG orchestration Snowflake Microsoft Fabric lakehouse Power BI Direct Lake 90% SLA',
      keywords: ['project', 'projects', 'aurastream', 'orchestration', 'platform', 'explain']
    });

    // Systech Solutions
    chunks.push({
      id: 'systech',
      category: 'experience',
      title: 'Systech Solutions Experience (06/2025 - Present)',
      text: 'Systech Solutions Data Engineer Chennai timeline 06/2025 Present Apache Airflow workflow orchestration multi-tier ingestion Python PySpark SQL Server Microsoft Fabric Snowflake Databricks Delta Lake SSA incident triage',
      keywords: ['systech', 'solutions', 'experience', 'present']
    });

    // SPB Corp
    chunks.push({
      id: 'spb',
      category: 'experience',
      title: 'SPB CORP LTD Software Engineer',
      text: 'SPB Corp Software Engineer full stack development Python FastAPI Django React JavaScript MS SQL Server RESTful APIs microservices state management Docker CI CD',
      keywords: ['spb', 'corp', 'software', 'engineer', 'react', 'fastapi', 'fullstack']
    });

    // IIT Madras
    chunks.push({
      id: 'iit',
      category: 'experience',
      title: 'IIT Madras Software Engineer',
      text: 'IIT Madras Software Engineer full stack research dashboards Python Flask FastAPI PostgreSQL JavaScript data visualization REST APIs compute optimization Linux',
      keywords: ['iit', 'madras', 'research', 'dashboards', 'computational', 'software']
    });

    // General Journey
    chunks.push({
      id: 'experience',
      category: 'experience',
      title: 'Complete Career Journey & Roles',
      text: 'complete professional career journey experience history roles Data Engineer Software Engineer Systech Solutions SPB Corp IIT Madras timeline companies',
      keywords: ['experience', 'journey', 'career', 'history', 'companies', 'roles']
    });

    // Certifications
    chunks.push({
      id: 'certifications',
      category: 'credentials',
      title: 'Industry Certifications & Credentials',
      text: 'certifications credentials Microsoft Fabric Analytics Engineer DP-700 Astronomer Apache Airflow DAG Authoring Airflow Fundamentals Databricks Data Engineer Associate Anna University B.Tech IT degree',
      keywords: ['certifications', 'cert', 'fabric', 'dp-700', 'airflow', 'databricks', 'credentials']
    });

    // Architecture
    chunks.push({
      id: 'architecture',
      category: 'architecture',
      title: 'Modern End-to-End Data Architecture Flow',
      text: 'architecture data flow pipeline medallion lakehouse Bronze Silver Gold Azure Data Lake ADF Databricks PySpark Airflow DAG orchestration Snowflake star schema Power BI Direct Lake',
      keywords: ['architecture', 'pipeline', 'flow', 'medallion', 'lakehouse']
    });

    // Skills Matrix
    chunks.push({
      id: 'skills',
      category: 'skills',
      title: 'Core Technical Competencies & Tech Stack',
      text: 'skills technical stack tools languages Python SQL PySpark MS SQL Server Snowflake Greenplum Microsoft Fabric Azure Data Factory Power BI DAX Linux Bash Git Docker',
      keywords: ['skills', 'stack', 'technologies', 'tools']
    });

    // Education
    chunks.push({
      id: 'education',
      category: 'education',
      title: 'Education & Degree',
      text: 'education degree B.Tech in Information Technology Anna University C.Abdul Hakeem College of Engineering 2020-2024 distributed systems database management algorithms',
      keywords: ['education', 'degree', 'college', 'university', 'btech', 'anna']
    });

    // Location
    chunks.push({
      id: 'location',
      category: 'contact',
      title: 'Location & Remote Availability',
      text: 'location Chennai India open to remote relocation where does he live stay based',
      keywords: ['location', 'chennai', 'remote', 'live', 'where']
    });

    // Contact
    chunks.push({
      id: 'contact',
      category: 'contact',
      title: 'Contact Information & Hiring Opportunities',
      text: 'contact email chandrakhanth07@gmail.com linkedin github phone reach hire connect message send touch',
      keywords: ['contact', 'email', 'linkedin', 'github', 'hire', 'reach']
    });

    return chunks;
  }

  /**
   * Search query against NLP pipeline:
   * 1. Pattern classifier (fast & deterministic for human questions)
   * 2. Dynamic Context Lookup (searches PORTFOLIO_DATA entities)
   * 3. TF-IDF Vector & Cosine Similarity Semantic Search
   * 4. Smart Fallback with relevant suggestions
   */
  search(userQuery, threshold = 0.12) {
    if (!this.isInitialized) {
      console.warn('[NLPEngine] Engine not yet initialized with data.');
      return { isOutOfScope: true, topMatch: null, intent: 'out_of_scope' };
    }

    const cleanQuery = this.cleanText(userQuery);

    // 1. High-precision pattern classifier
    const patternResult = this.classifyIntent(userQuery);
    if (patternResult) {
      const matchedChunk = this.knowledgeChunks.find(c => c.id === patternResult.intent);
      return {
        query: userQuery,
        cleanQuery: cleanQuery,
        intent: patternResult.intent,
        confidence: patternResult.confidence,
        source: 'pattern',
        topMatch: {
          chunkId: patternResult.intent,
          title: matchedChunk ? matchedChunk.title : patternResult.intent,
          score: Math.round(patternResult.confidence * 100),
          rawScore: patternResult.confidence
        },
        isOutOfScope: false
      };
    }

    // 2. Vector space TF-IDF & Cosine Similarity retrieval
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

    if (topMatch && topMatch.rawScore >= threshold) {
      return {
        query: userQuery,
        cleanQuery: cleanQuery,
        tokens: tokens,
        intent: topMatch.chunkId,
        confidence: topMatch.rawScore,
        source: 'vector_semantic',
        topMatch: topMatch,
        isOutOfScope: false,
        allScores: scores.slice(0, 5)
      };
    }

    // 3. Dynamic Context Entity Search across PORTFOLIO_DATA
    const contextEntity = this.searchContextData(userQuery);
    if (contextEntity) {
      return {
        query: userQuery,
        cleanQuery: cleanQuery,
        intent: 'context_match',
        confidence: 0.85,
        source: 'context_search',
        contextEntity: contextEntity,
        topMatch: {
          chunkId: 'context_match',
          title: contextEntity.title || 'Portfolio Knowledge Match',
          score: 85,
          rawScore: 0.85
        },
        isOutOfScope: false
      };
    }

    // 4. Genuine out-of-scope query
    return {
      query: userQuery,
      cleanQuery: cleanQuery,
      tokens: tokens,
      intent: 'out_of_scope',
      confidence: topMatch ? topMatch.rawScore : 0,
      source: 'fallback',
      topMatch: topMatch,
      isOutOfScope: true,
      allScores: scores.slice(0, 3)
    };
  }
}

if (typeof window !== 'undefined') {
  window.NLPEngine = NLPEngine;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NLPEngine;
}
