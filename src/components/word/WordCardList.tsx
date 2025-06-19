import { FC } from 'react';
import { Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { ICard } from '../../types/card.types';

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
                height: 280,
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
                  p: 3,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.75,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: theme.palette.primary.main,
                    wordBreak: 'break-word',
                    lineHeight: 1.2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
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
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 0.5,
                  }}
                >
                  {word.targetWord}
                </Typography>

                <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {word.pronunciation && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: 'italic',
                        color: theme.palette.text.secondary,
                        fontSize: '0.9rem',
                        lineHeight: 1.2,
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
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
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
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
