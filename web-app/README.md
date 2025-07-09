# GenAI Learning Roadmap Tracker

A comprehensive web application for tracking your GenAI learning journey with **enhanced resource integration** and **Google Calendar export functionality**.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   cd web-app
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   - The app will automatically open at http://localhost:3000
   - If it doesn't open automatically, navigate to http://localhost:3000

## ✨ New Features Added

### 📅 **Google Calendar Export**
- Export learning tasks to Google Calendar or any calendar app
- ICS file generation for universal compatibility
- Customizable start dates and reminder settings
- Individual task scheduling with study resources embedded

### 📚 **Enhanced Study Resources**
Each of the 126 daily tasks now includes:
- **Research Papers**: Original publications and technical reports
- **Video Tutorials**: Expert lectures and demonstrations  
- **Code Examples**: GitHub repositories and implementations
- **Documentation**: Official platform guides and references
- **Hands-on Labs**: Interactive workshops and exercises
- **Resource Metadata**: Difficulty levels, time estimates, and priorities

## 📖 Features Overview

### 📊 Dashboard
- Overall progress tracking across all 5 phases
- Today's focus tasks with direct resource access
- Phase completion status and milestones
- Recent achievements and learning streaks

### 🗺️ Enhanced Roadmap
- **126 detailed daily tasks** across 5 phases (38 weeks total)
- **Rich resource integration** with 500+ curated study materials
- **Interactive task management** with progress tracking
- **Calendar export functionality** for seamless scheduling
- **Resource categorization** by type, difficulty, and priority

### 🚀 Projects
- 5 capstone portfolio projects for hands-on experience
- Multi-cloud implementations (Azure, AWS, Google Cloud)
- GitHub integration for project tracking
- Technology stack progression

### 🧠 Skills
- Technical skills progression tracking
- Platform expertise development (Azure OpenAI, AWS Bedrock, Vertex AI)
- Business acumen and strategy skills
- Visual skill level indicators with target goals

### 📈 Progress Analytics
- Daily learning activity charts and insights
- Phase completion metrics and timelines
- Learning streak tracking and motivation
- Resource completion analytics

## Learning Path Overview

### Phase 1: Advanced GenAI Fundamentals (6 weeks)
- Transformer architecture deep dive
- Large language model training
- Multimodal AI systems
- **Capstone**: Multimodal GenAI demo

### Phase 2: Multi-Cloud GenAI Architecture (8 weeks)
- Azure OpenAI Service mastery
- AWS Bedrock implementation
- Google Cloud Vertex AI
- **Capstone**: Multi-cloud GenAI solution

### Phase 3: Enterprise GenAI Implementation (8 weeks)
- Enterprise architecture patterns
- Advanced RAG systems
- MLOps for GenAI
- **Capstone**: Production GenAI platform

### Phase 4: Specialized GenAI Applications (10 weeks)
- Code generation systems
- Conversational AI agents
- Creative AI applications
- **Capstone**: Industry-specific AI agent

### Phase 5: Leadership & Strategy (6 weeks)
- GenAI business strategy
- Responsible AI implementation
- Team leadership skills
- **Capstone**: Complete governance framework

## Data Persistence
- Progress is automatically saved to browser localStorage
- Export/import functionality (coming soon)
- No server required - runs entirely in browser

## Customization
- Edit `src/data/roadmapData.ts` to customize learning content
- Modify phases, tasks, and projects to match your specific goals
- Add your own resources and links

## Troubleshooting

### Dependencies Issues
If you encounter dependency issues:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
If port 3000 is busy:
```bash
npm start -- --port 3001
```

### Performance
- The app is optimized for modern browsers
- Chrome, Firefox, Safari, and Edge are fully supported
- Mobile responsive design included

## Advanced Usage

### Adding Custom Tasks
1. Edit `src/data/roadmapData.ts`
2. Add tasks following the existing format
3. Include resources, estimated hours, and categories

### Customizing Phases
1. Modify the `phases` array in `roadmapData.ts`
2. Update week counts and descriptions
3. Ensure task counts match phase totals

### Integration with External Tools
- GitHub integration for project tracking
- Export data for use with other tools
- API endpoints (planned for future releases)

## Next Steps
1. Complete the initial setup
2. Review Phase 1 tasks and resources
3. Set up your development environment
4. Start your GenAI learning journey!

## Support
- Check the detailed roadmap in `roadmap/detailed-roadmap.md`
- Review individual phase documentation
- Create issues for bugs or feature requests
