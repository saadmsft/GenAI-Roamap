import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import {
  LinkedIn,
  Article,
  Edit,
  ContentCopy,
  Share,
  Schedule,
  Download,
  Refresh,
} from '@mui/icons-material';
import { Task, Phase, Project } from '../types';
import {
  generateLinkedInPostFromTask,
  generateWeeklySummaryPost,
  generateBlogPostFromProject,
  LinkedInPost,
  BlogPost,
  ContentCalendar,
  generateContentCalendar,
} from '../utils/linkedinContent';
import { shareToLinkedIn, shareToMedium, copyLinkedInPostToClipboard } from '../utils/socialSharing';

interface ContentCreatorDialogProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
  phases: Phase[];
  projects: Project[];
  completedTasks: Task[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const ContentCreatorDialog: React.FC<ContentCreatorDialogProps> = ({
  open,
  onClose,
  phases,
  projects,
  completedTasks,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [generatedLinkedInPost, setGeneratedLinkedInPost] = useState<LinkedInPost | null>(null);
  const [generatedBlogPost, setGeneratedBlogPost] = useState<BlogPost | null>(null);
  const [contentCalendar, setContentCalendar] = useState<ContentCalendar[]>([]);
  const [customContent, setCustomContent] = useState('');

  const handleGenerateLinkedInPost = () => {
    const task = completedTasks.find(t => t.id === selectedTask);
    if (task) {
      const mockProgress = { 
        date: new Date().toISOString().split('T')[0], 
        tasksCompleted: 1,
        hoursStudied: task.estimatedHours,
        notes: task.notes || '',
        mood: 4 as 1 | 2 | 3 | 4 | 5
      };
      const post = generateLinkedInPostFromTask(task, mockProgress);
      setGeneratedLinkedInPost(post);
    }
  };

  const handleGenerateWeeklySummary = () => {
    const weekTasks = completedTasks.filter(t => t.week === selectedWeek);
    const phase = phases.find(p => p.id === 1) || phases[0]; // Default to first phase
    if (weekTasks.length > 0 && phase) {
      const post = generateWeeklySummaryPost(weekTasks, selectedWeek, phase);
      setGeneratedLinkedInPost(post);
    }
  };

  const handleGenerateBlogPost = () => {
    const project = projects.find(p => p.id === selectedProject);
    if (project) {
      const relatedTasks = completedTasks.filter(t => 
        t.phase === project.phase // Link tasks by phase instead
      );
      const post = generateBlogPostFromProject(project, relatedTasks);
      setGeneratedBlogPost(post);
    }
  };

  const handleGenerateContentCalendar = () => {
    const currentDate = new Date();
    const calendar = generateContentCalendar(completedTasks, currentDate.getMonth() + 1, currentDate.getFullYear());
    setContentCalendar(calendar);
  };

  const handleCopyToClipboard = (content: string) => {
    copyLinkedInPostToClipboard(content);
  };

  const handleShareToLinkedIn = (post: LinkedInPost) => {
    shareToLinkedIn(post.content, {
      title: post.title,
      summary: post.content.substring(0, 250)
    });
  };

  const handleShareToMedium = (post: BlogPost) => {
    shareToMedium(post.title, post.content);
  };

  const handleExportCalendar = () => {
    const csvContent = [
      'Date,Content Type,Topic,Status,Phase',
      ...contentCalendar.map(item => 
        `${item.date},${item.contentType},${item.topic},${item.status},${item.linkedPhase || ''}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'content-calendar.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Share />
          Content Creator - LinkedIn & Blog Posts
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab icon={<LinkedIn />} label="LinkedIn Posts" />
            <Tab icon={<Article />} label="Blog Posts" />
            <Tab icon={<Schedule />} label="Content Calendar" />
          </Tabs>
        </Box>

        {/* LinkedIn Posts Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Generate LinkedIn Content</Typography>
              
              {/* Task-based Post */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Post from Completed Task
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select Completed Task</InputLabel>
                    <Select
                      value={selectedTask}
                      onChange={(e) => setSelectedTask(e.target.value)}
                    >
                      {completedTasks.map(task => (
                        <MenuItem key={task.id} value={task.id}>
                          Day {task.day}: {task.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleGenerateLinkedInPost}
                    disabled={!selectedTask}
                    startIcon={<Refresh />}
                  >
                    Generate Post
                  </Button>
                </CardContent>
              </Card>

              {/* Weekly Summary */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Weekly Summary Post
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select Week</InputLabel>
                    <Select
                      value={selectedWeek}
                      onChange={(e) => setSelectedWeek(Number(e.target.value))}
                    >
                      {Array.from({length: 12}, (_, i) => i + 1).map(week => (
                        <MenuItem key={week} value={week}>
                          Week {week}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleGenerateWeeklySummary}
                    startIcon={<Refresh />}
                  >
                    Generate Summary
                  </Button>
                </CardContent>
              </Card>

              {/* Custom Post */}
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Custom LinkedIn Post
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Write your custom LinkedIn post here..."
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button variant="outlined" disabled={!customContent}>
                    Preview Post
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              {generatedLinkedInPost && (
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">Generated Post</Typography>
                      <Box>
                        <Tooltip title="Copy to Clipboard">
                          <IconButton 
                            onClick={() => handleCopyToClipboard(generatedLinkedInPost.content)}
                            size="small"
                          >
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                      {generatedLinkedInPost.content}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      {generatedLinkedInPost.hashtags.map(tag => (
                        <Chip key={tag} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
                      ))}
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary">
                      Category: {generatedLinkedInPost.category} | 
                      Created: {generatedLinkedInPost.createdDate.toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<LinkedIn />}
                      onClick={() => handleShareToLinkedIn(generatedLinkedInPost)}
                    >
                      Share to LinkedIn
                    </Button>
                    <Button size="small">Schedule Post</Button>
                  </CardActions>
                </Card>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Blog Posts Tab */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Generate Blog Content</Typography>
              
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Blog Post from Project
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select Project</InputLabel>
                    <Select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                    >
                      {projects.map(project => (
                        <MenuItem key={project.id} value={project.id}>
                          {project.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleGenerateBlogPost}
                    disabled={!selectedProject}
                    startIcon={<Article />}
                  >
                    Generate Blog Post
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              {generatedBlogPost && (
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">Generated Blog Post</Typography>
                      <Box>
                        <Tooltip title="Copy to Clipboard">
                          <IconButton 
                            onClick={() => handleCopyToClipboard(generatedBlogPost.content)}
                            size="small"
                          >
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download as Markdown">
                          <IconButton size="small">
                            <Download />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Typography variant="h6" gutterBottom>
                      {generatedBlogPost.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {generatedBlogPost.excerpt}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
                      {generatedBlogPost.content.substring(0, 500)}...
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      {generatedBlogPost.tags.map(tag => (
                        <Chip key={tag} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
                      ))}
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary">
                      Reading Time: {generatedBlogPost.readingTime} min | 
                      Status: {generatedBlogPost.status}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<Article />}
                      onClick={() => handleShareToMedium(generatedBlogPost)}
                    >
                      Publish to Medium
                    </Button>
                    <Button size="small">Save as Draft</Button>
                  </CardActions>
                </Card>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Content Calendar Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Content Calendar</Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={handleGenerateContentCalendar}
                startIcon={<Refresh />}
                sx={{ mr: 1 }}
              >
                Generate Calendar
              </Button>
              <Button
                variant="contained"
                onClick={handleExportCalendar}
                startIcon={<Download />}
                disabled={contentCalendar.length === 0}
              >
                Export CSV
              </Button>
            </Box>
          </Box>

          {contentCalendar.length > 0 && (
            <Card>
              <CardContent>
                <List>
                  {contentCalendar.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={item.topic}
                          secondary={`${item.date} - ${item.contentType} - Phase ${item.linkedPhase}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip 
                            label={item.status} 
                            size="small" 
                            color={item.status === 'published' ? 'success' : 'default'}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < contentCalendar.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </TabPanel>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
