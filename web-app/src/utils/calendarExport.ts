import { Task, CalendarEvent, ExportOptions } from '../types';

/**
 * Generates Google Calendar URL for a single event
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  
  const params = new URLSearchParams({
    text: event.title,
    dates: `${formatDateForGoogle(event.startDate)}/${formatDateForGoogle(event.endDate)}`,
    details: event.description,
    location: event.location || '',
    sf: 'true',
    output: 'xml'
  });
  
  return `${baseUrl}&${params.toString()}`;
}

/**
 * Formats date for Google Calendar (YYYYMMDDTHHMMSSZ)
 */
function formatDateForGoogle(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Converts a task to a calendar event
 */
export function taskToCalendarEvent(task: Task, startDate: Date, options: ExportOptions): CalendarEvent {
  const taskDate = new Date(startDate);
  taskDate.setDate(taskDate.getDate() + task.day - 1);
  
  const startTime = new Date(taskDate);
  startTime.setHours(9, 0, 0, 0); // Default to 9 AM
  
  const endTime = new Date(startTime);
  endTime.setHours(startTime.getHours() + task.estimatedHours);
  
  let description = `${task.description}\n\n`;
  description += `Phase: ${task.phase} | Week: ${task.week} | Day: ${task.day}\n`;
  description += `Estimated time: ${task.estimatedHours} hours\n`;
  
  if (options.includeResources && task.resources && task.resources.length > 0) {
    description += '\n📚 Resources:\n';
    task.resources.forEach(resource => {
      description += `• ${resource.title}`;
      if (resource.url) {
        description += ` (${resource.url})`;
      }
      description += '\n';
    });
  }
  
  description += '\n🎯 GenAI Learning Roadmap';
  
  return {
    title: `Day ${task.day}: ${task.title}`,
    description,
    startDate: startTime,
    endDate: endTime,
    location: 'Study/Work Space'
  };
}

/**
 * Generates ICS file content for multiple tasks
 */
export function generateICSContent(tasks: Task[], options: ExportOptions): string {
  const events = tasks.map(task => taskToCalendarEvent(task, options.startDate, options));
  
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GenAI Roadmap//Learning Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ].join('\r\n');
  
  events.forEach(event => {
    icsContent += '\r\n' + generateVEvent(event, options.reminderMinutes);
  });
  
  icsContent += '\r\nEND:VCALENDAR';
  
  return icsContent;
}

/**
 * Generates VEVENT component for ICS file
 */
function generateVEvent(event: CalendarEvent, reminderMinutes: number): string {
  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@genai-roadmap.com`;
  const now = new Date();
  
  let vevent = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatDateForICS(now)}`,
    `DTSTART:${formatDateForICS(event.startDate)}`,
    `DTEND:${formatDateForICS(event.endDate)}`,
    `SUMMARY:${escapeICSText(event.title)}`,
    `DESCRIPTION:${escapeICSText(event.description)}`,
    `LOCATION:${escapeICSText(event.location || '')}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE'
  ];
  
  if (reminderMinutes > 0) {
    vevent.push(
      'BEGIN:VALARM',
      'TRIGGER:-PT' + reminderMinutes + 'M',
      'ACTION:DISPLAY',
      'DESCRIPTION:GenAI Learning Task Reminder',
      'END:VALARM'
    );
  }
  
  vevent.push('END:VEVENT');
  
  return vevent.join('\r\n');
}

/**
 * Formats date for ICS file (YYYYMMDDTHHMMSSZ)
 */
function formatDateForICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Escapes text for ICS file format
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

/**
 * Downloads ICS file
 */
export function downloadICSFile(content: string, filename: string = 'genai-roadmap.ics'): void {
  const blob = new Blob([content], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Generates a bulk import URL for Google Calendar (limited to single events)
 */
export function generateBulkGoogleCalendarUrl(tasks: Task[], options: ExportOptions): string[] {
  return tasks.map(task => {
    const event = taskToCalendarEvent(task, options.startDate, options);
    return generateGoogleCalendarUrl(event);
  });
}

/**
 * Opens multiple Google Calendar tabs (with confirmation)
 */
export function exportToGoogleCalendar(tasks: Task[], options: ExportOptions): void {
  const urls = generateBulkGoogleCalendarUrl(tasks, options);
  
  if (urls.length > 10) {
    const confirmed = confirm(
      `This will open ${urls.length} tabs in your browser. This might be overwhelming. ` +
      'Consider using the ICS file export instead for better performance. Continue?'
    );
    if (!confirmed) return;
  }
  
  urls.forEach((url, index) => {
    // Add delay to prevent browser blocking
    setTimeout(() => {
      window.open(url, '_blank');
    }, index * 200);
  });
}
