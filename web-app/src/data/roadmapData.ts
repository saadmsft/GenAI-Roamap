import { Task, Phase, Project, Skill } from '../types';

export const phases: Phase[] = [
  {
    id: 1,
    title: "Advanced GenAI Fundamentals",
    description: "Master the mathematical foundations and architectures powering modern GenAI",
    weeks: 6,
    totalTasks: 42,
    completedTasks: 0
  },
  {
    id: 2,
    title: "Multi-Cloud GenAI Architecture",
    description: "Master Azure, AWS, and Google Cloud GenAI services and cross-cloud patterns",
    weeks: 8,
    totalTasks: 56,
    completedTasks: 0
  },
  {
    id: 3,
    title: "Enterprise GenAI Implementation",
    description: "Design enterprise-scale GenAI solutions with proper governance and MLOps",
    weeks: 8,
    totalTasks: 56,
    completedTasks: 0
  },
  {
    id: 4,
    title: "Specialized GenAI Applications",
    description: "Build advanced applications in code generation, agents, and industry-specific solutions",
    weeks: 10,
    totalTasks: 70,
    completedTasks: 0
  },
  {
    id: 5,
    title: "Leadership & Strategy",
    description: "Develop strategic thinking and leadership skills for GenAI initiatives",
    weeks: 6,
    totalTasks: 42,
    completedTasks: 0
  }
];

// Helper function to generate task IDs
const generateTaskId = (phase: number, week: number, day: number): string => 
  `p${phase}w${week}d${day}`;

// Generate comprehensive task data for all phases
export const sampleTasks: Task[] = [
  // Phase 1: Advanced GenAI Fundamentals (6 weeks, 42 tasks - 7 per week)
  ...Array.from({ length: 6 }, (_, weekIndex) => {
    const week = weekIndex + 1;
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const day = dayIndex + 1;
      const taskId = generateTaskId(1, week, day);
      
      const phase1Tasks = [
        // Week 1: Transformer fundamentals
        { title: 'Review transformer architecture papers', description: 'Deep dive into "Attention is All You Need" paper and understand the mathematical foundations', category: 'study' },
        { title: 'Implement basic transformer from scratch', description: 'Build a simple transformer model in PyTorch to understand the architecture', category: 'hands-on' },
        { title: 'Study BERT, GPT evolution', description: 'Understand the evolution from GPT-1 to GPT-4 and BERT architecture', category: 'study' },
        { title: 'Hands-on with Hugging Face Transformers', description: 'Build text classification and generation models using pre-trained transformers', category: 'hands-on' },
        { title: 'Mathematical foundations deep dive', description: 'Study linear algebra, probability theory, and optimization for deep learning', category: 'study' },
        { title: 'Implement attention mechanisms', description: 'Code different attention variants: scaled dot-product, multi-head, self-attention', category: 'hands-on' },
        { title: 'Build text generation pipeline', description: 'Create end-to-end text generation using pre-trained models', category: 'project' },
        
        // Week 2: Advanced architectures
        { title: 'Study Llama architecture', description: 'Deep dive into Llama model architecture and improvements over GPT', category: 'study' },
        { title: 'Implement RoPE positional encoding', description: 'Build Rotary Position Embedding from scratch', category: 'hands-on' },
        { title: 'Study mixture of experts', description: 'Learn about MoE architecture and scaling laws', category: 'study' },
        { title: 'Build custom tokenizer', description: 'Implement BPE tokenization from scratch', category: 'hands-on' },
        { title: 'Fine-tuning experiments', description: 'Compare different fine-tuning strategies: full, LoRA, prefix tuning', category: 'hands-on' },
        { title: 'Model compression techniques', description: 'Study and implement quantization, pruning, and distillation', category: 'study' },
        { title: 'Build instruction-following model', description: 'Fine-tune a model for instruction following tasks', category: 'project' },
        
        // Week 3: Multimodal foundations
        { title: 'Study CLIP architecture', description: 'Understand contrastive learning for vision-language models', category: 'study' },
        { title: 'Implement vision transformer', description: 'Build ViT from scratch for image classification', category: 'hands-on' },
        { title: 'Study DALL-E architecture', description: 'Learn about text-to-image generation models', category: 'study' },
        { title: 'Build image captioning model', description: 'Create a model that generates captions for images', category: 'hands-on' },
        { title: 'Study audio generation models', description: 'Learn about WaveNet, MusicLM, and speech synthesis', category: 'study' },
        { title: 'Implement cross-modal retrieval', description: 'Build a system for finding images from text queries', category: 'hands-on' },
        { title: 'Multimodal demo application', description: 'Create an app combining text, image, and audio generation', category: 'project' },
        
        // Week 4: Training and optimization
        { title: 'Study gradient descent variants', description: 'Deep dive into Adam, AdamW, and advanced optimizers', category: 'study' },
        { title: 'Implement learning rate scheduling', description: 'Code different LR schedules: cosine, warmup, polynomial decay', category: 'hands-on' },
        { title: 'Study batch normalization alternatives', description: 'Learn about LayerNorm, RMSNorm, and GroupNorm', category: 'study' },
        { title: 'Implement gradient checkpointing', description: 'Build memory-efficient training with gradient checkpointing', category: 'hands-on' },
        { title: 'Study distributed training', description: 'Learn about data and model parallelism strategies', category: 'study' },
        { title: 'Build training monitoring', description: 'Create comprehensive logging and visualization for training', category: 'hands-on' },
        { title: 'Hyperparameter optimization', description: 'Implement automated hyperparameter tuning pipeline', category: 'project' },
        
        // Week 5: Evaluation and benchmarking
        { title: 'Study evaluation metrics', description: 'Learn about BLEU, ROUGE, BERTScore, and human evaluation', category: 'study' },
        { title: 'Implement automated evaluation', description: 'Build comprehensive evaluation pipeline for text generation', category: 'hands-on' },
        { title: 'Study benchmark datasets', description: 'Explore GLUE, SuperGLUE, HELM, and domain-specific benchmarks', category: 'study' },
        { title: 'Build custom evaluation suite', description: 'Create evaluation metrics for specific use cases', category: 'hands-on' },
        { title: 'Study bias and fairness', description: 'Learn about detecting and mitigating bias in language models', category: 'study' },
        { title: 'Implement bias detection', description: 'Build tools to measure and visualize model biases', category: 'hands-on' },
        { title: 'Comprehensive model evaluation', description: 'Evaluate models across multiple dimensions and create report', category: 'project' },
        
        // Week 6: Research and future directions
        { title: 'Study latest research papers', description: 'Review cutting-edge papers in transformer architectures', category: 'study' },
        { title: 'Implement novel architecture', description: 'Build and experiment with a new transformer variant', category: 'hands-on' },
        { title: 'Study scaling laws', description: 'Learn about compute-optimal training and scaling behaviors', category: 'study' },
        { title: 'Experiment with architectural changes', description: 'Test modifications to existing architectures', category: 'hands-on' },
        { title: 'Study emergent capabilities', description: 'Research how capabilities emerge with scale', category: 'study' },
        { title: 'Build research prototype', description: 'Create a novel model or training technique', category: 'hands-on' },
        { title: 'Research project presentation', description: 'Document and present original research findings', category: 'project' }
      ];
      
      const taskIndex = (week - 1) * 7 + (day - 1);
      const task = phase1Tasks[taskIndex] || { title: `Phase 1 Task ${taskIndex + 1}`, description: 'Advanced GenAI learning task', category: 'study' };
      
      return {
        id: taskId,
        title: task.title,
        description: task.description,
        day,
        week,
        phase: 1,
        category: task.category as 'study' | 'hands-on' | 'project',
        estimatedHours: task.category === 'project' ? 8 : task.category === 'hands-on' ? 6 : 4,
        completed: false,
        resources: [
          {
            id: `${taskId}_r1`,
            title: 'Primary Resource',
            type: 'tutorial' as const,
            url: '#',
            description: 'Main learning resource for this task',
            estimatedTime: 60,
            difficulty: 'intermediate' as const,
            priority: 'high' as const
          }
        ]
      };
    });
  }).flat(),

  // Phase 2: Multi-Cloud GenAI Architecture (8 weeks, 56 tasks - 7 per week)
  ...Array.from({ length: 8 }, (_, weekIndex) => {
    const week = weekIndex + 1;
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const day = dayIndex + 1;
      const taskId = generateTaskId(2, week, day);
      
      const phase2Tasks = [
        // Week 1: Azure OpenAI fundamentals
        'Master Azure OpenAI Service setup and API', 'Build chat completions with Azure OpenAI', 'Implement Azure OpenAI embeddings', 'Study Azure AI Content Safety', 'Build RAG system on Azure', 'Deploy Azure OpenAI to production', 'Azure OpenAI cost optimization',
        // Week 2: AWS Bedrock mastery
        'Set up AWS Bedrock and model access', 'Build applications with Claude on Bedrock', 'Implement Bedrock embeddings and vectorization', 'Study AWS Bedrock security and compliance', 'Build multi-model Bedrock pipeline', 'Deploy Bedrock app to AWS Lambda', 'Bedrock cost optimization strategies',
        // Week 3: Google Cloud Vertex AI
        'Master Vertex AI setup and PaLM API', 'Build applications with Vertex AI models', 'Implement Vertex AI AutoML', 'Study Vertex AI MLOps pipeline', 'Build custom models on Vertex AI', 'Deploy Vertex AI to production', 'Vertex AI monitoring and optimization',
        // Week 4: Cross-cloud architecture patterns
        'Design multi-cloud GenAI architecture', 'Implement cloud-agnostic abstraction layer', 'Build cross-cloud model routing', 'Study multi-cloud security patterns', 'Implement cross-cloud monitoring', 'Build failover and redundancy', 'Multi-cloud cost optimization',
        // Week 5: Infrastructure as Code
        'Master Terraform for GenAI infrastructure', 'Build Azure GenAI resources with Terraform', 'Deploy AWS Bedrock with CloudFormation', 'Implement Google Cloud deployment with Terraform', 'Build cross-cloud IaC pipeline', 'Study infrastructure security scanning', 'Automate infrastructure monitoring',
        // Week 6: DevOps and MLOps
        'Build CI/CD for GenAI applications', 'Implement model versioning and registry', 'Study A/B testing for GenAI', 'Build automated testing for GenAI', 'Implement continuous model evaluation', 'Build deployment automation', 'MLOps monitoring and alerting',
        // Week 7: Security and compliance
        'Study GenAI security best practices', 'Implement data privacy and encryption', 'Build identity and access management', 'Study compliance frameworks for AI', 'Implement audit logging and monitoring', 'Build security scanning automation', 'Incident response for GenAI',
        // Week 8: Performance and scalability
        'Study GenAI performance optimization', 'Implement caching and load balancing', 'Build auto-scaling for GenAI workloads', 'Study distributed GenAI architectures', 'Implement performance monitoring', 'Build capacity planning tools', 'Capstone multi-cloud GenAI project'
      ];
      
      const taskIndex = (week - 1) * 7 + (day - 1);
      const title = phase2Tasks[taskIndex] || `Multi-Cloud GenAI Task ${taskIndex + 1}`;
      
      const category = day === 7 ? 'project' : day % 3 === 0 ? 'hands-on' : 'study';
      
      return {
        id: taskId,
        title,
        description: `Learn and implement ${title.toLowerCase()} for enterprise-scale GenAI solutions`,
        day,
        week,
        phase: 2,
        category: category as 'study' | 'hands-on' | 'project',
        estimatedHours: day === 7 ? 8 : day % 3 === 0 ? 6 : 4,
        completed: false,
        resources: [
          {
            id: `${taskId}_r1`,
            title: 'Cloud Documentation',
            type: 'documentation' as const,
            url: '#',
            description: 'Official cloud provider documentation',
            estimatedTime: 60,
            difficulty: 'intermediate' as const,
            priority: 'high' as const
          }
        ]
      };
    });
  }).flat(),

  // Phase 3: Enterprise GenAI Implementation (8 weeks, 56 tasks - 7 per week)
  ...Array.from({ length: 8 }, (_, weekIndex) => {
    const week = weekIndex + 1;
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const day = dayIndex + 1;
      const taskId = generateTaskId(3, week, day);
      
      const phase3Tasks = [
        // Week 1: Enterprise architecture
        'Design enterprise GenAI architecture', 'Study enterprise integration patterns', 'Build API gateway for GenAI services', 'Implement enterprise authentication', 'Design data governance framework', 'Build monitoring and observability', 'Enterprise architecture documentation',
        // Week 2: Advanced RAG systems
        'Design advanced RAG architecture', 'Implement hybrid search with dense/sparse retrieval', 'Build multi-modal RAG system', 'Implement RAG with graph databases', 'Study RAG evaluation metrics', 'Build RAG optimization pipeline', 'Production RAG deployment',
        // Week 3: Knowledge management
        'Design enterprise knowledge graph', 'Build document processing pipeline', 'Implement semantic search engine', 'Build knowledge extraction system', 'Study knowledge base versioning', 'Implement knowledge validation', 'Knowledge management dashboard',
        // Week 4: Governance and compliance
        'Design AI governance framework', 'Implement model approval workflows', 'Build compliance monitoring system', 'Study regulatory requirements', 'Implement audit trails', 'Build risk assessment tools', 'Governance dashboard and reporting',
        // Week 5: Security and privacy
        'Design GenAI security architecture', 'Implement data anonymization', 'Build privacy-preserving GenAI', 'Study federated learning approaches', 'Implement secure model serving', 'Build threat detection system', 'Security testing and validation',
        // Week 6: Performance optimization
        'Design high-performance GenAI systems', 'Implement model optimization techniques', 'Build caching and acceleration', 'Study hardware optimization', 'Implement load balancing strategies', 'Build performance monitoring', 'Performance testing and tuning',
        // Week 7: Change management
        'Design GenAI adoption strategy', 'Build training and education programs', 'Implement change management process', 'Study organizational transformation', 'Build user feedback systems', 'Implement adoption metrics', 'Change management documentation',
        // Week 8: Business integration
        'Design business process integration', 'Build ROI measurement framework', 'Implement business metrics tracking', 'Study value realization strategies', 'Build business reporting dashboard', 'Implement success metrics', 'Enterprise GenAI business case'
      ];
      
      const taskIndex = (week - 1) * 7 + (day - 1);
      const title = phase3Tasks[taskIndex] || `Enterprise GenAI Task ${taskIndex + 1}`;
      
      const category = day === 7 ? 'project' : day % 3 === 0 ? 'hands-on' : 'study';
      
      return {
        id: taskId,
        title,
        description: `Implement ${title.toLowerCase()} for enterprise-scale GenAI deployment`,
        day,
        week,
        phase: 3,
        category: category as 'study' | 'hands-on' | 'project',
        estimatedHours: day === 7 ? 8 : day % 3 === 0 ? 6 : 4,
        completed: false,
        resources: [
          {
            id: `${taskId}_r1`,
            title: 'Enterprise Resource',
            type: 'documentation' as const,
            url: '#',
            description: 'Enterprise implementation guide',
            estimatedTime: 60,
            difficulty: 'advanced' as const,
            priority: 'high' as const
          }
        ]
      };
    });
  }).flat(),

  // Phase 4: Specialized GenAI Applications (10 weeks, 70 tasks - 7 per week)
  ...Array.from({ length: 10 }, (_, weekIndex) => {
    const week = weekIndex + 1;
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const day = dayIndex + 1;
      const taskId = generateTaskId(4, week, day);
      
      const phase4Tasks = [
        // Week 1: Code generation
        'Study code generation models', 'Build code completion system', 'Implement code explanation tool', 'Build code review assistant', 'Study code translation systems', 'Implement code optimization tool', 'Code generation pipeline project',
        // Week 2: AI agents
        'Study autonomous agent architectures', 'Build planning and reasoning agents', 'Implement tool-using agents', 'Build multi-agent collaboration', 'Study agent memory systems', 'Implement agent evaluation framework', 'Autonomous agent project',
        // Week 3: Conversational AI
        'Design advanced chatbot architecture', 'Build context-aware conversation', 'Implement personality and tone control', 'Build multi-turn conversation system', 'Study conversation evaluation', 'Implement conversation analytics', 'Advanced chatbot project',
        // Week 4: Content creation
        'Build automated content generation', 'Implement style transfer systems', 'Build creative writing assistant', 'Implement content optimization', 'Study content evaluation metrics', 'Build content workflow automation', 'Content creation platform',
        // Week 5: Industry-specific applications
        'Build healthcare GenAI applications', 'Implement financial GenAI solutions', 'Build legal document processing', 'Implement educational GenAI tools', 'Study domain adaptation techniques', 'Build industry-specific evaluation', 'Industry application showcase',
        // Week 6: Advanced fine-tuning
        'Master parameter-efficient fine-tuning', 'Implement reinforcement learning from human feedback', 'Build custom training pipelines', 'Study instruction tuning techniques', 'Implement model alignment methods', 'Build fine-tuning automation', 'Custom model development project',
        // Week 7: Multimodal applications
        'Build text-to-image applications', 'Implement image-to-text systems', 'Build video generation tools', 'Implement audio synthesis systems', 'Study multimodal model training', 'Build multimodal evaluation', 'Multimodal application project',
        // Week 8: Research and innovation
        'Study cutting-edge research', 'Implement novel techniques', 'Build experimental prototypes', 'Study emerging model architectures', 'Implement research methodologies', 'Build innovation pipeline', 'Research innovation project',
        // Week 9: Integration and APIs
        'Build GenAI API ecosystem', 'Implement model serving infrastructure', 'Build integration frameworks', 'Study API design patterns', 'Implement rate limiting and quotas', 'Build API analytics and monitoring', 'API ecosystem project',
        // Week 10: Capstone project
        'Design capstone project architecture', 'Implement core functionality', 'Build user interface and experience', 'Implement testing and validation', 'Build deployment pipeline', 'Create documentation and presentation', 'Capstone project completion'
      ];
      
      const taskIndex = (week - 1) * 7 + (day - 1);
      const title = phase4Tasks[taskIndex] || `Specialized GenAI Task ${taskIndex + 1}`;
      
      const category = day === 7 ? 'project' : day % 3 === 0 ? 'hands-on' : 'study';
      
      return {
        id: taskId,
        title,
        description: `Build ${title.toLowerCase()} for specialized GenAI applications`,
        day,
        week,
        phase: 4,
        category: category as 'study' | 'hands-on' | 'project',
        estimatedHours: day === 7 ? 8 : day % 3 === 0 ? 6 : 4,
        completed: false,
        resources: [
          {
            id: `${taskId}_r1`,
            title: 'Specialized Resource',
            type: 'tutorial' as const,
            url: '#',
            description: 'Specialized application development guide',
            estimatedTime: 60,
            difficulty: 'advanced' as const,
            priority: 'high' as const
          }
        ]
      };
    });
  }).flat(),

  // Phase 5: Leadership & Strategy (6 weeks, 42 tasks - 7 per week)
  ...Array.from({ length: 6 }, (_, weekIndex) => {
    const week = weekIndex + 1;
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const day = dayIndex + 1;
      const taskId = generateTaskId(5, week, day);
      
      const phase5Tasks = [
        // Week 1: Strategic planning
        'Develop GenAI strategy framework', 'Study technology roadmap planning', 'Build business case development', 'Implement strategic assessment tools', 'Study competitive analysis methods', 'Build strategic planning process', 'Strategic planning workshop',
        // Week 2: Team leadership
        'Study GenAI team structure', 'Build talent acquisition strategy', 'Implement skill development programs', 'Study leadership in tech organizations', 'Build performance management system', 'Implement mentoring programs', 'Leadership development project',
        // Week 3: Stakeholder management
        'Build stakeholder engagement strategy', 'Study executive communication', 'Implement change management', 'Build consensus building skills', 'Study conflict resolution', 'Implement feedback systems', 'Stakeholder management simulation',
        // Week 4: Innovation management
        'Design innovation frameworks', 'Build idea evaluation processes', 'Implement innovation metrics', 'Study technology adoption curves', 'Build innovation culture', 'Implement innovation tracking', 'Innovation management project',
        // Week 5: Risk and governance
        'Build risk assessment frameworks', 'Study AI ethics and governance', 'Implement compliance management', 'Build risk mitigation strategies', 'Study regulatory landscape', 'Implement governance processes', 'Risk governance framework',
        // Week 6: Future visioning
        'Study future technology trends', 'Build scenario planning capabilities', 'Implement trend analysis', 'Study disruptive innovation', 'Build future strategy development', 'Implement vision communication', 'Future strategy presentation'
      ];
      
      const taskIndex = (week - 1) * 7 + (day - 1);
      const title = phase5Tasks[taskIndex] || `Leadership Task ${taskIndex + 1}`;
      
      const category = day === 7 ? 'project' : day % 3 === 0 ? 'hands-on' : 'study';
      
      return {
        id: taskId,
        title,
        description: `Develop ${title.toLowerCase()} for GenAI leadership and strategy`,
        day,
        week,
        phase: 5,
        category: category as 'study' | 'hands-on' | 'project',
        estimatedHours: day === 7 ? 8 : day % 3 === 0 ? 6 : 4,
        completed: false,
        resources: [
          {
            id: `${taskId}_r1`,
            title: 'Leadership Resource',
            type: 'book' as const,
            url: '#',
            description: 'Leadership and strategy development guide',
            estimatedTime: 60,
            difficulty: 'intermediate' as const,
            priority: 'high' as const
          }
        ]
      };
    });
  }).flat()
];

export const sampleProjects: Project[] = [
  {
    id: 'proj1',
    title: 'Multimodal GenAI Demo',
    description: 'Build a demonstration application combining text, image, and audio generation',
    phase: 1,
    status: 'not-started',
    technologies: ['Python', 'PyTorch', 'Hugging Face', 'Streamlit']
  },
  {
    id: 'proj2',
    title: 'Multi-Cloud GenAI Solution',
    description: 'Deploy identical GenAI solution across Azure, AWS, and GCP',
    phase: 2,
    status: 'not-started',
    technologies: ['Azure OpenAI', 'AWS Bedrock', 'Vertex AI', 'Terraform']
  },
  {
    id: 'proj3',
    title: 'Enterprise RAG System',
    description: 'Production-ready knowledge management system with advanced RAG patterns',
    phase: 3,
    status: 'not-started',
    technologies: ['LangChain', 'Vector DB', 'FastAPI', 'Docker']
  }
];

export const sampleSkills: Skill[] = [
  {
    id: 'skill1',
    name: 'Transformer Architecture',
    category: 'technical',
    level: 2,
    targetLevel: 5,
    relatedTasks: ['p1w1d1', 'p1w1d2']
  },
  {
    id: 'skill2',
    name: 'Azure OpenAI Service',
    category: 'platform',
    level: 4,
    targetLevel: 5,
    relatedTasks: ['p2w1d1', 'p2w1d2']
  },
  {
    id: 'skill3',
    name: 'GenAI Strategy & ROI',
    category: 'business',
    level: 3,
    targetLevel: 5,
    relatedTasks: ['p5w1d1', 'p5w1d2']
  }
];
