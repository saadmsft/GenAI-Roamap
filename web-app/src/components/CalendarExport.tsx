import React, { useState } from 'react';
import { Task, ExportOptions } from '../types';
import { 
  generateICSContent, 
  downloadICSFile, 
  exportToGoogleCalendar 
} from '../utils/calendarExport';

interface CalendarExportProps {
  tasks: Task[];
  onClose: () => void;
}

export const CalendarExport: React.FC<CalendarExportProps> = ({ tasks, onClose }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    selectedTasks: tasks.map(t => t.id),
    startDate: new Date(),
    includeResources: true,
    reminderMinutes: 15
  });

  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);

  const handleWeekSelection = (week: number) => {
    setSelectedWeeks(prev => 
      prev.includes(week) 
        ? prev.filter(w => w !== week)
        : [...prev, week]
    );
    
    const weekTasks = tasks
      .filter(t => selectedWeeks.includes(week) || week === t.week)
      .map(t => t.id);
    
    setExportOptions(prev => ({
      ...prev,
      selectedTasks: selectedWeeks.includes(week) 
        ? prev.selectedTasks.filter(id => !weekTasks.includes(id))
        : [...prev.selectedTasks, ...weekTasks]
    }));
  };

  const handleSelectAll = () => {
    setExportOptions(prev => ({
      ...prev,
      selectedTasks: tasks.map(t => t.id)
    }));
    setSelectedWeeks(Array.from(new Set(tasks.map(t => t.week))));
  };

  const handleSelectNone = () => {
    setExportOptions(prev => ({
      ...prev,
      selectedTasks: []
    }));
    setSelectedWeeks([]);
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

  const weekGroups = Array.from(new Set(tasks.map(t => t.week)))
    .sort((a, b) => a - b)
    .map(week => ({
      week,
      tasks: tasks.filter(t => t.week === week),
      selected: selectedWeeks.includes(week)
    }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Export to Calendar</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Export Options */}
          <div className="space-y-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={exportOptions.startDate.toISOString().split('T')[0]}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  startDate: new Date(e.target.value)
                }))}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            {/* Reminder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder (minutes before)
              </label>
              <select
                value={exportOptions.reminderMinutes}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  reminderMinutes: parseInt(e.target.value)
                }))}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              >
                <option value={0}>No reminder</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={1440}>1 day</option>
              </select>
            </div>

            {/* Include Resources */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeResources"
                checked={exportOptions.includeResources}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  includeResources: e.target.checked
                }))}
                className="mr-2"
              />
              <label htmlFor="includeResources" className="text-sm text-gray-700">
                Include study resources in event descriptions
              </label>
            </div>

            {/* Task Selection */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-900">Select Tasks</h3>
                <div className="space-x-2">
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleSelectNone}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Select None
                  </button>
                </div>
              </div>

              {/* Week Selection */}
              <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
                {weekGroups.map(({ week, tasks: weekTasks, selected }) => (
                  <div key={week} className="border-b pb-2 last:border-b-0">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`week-${week}`}
                        checked={selected}
                        onChange={() => handleWeekSelection(week)}
                        className="mr-2"
                      />
                      <label htmlFor={`week-${week}`} className="font-medium text-gray-800">
                        Week {week} ({weekTasks.length} tasks)
                      </label>
                    </div>
                    <div className="ml-6 space-y-1">
                      {weekTasks.map(task => (
                        <div key={task.id} className="text-sm text-gray-600">
                          Day {task.day}: {task.title}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-700">
                  <strong>{selectedTasksCount}</strong> tasks selected
                  <br />
                  <strong>{totalEstimatedHours}</strong> total hours
                  <br />
                  Duration: <strong>{Math.ceil(totalEstimatedHours / 8)}</strong> work days
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleExportICS}
                disabled={selectedTasksCount === 0}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                📅 Download ICS File (Universal Calendar Import)
              </button>
              
              <button
                onClick={handleExportGoogle}
                disabled={selectedTasksCount === 0}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                🗓️ Export to Google Calendar
                {selectedTasksCount > 10 && (
                  <span className="block text-xs mt-1">
                    Note: Will open {selectedTasksCount} tabs
                  </span>
                )}
              </button>

              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>ICS File:</strong> Import into any calendar app (Google, Outlook, Apple Calendar, etc.)</p>
                <p><strong>Google Calendar:</strong> Opens individual event creation pages (best for small selections)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
