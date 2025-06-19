import { FC, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { ICard } from '../../types/card.types';

interface DisplayModeTabsProps {
  words: ICard[];
  sliderComponent: React.ReactNode;
  listComponent: React.ReactNode;
}

const DisplayModeTabs: FC<DisplayModeTabsProps> = ({ words, sliderComponent, listComponent }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (words.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
            },
          }}
        >
          <Tab
            label="List"
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          />
          <Tab
            label="Slider"
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          />
        </Tabs>
      </Box>

      <Box>
        {activeTab === 0 && listComponent}
        {activeTab === 1 && sliderComponent}
      </Box>
    </Box>
  );
};

export default DisplayModeTabs;
