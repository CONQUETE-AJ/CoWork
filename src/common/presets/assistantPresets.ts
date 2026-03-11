import type { PresetAgentType } from '@/types/acpTypes';

export type AssistantPreset = {
  id: string;
  avatar: string;
  presetAgentType?: PresetAgentType;
  /**
   * Directory containing all resources for this preset (relative to project root).
   * If set, both ruleFiles and skillFiles will be resolved from this directory.
   * Default: rules/ for rules, skills/ for skills
   */
  resourceDir?: string;
  ruleFiles: Record<string, string>;
  skillFiles?: Record<string, string>;
  /**
   * Default enabled skills for this assistant (skill names from skills/ directory).
   * 此助手默认启用的技能列表（来自 skills/ 目录的技能名称）
   */
  defaultEnabledSkills?: string[];
  nameI18n: Record<string, string>;
  descriptionI18n: Record<string, string>;
  promptsI18n?: Record<string, string[]>;
};

export const ASSISTANT_PRESETS: AssistantPreset[] = [
  {
    id: 'openclaw-setup',
    avatar: '🦞',
    presetAgentType: 'gemini',
    resourceDir: 'assistant/openclaw-setup',
    ruleFiles: {
      'en-US': 'openclaw-setup.md',
      'fr-FR': 'openclaw-setup.md',
    },
    defaultEnabledSkills: ['openclaw-setup', 'aionui-webui-setup'],
    nameI18n: {
      'en-US': 'OpenClaw Setup Expert',
      'fr-FR': "Expert d'installation OpenClaw",
    },
    descriptionI18n: {
      'en-US': 'Expert guide for installing, deploying, configuring, and troubleshooting OpenClaw. Proactively helps with setup, diagnoses issues, and provides security best practices.',
      'fr-FR': "Guide expert pour installer, déployer, configurer et dépanner OpenClaw. Aide proactive à l'installation, diagnostic des problèmes et bonnes pratiques de sécurité.",
    },
    promptsI18n: {
      'en-US': ['Help me install OpenClaw step by step', "My OpenClaw isn't working, please diagnose the issue", 'Configure Telegram channel for OpenClaw integration'],
      'fr-FR': ["Aide-moi à installer OpenClaw étape par étape", "Mon OpenClaw ne fonctionne pas, peux-tu diagnostiquer le problème ?", "Configurer le canal Telegram pour l'intégration OpenClaw"],
    },
  },
  {
    id: 'cowork',
    avatar: 'cowork.svg',
    presetAgentType: 'gemini',
    resourceDir: 'assistant/cowork',
    ruleFiles: {
      'en-US': 'cowork.md',
      'fr-FR': 'cowork.md', // 使用同一个文件，内容已精简 / Use same file, content is simplified
    },
    skillFiles: {
      'en-US': 'cowork-skills.md',
      'fr-FR': 'cowork-skills.md',
    },
    defaultEnabledSkills: ['skill-creator', 'pptx', 'docx', 'pdf', 'xlsx'],
    nameI18n: {
      'en-US': 'Cowork',
      'fr-FR': 'Cowork',
    },
    descriptionI18n: {
      'en-US': 'Autonomous task execution with file operations, document processing, and multi-step workflow planning.',
      'fr-FR': "Exécution autonome des tâches avec opérations sur les fichiers, traitement de documents et planification de workflows en plusieurs étapes.",
    },
    promptsI18n: {
      'en-US': ['Analyze the current project structure and suggest improvements', 'Automate the build and deployment process', 'Extract and summarize key information from all PDF files'],
      'fr-FR': ["Analyser la structure actuelle du projet et proposer des améliorations", "Automatiser le processus de build et de déploiement", "Extraire et résumer les informations clés de tous les fichiers PDF"],
    },
  },
  {
    id: 'pptx-generator',
    avatar: '📊',
    presetAgentType: 'gemini',
    resourceDir: 'assistant/pptx-generator',
    ruleFiles: {
      'en-US': 'pptx-generator.md',
      'fr-FR': 'pptx-generator.md',
    },
    nameI18n: {
      'en-US': 'PPTX Generator',
      'fr-FR': 'Générateur PPTX',
    },
    descriptionI18n: {
      'en-US': 'Generate local PPTX assets and structure for pptxgenjs.',
      'fr-FR': 'Génère des ressources et une structure PPTX locales pour pptxgenjs.',
    },
    promptsI18n: {
      'en-US': ['Create a professional slide deck about AI trends with 10 slides', 'Generate a quarterly business report presentation', 'Make a product launch presentation with visual elements'],
      'fr-FR': ["Créer un deck professionnel de 10 slides sur les tendances IA", "Générer une présentation de rapport trimestriel", "Créer une présentation de lancement produit avec des éléments visuels"],
    },
  },
  {
    id: 'pdf-to-ppt',
    avatar: '📄',
    presetAgentType: 'gemini',
    resourceDir: 'assistant/pdf-to-ppt',
    ruleFiles: {
      'en-US': 'pdf-to-ppt.md',
      'fr-FR': 'pdf-to-ppt.md',
    },
    nameI18n: {
      'en-US': 'PDF to PPT',
      'fr-FR': 'PDF to PPT',
    },
    descriptionI18n: {
      'en-US': 'Convert PDF to PPT with watermark removal rules.',
      'fr-FR': 'Convertit un PDF en PPT avec des règles de suppression de filigrane.',
    },
    promptsI18n: {
      'en-US': ['Convert report.pdf to a PowerPoint presentation', 'Extract all charts and diagrams from whitepaper.pdf', 'Transform this PDF document into slides with proper formatting'],
      'fr-FR': ["Convertir report.pdf en présentation PowerPoint", "Extraire tous les graphiques et schémas de whitepaper.pdf", "Transformer ce document PDF en slides bien formatées"],
    },
  },
  {
    id: 'game-3d',
    avatar: '🎮',
    presetAgentType: 'gemini',
    resourceDir: 'assistant/game-3d',
    ruleFiles: {
      'en-US': 'game-3d.md',
      'fr-FR': 'game-3d.md',
    },
    nameI18n: {
      'en-US': '3D Game',
      'fr-FR': 'Jeu 3D',
    },
    descriptionI18n: {
      'en-US': 'Generate a complete 3D platform collection game in one HTML file.',
      'fr-FR': 'Génère un jeu 3D de plateforme/collecte complet dans un seul fichier HTML.',
    },
    promptsI18n: {
      'en-US': ['Create a 3D platformer game with jumping mechanics', 'Make a coin collection game with obstacles', 'Build a 3D maze exploration game'],
      'fr-FR': ["Créer un jeu de plateforme 3D avec mécanique de saut", "Créer un jeu de collecte de pièces avec obstacles", "Construire un jeu d'exploration de labyrinthe 3D"],
    },
  },
  {
    id: 'ui-ux-pro-max',
    avatar: '🎨',
    presetAgentType: 'gemini',
    resourceDir: 'assistant/ui-ux-pro-max',
    ruleFiles: {
      'en-US': 'ui-ux-pro-max.md',
      'fr-FR': 'ui-ux-pro-max.md',
    },
    nameI18n: {
      'en-US': 'UI/UX Pro Max',
      'fr-FR': 'UI/UX Pro Max',
    },
    descriptionI18n: {
      'en-US': 'Professional UI/UX design intelligence with 57 styles, 95 color palettes, 56 font pairings, and stack-specific best practices.',
      'fr-FR': "Assistant UI/UX professionnel avec 57 styles, 95 palettes de couleurs, 56 associations de polices et des bonnes pratiques par stack.",
    },
    promptsI18n: {
      'en-US': ['Design a modern login page for a fintech mobile app', 'Create a color palette for a nature-themed website', 'Design a dashboard interface for a SaaS product'],
      'fr-FR': ["Concevoir une page de connexion moderne pour une app fintech mobile", "Créer une palette de couleurs pour un site sur le thème de la nature", "Concevoir une interface de dashboard pour un produit SaaS"],
    },
  },
  {
    id: 'planning-with-files',
    avatar: '📋',
    presetAgentType: 'gemini',
    resourceDir: 'assistant/planning-with-files',
    ruleFiles: {
      'en-US': 'planning-with-files.md',
      'fr-FR': 'planning-with-files.md',
    },
    nameI18n: {
      'en-US': 'Planning with Files',
      'fr-FR': 'Planification avec fichiers',
    },
    descriptionI18n: {
      'en-US': 'Manus-style file-based planning for complex tasks. Uses task_plan.md, findings.md, and progress.md to maintain persistent context.',
      'fr-FR': 'Planification basée sur des fichiers (style Manus) pour des tâches complexes. Utilise task_plan.md, findings.md et progress.md pour conserver le contexte.',
    },
    promptsI18n: {
      'en-US': ['Plan a comprehensive refactoring task with milestones', 'Break down the feature implementation into actionable steps', 'Create a project plan for migrating to a new framework'],
      'fr-FR': ["Planifier une refonte complète avec des jalons", "Découper l'implémentation d'une fonctionnalité en étapes actionnables", "Créer un plan de migration vers un nouveau framework"],
    },
  },
  {
    id: 'human-3-coach',
    avatar: '🧭',
    presetAgentType: 'gemini',
    resourceDir: 'assistant/human-3-coach',
    ruleFiles: {
      'en-US': 'human-3-coach.md',
      'fr-FR': 'human-3-coach.md',
    },
    nameI18n: {
      'en-US': 'HUMAN 3.0 Coach',
      'fr-FR': 'Coach HUMAN 3.0',
    },
    descriptionI18n: {
      'en-US': 'Personal development coach based on HUMAN 3.0 framework: 4 Quadrants (Mind/Body/Spirit/Vocation), 3 Levels, 3 Growth Phases.',
      'fr-FR': 'Coach de développement personnel basé sur le framework HUMAN 3.0 : 4 quadrants (esprit/corps/spiritualité/vocation), 3 niveaux et 3 phases de croissance.',
    },
    promptsI18n: {
      'en-US': ['Help me set quarterly goals across all life quadrants', 'Reflect on my career progress and plan next steps', 'Create a personal development plan for the next 3 months'],
      'fr-FR': ["Aide-moi à définir des objectifs trimestriels sur tous les axes de vie", "Aide-moi à faire le point sur ma progression de carrière et à planifier la suite", "Créer un plan de développement personnel pour les 3 prochains mois"],
    },
  },
  {
    id: 'social-job-publisher',
    avatar: '📣',
    presetAgentType: 'gemini',
    resourceDir: 'assistant/social-job-publisher',
    ruleFiles: {
      'en-US': 'social-job-publisher.md',
      'fr-FR': 'social-job-publisher.md',
    },
    skillFiles: {
      'en-US': 'social-job-publisher-skills.md',
      'fr-FR': 'social-job-publisher-skills.md',
    },
    defaultEnabledSkills: ['xiaohongshu-recruiter', 'x-recruiter'],
    nameI18n: {
      'en-US': 'Social Job Publisher',
      'fr-FR': "Publication d'offres sociales",
    },
    descriptionI18n: {
      'en-US': 'Expand hiring requests into a full JD, images, and publish to social platforms via connectors.',
      'fr-FR': "Transforme une demande de recrutement en fiche de poste complète, visuels et publication sur les réseaux via connecteurs.",
    },
    promptsI18n: {
      'en-US': ['Create a comprehensive job post for Senior Full-Stack Engineer', 'Draft an engaging hiring tweet for social media', 'Create a multi-platform job posting (LinkedIn, X, Redbook)'],
      'fr-FR': ["Créer une offre complète pour un poste d'ingénieur full-stack senior", "Rédiger un post de recrutement engageant pour les réseaux", "Créer une publication multi-plateformes (LinkedIn, X, Redbook)"],
    },
  },
  {
    id: 'moltbook',
    avatar: '🦞',
    presetAgentType: 'gemini',
    resourceDir: 'assistant/moltbook',
    ruleFiles: {
      'en-US': 'moltbook.md',
      'fr-FR': 'moltbook.md',
    },
    skillFiles: {
      'en-US': 'moltbook-skills.md',
      'fr-FR': 'moltbook-skills.md',
    },
    defaultEnabledSkills: ['moltbook'],
    nameI18n: {
      'en-US': 'moltbook',
      'fr-FR': 'moltbook',
    },
    descriptionI18n: {
      'en-US': 'The social network for AI agents. Post, comment, upvote, and create communities.',
      'fr-FR': "Le réseau social pour agents IA : publier, commenter, voter et créer des communautés.",
    },
    promptsI18n: {
      'en-US': ['Check my moltbook feed for latest updates', 'Post an interesting update to moltbook', 'Check for new direct messages'],
      'fr-FR': ["Vérifier mon flux moltbook pour les dernières nouveautés", "Publier une mise à jour intéressante sur moltbook", "Vérifier s'il y a de nouveaux messages privés"],
    },
  },
  {
    id: 'beautiful-mermaid',
    avatar: '📈',
    presetAgentType: 'gemini',
    resourceDir: 'assistant/beautiful-mermaid',
    ruleFiles: {
      'en-US': 'beautiful-mermaid.md',
      'fr-FR': 'beautiful-mermaid.md',
    },
    defaultEnabledSkills: ['mermaid'],
    nameI18n: {
      'en-US': 'Beautiful Mermaid',
      'fr-FR': 'Mermaid élégant',
    },
    descriptionI18n: {
      'en-US': 'Create flowcharts, sequence diagrams, state diagrams, class diagrams, and ER diagrams with beautiful themes.',
      'fr-FR': 'Crée des organigrammes, diagrammes de séquence, diagrammes d’état, de classes et ER avec des thèmes soignés.',
    },
    promptsI18n: {
      'en-US': ['Draw a detailed user login authentication flowchart', 'Create an API sequence diagram for payment processing', 'Create a system architecture diagram'],
      'fr-FR': ["Dessiner un organigramme détaillé du flux d'authentification utilisateur", "Créer un diagramme de séquence API pour le traitement des paiements", "Créer un diagramme d'architecture système"],
    },
  },
  {
    id: 'story-roleplay',
    avatar: '📖',
    presetAgentType: 'gemini',
    resourceDir: 'assistant/story-roleplay',
    ruleFiles: {
      'en-US': 'story-roleplay.md',
      'fr-FR': 'story-roleplay.md',
    },
    defaultEnabledSkills: ['story-roleplay'],
    nameI18n: {
      'en-US': 'Story Roleplay',
      'fr-FR': 'Jeu de rôle narratif',
    },
    descriptionI18n: {
      'en-US': 'Immersive story roleplay. Start by: 1) Natural language to create characters, 2) Paste PNG images, or 3) Open folder with character cards (PNG/JSON) and world info.',
      'fr-FR': "Jeu de rôle narratif immersif. Démarrez en : 1) langage naturel pour créer des personnages, 2) collage d'images PNG, 3) ouverture d'un dossier avec fiches personnages (PNG/JSON) et infos d'univers.",
    },
    promptsI18n: {
      'en-US': ['Start an epic fantasy adventure with a brave warrior', 'Create a detailed character with backstory and personality', 'Begin an interactive story in a sci-fi setting'],
      'fr-FR': ["Commencer une aventure fantasy épique avec un guerrier courageux", "Créer un personnage détaillé avec histoire et personnalité", "Démarrer une histoire interactive dans un univers de science-fiction"],
    },
  },
];
