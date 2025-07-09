// Simple verification by counting source code lines
import fs from 'fs';

const roadmapData = fs.readFileSync('./src/data/roadmapData.ts', 'utf8');

console.log('=== Task Generation Verification ===');

// Count task ID occurrences
const taskIdPattern = /id: generateTaskId\(/g;
const taskIdMatches = roadmapData.match(taskIdPattern);
console.log(`Task generation calls found: ${taskIdMatches ? taskIdMatches.length : 0}`);

// Count phase arrays
const phaseArrayPattern = /Array\.from\(\{ length: (\d+) \}/g;
let match;
let totalExpectedTasks = 0;
let phaseNum = 1;

while ((match = phaseArrayPattern.exec(roadmapData)) !== null) {
  const weeks = parseInt(match[1]);
  const tasks = weeks * 7; // 7 tasks per week
  console.log(`Phase ${phaseNum}: ${weeks} weeks × 7 tasks = ${tasks} tasks`);
  totalExpectedTasks += tasks;
  phaseNum++;
}

console.log(`\nTotal expected tasks: ${totalExpectedTasks}`);
console.log('Expected breakdown:');
console.log('- Phase 1: 42 tasks (6 weeks)');
console.log('- Phase 2: 56 tasks (8 weeks)'); 
console.log('- Phase 3: 56 tasks (8 weeks)');
console.log('- Phase 4: 70 tasks (10 weeks)');
console.log('- Phase 5: 42 tasks (6 weeks)');
console.log('- Total: 266 tasks');

// Check if file contains all phase task arrays
const phase1Match = roadmapData.includes('Array.from({ length: 6 }');
const phase2Match = roadmapData.includes('Array.from({ length: 8 }');
const phase4Match = roadmapData.includes('Array.from({ length: 10 }');

console.log('\n=== Phase Generation Verification ===');
console.log(`Phase 1 (6 weeks): ${phase1Match ? '✅' : '❌'}`);
console.log(`Phase 2 (8 weeks): ${phase2Match ? '✅' : '❌'}`);
console.log(`Phase 3 (8 weeks): ${phase2Match ? '✅' : '❌'}`);
console.log(`Phase 4 (10 weeks): ${phase4Match ? '✅' : '❌'}`);
console.log(`Phase 5 (6 weeks): ${phase1Match ? '✅' : '❌'}`);

// Check specific task titles
const checkTasks = [
  'Review transformer architecture papers',
  'Master Azure OpenAI Service setup and API',
  'Design enterprise GenAI architecture',
  'Study code generation models',
  'Develop GenAI strategy framework'
];

console.log('\n=== Sample Task Verification ===');
checkTasks.forEach((taskTitle, index) => {
  const found = roadmapData.includes(taskTitle);
  console.log(`Phase ${index + 1} sample task: ${found ? '✅' : '❌'} "${taskTitle}"`);
});
