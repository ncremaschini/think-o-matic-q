import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { CreateWorkshopRequest, WorkshopType, Workshop } from '../../types/workshop';
import { getDefaultMiroWorkspaceId, getDefaultTrelloBoardId, getDefaultTrelloListId } from '../../config/defaults';

interface WorkshopFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (workshop: CreateWorkshopRequest) => void;
  loading?: boolean;
  workshop?: Workshop; // For editing
}

const workshopTypes = [
  { value: WorkshopType.BRAINSTORMING, label: 'Brainstorming' },
  { value: WorkshopType.RETROSPECTIVE, label: 'Retrospective' },
  { value: WorkshopType.PLANNING, label: 'Planning' },
  { value: WorkshopType.DESIGN_THINKING, label: 'Design Thinking' },
  { value: WorkshopType.PROBLEM_SOLVING, label: 'Problem Solving' },
  { value: WorkshopType.TEAM_BUILDING, label: 'Team Building' },
];

export const WorkshopForm: React.FC<WorkshopFormProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  workshop,
}) => {
  // Get default values
  const defaultWorkspaceId = getDefaultMiroWorkspaceId();
  const defaultTrelloBoardId = getDefaultTrelloBoardId();
  const defaultTrelloListId = getDefaultTrelloListId();
  
  console.log('Default Miro Workspace ID:', defaultWorkspaceId);
  console.log('Default Trello Board ID:', defaultTrelloBoardId);
  console.log('Default Trello List ID:', defaultTrelloListId);
  console.log('Environment variables:', {
    miro: process.env.REACT_APP_MIRO_DEFAULT_WORKSPACE_ID,
    trelloBoard: process.env.REACT_APP_TRELLO_DEFAULT_BOARD_ID,
    trelloList: process.env.REACT_APP_TRELLO_DEFAULT_LIST_ID
  });
  
  // Temporary alert for debugging
  useEffect(() => {
    if (open && !workshop) {
      console.log('New workshop form opened. Default workspace ID:', defaultWorkspaceId);
    }
  }, [open, workshop, defaultWorkspaceId]);
  
  const [formData, setFormData] = useState<CreateWorkshopRequest>({
    title: workshop?.title || '',
    goal: workshop?.goal || '',
    type: workshop?.type || WorkshopType.BRAINSTORMING,
    expectedOutcomes: workshop?.expectedOutcomes || '',
    dateTime: workshop?.dateTime || dayjs().add(1, 'day').toISOString(),
    duration: workshop?.duration || 120,
    participantCount: workshop?.participantCount || 5,
    participantTypes: workshop?.participantTypes || '',
    miroWorkspaceId: workshop?.miroWorkspaceId || defaultWorkspaceId,
    trelloBoardId: workshop?.trelloBoardId || defaultTrelloBoardId,
    trelloListId: workshop?.trelloListId || defaultTrelloListId,
  });

  const [dateTime, setDateTime] = useState<Dayjs | null>(
    workshop ? dayjs(workshop.dateTime) : dayjs().add(1, 'day')
  );

  const handleInputChange = (field: keyof CreateWorkshopRequest) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: keyof CreateWorkshopRequest) => (
    event: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleDateTimeChange = (newValue: Dayjs | null) => {
    setDateTime(newValue);
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        dateTime: newValue.toISOString(),
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      title: '',
      goal: '',
      type: WorkshopType.BRAINSTORMING,
      expectedOutcomes: '',
      dateTime: dayjs().add(1, 'day').toISOString(),
      duration: 120,
      participantCount: 5,
      participantTypes: '',
      miroWorkspaceId: '',
      trelloBoardId: '',
      trelloListId: '',
    });
    setDateTime(dayjs().add(1, 'day'));
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {workshop ? 'Edit Workshop' : 'Create New Workshop'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Workshop Title"
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  required
                />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <FormControl sx={{ minWidth: 200, flex: 1 }} required>
                    <InputLabel>Workshop Type</InputLabel>
                    <Select
                      value={formData.type}
                      label="Workshop Type"
                      onChange={handleSelectChange('type')}
                    >
                      {workshopTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <DateTimePicker
                      label="Date & Time"
                      value={dateTime}
                      onChange={handleDateTimeChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                    />
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Workshop Goal"
                  value={formData.goal}
                  onChange={handleInputChange('goal')}
                  multiline
                  rows={2}
                  required
                />

                <TextField
                  fullWidth
                  label="Expected Outcomes"
                  value={formData.expectedOutcomes}
                  onChange={handleInputChange('expectedOutcomes')}
                  multiline
                  rows={2}
                  required
                />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Duration (minutes)"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange('duration')}
                    required
                    inputProps={{ min: 30, max: 480 }}
                    sx={{ flex: 1, minWidth: 120 }}
                  />

                  <TextField
                    label="Number of Participants"
                    type="number"
                    value={formData.participantCount}
                    onChange={handleInputChange('participantCount')}
                    required
                    inputProps={{ min: 1, max: 50 }}
                    sx={{ flex: 1, minWidth: 120 }}
                  />

                  <TextField
                    label="Participant Types"
                    value={formData.participantTypes}
                    onChange={handleInputChange('participantTypes')}
                    placeholder="e.g., developers, designers, PMs"
                    required
                    sx={{ flex: 1, minWidth: 200 }}
                  />
                </Box>

                {/* Integration Settings */}
                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  Integration Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Configure Miro and Trello integration for this workshop. Default values are pre-filled.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label={`Miro Workspace ID ${defaultWorkspaceId ? '(auto-filled)' : '(optional)'}`}
                    value={formData.miroWorkspaceId}
                    onChange={handleInputChange('miroWorkspaceId')}
                    helperText={defaultWorkspaceId ? `Default: ${defaultWorkspaceId}` : "Leave empty if not available yet"}
                    sx={{ flex: 1, minWidth: 200 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label={`Trello Board ID ${defaultTrelloBoardId ? '(auto-filled)' : '(optional)'}`}
                    value={formData.trelloBoardId}
                    onChange={handleInputChange('trelloBoardId')}
                    helperText={defaultTrelloBoardId ? `Default: ${defaultTrelloBoardId}` : "Board where tasks will be created"}
                    sx={{ flex: 1, minWidth: 200 }}
                  />

                  <TextField
                    label={`Trello List ID ${defaultTrelloListId ? '(auto-filled)' : '(optional)'}`}
                    value={formData.trelloListId}
                    onChange={handleInputChange('trelloListId')}
                    helperText={defaultTrelloListId ? `Default: ${defaultTrelloListId}` : "List where tasks will be added"}
                    sx={{ flex: 1, minWidth: 200 }}
                  />
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Creating...' : 'Create Workshop'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};
