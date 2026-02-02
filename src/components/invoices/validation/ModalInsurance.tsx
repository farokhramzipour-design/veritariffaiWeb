import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';

type Props = {
  open: boolean;
  baseValue?: number | null;
  onClose: () => void;
  onSave: (payload: { insurance_mode: 'manual' | 'estimate'; insurance_cost?: number; rate?: number }) => void;
};

export default function ModalInsurance({ open, baseValue, onClose, onSave }: Props) {
  const [mode, setMode] = useState<'manual' | 'estimate'>('manual');
  const [insurance, setInsurance] = useState<number | ''>('');

  const estimateValue =
    typeof baseValue === 'number' ? Number((baseValue * 0.005).toFixed(2)) : null;

  const handleSave = () => {
    if (mode === 'manual') {
      if (insurance === '') return;
      onSave({ insurance_mode: 'manual', insurance_cost: Number(insurance) });
      return;
    }
    onSave({ insurance_mode: 'estimate', rate: 0.005, insurance_cost: estimateValue ?? undefined });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Insurance Required</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <RadioGroup value={mode} onChange={(event) => setMode(event.target.value as 'manual' | 'estimate')}>
            <FormControlLabel value="manual" control={<Radio />} label="Enter manually" />
            <FormControlLabel
              value="estimate"
              control={<Radio />}
              label={`Estimate conservative insurance rate (0.5%)${estimateValue ? ` → ${estimateValue}` : ''}`}
            />
          </RadioGroup>
          {mode === 'manual' && (
            <TextField
              label="Insurance cost"
              type="number"
              value={insurance}
              onChange={(event) =>
                setInsurance(event.target.value === '' ? '' : Number(event.target.value))
              }
              fullWidth
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
