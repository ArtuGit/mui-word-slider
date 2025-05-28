import { Box, Button, Paper, Typography, Divider, Chip } from '@mui/material';
import { FC, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useWordsStore } from '../../stores/useWordsStore';
import CodeEditor from '@uiw/react-textarea-code-editor';

interface WordPairInput {
  id: string;
  sourceWord: string;
  targetWord: string;
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
      'JSON must be an array of objects with id (string), sourceWord (string), and targetWord (string)',
      function (value) {
        if (!value) return false;
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) return false;

          return parsed.every(
            (item: unknown) =>
              typeof item === 'object' &&
              item !== null &&
              typeof (item as WordPairInput).id === 'string' &&
              typeof (item as WordPairInput).sourceWord === 'string' &&
              typeof (item as WordPairInput).targetWord === 'string'
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
  const { words, saveWords, isLoading } = useWordsStore();
  const { enqueueSnackbar } = useSnackbar();

  // Generate initial JSON from current words
  const getInitialJsonValue = () => {
    if (words.length > 0) {
      return JSON.stringify(words, null, 2);
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
      const parsed: WordPairInput[] = JSON.parse(values.jsonInput);

      // Save to Zustand store (now with IndexedDB persistence)
      await saveWords(parsed);

      enqueueSnackbar(`Successfully saved ${parsed.length} word pairs to local storage!`, {
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
        Upload Word Pairs in JSON
      </Typography>

      {words.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h3" gutterBottom color="text.secondary">
            Current Word Set
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip label={`${words.length} word pairs loaded`} color="primary" variant="outlined" />
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
                  JSON Word Pairs
                </Typography>
                <Field name="jsonInput">
                  {({ field, meta }: any) => (
                    <Box>
                      <CodeEditor
                        value={field.value}
                        language="json"
                        placeholder={`[
  {
    "id": "1",
    "sourceWord": "Hello",
    "targetWord": "Hola"
  },
  {
    "id": "2",
    "sourceWord": "Goodbye",
    "targetWord": "Adiós"
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
