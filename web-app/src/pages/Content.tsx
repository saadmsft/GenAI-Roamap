import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  Tab,
  Tabs,
  TextField,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  LinkedIn,
  Article,
  Add,
  Edit,
  Delete,
  Share,
  ContentCopy,
  TrendingUp,
  CalendarMonth,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import {
  LinkedInPost,
  BlogPost,
  ContentCalendar,
  generateLinkedInPostFromTask,
  generateWeeklySummaryPost,
  generateContentCalendar,
} from '../utils/linkedinContent';
import { shareToLinkedIn, shareToMedium, copyLinkedInPostToClipboard } from '../utils/socialSharing';

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

const Content = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [contentCalendar, setContentCalendar] = useState<ContentCalendar[]>([]);
  const [editDialog, setEditDialog] = useState<{open: boolean, post?: LinkedInPost | BlogPost, type?: 'linkedin' | 'blog'}>({open: false});
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');

  // Load saved content from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('linkedin-posts');
    const savedBlogs = localStorage.getItem('blog-posts');
    const savedCalendar = localStorage.getItem('content-calendar');

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
    if (savedBlogs) {
      setBlogPosts(JSON.parse(savedBlogs));
    }
    if (savedCalendar) {
      setContentCalendar(JSON.parse(savedCalendar));
    }
  }, []);

  // Save content to localStorage
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleGenerateQuickPost = () => {
    const completedTasks = state.tasks.filter(t => t.completed);
    if (completedTasks.length === 0) return;

    const randomTask = completedTasks[Math.floor(Math.random() * completedTasks.length)];
    const mockProgress = {
      date: new Date().toISOString().split('T')[0],
      tasksCompleted: 1,
      hoursStudied: randomTask.estimatedHours,
      notes: randomTask.notes || '',
      mood: 4 as 1 | 2 | 3 | 4 | 5
    };

    const newPost = generateLinkedInPostFromTask(randomTask, mockProgress);
    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
    saveToStorage('linkedin-posts', updatedPosts);
  };

  const handleGenerateWeeklyPost = () => {
    const currentWeek = Math.ceil(state.tasks.filter(t => t.completed).length / 5);
    const weekTasks = state.tasks.filter(t => t.week === currentWeek && t.completed);
    const phase = state.phases[0]; // Default to first phase

    if (weekTasks.length > 0) {
      const newPost = generateWeeklySummaryPost(weekTasks, currentWeek, phase);
      const updatedPosts = [...posts, newPost];
      setPosts(updatedPosts);
      saveToStorage('linkedin-posts', updatedPosts);
    }
  };

  const handleEditPost = (post: LinkedInPost | BlogPost, type: 'linkedin' | 'blog') => {
    setEditDialog({open: true, post, type});
    setEditContent(post.content);
    setEditTitle(post.title);
  };

  const handleSaveEdit = () => {
    if (!editDialog.post) return;

    if (editDialog.type === 'linkedin') {
      const updatedPosts = posts.map(p => 
        p.id === editDialog.post!.id 
          ? {...p, content: editContent, title: editTitle}
          : p
      );
      setPosts(updatedPosts);
      saveToStorage('linkedin-posts', updatedPosts);
    } else {
      const updatedBlogs = blogPosts.map(p => 
        p.id === editDialog.post!.id 
          ? {...p, content: editContent, title: editTitle}
          : p
      );
      setBlogPosts(updatedBlogs);
      saveToStorage('blog-posts', updatedBlogs);
    }

    setEditDialog({open: false});
  };

  const handleDeletePost = (id: string, type: 'linkedin' | 'blog') => {
    if (type === 'linkedin') {
      const updatedPosts = posts.filter(p => p.id !== id);
      setPosts(updatedPosts);
      saveToStorage('linkedin-posts', updatedPosts);
    } else {
      const updatedBlogs = blogPosts.filter(p => p.id !== id);
      setBlogPosts(updatedBlogs);
      saveToStorage('blog-posts', updatedBlogs);
    }
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

  const handleMarkAsPublished = (id: string, type: 'linkedin' | 'blog') => {
    if (type === 'linkedin') {
      const updatedPosts = posts.map(p => 
        p.id === id ? {...p, published: true} : p
      );
      setPosts(updatedPosts);
      saveToStorage('linkedin-posts', updatedPosts);
    } else {
      const updatedBlogs = blogPosts.map(p => 
        p.id === id ? {...p, status: 'published' as const} : p
      );
      setBlogPosts(updatedBlogs);
      saveToStorage('blog-posts', updatedBlogs);
    }
  };

  const generateCalendar = () => {
    const currentDate = new Date();
    const calendar = generateContentCalendar(
      state.tasks.filter(t => t.completed), 
      currentDate.getMonth() + 1, 
      currentDate.getFullYear()
    );
    setContentCalendar(calendar);
    saveToStorage('content-calendar', calendar);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Content Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            onClick={handleGenerateQuickPost}
            startIcon={<Add />}
            sx={{ mr: 1 }}
          >
            Quick Post
          </Button>
          <Button
            variant="contained"
            onClick={handleGenerateWeeklyPost}
            startIcon={<TrendingUp />}
          >
            Weekly Summary
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab icon={<LinkedIn />} label={`LinkedIn Posts (${posts.length})`} />
          <Tab icon={<Article />} label={`Blog Posts (${blogPosts.length})`} />
          <Tab icon={<CalendarMonth />} label="Content Calendar" />
        </Tabs>
      </Box>

      {/* LinkedIn Posts Tab */}
      <TabPanel value={activeTab} index={0}>
        {posts.length === 0 ? (
          <Alert severity="info">
            No LinkedIn posts created yet. Use the "Quick Post" or "Weekly Summary" buttons to generate content!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} md={6} key={post.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {post.title}
                      </Typography>
                      <Chip 
                        label={post.published ? 'Published' : 'Draft'} 
                        color={post.published ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ maxHeight: 150, overflow: 'auto', mb: 2 }}>
                      {post.content}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      {post.hashtags.slice(0, 3).map(tag => (
                        <Chip key={tag} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
                      ))}
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary">
                      Category: {post.category} | Created: {new Date(post.createdDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title="Copy to Clipboard">
                      <IconButton 
                        onClick={() => handleCopyToClipboard(post.content)}
                        size="small"
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={() => handleEditPost(post, 'linkedin')}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={() => handleDeletePost(post.id, 'linkedin')}
                        size="small"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    {!post.published && (
                      <Button 
                        size="small"
                        onClick={() => handleMarkAsPublished(post.id, 'linkedin')}
                        startIcon={<Share />}
                      >
                        Mark Published
                      </Button>
                    )}
                    <Button 
                      size="small"
                      onClick={() => handleShareToLinkedIn(post)}
                      startIcon={<LinkedIn />}
                      variant="contained"
                    >
                      Share to LinkedIn
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Blog Posts Tab */}
      <TabPanel value={activeTab} index={1}>
        {blogPosts.length === 0 ? (
          <Alert severity="info">
            No blog posts created yet. Go to the Roadmap page and use the Content Creator to generate blog posts from your projects!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {blogPosts.map((post) => (
              <Grid item xs={12} key={post.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {post.title}
                      </Typography>
                      <Chip 
                        label={post.status} 
                        color={post.status === 'published' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {post.excerpt}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
                      {post.content.substring(0, 500)}...
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      {post.tags.slice(0, 5).map(tag => (
                        <Chip key={tag} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
                      ))}
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary">
                      Reading Time: {post.readingTime} min | Category: {post.category}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title="Copy to Clipboard">
                      <IconButton 
                        onClick={() => handleCopyToClipboard(post.content)}
                        size="small"
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={() => handleEditPost(post, 'blog')}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={() => handleDeletePost(post.id, 'blog')}
                        size="small"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    {post.status !== 'published' && (
                      <Button 
                        size="small"
                        onClick={() => handleMarkAsPublished(post.id, 'blog')}
                        startIcon={<Share />}
                      >
                        Mark Published
                      </Button>
                    )}
                    <Button 
                      size="small"
                      onClick={() => handleShareToMedium(post)}
                      startIcon={<Article />}
                      variant="contained"
                    >
                      Publish to Medium
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Content Calendar Tab */}
      <TabPanel value={activeTab} index={2}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Content Planning Calendar</Typography>
          <Button
            variant="contained"
            onClick={generateCalendar}
            startIcon={<CalendarMonth />}
          >
            Generate Calendar
          </Button>
        </Box>

        {contentCalendar.length > 0 ? (
          <Card>
            <CardContent>
              <List>
                {contentCalendar.map((item, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={item.topic}
                      secondary={`${item.date} - ${item.contentType.toUpperCase()} - Phase ${item.linkedPhase}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip 
                        label={item.status} 
                        size="small" 
                        color={item.status === 'published' ? 'success' : 'default'}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ) : (
          <Alert severity="info">
            No content calendar generated yet. Click "Generate Calendar" to create a posting schedule based on your completed tasks!
          </Alert>
        )}
      </TabPanel>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({open: false})} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit {editDialog.type === 'linkedin' ? 'LinkedIn Post' : 'Blog Post'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            multiline
            rows={10}
            label="Content"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({open: false})}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Content;
