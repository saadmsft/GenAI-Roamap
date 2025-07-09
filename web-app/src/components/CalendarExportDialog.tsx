import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore, CalendarToday, CloudDownload } from '@mui/icons-material';
import { Task, ExportOptions } from '../types';
import { 
  generateICSContent, 
  downloadICSFile, 
  exportToGoogleCalendar 
} from '../utils/calendarExport';

interface CalendarExportDialogProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
}

export const CalendarExportDialog: React.FC<CalendarExportDialogProps> = ({ 
  open, 
  onClose, 
  tasks 
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    selectedTasks: tasks.map(t => t.id),
    startDate: new Date(),
    includeResources: true,
    reminderMinutes: 15
  });

  const [selectedPhases, setSelectedPhases] = useState<number[]>([]);
  const [selectedWeeks, setSelectedWeeks] = useState<{[key: number]: number[]}>({});

  const handlePhaseToggle = (phaseId: number) => {
    const isSelected = selectedPhases.includes(phaseId);
    const newSelectedPhases = isSelected 
      ? selectedPhases.filter(p => p !== phaseId)
      : [...selectedPhases, phaseId];
    
    setSelectedPhases(newSelectedPhases);
    
    const phaseTasks = tasks.filter(t => t.phase === phaseId).map(t => t.id);
    setExportOptions(prev => ({
      ...prev,
      selectedTasks: isSelected
        ? prev.selectedTasks.filter(id => !phaseTasks.includes(id))
        : [...prev.selectedTasks, ...phaseTasks]
    }));
  };

  const handleWeekToggle = (phaseId: number, week: number) => {
    const phaseWeeks = selectedWeeks[phaseId] || [];
    const isSelected = phaseWeeks.includes(week);
    
    setSelectedWeeks(prev => ({
      ...prev,
      [phaseId]: isSelected
        ? phaseWeeks.filter(w => w !== week)
        : [...phaseWeeks, week]
    }));

    const weekTasks = tasks
      .filter(t => t.phase === phaseId && t.week === week)
      .map(t => t.id);
    
    setExportOptions(prev => ({
      ...prev,
      selectedTasks: isSelected
        ? prev.selectedTasks.filter(id => !weekTasks.includes(id))
        : [...prev.selectedTasks, ...weekTasks]
    }));
  };

  const handleSelectAll = () => {
    const allPhases = Array.from(new Set(tasks.map(t => t.phase)));
    const allWeeks: {[key: number]: number[]} = {};
    
    allPhases.forEach(phase => {
      allWeeks[phase] = Array.from(new Set(tasks.filter(t => t.phase === phase).map(t => t.week)));
    });

    setSelectedPhases(allPhases);
    setSelectedWeeks(allWeeks);
    setExportOptions(prev => ({
      ...prev,
      selectedTasks: tasks.map(t => t.id)
    }));
  };

  const handleSelectNone = () => {
    setSelectedPhases([]);
    setSelectedWeeks({});
    setExportOptions(prev => ({
      ...prev,
      selectedTasks: []
    }));
  };

  const handleExportICS = () => {
    const selectedTasks = tasks.filter(t => exportOptions.selectedTasks.includes(t.id));
    const icsContent = generateICSContent(selectedTasks, exportOptions);
    downloadICSFile(icsContent, 'genai-learning-roadmap.ics');
  };

  const handleExportGoogle = () => {
    const selectedTasks = tasks.filter(t => exportOptions.selectedTasks.includes(t.id));
    exportToGoogleCalendar(selectedTasks, exportOptions);
  };

  const selectedTasksCount = exportOptions.selectedTasks.length;
  const totalEstimatedHours = tasks
    .filter(t => exportOptions.selectedTasks.includes(t.id))
    .reduce((sum, task) => sum + task.estimatedHours, 0);

  const phaseGroups = Array.from(new Set(tasks.map(t => t.phase)))
    .sort((a, b) => a - b)
    .map(phase => ({
      phase,
      tasks: tasks.filter(t => t.phase === phase),
      weeks: Array.from(new Set(tasks.filter(t => t.phase === phase).map(t => t.week))).sort((a, b) => a - b)
    }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarToday />
          Export Learning Plan to Calendar
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={3}>
            {/* Start Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={exportOptions.startDate.toISOString().split('T')[0]}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  startDate: new Date(e.target.value)
                }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Reminder */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Reminder</InputLabel>
                <Select
                  value={exportOptions.reminderMinutes}
                  label="Reminder"
                  onChange={(e) => setExportOptions(prev => ({
                    ...prev,
                    reminderMinutes: Number(e.target.value)
                  }))}
                >
                  <MenuItem value={0}>No reminder</MenuItem>
                  <MenuItem value={15}>15 minutes before</MenuItem>
                  <MenuItem value={30}>30 minutes before</MenuItem>
                  <MenuItem value={60}>1 hour before</MenuItem>
                  <MenuItem value={120}>2 hours before</MenuItem>
                  <MenuItem value={1440}>1 day before</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Include Resources */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportOptions.includeResources}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      includeResources: e.target.checked
                    }))}
                  />
                }
                label="Include study resources and links in calendar events"
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Task Selection */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Select Tasks to Export</Typography>
            <Box>
              <Button size="small" onClick={handleSelectAll} sx={{ mr: 1 }}>
                Select All
              </Button>
              <Button size="small" onClick={handleSelectNone}>
                Select None
              </Button>
            </Box>
          </Box>

          {/* Phase and Week Selection */}
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {phaseGroups.map(({ phase, tasks: phaseTasks, weeks }) => (
              <Accordion key={phase} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedPhases.includes(phase)}
                        onChange={() => handlePhaseToggle(phase)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    }
                    label={`Phase ${phase} (${phaseTasks.length} tasks)`}
                    onClick={(e) => e.stopPropagation()}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup>
                    {weeks.map(week => {
                      const weekTasks = phaseTasks.filter(t => t.week === week);
                      const isWeekSelected = (selectedWeeks[phase] || []).includes(week);
                      
                      return (
                        <Box key={week} sx={{ ml: 2, mb: 1 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isWeekSelected}
                                onChange={() => handleWeekToggle(phase, week)}
                              />
                            }
                            label={`Week ${week} (${weekTasks.length} tasks)`}
                          />
                          <Box sx={{ ml: 3, mt: 1 }}>
                            {weekTasks.slice(0, 3).map(task => (
                              <Typography key={task.id} variant="caption" display="block" color="text.secondary">
                                Day {task.day}: {task.title}
                              </Typography>
                            ))}
                            {weekTasks.length > 3 && (
                              <Typography variant="caption" color="text.secondary">
                                ... and {weekTasks.length - 3} more
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* Summary */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Export Summary</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">{selectedTasksCount}</Typography>
                  <Typography variant="body2" color="text.secondary">Tasks Selected</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">{totalEstimatedHours}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Hours</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">{Math.ceil(totalEstimatedHours / 8)}</Typography>
                  <Typography variant="body2" color="text.secondary">Work Days</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Export Options Info */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>ICS File:</strong> Universal calendar format that works with Google Calendar, Outlook, Apple Calendar, and more.
            <br />
            <strong>Google Calendar:</strong> Opens individual event creation pages (recommended for small selections only).
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleExportICS}
          disabled={selectedTasksCount === 0}
          variant="contained"
          startIcon={<CloudDownload />}
          sx={{ mr: 1 }}
        >
          Download ICS File
        </Button>
        <Button
          onClick={handleExportGoogle}
          disabled={selectedTasksCount === 0}
          variant="outlined"
          startIcon={<CalendarToday />}
        >
          Open in Google Calendar
          {selectedTasksCount > 10 && (
            <Chip 
              label={`${selectedTasksCount} tabs`} 
              size="small" 
              color="warning" 
              sx={{ ml: 1 }}
            />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
