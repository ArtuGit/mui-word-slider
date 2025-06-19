import { FC } from 'react';
import MainMenu from './MainMenu.tsx';
import { Box } from '@mui/material';

export const Header: FC = () => {
  return (
    <>
      <Box
        sx={{
          height: '8%',
          minHeight: { xs: '1.6rem', sm: '1.8rem', md: '2rem' },
          bgcolor: 'background.paper',
          color: 'text.primary',
          p: { xs: 0.8, sm: 1.2, md: 1.6 },
        }}
      >
        <MainMenu />
      </Box>
    </>
  );
};

export default Header;
