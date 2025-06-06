import {Box, Button, Chip, Divider, Paper, Typography} from '@mui/material';
import {FC, useState} from 'react';
import {Field, FieldProps, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {useCardsStore} from '../../stores/useCardsStore.ts';
import {useDecksStore} from '../../stores/useDecksStore';
import CodeEditor from '@uiw/react-textarea-code-editor';

interface CardInput {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceWord: string;
  targetWord: string;
  pronunciation: string;
  remark?: string;
  deckId?: string; // Optional in input, will be added automatically
}

const validationSchema = Yup.object({
  jsonInput: Yup.string()
    .required('JSON input is required')
    .test('valid-json', 'Invalid JSON format or content', function (value) {
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
      'JSON must be an array of objects with id (string), sourceLanguage (string), targetLanguage (string), sourceWord (string), targetWord (string), pronunciation (string), and optionally remark (string)',
      function (value) {
        if (!value) return false;
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) return false;

          return parsed.every(
            (item: unknown) =>
              typeof item === 'object' &&
              item !== null &&
              typeof (item as CardInput).id === 'string' &&
              typeof (item as CardInput).sourceLanguage === 'string' &&
              typeof (item as CardInput).targetLanguage === 'string' &&
              typeof (item as CardInput).sourceWord === 'string' &&
              typeof (item as CardInput).targetWord === 'string' &&
              typeof (item as CardInput).pronunciation === 'string' &&
              (!(item as CardInput).remark ||
                typeof (item as CardInput).remark === 'string')
          );
        } catch {
          return false;
        }
      }
    ),
});

const UploadForm: FC = () => {
  const [isValidated, setIsValidated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { words, saveCards, isLoading } = useCardsStore();
  const { currentDeck } = useDecksStore();
  const { enqueueSnackbar } = useSnackbar();

  // Generate initial JSON from current words
  const getInitialJsonValue = () => {
    if (words.length > 0) {
      // Remove deckId from display to keep the interface clean
      const wordsForDisplay = words.map(({ deckId: _deckId, ...word }) => word);
      return JSON.stringify(wordsForDisplay, null, 2);
    }
    return '';
  };

  const handleValidate = async (values: { jsonInput: string }) => {
    try {
      await validationSchema.validate(values);
      setIsValidated(true);
      enqueueSnackbar('JSON is valid!', { variant: 'success' });
    } catch (error) {
      setIsValidated(false);
      enqueueSnackbar(error instanceof Error ? error.message : 'Validation failed', {
        variant: 'error',
      });
    }
  };

  const handleSave = async (values: { jsonInput: string }) => {
    setIsSaving(true);
    try {
      const parsed: CardInput[] = JSON.parse(values.jsonInput);

      // Add deckId to each word pair if not present
      const wordsWithDeckId = parsed.map(word => ({
        ...word,
        deckId: word.deckId || currentDeck?.id || 'default-deck-1',
      }));

      // Save to Zustand store (now with IndexedDB persistence)
      await saveCards(wordsWithDeckId);

      enqueueSnackbar(`Successfully saved ${parsed.length} cards to local storage!`, {
        variant: 'success',
      });
      setIsValidated(false); // Reset validation state after save
    } catch (error) {
      console.error('Error saving data:', error);
      enqueueSnackbar(
        error instanceof Error ? error.message : 'Error saving data to local storage',
        { variant: 'error' }
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        width: '100%',
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Typography variant="h2" component="h2" gutterBottom color="primary">
        Upload Cards in JSON
      </Typography>

      {currentDeck && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h3" gutterBottom color="text.secondary">
            Current Deck: {currentDeck.topic}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {currentDeck.description} ({currentDeck.languageFrom} → {currentDeck.languageTo})
          </Typography>
        </Box>
      )}

      {words.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h3" gutterBottom color="text.secondary">
            Current Word Set
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip label={`${words.length} cards loaded`} color="primary" variant="outlined"/>
          </Box>
          <Divider sx={{ my: 3 }} />
        </Box>
      )}

      <Formik
        initialValues={{ jsonInput: getInitialJsonValue() }}
        validationSchema={validationSchema}
        onSubmit={() => {}}
        enableReinitialize={true}
      >
        {({ values, isValid, setFieldValue }) => {
          const currentWordsJson = getInitialJsonValue();
          const isInputDifferent = values.jsonInput.trim() !== currentWordsJson.trim();

          return (
            <Form>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  JSON Cards
                </Typography>
                <Field name="jsonInput">
                  {({ field, meta }: FieldProps) => (
                    <Box>
                      <CodeEditor
                        value={field.value}
                        language="json"
                        placeholder={`[
  {
    "id": "1",
    "sourceLanguage": "Polish",
    "targetLanguage": "English",
    "sourceWord": "Dzień dobry",
    "targetWord": "Good morning",
    "pronunciation": "/d͡ʑɛɲ ˈdɔbrɨ/",
    "remark": "Formal greeting used until afternoon"
  },
  {
    "id": "2",
    "sourceLanguage": "Polish",
    "targetLanguage": "English",
    "sourceWord": "Do widzenia",
    "targetWord": "Goodbye",
    "pronunciation": "/dɔ viˈd͡zɛɲa/"
  }
]`}
                        onChange={evn =>
                          field.onChange({ target: { name: field.name, value: evn.target.value } })
                        }
                        onBlur={field.onBlur}
                        padding={15}
                        data-color-mode="dark"
                        style={{
                          fontSize: 14,
                          backgroundColor: '#1e1e1e',
                          fontFamily:
                            'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                          minHeight: '300px',
                          border:
                            meta.touched && meta.error ? '2px solid #f44336' : '1px solid #424242',
                          borderRadius: '4px',
                        }}
                      />
                      {meta.touched && meta.error && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1, display: 'block' }}
                        >
                          {meta.error}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Field>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleValidate(values)}
                  disabled={!values.jsonInput.trim() || isLoading || isSaving}
                >
                  Validate
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSave(values)}
                  disabled={!isValidated || !isValid || isLoading || isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>

                {words.length > 0 && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setFieldValue('jsonInput', currentWordsJson);
                      setIsValidated(false);
                    }}
                    disabled={!isInputDifferent || isLoading || isSaving}
                  >
                    Reset to Current
                  </Button>
                )}
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Paper>
  );
};

export default UploadForm;
