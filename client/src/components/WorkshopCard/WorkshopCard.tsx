import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  PlayArrow as PlayArrowIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { Workshop } from '../../types/workshop';
import {
  getStatusColor,
  getStatusLabel,
  getWorkshopTypeLabel,
  formatDuration,
  formatDateTime,
} from '../../utils/workshopHelpers';

interface WorkshopCardProps {
  workshop: Workshop;
  onGenerateAgenda: (id: string) => void;
  onCreateMiroBoard: (id: string) => void;
  onMarkAsConducted: (id: string) => void;
  onAnalyzeWorkshop: (id: string) => void;
  onCreateTasks: (id: string) => void;
  onEdit: (workshop: Workshop) => void;
  onDelete: (id: string) => void;
  onViewDetails: (workshop: Workshop) => void;
  loadingStates?: {
    [key: string]: boolean;
  };
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({
  workshop,
  onGenerateAgenda,
  onCreateMiroBoard,
  onMarkAsConducted,
  onAnalyzeWorkshop,
  onCreateTasks,
  onEdit,
  onDelete,
  onViewDetails,
  loadingStates = {},
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(workshop);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(workshop.id);
    handleMenuClose();
  };

  // Get the primary action based on workshop status
  const getPrimaryAction = () => {
    switch (workshop.status) {
      case 'created':
        return {
          label: loadingStates[`agenda-${workshop.id}`] ? 'Generating...' : 'Generate Agenda',
          icon: loadingStates[`agenda-${workshop.id}`] ? 
            <CircularProgress size={16} /> : <PlayArrowIcon />,
          onClick: () => onGenerateAgenda(workshop.id),
          disabled: loadingStates[`agenda-${workshop.id}`],
          color: 'primary' as const,
        };
      case 'agenda-generated':
        return {
          label: loadingStates[`board-${workshop.id}`] ? 'Creating...' : 'Create Board',
          icon: loadingStates[`board-${workshop.id}`] ? 
            <CircularProgress size={16} /> : <DashboardIcon />,
          onClick: () => onCreateMiroBoard(workshop.id),
          disabled: loadingStates[`board-${workshop.id}`],
          color: 'primary' as const,
        };
      case 'miro-board-created':
        return {
          label: loadingStates[`conducted-${workshop.id}`] ? 'Marking...' : 'Mark as Conducted',
          icon: loadingStates[`conducted-${workshop.id}`] ? 
            <CircularProgress size={16} /> : <CheckCircleIcon />,
          onClick: () => onMarkAsConducted(workshop.id),
          disabled: loadingStates[`conducted-${workshop.id}`],
          color: 'success' as const,
        };
      case 'workshop-conducted':
        return {
          label: loadingStates[`analyze-${workshop.id}`] ? 'Analyzing...' : 'Analyze Workshop',
          icon: loadingStates[`analyze-${workshop.id}`] ? 
            <CircularProgress size={16} /> : <AnalyticsIcon />,
          onClick: () => onAnalyzeWorkshop(workshop.id),
          disabled: loadingStates[`analyze-${workshop.id}`],
          color: 'secondary' as const,
        };
      case 'analysis-completed':
        if (!workshop.trelloTasks) {
          return {
            label: loadingStates[`tasks-${workshop.id}`] ? 'Creating...' : 'Create Tasks',
            icon: loadingStates[`tasks-${workshop.id}`] ? 
              <CircularProgress size={16} /> : <AssignmentIcon />,
            onClick: () => onCreateTasks(workshop.id),
            disabled: loadingStates[`tasks-${workshop.id}`],
            color: 'secondary' as const,
          };
        }
        return null;
      default:
        return null;
    }
  };

  const primaryAction = getPrimaryAction();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header with title and menu */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="h2" gutterBottom>
            {workshop.title}
          </Typography>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Status and type chips */}
        <Box mb={2}>
          <Chip
            label={getStatusLabel(workshop.status)}
            color={getStatusColor(workshop.status)}
            size="small"
            sx={{ mr: 1, mb: 1 }}
          />
          <Chip
            label={getWorkshopTypeLabel(workshop.type)}
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
          />
        </Box>

        {/* Workshop goal */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {workshop.goal}
        </Typography>

        {/* Workshop details */}
        <Box mt={2}>
          <Typography variant="caption" display="block">
            📅 {formatDateTime(workshop.dateTime)}
          </Typography>
          <Typography variant="caption" display="block">
            ⏱️ {formatDuration(workshop.duration)}
          </Typography>
          <Typography variant="caption" display="block">
            👥 {workshop.participantCount} participants
          </Typography>
        </Box>

        {/* Links section */}
        {(workshop.miroBoard || workshop.trelloTasks) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              {workshop.miroBoard && (
                <Tooltip title="Open Miro board in new tab">
                  <Button
                    size="small"
                    startIcon={<DashboardIcon />}
                    endIcon={<OpenInNewIcon />}
                    onClick={() => window.open(workshop.miroBoard!.url, '_blank')}
                    sx={{ mr: 1, mb: 1 }}
                  >
                    Miro Board
                  </Button>
                </Tooltip>
              )}
              {workshop.trelloTasks && (
                <Tooltip title="Open Trello board in new tab">
                  <Button
                    size="small"
                    startIcon={<AssignmentIcon />}
                    endIcon={<OpenInNewIcon />}
                    onClick={() => window.open(workshop.trelloTasks!.boardUrl, '_blank')}
                    sx={{ mb: 1 }}
                  >
                    Tasks ({workshop.trelloTasks.cards.length})
                  </Button>
                </Tooltip>
              )}
            </Box>
          </>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
        {/* Left side: View Details button */}
        <Button
          size="small"
          onClick={() => onViewDetails(workshop)}
          sx={{ mr: 1 }}
        >
          View Details
        </Button>

        {/* Right side: Primary action button */}
        {primaryAction && (
          <Button
            size="small"
            startIcon={primaryAction.icon}
            onClick={primaryAction.onClick}
            variant="contained"
            color={primaryAction.color}
            disabled={primaryAction.disabled}
          >
            {primaryAction.label}
          </Button>
        )}
      </CardActions>

      {/* More menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit Workshop
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete Workshop
        </MenuItem>
      </Menu>
    </Card>
  );
};
