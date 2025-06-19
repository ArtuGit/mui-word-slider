import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MainMenu: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <List
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        p: 0,
      }}
      disablePadding
      dense
    >
      <ListItem sx={{ width: 'auto', p: 0, minHeight: 0 }} disablePadding>
        <ListItemButton
          selected={location.pathname === '/decks'}
          onClick={() => handleNavigation('/decks')}
          dense
          sx={{ minHeight: 32, p: '4px 12px' }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: 0.5 }}>
            <ViewModuleIcon color="secondary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Decks" primaryTypographyProps={{ fontSize: '0.95rem' }} />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default MainMenu;
