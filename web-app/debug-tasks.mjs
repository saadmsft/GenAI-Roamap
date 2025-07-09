import fs from 'fs';

// Read the compiled JavaScript file to see what's actually exported
const distPath = './dist/assets/';
const files = fs.readdirSync(distPath);
const jsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));

console.log('Found JS file:', jsFile);

if (jsFile) {
  const content = fs.readFileSync(`${distPath}${jsFile}`, 'utf8');
  
  // Look for task data patterns
  const taskMatches = content.match(/sampleTasks.*?\[.*?\]/g);
  console.log('Task array patterns found:', taskMatches ? taskMatches.length : 0);
  
  // Look for specific task titles to verify content
  const titles = [
    'Review transformer architecture papers',
    'Master Azure OpenAI Service setup and API',
    'Design enterprise GenAI architecture'
  ];
  
  titles.forEach(title => {
    const found = content.includes(title);
    console.log(`"${title}": ${found ? '✅ Found' : '❌ Not found'}`);
  });
  
  // Count occurrences of task-like patterns
  const taskPatterns = content.match(/\{[^}]*title[^}]*\}/g);
  console.log('Task object patterns found:', taskPatterns ? taskPatterns.length : 0);
}
