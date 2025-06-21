import { FC } from 'react';
import { Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainMenu from './menu/MainMenu.tsx';

export const Header: FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      <Box
        sx={{
          height: '8%',
          minHeight: { xs: '1.6rem', sm: '1.8rem', md: '2rem' },
          bgcolor: 'background.paper',
          color: 'text.primary',
          p: { xs: 0.8, sm: 1.2, md: 1.6 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <IconButton
            onClick={handleLogoClick}
            sx={{
              p: 0,
              borderRadius: '50%',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out',
                borderRadius: '8px',
              },
            }}
          >
            <img
              src="/logo.svg"
              alt="Logo"
              style={{
                height: '100%',
                maxHeight: '2.5rem',
                width: 'auto',
              }}
            />
          </IconButton>

          <MainMenu />
        </Box>
      </Box>
    </>
  );
};

export default Header;
