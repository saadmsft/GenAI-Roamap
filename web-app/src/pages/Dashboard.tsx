
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  TrendingUp,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const { state } = useApp();

  // Calculate overall progress
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.completed).length;
  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Get today's tasks
  const todaysTasks = state.tasks.filter(task => {
    // For demo purposes, show first few uncompleted tasks as today's tasks
    return !task.completed;
  }).slice(0, 5);

  // Calculate phase progress
  const phaseProgress = state.phases.map(phase => ({
    ...phase,
    progress: phase.totalTasks > 0 ? (phase.completedTasks / phase.totalTasks) * 100 : 0,
  }));

  // Recent achievements
  const recentCompletions = state.tasks
    .filter(task => task.completed && task.completedDate)
    .sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime())
    .slice(0, 5);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Welcome to Your GenAI Learning Journey
      </Typography>
      
      <Grid container spacing={3}>
        {/* Overall Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h3" sx={{ mr: 2 }}>
                  {Math.round(overallProgress)}%
                </Typography>
                <TrendingUp color="primary" />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={overallProgress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {completedTasks} of {totalTasks} tasks completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {state.phases.filter(p => p.completedTasks > 0).length}
                    </Typography>
                    <Typography variant="body2">Phases Started</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="secondary">
                      {state.projects.filter(p => p.status === 'completed').length}
                    </Typography>
                    <Typography variant="body2">Projects Done</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Tasks */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Focus
              </Typography>
              <List>
                {todaysTasks.map((task, index) => (
                  <ListItem key={task.id} divider={index < todaysTasks.length - 1}>
                    <ListItemIcon>
                      {task.completed ? <CheckCircle color="success" /> : <Schedule color="action" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={`Phase ${task.phase} • ${task.estimatedHours}h • ${task.category}`}
                    />
                    <Chip 
                      label={task.category} 
                      size="small" 
                      variant="outlined"
                      color={task.category === 'hands-on' ? 'primary' : 'default'}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Phase Progress */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Phase Progress
              </Typography>
              {phaseProgress.map((phase) => (
                <Box key={phase.id} sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Phase {phase.id}: {phase.title}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={phase.progress} 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(phase.progress)}% complete
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Achievements */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Achievements
              </Typography>
              {recentCompletions.length > 0 ? (
                <List>
                  {recentCompletions.map((task, index) => (
                    <ListItem key={task.id} divider={index < recentCompletions.length - 1}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        secondary={`Completed on ${new Date(task.completedDate!).toLocaleDateString()}`}
                      />
                      <Chip label={`Phase ${task.phase}`} size="small" />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  Complete your first task to see achievements here!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
