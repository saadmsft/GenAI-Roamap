
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Box,
  Chip,
} from '@mui/material';
import { useApp } from '../context/AppContext';

const Skills = () => {
  const { state } = useApp();

  const getSkillColor = (level: number) => {
    if (level >= 4) return 'success';
    if (level >= 3) return 'primary';
    if (level >= 2) return 'warning';
    return 'error';
  };

  const skillCategories = {
    technical: state.skills.filter(s => s.category === 'technical'),
    platform: state.skills.filter(s => s.category === 'platform'),
    business: state.skills.filter(s => s.category === 'business'),
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Skills Development
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Track your progress across technical, platform, and business skills
      </Typography>

      {Object.entries(skillCategories).map(([category, skills]) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ textTransform: 'capitalize' }}>
            {category} Skills
          </Typography>
          <Grid container spacing={3}>
            {skills.map((skill) => (
              <Grid item xs={12} md={6} lg={4} key={skill.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {skill.name}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Current Level: {skill.level}/5
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(skill.level / 5) * 100}
                        color={getSkillColor(skill.level) as any}
                        sx={{ height: 8, borderRadius: 4, mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Target: {skill.targetLevel}/5
                      </Typography>
                    </Box>

                    <Chip 
                      label={`${skill.relatedTasks.length} related tasks`}
                      size="small"
                      variant="outlined"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
  );
};

export default Skills;
