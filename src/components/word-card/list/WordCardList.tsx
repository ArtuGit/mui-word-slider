import { FC } from 'react';
import { Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { ICard } from '../../../types/card.types.ts';

interface WordCardListProps {
  words: ICard[];
}

const WordCardList: FC<WordCardListProps> = ({ words }) => {
  const theme = useTheme();

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
            <Card
              elevation={2}
              sx={{
                height: 180,
                width: '100%',
                maxWidth: 280,
                mx: 'auto',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  elevation: 6,
                  transform: 'translateY(-4px)',
                },
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent
                sx={{
                  p: 2,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.25,
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      color: theme.palette.primary.main,
                      wordBreak: 'break-word',
                      lineHeight: 1.1,
                      mb: 0.5,
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
                      wordBreak: 'break-word',
                      lineHeight: 1.2,
                    }}
                  >
                    {word.targetWord}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 'auto',
                    pt: 0.5,
                    borderTop: 1,
                    borderColor: 'divider',
                  }}
                >
                  {word.pronunciation && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: 'italic',
                        color: theme.palette.text.secondary,
                        fontSize: '0.85rem',
                        lineHeight: 1.1,
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
                        fontSize: '0.8rem',
                        lineHeight: 1.2,
                        mt: 0.25,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {word.remark}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WordCardList;
