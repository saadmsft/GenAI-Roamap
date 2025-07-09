import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Box,
  Tab,
  Tabs,
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  PlayArrow,
  CalendarToday,
  Share,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { CalendarExportDialog } from '../components/CalendarExportDialog';
import { ContentCreatorDialog } from '../components/ContentCreatorDialog';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Roadmap = () => {
  const { state, dispatch } = useApp();
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [taskDialog, setTaskDialog] = useState<{open: boolean, task?: any}>({open: false});
  const [taskNotes, setTaskNotes] = useState('');
  const [calendarExportOpen, setCalendarExportOpen] = useState(false);
  const [contentCreatorOpen, setContentCreatorOpen] = useState(false);

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    if (completed) {
      dispatch({ type: 'COMPLETE_TASK', taskId, notes: taskNotes });
    } else {
      dispatch({ type: 'UNCOMPLETE_TASK', taskId });
    }
    setTaskDialog({open: false});
    setTaskNotes('');
  };

  const openTaskDialog = (task: any) => {
    setTaskDialog({open: true, task});
    setTaskNotes(task.notes || '');
  };

  const getTasksByWeek = (phaseId: number, week: number) => {
    return state.tasks.filter(task => task.phase === phaseId && task.week === week);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          GenAI Architect Learning Roadmap
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Share />}
            onClick={() => setContentCreatorOpen(true)}
            sx={{ mr: 1 }}
          >
            Create Content
          </Button>
          <Button
            variant="contained"
            startIcon={<CalendarToday />}
            onClick={() => setCalendarExportOpen(true)}
            sx={{ mb: 2 }}
          >
            Export to Calendar
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedPhase} onChange={(_, newValue) => setSelectedPhase(newValue)}>
          {state.phases.map((phase, index) => (
            <Tab 
              key={phase.id} 
              label={`Phase ${phase.id}: ${phase.title}`} 
              id={`phase-tab-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {state.phases.map((phase, index) => (
        <TabPanel key={phase.id} value={selectedPhase} index={index}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Phase {phase.id}: {phase.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {phase.description}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Progress: {phase.completedTasks} of {phase.totalTasks} tasks completed
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={phase.totalTasks > 0 ? (phase.completedTasks / phase.totalTasks) * 100 : 0}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Weeks in this phase */}
          {Array.from({length: phase.weeks}, (_, weekIndex) => {
            const weekNumber = weekIndex + 1;
            const weekTasks = getTasksByWeek(phase.id, weekNumber);
            
            if (weekTasks.length === 0) return null;

            return (
              <Accordion key={weekNumber} defaultExpanded={weekIndex === 0}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">
                    Week {weekNumber} ({weekTasks.filter(t => t.completed).length}/{weekTasks.length} completed)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {weekTasks.map((task) => (
                      <Grid item xs={12} md={6} key={task.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                              <Checkbox
                                checked={task.completed}
                                onChange={(e) => handleTaskComplete(task.id, e.target.checked)}
                                sx={{ mt: -1 }}
                              />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Day {task.day}: {task.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  {task.description}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  <Chip 
                                    label={task.category} 
                                    size="small" 
                                    color={task.category === 'hands-on' ? 'primary' : 'default'}
                                  />
                                  <Chip 
                                    label={`${task.estimatedHours}h`} 
                                    size="small" 
                                    variant="outlined"
                                  />
                                  {task.completed && (
                                    <Chip 
                                      icon={<CheckCircle />}
                                      label="Completed" 
                                      size="small" 
                                      color="success"
                                    />
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                          <CardActions>
                            <Button 
                              size="small" 
                              onClick={() => openTaskDialog(task)}
                              startIcon={task.completed ? <CheckCircle /> : <PlayArrow />}
                            >
                              {task.completed ? 'View Details' : 'Start Task'}
                            </Button>
                            {task.completed && (
                              <Button 
                                size="small" 
                                onClick={() => setContentCreatorOpen(true)}
                                startIcon={<Share />}
                                color="primary"
                              >
                                Share
                              </Button>
                            )}
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </TabPanel>
      ))}

      {/* Task Detail Dialog */}
      <Dialog 
        open={taskDialog.open} 
        onClose={() => setTaskDialog({open: false})}
        maxWidth="md"
        fullWidth
      >
        {taskDialog.task && (
          <>
            <DialogTitle>
              Day {taskDialog.task.day}: {taskDialog.task.title}
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {taskDialog.task.description}
              </Typography>
              
              {taskDialog.task.resources && taskDialog.task.resources.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Resources:
                  </Typography>
                  {taskDialog.task.resources.map((resource: any) => (
                    <Card key={resource.id} variant="outlined" sx={{ mb: 1 }}>
                      <CardContent>
                        <Typography variant="subtitle2">{resource.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {resource.description}
                        </Typography>
                        {resource.url && (
                          <Button
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            sx={{ mt: 1 }}
                          >
                            Open Resource
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                sx={{ mt: 2 }}
                placeholder="Add your notes, learnings, or reflections..."
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setTaskDialog({open: false})}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleTaskComplete(taskDialog.task.id, !taskDialog.task.completed)}
                variant="contained"
              >
                {taskDialog.task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Calendar Export Dialog */}
      <CalendarExportDialog
        open={calendarExportOpen}
        onClose={() => setCalendarExportOpen(false)}
        tasks={state.tasks}
      />

      {/* Content Creator Dialog */}
      <ContentCreatorDialog
        open={contentCreatorOpen}
        onClose={() => setContentCreatorOpen(false)}
        tasks={state.tasks}
        phases={state.phases}
        projects={state.projects}
        completedTasks={state.tasks.filter(task => task.completed)}
      />
    </Container>
  );
};

export default Roadmap;
