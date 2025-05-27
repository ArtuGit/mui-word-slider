import { FC } from 'react';
import { Box, Container } from '@mui/material';

import UploadInstruction from '../components/upload/UploadInstruction.tsx';
import UploadForm from '../components/upload/UploadForm.tsx';

export const UploadPage: FC = () => {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          py: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            width: '100%',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <UploadInstruction />
          </Box>
          <Box sx={{ flex: 1 }}>
            <UploadForm />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default UploadPage;
