
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useApp } from '../context/AppContext';

const Progress = () => {
  const { state } = useApp();

  // Sample progress data
  const progressData = [
    { date: '2024-01-01', tasksCompleted: 3, hoursStudied: 6 },
    { date: '2024-01-02', tasksCompleted: 2, hoursStudied: 4 },
    { date: '2024-01-03', tasksCompleted: 4, hoursStudied: 8 },
    { date: '2024-01-04', tasksCompleted: 3, hoursStudied: 6 },
    { date: '2024-01-05', tasksCompleted: 5, hoursStudied: 10 },
  ];

  const phaseData = state.phases.map(phase => ({
    name: `Phase ${phase.id}`,
    completed: phase.completedTasks,
    total: phase.totalTasks,
    percentage: phase.totalTasks > 0 ? (phase.completedTasks / phase.totalTasks) * 100 : 0,
  }));

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Learning Progress Analytics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Daily Progress Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Learning Activity
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="tasksCompleted" stroke="#8884d8" name="Tasks Completed" />
                    <Line type="monotone" dataKey="hoursStudied" stroke="#82ca9d" name="Hours Studied" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Phase Progress Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Progress by Phase
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={phaseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="percentage" fill="#8884d8" name="Completion %" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Tasks
              </Typography>
              <Typography variant="h3" color="primary">
                {state.tasks.filter(t => t.completed).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {state.tasks.length} completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Phase
              </Typography>
              <Typography variant="h3" color="secondary">
                {state.phases.find(p => p.completedTasks > 0 && p.completedTasks < p.totalTasks)?.id || 1}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current focus area
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Learning Streak
              </Typography>
              <Typography variant="h3" color="success.main">
                7
              </Typography>
              <Typography variant="body2" color="text.secondary">
                days in a row
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Progress;
