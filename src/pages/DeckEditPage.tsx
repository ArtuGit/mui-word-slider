import {FC} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import DeckEdit from '../components/deck/DeckEdit';

const DeckEditPage: FC = () => {
    const navigate = useNavigate();
    const {deckId} = useParams<{ deckId?: string }>();

    const handleBack = () => navigate('/decks');

    return <DeckEdit deckId={deckId} onBack={handleBack}/>;
};

export default DeckEditPage;
