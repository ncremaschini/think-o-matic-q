import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Paper,
  Stack,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Lightbulb as LightbulbIcon,
  Flag as FlagIcon,
  Recommend as RecommendIcon,
} from '@mui/icons-material';
import { Workshop } from '../../types/workshop';

interface WorkshopAnalysisProps {
  workshop: Workshop;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return 'error';
    case 'MEDIUM':
      return 'warning';
    case 'LOW':
      return 'success';
    default:
      return 'default';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Technical':
      return '🔧';
    case 'Process':
      return '📋';
    case 'Research':
      return '🔍';
    default:
      return '📌';
  }
};

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case 'POSITIVE':
      return <TrendingUpIcon color="success" />;
    case 'NEGATIVE':
      return <TrendingDownIcon color="error" />;
    default:
      return <TrendingFlatIcon color="action" />;
  }
};

const getParticipationColor = (level: string) => {
  switch (level) {
    case 'HIGH':
      return 'success';
    case 'MEDIUM':
      return 'warning';
    case 'LOW':
      return 'error';
    default:
      return 'default';
  }
};

export const WorkshopAnalysis: React.FC<WorkshopAnalysisProps> = ({ workshop }) => {
  if (!workshop.analysis) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No analysis available for this workshop.
        </Typography>
      </Box>
    );
  }

  const { analysis } = workshop;

  return (
    <Box sx={{ p: 2 }}>
      {/* Summary Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Typography variant="subtitle1" color="text.primary" gutterBottom>
            {analysis.summary.brief}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {analysis.summary.detailed}
          </Typography>
        </CardContent>
      </Card>

      <Stack spacing={3}>
        {/* Sentiment and Participation */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Sentiment Analysis */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                {getSentimentIcon(analysis.sentiment.overall)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Sentiment Analysis
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Score: {analysis.sentiment.score}/5
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(analysis.sentiment.score / 5) * 100}
                  color={analysis.sentiment.overall === 'POSITIVE' ? 'success' : 
                         analysis.sentiment.overall === 'NEGATIVE' ? 'error' : 'primary'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="body2">
                {analysis.sentiment.explanation}
              </Typography>
            </CardContent>
          </Card>

          {/* Participation Level */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PeopleIcon />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Participation
                </Typography>
              </Box>
              <Chip
                label={analysis.participation.level}
                color={getParticipationColor(analysis.participation.level)}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2">
                {analysis.participation.evidence}
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* Action Items and Key Themes */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Action Items */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AssignmentIcon />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Action Items
                </Typography>
              </Box>
              <List>
                {analysis.actionItems.map((item, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getCategoryIcon(item.category)}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.task}
                      secondary={
                        <Box display="flex" gap={1} mt={0.5}>
                          <Chip
                            label={item.priority}
                            size="small"
                            color={getPriorityColor(item.priority)}
                          />
                          <Chip
                            label={item.category}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Key Themes */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <LightbulbIcon />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Key Themes
                </Typography>
              </Box>
              <List>
                {analysis.keyThemes.map((theme, index) => (
                  <Paper key={index} elevation={1} sx={{ mb: 2, p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {theme.theme}
                    </Typography>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Chip
                        label={`Frequency: ${theme.frequency}`}
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {theme.context}
                    </Typography>
                  </Paper>
                ))}
              </List>
            </CardContent>
          </Card>
        </Stack>

        {/* Recommendations */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <RecommendIcon />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Recommendations
              </Typography>
            </Box>
            <List>
              {analysis.recommendations.map((recommendation, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <FlagIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={recommendation} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};
