// LinkedIn content generation utilities
import { Task, DailyProgress, Phase, Project } from '../types';

export interface LinkedInPost {
  id: string;
  title: string;
  content: string;
  hashtags: string[];
  category: 'learning' | 'achievement' | 'insight' | 'project' | 'tip' | 'industry';
  linkedResources?: string[];
  createdDate: Date;
  published: boolean;
  engagementScore?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  readingTime: number;
  publishDate?: Date;
  status: 'draft' | 'published' | 'scheduled';
  linkedTasks: string[];
  linkedProjects: string[];
}

export interface ContentCalendar {
  date: string;
  contentType: 'linkedin' | 'blog' | 'both';
  topic: string;
  status: 'planned' | 'drafted' | 'published';
  linkedPhase?: number;
}

/**
 * Generates LinkedIn post content based on completed tasks
 */
export function generateLinkedInPostFromTask(task: Task, _progress: DailyProgress): LinkedInPost {
  const templates = {
    learning: [
      "🧠 Day {day} of my GenAI journey: {title}\n\n{insight}\n\n💡 Key takeaway: {takeaway}\n\n{resources}",
      "📚 Just completed: {title}\n\n{insight}\n\nWhat I learned:\n{bulletPoints}\n\n{resources}",
      "🚀 Progress update: {title}\n\n{insight}\n\nThis builds foundation for: {nextSteps}\n\n{resources}"
    ],
    hands_on: [
      "💻 Hands-on learning: {title}\n\n{insight}\n\nCode/Implementation highlights:\n{bulletPoints}\n\n{resources}",
      "🛠️ Built today: {title}\n\n{insight}\n\nTechnical insights:\n{bulletPoints}\n\n{resources}"
    ],
    project: [
      "🎯 Project milestone: {title}\n\n{insight}\n\nWhat I built:\n{bulletPoints}\n\nWhy it matters: {impact}\n\n{resources}"
    ]
  };

  const category = task.category === 'hands-on' ? 'hands_on' : 
                  task.category === 'project' ? 'project' : 'learning';
  
  const template = templates[category][Math.floor(Math.random() * templates[category].length)];
  
  const insight = generateInsightFromTask(task);
  const bulletPoints = generateBulletPoints(task);
  const takeaway = generateKeyTakeaway(task);
  const nextSteps = generateNextSteps(task);
  const impact = generateImpact(task);
  const resources = formatResourcesForLinkedIn(task.resources || []);
  
  const content = template
    .replace('{day}', task.day.toString())
    .replace('{title}', task.title)
    .replace('{insight}', insight)
    .replace('{takeaway}', takeaway)
    .replace('{bulletPoints}', bulletPoints)
    .replace('{nextSteps}', nextSteps)
    .replace('{impact}', impact)
    .replace('{resources}', resources);

  const hashtags = generateHashtags(task);

  return {
    id: `linkedin-${task.id}-${Date.now()}`,
    title: `Day ${task.day}: ${task.title}`,
    content,
    hashtags,
    category: 'learning',
    linkedResources: task.resources?.map(r => r.url).filter(Boolean) as string[],
    createdDate: new Date(),
    published: false
  };
}

/**
 * Generates weekly summary LinkedIn post
 */
export function generateWeeklySummaryPost(
  weekTasks: Task[], 
  weekNumber: number, 
  phase: Phase
): LinkedInPost {
  const completedTasks = weekTasks.filter(t => t.completed);
  const totalHours = completedTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  
  const keyLearnings = completedTasks.map(t => `• ${t.title}`).join('\n');
  
  const content = `🎯 Week ${weekNumber} Complete: ${phase.title}

This week I dove deep into:
${keyLearnings}

📊 Stats:
• ${completedTasks.length}/${weekTasks.length} tasks completed
• ${totalHours} hours of focused learning
• Multiple hands-on implementations

🚀 Next week: Advancing to more complex architectures and real-world applications.

Building expertise one day at a time! 

#GenAI #MachineLearning #AIArchitecture #ContinuousLearning #TechLeadership`;

  return {
    id: `weekly-${weekNumber}-${Date.now()}`,
    title: `Week ${weekNumber} Summary: ${phase.title}`,
    content,
    hashtags: ['#GenAI', '#MachineLearning', '#AIArchitecture', '#ContinuousLearning'],
    category: 'achievement',
    createdDate: new Date(),
    published: false
  };
}

/**
 * Generates blog post from project completion
 */
export function generateBlogPostFromProject(project: Project, relatedTasks: Task[]): BlogPost {
  const title = `Building ${project.title}: A GenAI Architecture Journey`;
  
  const excerpt = `Deep dive into building ${project.title} - exploring the architecture decisions, implementation challenges, and key learnings from this GenAI project.`;
  
  const content = generateBlogContent(project, relatedTasks);
  
  return {
    id: `blog-${project.id}-${Date.now()}`,
    title,
    content,
    excerpt,
    tags: ['GenAI', 'Architecture', 'Projects', ...project.technologies],
    category: 'Technical Tutorial',
    readingTime: Math.ceil(content.length / 1000) * 5, // Approximate reading time
    status: 'draft',
    linkedTasks: relatedTasks.map(t => t.id),
    linkedProjects: [project.id]
  };
}

/**
 * Generates insight content for LinkedIn posts
 */
function generateInsightFromTask(task: Task): string {
  const insights = [
    `Understanding ${task.title.toLowerCase()} has opened up new perspectives on how modern AI systems work.`,
    `Today's exploration of ${task.title.toLowerCase()} revealed the intricate engineering behind state-of-the-art AI.`,
    `Diving into ${task.title.toLowerCase()} showed me why this is fundamental to advanced GenAI applications.`,
    `The complexity and elegance of ${task.title.toLowerCase()} continues to amaze me.`
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
}

/**
 * Generates bullet points for posts
 */
function generateBulletPoints(task: Task): string {
  const points = [
    `• Implemented core concepts from ${task.description}`,
    `• Explored practical applications and use cases`,
    `• Connected theory to real-world implementations`,
    `• Identified key architectural patterns and best practices`
  ];
  
  return points.slice(0, 3).join('\n');
}

/**
 * Generates key takeaway
 */
function generateKeyTakeaway(_task: Task): string {
  const takeaways = [
    "The importance of understanding fundamentals before moving to complex implementations.",
    "How theoretical concepts translate directly to practical applications.",
    "The interconnected nature of modern AI architectures.",
    "Why hands-on practice is essential for deep understanding."
  ];
  
  return takeaways[Math.floor(Math.random() * takeaways.length)];
}

/**
 * Formats resources for LinkedIn
 */
function formatResourcesForLinkedIn(resources: any[]): string {
  if (!resources || resources.length === 0) return '';
  
  const formatted = resources.slice(0, 3).map(r => 
    `📎 ${r.title}${r.url ? ` - ${r.url}` : ''}`
  ).join('\n');
  
  return `\n📚 Resources:\n${formatted}`;
}

/**
 * Generates relevant hashtags
 */
function generateHashtags(task: Task): string[] {
  const baseHashtags = ['#GenAI', '#MachineLearning', '#AI'];
  
  const categoryHashtags = {
    'study': ['#Learning', '#Research', '#AIEducation'],
    'hands-on': ['#Coding', '#Implementation', '#TechSkills'],
    'project': ['#Projects', '#Building', '#Innovation'],
    'review': ['#Reflection', '#Growth', '#ContinuousLearning']
  };
  
  const phaseHashtags: { [key: number]: string[] } = {
    1: ['#Transformers', '#DeepLearning', '#NLP'],
    2: ['#CloudAI', '#Azure', '#AWS', '#GCP'],
    3: ['#Enterprise', '#MLOps', '#RAG'],
    4: ['#Applications', '#Agents', '#CodeGeneration'],
    5: ['#Leadership', '#Strategy', '#ResponsibleAI']
  };
  
  return [
    ...baseHashtags,
    ...(categoryHashtags[task.category] || []),
    ...(phaseHashtags[task.phase] || []),
    '#TechLeadership',
    '#CareerGrowth'
  ];
}

/**
 * Generates next steps content
 */
function generateNextSteps(_task: Task): string {
  const nextSteps = [
    "Advanced implementations and optimizations",
    "Integration with real-world applications",
    "Scaling and production considerations",
    "Cross-platform compatibility and deployment"
  ];
  
  return nextSteps[Math.floor(Math.random() * nextSteps.length)];
}

/**
 * Generates impact statement
 */
function generateImpact(_task: Task): string {
  const impacts = [
    "This foundation will be crucial for building enterprise-scale GenAI solutions.",
    "Understanding this enables better architectural decisions in complex AI systems.",
    "This knowledge directly applies to solving real-world business challenges with AI.",
    "These skills are essential for leading AI transformation initiatives."
  ];
  
  return impacts[Math.floor(Math.random() * impacts.length)];
}

/**
 * Generates full blog content
 */
function generateBlogContent(project: Project, relatedTasks: Task[]): string {
  return `# ${project.title}: A Comprehensive GenAI Implementation

## Introduction

In this post, I'll walk you through my journey building ${project.title}, sharing the architectural decisions, implementation challenges, and key insights gained throughout the process.

## Project Overview

${project.description}

**Technologies Used:**
${project.technologies.map(tech => `- ${tech}`).join('\n')}

## Learning Path

This project was built as part of my comprehensive GenAI learning roadmap, specifically during Phase ${project.phase}. The preparation involved:

${relatedTasks.map(task => `### Day ${task.day}: ${task.title}
${task.description}

**Key Resources:**
${(task.resources || []).map(r => `- [${r.title}](${r.url}) - ${r.description}`).join('\n')}
`).join('\n')}

## Architecture Deep Dive

[This section would be filled with specific architectural details based on the project]

## Implementation Challenges

[Details about specific challenges faced and how they were overcome]

## Key Learnings

[Important insights and lessons learned]

## Next Steps

[Plans for future enhancements and related projects]

## Conclusion

Building ${project.title} has been an incredible learning experience that has significantly advanced my understanding of GenAI architectures. The combination of theoretical study and hands-on implementation has provided invaluable insights that will inform future projects.

---

*This project is part of my 38-week GenAI Architect learning journey. Follow my progress on [LinkedIn](https://linkedin.com/in/yourprofile) where I share daily insights and weekly summaries.*

**Tags:** ${project.technologies.join(', ')}, GenAI, Architecture, Learning Journey`;
}

/**
 * Generates content calendar for the month
 */
export function generateContentCalendar(_tasks: Task[], month: number, year: number): ContentCalendar[] {
  const calendar: ContentCalendar[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dateString = date.toISOString().split('T')[0];
    
    // LinkedIn posts for completed tasks (daily)
    if (day % 2 === 0) { // Every other day
      calendar.push({
        date: dateString,
        contentType: 'linkedin',
        topic: 'Daily Learning Update',
        status: 'planned'
      });
    }
    
    // Weekly summary posts (Sundays)
    if (date.getDay() === 0) {
      calendar.push({
        date: dateString,
        contentType: 'linkedin',
        topic: 'Weekly Learning Summary',
        status: 'planned'
      });
    }
    
    // Blog posts (every 2 weeks)
    if (day === 15 || day === 30) {
      calendar.push({
        date: dateString,
        contentType: 'blog',
        topic: 'Technical Deep Dive',
        status: 'planned'
      });
    }
  }
  
  return calendar;
}

/**
 * Exports posts for LinkedIn scheduling tools
 */
export function exportPostsForScheduling(posts: LinkedInPost[]): string {
  const csvContent = [
    'Date,Time,Content,Hashtags,Category',
    ...posts.map(post => 
      `${post.createdDate.toISOString().split('T')[0]},09:00,"${post.content.replace(/"/g, '""')}","${post.hashtags.join(' ')}",${post.category}`
    )
  ].join('\n');
  
  return csvContent;
}
