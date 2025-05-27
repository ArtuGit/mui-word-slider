import { FC } from 'react';
import MainMenu from './MainMenu.tsx';
import { Box } from '@mui/material';

export const Header: FC = () => {
  return (
    <>
      <Box
        sx={{
          height: '10%',
          minHeight: '2.5rem',
          bgcolor: 'background.paper',
          color: 'text.primary',
          p: 2,
        }}
      >
        <MainMenu />
      </Box>
    </>
  );
};

export default Header;
