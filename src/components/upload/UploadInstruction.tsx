import { FC } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const UPLOAD_INSTRUCTION_MD = `
## How to Upload your Word Pairs

Ask your AI agent to create a JSON with word pairs on a given language and topic 
as an array of objects with the following structure:

  - \`id\`: A unique identifier for the word pair (string)
  - \`sourceLanguage\`: The source language name (string)
  - \`targetLanguage\`: The target language name (string)
  - \`sourceWord\`: The word in the source language
  - \`targetWord\`: The word in the target language
  - \`pronunciation\`: IPA pronunciation transcription
  - \`remark\`: (Optional) Additional context or meaning clarification
  

### Prompt Example
> Please, create JSON with an array of the  following structure:
>  - \`id\`: A unique identifier for the word pair (string)
>  - \`sourceLanguage\`: Polish
>  - \`targetLanguage\`: English
>  - \`sourceWord\`: The word in the source language
>  - \`targetWord\`: The word in the target language
>  - \`pronunciation\`: IPA pronunciation transcription
>  - \`remark\`: (Optional) Additional context or meaning clarification
>
>   Parameters:
> - Source language: Polish
> - Target language: English
> - Topic: Common phrases
> - Limit: 30 word pairs

### JSON Output Example
\`\`\`json
[
  {
    "id": "1",
    "sourceLanguage": "Polish",
    "targetLanguage": "English",
    "sourceWord": "Dzień dobry",
    "targetWord": "Good morning / Good day",
    "pronunciation": "/d͡ʑɛɲ ˈdɔbrɨ/",
    "remark": "Formal greeting used until afternoon"
  },
  {
    "id": "2",
    "sourceLanguage": "Polish",
    "targetLanguage": "English",
    "sourceWord": "Do widzenia",
    "targetWord": "Goodbye",
    "pronunciation": "/dɔ viˈd͡zɛɲa/",
    "remark": "Formal farewell, literally 'until seeing'"
  },
  {
    "id": "3",
    "sourceLanguage": "Polish",
    "targetLanguage": "English",
    "sourceWord": "Cześć",
    "targetWord": "Hi / Hello / Bye (informal)",
    "pronunciation": "/t͡ʂɛɕt͡ɕ/",
    "remark": "Informal greeting, also used for goodbye"
  },
  ...
]
\`\`\`
`;

const UploadInstruction: FC = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        width: '100%',
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
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
        {UPLOAD_INSTRUCTION_MD}
      </ReactMarkdown>
    </Paper>
  );
};

export default UploadInstruction;
