import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
import { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: { attribute: string }) => void;
};

export default function ModalHsRefine({ open, onClose, onSave }: Props) {
  const [value, setValue] = useState('Hot Rolled');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>HS Code refinement</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <p>Is this product hot rolled or cold rolled?</p>
          <RadioGroup value={value} onChange={(event) => setValue(event.target.value)}>
            <FormControlLabel value="Hot Rolled" control={<Radio />} label="Hot Rolled" />
            <FormControlLabel value="Cold Rolled" control={<Radio />} label="Cold Rolled" />
          </RadioGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave({ attribute: value })}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
