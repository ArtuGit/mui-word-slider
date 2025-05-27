import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useWordsStore } from '../../stores/useWordsStore';

interface WordPairInput {
  id: string;
  sourceWord: string;
  targetWord: string;
}

const validationSchema = Yup.object({
  jsonInput: Yup.string()
    .required('JSON input is required')
    .test('valid-json', 'Invalid JSON format', function (value) {
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
  const { saveWords } = useWordsStore();
  const { enqueueSnackbar } = useSnackbar();

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

  const handleSave = (values: { jsonInput: string }) => {
    try {
      const parsed: WordPairInput[] = JSON.parse(values.jsonInput);

      // Save to Zustand store
      saveWords(parsed);

      enqueueSnackbar(`Successfully saved ${parsed.length} word pairs to the store!`, {
        variant: 'success',
      });
      setIsValidated(false); // Reset validation state after save
    } catch {
      enqueueSnackbar('Error saving data', { variant: 'error' });
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
      <Typography variant="h5" component="h2" gutterBottom color="primary">
        Upload Word Pairs in JSON
      </Typography>

      <Formik
        initialValues={{ jsonInput: '' }}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, isValid }) => (
          <Form>
            <Box sx={{ mb: 3 }}>
              <Field
                as={TextField}
                name="jsonInput"
                label="JSON Word Pairs"
                multiline
                rows={12}
                fullWidth
                variant="outlined"
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
                error={touched.jsonInput && !!errors.jsonInput}
                helperText={touched.jsonInput && errors.jsonInput}
                sx={{
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleValidate(values)}
                disabled={!values.jsonInput.trim()}
              >
                Validate
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSave(values)}
                disabled={!isValidated || !isValid}
              >
                Save
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default UploadForm;
