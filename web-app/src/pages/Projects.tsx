
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Box,
} from '@mui/material';
import { GitHub, Launch } from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const Projects = () => {
  const { state, dispatch } = useApp();

  const handleUpdateProject = (projectId: string, updates: any) => {
    dispatch({ type: 'UPDATE_PROJECT', projectId, updates });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Portfolio Projects
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Build these capstone projects to demonstrate your GenAI expertise
      </Typography>

      <Grid container spacing={3}>
        {state.projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {project.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={`Phase ${project.phase}`} 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={project.status.replace('-', ' ')} 
                    size="small" 
                    color={getStatusColor(project.status) as any}
                  />
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Technologies:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                  {project.technologies.map((tech, index) => (
                    <Chip key={index} label={tech} size="small" variant="outlined" />
                  ))}
                </Box>

                {project.status === 'in-progress' && (
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Progress: 40%
                    </Typography>
                    <LinearProgress variant="determinate" value={40} />
                  </Box>
                )}
              </CardContent>
              
              <CardActions>
                {project.status === 'not-started' && (
                  <Button 
                    size="small"
                    onClick={() => handleUpdateProject(project.id, { status: 'in-progress' })}
                  >
                    Start Project
                  </Button>
                )}
                {project.githubUrl && (
                  <Button 
                    size="small" 
                    startIcon={<GitHub />}
                    href={project.githubUrl}
                    target="_blank"
                  >
                    Code
                  </Button>
                )}
                {project.demoUrl && (
                  <Button 
                    size="small" 
                    startIcon={<Launch />}
                    href={project.demoUrl}
                    target="_blank"
                  >
                    Demo
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Projects;
