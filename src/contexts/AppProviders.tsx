import { FC, ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '../theme/ThemeProvider';

export const AppProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={2000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </SnackbarProvider>
  );
};

export default AppProviders;
