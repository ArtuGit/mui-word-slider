import { FC } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingProgressProps {
  message?: string;
  size?: number;
}

const LoadingProgress: FC<LoadingProgressProps> = ({ message = 'Loading...', size = 60 }) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <CircularProgress size={size} />
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingProgress;
