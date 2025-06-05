import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
    >
      <ListItem sx={{ width: 'auto' }}>
        <ListItemButton
          selected={location.pathname === '/' || location.pathname === '/learn'}
          onClick={() => handleNavigation('/learn')}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
            <RocketLaunchIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Go!" />
        </ListItemButton>
      </ListItem>
      <ListItem sx={{ width: 'auto' }}>
        <ListItemButton
          selected={location.pathname === '/decks'}
          onClick={() => handleNavigation('/decks')}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
            <ViewModuleIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Decks" />
        </ListItemButton>
      </ListItem>
      <ListItem sx={{ width: 'auto' }}>
        <ListItemButton
          selected={location.pathname === '/upload'}
          onClick={() => handleNavigation('/upload')}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
            <CloudUploadIcon color="action" />
          </ListItemIcon>
          <ListItemText primary="Upload" />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default MainMenu;
