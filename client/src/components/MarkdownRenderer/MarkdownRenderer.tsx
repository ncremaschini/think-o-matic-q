import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledMarkdownContainer = styled(Box)(({ theme }) => ({
  '& h1': {
    ...theme.typography.h4,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  '& h2': {
    ...theme.typography.h5,
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(1.5),
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  '& h3': {
    ...theme.typography.h6,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    fontWeight: 600,
  },
  '& h4, & h5, & h6': {
    ...theme.typography.subtitle1,
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    fontWeight: 600,
  },
  '& p': {
    ...theme.typography.body1,
    marginBottom: theme.spacing(1.5),
    lineHeight: 1.6,
  },
  '& ul, & ol': {
    marginBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(3),
  },
  '& li': {
    ...theme.typography.body1,
    marginBottom: theme.spacing(0.5),
    lineHeight: 1.6,
  },
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    paddingLeft: theme.spacing(2),
    margin: theme.spacing(2, 0),
    fontStyle: 'italic',
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
  },
  '& code': {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(0.25, 0.5),
    borderRadius: theme.shape.borderRadius,
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    fontSize: '0.875em',
  },
  '& pre': {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    overflow: 'auto',
    marginBottom: theme.spacing(2),
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
  },
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
  '& th, & td': {
    padding: theme.spacing(1),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& th': {
    backgroundColor: theme.palette.grey[50],
    fontWeight: 600,
  },
  '& hr': {
    border: 'none',
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: theme.spacing(3, 0),
  },
  '& strong': {
    fontWeight: 600,
  },
  '& em': {
    fontStyle: 'italic',
  },
}));

interface MarkdownRendererProps {
  content: string;
  sx?: any;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  sx = {} 
}) => {
  if (!content || content.trim() === '') {
    return (
      <Typography variant="body2" color="text.secondary" sx={sx}>
        No content available
      </Typography>
    );
  }

  return (
    <StyledMarkdownContainer sx={sx}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom component for better MUI integration
          h1: ({ children }) => (
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              {children}
            </Typography>
          ),
          h2: ({ children }) => (
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              {children}
            </Typography>
          ),
          h3: ({ children }) => (
            <Typography variant="h6" component="h3" gutterBottom>
              {children}
            </Typography>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </StyledMarkdownContainer>
  );
};
