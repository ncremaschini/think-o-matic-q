import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import { Add as AddIcon, Groups as GroupsIcon } from '@mui/icons-material';
import { Workshop, CreateWorkshopRequest } from '../../types/workshop';
import { WorkshopCard } from '../WorkshopCard/WorkshopCard';
import { WorkshopForm } from '../WorkshopForm/WorkshopForm';
import { WorkshopAnalysis } from '../WorkshopAnalysis/WorkshopAnalysis';
import { workshopApi } from '../../services/api';
import { MarkdownRenderer } from '../MarkdownRenderer/MarkdownRenderer';

export const Dashboard: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTab, setDetailsTab] = useState(0);
  const [agendaEditOpen, setAgendaEditOpen] = useState(false);
  const [editedAgenda, setEditedAgenda] = useState('');
  const [agendaEditTab, setAgendaEditTab] = useState(0);
  const [actionLoadingStates, setActionLoadingStates] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    loadWorkshops();
  }, []);

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      const data = await workshopApi.getAll();
      setWorkshops(data);
      setError(null);
    } catch (err) {
      setError('Failed to load workshops');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkshop = async (workshop: CreateWorkshopRequest) => {
    try {
      setFormLoading(true);
      await workshopApi.create(workshop);
      await loadWorkshops();
      setFormOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to create workshop');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditWorkshop = async (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setFormOpen(true);
  };

  const handleUpdateWorkshop = async (workshop: CreateWorkshopRequest) => {
    if (!selectedWorkshop) return;
    try {
      setFormLoading(true);
      await workshopApi.update(selectedWorkshop.id, workshop);
      await loadWorkshops();
      setFormOpen(false);
      setSelectedWorkshop(null);
      setError(null);
    } catch (err) {
      setError('Failed to update workshop');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteWorkshop = async (id: string) => {
    try {
      await workshopApi.delete(id);
      await loadWorkshops();
      setError(null);
    } catch (err) {
      setError('Failed to delete workshop');
      console.error(err);
    }
  };

  const handleGenerateAgenda = async (id: string) => {
    try {
      setActionLoadingStates(prev => ({ ...prev, [`agenda-${id}`]: true }));
      await workshopApi.generateAgenda(id);
      await loadWorkshops();
      setError(null);
    } catch (err) {
      setError('Failed to generate agenda');
      console.error(err);
    } finally {
      setActionLoadingStates(prev => ({ ...prev, [`agenda-${id}`]: false }));
    }
  };

  const handleCreateMiroBoard = async (id: string) => {
    try {
      setActionLoadingStates(prev => ({ ...prev, [`board-${id}`]: true }));
      await workshopApi.createMiroBoard(id);
      await loadWorkshops();
      setError(null);
    } catch (err) {
      setError('Failed to create Miro board');
      console.error(err);
    } finally {
      setActionLoadingStates(prev => ({ ...prev, [`board-${id}`]: false }));
    }
  };

  const handleMarkAsConducted = async (id: string) => {
    try {
      setActionLoadingStates(prev => ({ ...prev, [`conducted-${id}`]: true }));
      await workshopApi.markAsConducted(id);
      await loadWorkshops();
      setError(null);
    } catch (err) {
      setError('Failed to mark workshop as conducted');
      console.error(err);
    } finally {
      setActionLoadingStates(prev => ({ ...prev, [`conducted-${id}`]: false }));
    }
  };

  const handleAnalyzeWorkshop = async (id: string) => {
    try {
      setActionLoadingStates(prev => ({ ...prev, [`analyze-${id}`]: true }));
      await workshopApi.analyzeWorkshop(id);
      await loadWorkshops();
      setError(null);
    } catch (err) {
      setError('Failed to analyze workshop');
      console.error(err);
    } finally {
      setActionLoadingStates(prev => ({ ...prev, [`analyze-${id}`]: false }));
    }
  };

  const handleCreateTasks = async (id: string) => {
    try {
      setActionLoadingStates(prev => ({ ...prev, [`tasks-${id}`]: true }));
      await workshopApi.createTasks(id);
      await loadWorkshops();
      setError(null);
    } catch (err) {
      setError('Failed to create tasks');
      console.error(err);
    } finally {
      setActionLoadingStates(prev => ({ ...prev, [`tasks-${id}`]: false }));
    }
  };

  const handleViewDetails = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedWorkshop(null);
    setDetailsTab(0);
  };

  const handleEditAgenda = () => {
    if (!selectedWorkshop?.agenda) return;
    setEditedAgenda(selectedWorkshop.agenda);
    setAgendaEditOpen(true);
  };

  const handleSaveAgenda = async () => {
    if (!selectedWorkshop) return;
    try {
      await workshopApi.updateAgenda(selectedWorkshop.id, editedAgenda);
      await loadWorkshops();
      setAgendaEditOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to update agenda');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Workshops
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          New Workshop
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : workshops.length === 0 ? (
        // Empty State
        <Box display="flex" justifyContent="center" py={8}>
          <Card sx={{ maxWidth: 500, textAlign: 'center' }}>
            <CardContent sx={{ py: 6 }}>
              <GroupsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Welcome to Think-o-matic! 🧠⚡
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                You haven't created any workshops yet. Get started by creating your first workshop and experience the power of AI-driven agenda generation.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Think-o-matic will help you:
              </Typography>
              <Box component="ul" sx={{ textAlign: 'left', display: 'inline-block', color: 'text.secondary' }}>
                <li>Generate AI-powered agendas</li>
                <li>Create Miro boards automatically</li>
                <li>Analyze workshop outcomes</li>
                <li>Generate Trello tasks from action items</li>
              </Box>
              <Box mt={3}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => setFormOpen(true)}
                >
                  Create Your First Workshop
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ) : (
        // Workshop Grid
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {workshops.map((workshop) => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              onGenerateAgenda={handleGenerateAgenda}
              onCreateMiroBoard={handleCreateMiroBoard}
              onMarkAsConducted={handleMarkAsConducted}
              onAnalyzeWorkshop={handleAnalyzeWorkshop}
              onCreateTasks={handleCreateTasks}
              onEdit={handleEditWorkshop}
              onDelete={handleDeleteWorkshop}
              onViewDetails={handleViewDetails}
              loadingStates={actionLoadingStates}
            />
          ))}
        </Box>
      )}

      {/* Workshop Form Dialog */}
      <WorkshopForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedWorkshop(null);
        }}
        onSubmit={selectedWorkshop ? handleUpdateWorkshop : handleCreateWorkshop}
        loading={formLoading}
        workshop={selectedWorkshop || undefined}
      />

      {/* Workshop Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedWorkshop?.title}
        </DialogTitle>
        <DialogContent dividers>
          <Tabs
            value={detailsTab}
            onChange={(_, value) => setDetailsTab(value)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab label="Agenda" />
            {selectedWorkshop?.analysis && (
              <Tab label="Analysis" />
            )}
          </Tabs>

          {detailsTab === 0 && selectedWorkshop?.agenda && (
            <Box>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button onClick={handleEditAgenda}>
                  Edit Agenda
                </Button>
              </Box>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <MarkdownRenderer content={selectedWorkshop.agenda} />
              </Paper>
            </Box>
          )}

          {detailsTab === 1 && selectedWorkshop?.analysis && (
            <WorkshopAnalysis workshop={selectedWorkshop} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Agenda Edit Dialog */}
      <Dialog
        open={agendaEditOpen}
        onClose={() => setAgendaEditOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Agenda
        </DialogTitle>
        <DialogContent dividers>
          <Tabs
            value={agendaEditTab}
            onChange={(_, value) => setAgendaEditTab(value)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab label="Edit" />
            <Tab label="Preview" />
          </Tabs>

          {agendaEditTab === 0 && (
            <TextField
              multiline
              rows={20}
              fullWidth
              value={editedAgenda}
              onChange={(e) => setEditedAgenda(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}

          {agendaEditTab === 1 && (
            <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
              <MarkdownRenderer content={editedAgenda} />
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAgendaEditOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveAgenda} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
