import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface StyledMarkdownProps {
  children: string;
}

export const StyledMarkdown: FC<StyledMarkdownProps> = ({ children }) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            {children}
          </Typography>
        ),
        h2: ({ children }) => (
          <Typography variant="h4" component="h2" gutterBottom color="secondary">
            {children}
          </Typography>
        ),
        h3: ({ children }) => (
          <Typography variant="h5" component="h3" gutterBottom>
            {children}
          </Typography>
        ),
        p: ({ children }) => (
          <Typography variant="body1" paragraph>
            {children}
          </Typography>
        ),
        a: ({ children, href, ...props }) => (
          <Box
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#4FC3F7', // Light blue for better readability
              textDecoration: 'underline',
              '&:hover': {
                color: '#81D4FA', // Even lighter blue on hover
              },
            }}
            {...props}
          >
            {children}
          </Box>
        ),
        blockquote: ({ children }) => (
          <Box
            component="blockquote"
            sx={{
              margin: 2,
              padding: 2,
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              backgroundColor: 'rgba(53, 146, 196, 0.1)', // Semi-transparent primary color
              borderRadius: 1,
              fontStyle: 'italic',
              '& p': {
                margin: 0,
                color: 'text.secondary',
              },
            }}
          >
            {children}
          </Box>
        ),
        code: ({ children, className }) => {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          const isInline = !match;

          if (isInline) {
            return (
              <Box
                component="code"
                sx={{
                  bgcolor: '#1e1e1e',
                  color: '#d4d4d4',
                  px: 0.5,
                  py: 0.25,
                  borderRadius: 0.5,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}
              >
                {children}
              </Box>
            );
          }

          return (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <SyntaxHighlighter style={vscDarkPlus as any} language={language} PreTag="div">
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default StyledMarkdown;
