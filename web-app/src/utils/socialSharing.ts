// LinkedIn sharing utilities

export interface LinkedInShareOptions {
  url?: string;
  title?: string;
  summary?: string;
  source?: string;
}

/**
 * Opens LinkedIn share dialog with the provided content
 */
export function shareToLinkedIn(content: string, options: LinkedInShareOptions = {}) {
  const encodedUrl = encodeURIComponent(options.url || window.location.href);
  const encodedTitle = encodeURIComponent(options.title || 'GenAI Learning Progress');
  const encodedSummary = encodeURIComponent(options.summary || content.substring(0, 250) + '...');
  
  // LinkedIn share URL format
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`;
  
  // Open in new window
  window.open(linkedinUrl, '_blank', 'width=600,height=600,scrollbars=yes,resizable=yes');
}

/**
 * Generates a LinkedIn post URL with pre-filled content
 * Note: LinkedIn removed direct post pre-filling, but this can be used as a template
 */
export function generateLinkedInPostTemplate(content: string) {
  const template = `I'm sharing my GenAI learning progress:

${content}

#GenAI #MachineLearning #AIArchitecture #ContinuousLearning #TechCareer

---
Generated with my GenAI Learning Roadmap tracker.`;

  return template;
}

/**
 * Creates a downloadable text file with the LinkedIn post content
 */
export function downloadLinkedInPost(content: string, filename: string = 'linkedin-post.txt') {
  const template = generateLinkedInPostTemplate(content);
  const blob = new Blob([template], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Copies LinkedIn post template to clipboard
 */
export async function copyLinkedInPostToClipboard(content: string): Promise<boolean> {
  try {
    const template = generateLinkedInPostTemplate(content);
    await navigator.clipboard.writeText(template);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Generates a hashtag-optimized version of the content
 */
export function optimizeForLinkedIn(content: string, hashtags: string[] = []): string {
  // Add line breaks for better readability
  const formattedContent = content
    .replace(/\n\n/g, '\n\n') // Preserve double line breaks
    .replace(/\n/g, '\n\n'); // Convert single line breaks to double
  
  // Add hashtags at the end
  const hashtagString = hashtags.length > 0 
    ? '\n\n' + hashtags.join(' ')
    : '\n\n#GenAI #MachineLearning #AIArchitecture #Learning';
  
  return formattedContent + hashtagString;
}

/**
 * Medium.com sharing utility
 */
export function shareToMedium(title: string, content: string) {
  // Medium's draft creation URL (requires user to be logged in)
  const mediumUrl = `https://medium.com/new-story`;
  
  // Create a template that users can copy-paste
  const template = `${title}

${content}

---
This post was generated from my GenAI learning journey. You can track your own progress at: ${window.location.origin}`;
  
  // Copy to clipboard and open Medium
  navigator.clipboard.writeText(template).then(() => {
    window.open(mediumUrl, '_blank');
  });
}

/**
 * Dev.to sharing utility
 */
export function shareToDevTo(title: string, content: string, tags: string[] = []) {
  const devToUrl = 'https://dev.to/new';
  
  // Format content for Dev.to markdown
  const markdownContent = `---
title: ${title}
published: false
tags: ${tags.join(', ')}
---

${content}

---
*This post was generated from my GenAI learning roadmap tracker.*`;
  
  // Copy to clipboard and open Dev.to
  navigator.clipboard.writeText(markdownContent).then(() => {
    window.open(devToUrl, '_blank');
  });
}

/**
 * Hashnode sharing utility
 */
export function shareToHashnode(title: string, content: string) {
  const hashnodeUrl = 'https://hashnode.com/create/story';
  
  const template = `# ${title}

${content}

---
*Generated from my GenAI learning roadmap. Track your own progress at: ${window.location.origin}*`;
  
  navigator.clipboard.writeText(template).then(() => {
    window.open(hashnodeUrl, '_blank');
  });
}

/**
 * Export content calendar to popular scheduling tools
 */
export function exportToSocialScheduler(posts: any[], platform: 'hootsuite' | 'buffer' | 'sprout') {
  const csvContent = [
    'Date,Platform,Content,Hashtags,Status',
    ...posts.map(post => {
      const content = post.content.replace(/"/g, '""'); // Escape quotes for CSV
      const hashtags = post.hashtags?.join(' ') || '';
      return `${post.createdDate || new Date().toISOString().split('T')[0]},LinkedIn,"${content}","${hashtags}",Draft`;
    })
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `social-content-${platform}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
