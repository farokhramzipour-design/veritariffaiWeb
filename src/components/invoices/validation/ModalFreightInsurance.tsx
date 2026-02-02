import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';

type Props = {
  open: boolean;
  baseValue?: number | null;
  onClose: () => void;
  onSave: (payload: { freight_cost: number; insurance_cost: number }) => void;
};

export default function ModalFreightInsurance({ open, baseValue, onClose, onSave }: Props) {
  const [freight, setFreight] = useState<number | ''>('');
  const [insurance, setInsurance] = useState<number | ''>('');

  const handleEstimate = () => {
    if (typeof baseValue !== 'number') return;
    const estimate = Number((baseValue * 0.005).toFixed(2));
    setInsurance(estimate);
  };

  const handleSave = () => {
    if (freight === '' || insurance === '') return;
    onSave({ freight_cost: Number(freight), insurance_cost: Number(insurance) });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Freight & Insurance Required</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <p>Shipping costs not included. Please enter estimated Freight & Insurance costs.</p>
          <TextField
            label="Freight cost"
            type="number"
            value={freight}
            onChange={(event) => setFreight(event.target.value === '' ? '' : Number(event.target.value))}
            fullWidth
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Insurance cost"
              type="number"
              value={insurance}
              onChange={(event) =>
                setInsurance(event.target.value === '' ? '' : Number(event.target.value))
              }
              fullWidth
            />
            <Button variant="outlined" onClick={handleEstimate}>
              Estimate 0.5%
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
