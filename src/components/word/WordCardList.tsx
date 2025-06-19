import { FC } from 'react';
import { Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { ICard } from '../../types/card.types';

interface WordCardListProps {
  words: ICard[];
}

const WordCardList: FC<WordCardListProps> = ({ words }) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Grid container spacing={2}>
        {words.map((word, index) => (
          <Grid item xs={12} sm={6} md={4} key={word.id || index}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-2px)',
                },
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: '1.2rem',
                      color: theme.palette.primary.main,
                      mb: 1,
                      wordBreak: 'break-word',
                    }}
                  >
                    {word.sourceWord}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '1.1rem',
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      mb: 1,
                      wordBreak: 'break-word',
                    }}
                  >
                    {word.targetWord}
                  </Typography>
                </Box>

                {word.pronunciation && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: 'italic',
                      color: theme.palette.text.secondary,
                      mb: 1,
                      fontSize: '0.9rem',
                    }}
                  >
                    {word.pronunciation}
                  </Typography>
                )}

                {word.remark && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: '0.85rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {word.remark}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WordCardList;
