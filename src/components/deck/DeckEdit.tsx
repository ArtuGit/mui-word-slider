import { FC, useEffect, useState } from 'react';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { deckService } from '../../services/deck.service';
import { ICard } from '../../types/card.types';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { cardService } from '../../services/card.service';
import { SUPPORTED_LANGUAGES_NAMES } from '../../constants/languages';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AiPromptService from '../../services/ai-promt.service';
import InputAdornment from '@mui/material/InputAdornment';
import LoadingProgress from '../ui/LoadingProgress';
import { CARDS_JSON_EXAMPLE } from '../../constants/cards.json.example.ts';

interface DeckEditProps {
  deckId?: string;
  onBack: () => void;
}

interface DeckFormValues {
  topic: string;
  description?: string;
  languageFrom: string;
  languageTo: string;
  promptToAiAgent?: string;
  cards: string;
}

const cardArrayTest = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return false;
    return parsed.every(
      (item: unknown) =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as ICard).id === 'string' &&
        typeof (item as ICard).sourceLanguage === 'string' &&
        typeof (item as ICard).targetLanguage === 'string' &&
        typeof (item as ICard).sourceWord === 'string' &&
        typeof (item as ICard).targetWord === 'string' &&
        typeof (item as ICard).pronunciation === 'string' &&
        (!(item as ICard).remark || typeof (item as ICard).remark === 'string')
    );
  } catch {
    return false;
  }
};

const DeckSchema = Yup.object().shape({
  topic: Yup.string().required('Topic is required'),
  description: Yup.string(),
  languageFrom: Yup.string()
    .required('Source language is required')
    .oneOf(SUPPORTED_LANGUAGES_NAMES, 'Invalid source language'),
  languageTo: Yup.string()
    .required('Target language is required')
    .oneOf(SUPPORTED_LANGUAGES_NAMES, 'Invalid target language'),
  promptToAiAgent: Yup.string(),
  cards: Yup.string()
    .required('Cards JSON is required')
    .test('valid-json', 'Invalid JSON format or content', value => {
      if (!value) return false;
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed);
      } catch {
        return false;
      }
    })
    .test(
      'valid-structure',
      'Cards must be an array of valid card objects',
      value => !!value && cardArrayTest(value)
    ),
});

const DeckEdit: FC<DeckEditProps> = ({ deckId, onBack }) => {
  const [initialValues, setInitialValues] = useState<DeckFormValues>({
    topic: '',
    description: '',
    languageFrom: '',
    languageTo: '',
    promptToAiAgent: '',
    cards: '',
  });
  const [loading, setLoading] = useState(!!deckId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (deckId) {
      setLoading(true);
      Promise.all([deckService.getDeckById(deckId), cardService.loadCards(deckId)])
        .then(([deck, cards]) => {
          if (deck) {
            setInitialValues({
              topic: deck.topic,
              description: deck.description || '',
              languageFrom: deck.languageFrom,
              languageTo: deck.languageTo,
              promptToAiAgent: deck.promptToAiAgent || '',
              cards: JSON.stringify(cards || [], null, 2),
            });
          }
        })
        .catch(() => setError('Failed to load deck'))
        .finally(() => setLoading(false));
    }
  }, [deckId]);

  const handleSubmit = async (values: typeof initialValues) => {
    setError(null);
    try {
      const cards: ICard[] = JSON.parse(values.cards);
      if (deckId) {
        await deckService.updateDeck(deckId, {
          topic: values.topic,
          description: values.description,
          languageFrom: values.languageFrom,
          languageTo: values.languageTo,
          promptToAiAgent: values.promptToAiAgent,
        });
        await cardService.clearCards(deckId);
        await cardService.saveCards(cards, deckId);
      } else {
        const newDeckId = crypto.randomUUID();
        await deckService.createDeck({
          id: newDeckId,
          topic: values.topic,
          description: values.description,
          languageFrom: values.languageFrom,
          languageTo: values.languageTo,
          ...(values?.promptToAiAgent ? { promptToAiAgent: values.promptToAiAgent } : {}),
        });
        await cardService.saveCards(
          cards.map(card => ({ ...card, deckId: newDeckId })),
          newDeckId
        );
      }
      onBack();
    } catch {
      setError('Failed to save deck');
    }
  };

  if (loading) return <LoadingProgress />;

  return (
    <Paper sx={{ width: '90vw', maxWidth: 900, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" mb={2} textAlign="center">
        {deckId ? 'Edit Deck' : 'Add Deck'}
      </Typography>
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={DeckSchema}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          touched,
          isSubmitting,
          values,
          setFieldValue,
          validateForm,
          setFieldTouched,
        }) => (
          <Form>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                alignItems: 'stretch',
              }}
            >
              {/* Left column: all fields except cards */}
              <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                <Field
                  as={TextField}
                  name="topic"
                  label="Topic"
                  fullWidth
                  error={touched.topic && !!errors.topic}
                  helperText={touched.topic && errors.topic}
                />
                <Field
                  as={TextField}
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  minRows={2}
                  error={touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                />
                <Field
                  as={TextField}
                  name="languageFrom"
                  label="Source Language"
                  select
                  fullWidth
                  error={touched.languageFrom && !!errors.languageFrom}
                  helperText={touched.languageFrom && errors.languageFrom}
                >
                  {SUPPORTED_LANGUAGES_NAMES.map((lang: string) => (
                    <MenuItem key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  as={TextField}
                  name="languageTo"
                  label="Target Language"
                  select
                  fullWidth
                  error={touched.languageTo && !!errors.languageTo}
                  helperText={touched.languageTo && errors.languageTo}
                >
                  {SUPPORTED_LANGUAGES_NAMES.map((lang: string) => (
                    <MenuItem key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  as={TextField}
                  name="promptToAiAgent"
                  label="Prompt to AI Agent"
                  fullWidth
                  multiline
                  minRows={2}
                  error={touched.promptToAiAgent && !!errors.promptToAiAgent}
                  helperText={touched.promptToAiAgent && errors.promptToAiAgent}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          aria-label="Compose"
                          color="primary"
                          disabled={!!values.promptToAiAgent}
                          onClick={async () => {
                            await Promise.all([
                              setFieldTouched('topic', true, false),
                              setFieldTouched('languageFrom', true, false),
                              setFieldTouched('languageTo', true, false),
                            ]);

                            const errors = await validateForm();
                            if (Object.keys(errors).length > 0) {
                              return;
                            }

                            const prompt = AiPromptService.getCardsRequestForDeckPrompt({
                              id: '',
                              topic: values.topic,
                              description: values.description,
                              sourceLanguage: values.languageFrom,
                              targetLanguage: values.languageTo,
                              amount: JSON.parse(values.cards).length || 10,
                            });
                            setFieldValue('promptToAiAgent', prompt);
                          }}
                          edge="end"
                        >
                          <AutoAwesomeIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              {/* Right column: cards editor */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  height: { xs: 'auto', md: '100%' },
                  maxHeight: { xs: 'none', md: '600px' },
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Cards (JSON)
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    minHeight: 200,
                    height: '100%',
                    overflowY: 'auto',
                    backgroundColor: '#1e1e1e',
                    border:
                      touched.cards && errors.cards ? '2px solid #f44336' : '1px solid #424242',
                    borderRadius: '4px',
                  }}
                >
                  <CodeEditor
                    value={values.cards}
                    language="json"
                    placeholder={CARDS_JSON_EXAMPLE}
                    onChange={evn => setFieldValue('cards', evn.target.value)}
                    padding={15}
                    data-color-mode="dark"
                    style={{
                      fontSize: 14,
                      backgroundColor: 'transparent',
                      fontFamily:
                        'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                      minHeight: '200px',
                      height: '100%',
                      width: '100%',
                      resize: 'none',
                    }}
                  />
                </Box>
                {touched.cards && errors.cards && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    {errors.cards}
                  </Typography>
                )}
              </Box>
            </Box>
            {/* Buttons below both columns */}
            <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
              <Button variant="outlined" color="secondary" onClick={onBack} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                Save
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default DeckEdit;
