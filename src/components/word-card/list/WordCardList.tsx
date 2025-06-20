import { FC } from 'react';
import { Box, Grid } from '@mui/material';
import { ICard } from '../../../types/card.types.ts';
import WordCard from './WordCard.tsx';

interface WordCardListProps {
  words: ICard[];
}

const WordCardList: FC<WordCardListProps> = ({ words }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: 2 }}>
      <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        {words.map((word, index) => (
          <Grid
            key={word.id || index}
            sx={{
              gridColumn: {
                xs: 'span 12',
                sm: 'span 6',
                md: 'span 4',
                lg: 'span 3',
              },
            }}
          >
            <WordCard word={word} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WordCardList;
