import {FC} from 'react';
import {Paper} from '@mui/material';
import {StyledMarkdown} from '../ui/StyledMarkdown';
import {UPLOAD_INSTRUCTION_MARKDOWN} from "../../constants/mardown-contnent.ts";

const UploadInstruction: FC = () => {
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
        <StyledMarkdown>{UPLOAD_INSTRUCTION_MARKDOWN}</StyledMarkdown>
    </Paper>
  );
};

export default UploadInstruction;
