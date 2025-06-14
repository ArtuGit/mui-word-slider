import {FC, useEffect, useState} from 'react';
import {Button, CircularProgress, Paper, Stack, TextField, Typography} from '@mui/material';
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {deckService} from '../../services/deck.service';
import {IDeck} from '../../types/deck.types';

interface DeckEditProps {
    deckId?: string;
    onBack: () => void;
}

const DeckSchema = Yup.object().shape({
    topic: Yup.string().required('Topic is required'),
    description: Yup.string(),
    languageFrom: Yup.string().required('Source language is required'),
    languageTo: Yup.string().required('Target language is required'),
    promptToAiAgent: Yup.string(),
});

const DeckEdit: FC<DeckEditProps> = ({deckId, onBack}) => {
    const [initialValues, setInitialValues] = useState({
        topic: '',
        description: '',
        languageFrom: '',
        languageTo: '',
        promptToAiAgent: '',
    });
    const [loading, setLoading] = useState(!!deckId);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (deckId) {
            setLoading(true);
            deckService
                .getDeckById(deckId)
                .then(deck => {
                    if (deck) {
                        setInitialValues({
                            topic: deck.topic,
                            description: deck.description || '',
                            languageFrom: deck.languageFrom,
                            languageTo: deck.languageTo,
                            promptToAiAgent: deck.promptToAiAgent || '',
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
            if (deckId) {
                await deckService.updateDeck(deckId, values);
            } else {
                const newDeck: IDeck = {
                    ...values,
                    id: crypto.randomUUID(),
                    amount: 0,
                };
                await deckService.createDeck(newDeck);
            }
            onBack();
        } catch (e) {
            setError('Failed to save deck');
        }
    };

    if (loading) return <CircularProgress sx={{m: 4}}/>;

    return (
        <Paper sx={{maxWidth: 500, mx: 'auto', mt: 4, p: 3}}>
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
                {({errors, touched, isSubmitting}) => (
                    <Form>
                        <Stack spacing={2}>
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
                                fullWidth
                                error={touched.languageFrom && !!errors.languageFrom}
                                helperText={touched.languageFrom && errors.languageFrom}
                            />
                            <Field
                                as={TextField}
                                name="languageTo"
                                label="Target Language"
                                fullWidth
                                error={touched.languageTo && !!errors.languageTo}
                                helperText={touched.languageTo && errors.languageTo}
                            />
                            <Field
                                as={TextField}
                                name="promptToAiAgent"
                                label="Prompt to AI Agent"
                                fullWidth
                                multiline
                                minRows={2}
                                error={touched.promptToAiAgent && !!errors.promptToAiAgent}
                                helperText={touched.promptToAiAgent && errors.promptToAiAgent}
                            />
                            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={onBack}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                    Save
                                </Button>
                            </Stack>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default DeckEdit;
