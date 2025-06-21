import {FC, useState} from 'react';
import Slider from 'react-slick';
import {Box, IconButton, styled, Typography} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {ICard} from '../../../types/card.types.ts';
import WordCard from './WordCard.tsx';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface WordCardSliderProps {
  words: ICard[];
}

interface ArrowProps {
  onClick?: (event: React.MouseEvent) => void;
  onDirectionChange: (direction: 'left' | 'right') => void;
}

const OuterContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const SliderCardWrapper = styled(Box)(({theme}) => ({
  position: 'relative',
  width: '90%',
  maxWidth: '600px',
  [theme.breakpoints.up('lg')]: {
    maxWidth: '900px',
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: '1200px',
  },
  margin: '0 auto',
  '& .slick-slider': {
    width: '100%',
  },
  '& .slick-list': {
    width: '100%',
    margin: '0 auto',
  },
  '& .slick-track': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .slick-slide': {
    '& > div': {
      width: '100%',
      display: 'flex !important',
      justifyContent: 'center',
    },
  },
}));

const ArrowButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& svg': {
    fontSize: '2rem',
    color: theme.palette.primary.main,
    [theme.breakpoints.up('lg')]: {
      fontSize: '2.5rem',
    },
  },
}));

const Counter = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.primary.dark,
  fontWeight: 500,
  fontSize: '1.3rem',
  letterSpacing: 1,
  [theme.breakpoints.up('lg')]: {
    fontSize: '1.6rem',
    marginTop: theme.spacing(3),
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '1.8rem',
  },
}));

const NextArrow: FC<ArrowProps> = props => {
  const { onClick, onDirectionChange } = props;
  const handleClick = (e: React.MouseEvent) => {
    onDirectionChange('right');
    onClick?.(e);
  };
  return (
    <ArrowButton
      onClick={handleClick}
      sx={{
        right: { xs: -32, lg: -48 },
      }}
      aria-label="next"
    >
      <ArrowForwardIosIcon />
    </ArrowButton>
  );
};

const PrevArrow: FC<ArrowProps> = props => {
  const { onClick, onDirectionChange } = props;
  const handleClick = (e: React.MouseEvent) => {
    onDirectionChange('left');
    onClick?.(e);
  };
  return (
    <ArrowButton
      onClick={handleClick}
      sx={{
        left: { xs: -32, lg: -48 },
      }}
      aria-label="previous"
    >
      <ArrowBackIosNewIcon />
    </ArrowButton>
  );
};

export const WordCardSlider: FC<WordCardSliderProps> = ({ words }) => {
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [current, setCurrent] = useState(0);

  // Disable infinite scroll and autoplay when there's only one card
  const hasMultipleCards = words.length > 1;

  const settings = {
    dots: false,
    infinite: hasMultipleCards,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: hasMultipleCards,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: hasMultipleCards ? <NextArrow onDirectionChange={setSlideDirection}/> : undefined,
    prevArrow: hasMultipleCards ? <PrevArrow onDirectionChange={setSlideDirection}/> : undefined,
    beforeChange: (oldIndex: number, next: number) => {
      const direction = next > oldIndex ? 'right' : 'left';
      setSlideDirection(direction);
    },
    afterChange: (index: number) => setCurrent(index),
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    className: `slide-${slideDirection}`,
  };

  return (
    <OuterContainer>
      <SliderCardWrapper>
        <Slider {...settings}>
          {words.map(word => (
            <div key={word.id}>
              <WordCard
                sourceWord={word.sourceWord}
                targetWord={word.targetWord}
                pronunciation={word.pronunciation}
                remark={word.remark}
                sourceLanguage={word.sourceLanguage}
              />
            </div>
          ))}
        </Slider>
      </SliderCardWrapper>
      <Counter>{words.length ? `${current + 1} of ${words.length}` : null}</Counter>
    </OuterContainer>
  );
};

export default WordCardSlider;
