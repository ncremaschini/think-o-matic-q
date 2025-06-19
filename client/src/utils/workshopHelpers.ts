import { WorkshopStatus, WorkshopType } from '../types/workshop';

export const getStatusColor = (status: WorkshopStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case WorkshopStatus.CREATED:
      return 'default';
    case WorkshopStatus.AGENDA_GENERATED:
      return 'info';
    case WorkshopStatus.AGENDA_APPROVED:
      return 'primary';
    case WorkshopStatus.MIRO_BOARD_CREATED:
      return 'secondary';
    case WorkshopStatus.WORKSHOP_CONDUCTED:
      return 'warning';
    case WorkshopStatus.ANALYSIS_COMPLETED:
      return 'success';
    case WorkshopStatus.TASKS_CREATED:
      return 'success';
    default:
      return 'default';
  }
};

export const getStatusLabel = (status: WorkshopStatus): string => {
  switch (status) {
    case WorkshopStatus.CREATED:
      return 'Created';
    case WorkshopStatus.AGENDA_GENERATED:
      return 'Agenda Generated';
    case WorkshopStatus.AGENDA_APPROVED:
      return 'Agenda Approved';
    case WorkshopStatus.MIRO_BOARD_CREATED:
      return 'Miro Board Created';
    case WorkshopStatus.WORKSHOP_CONDUCTED:
      return 'Workshop Conducted';
    case WorkshopStatus.ANALYSIS_COMPLETED:
      return 'Analysis Completed';
    case WorkshopStatus.TASKS_CREATED:
      return 'Tasks Created';
    default:
      return 'Unknown';
  }
};

export const getWorkshopTypeLabel = (type: WorkshopType): string => {
  switch (type) {
    case WorkshopType.BRAINSTORMING:
      return 'Brainstorming';
    case WorkshopType.RETROSPECTIVE:
      return 'Retrospective';
    case WorkshopType.PLANNING:
      return 'Planning';
    case WorkshopType.DESIGN_THINKING:
      return 'Design Thinking';
    case WorkshopType.PROBLEM_SOLVING:
      return 'Problem Solving';
    case WorkshopType.TEAM_BUILDING:
      return 'Team Building';
    default:
      return 'Unknown';
  }
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${minutes}min`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${remainingMinutes}min`;
  }
};

export const formatDateTime = (dateTime: string): string => {
  return new Date(dateTime).toLocaleString();
};
