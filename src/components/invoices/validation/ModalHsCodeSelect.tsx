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
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { TariffSearchResult } from '@app/invoices';

type Props = {
  open: boolean;
  description: string;
  options: TariffSearchResult[];
  onSearch: (q: string) => Promise<TariffSearchResult[]>;
  onClose: () => void;
  onSave: (code: string) => void;
};

export default function ModalHsCodeSelect({
  open,
  description,
  options,
  onSearch,
  onClose,
  onSave,
}: Props) {
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TariffSearchResult[]>(options);
  const [manual, setManual] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelected('');
    setManual('');
    setQuery(description);
    setResults(options);
  }, [open, description, options]);

  useEffect(() => {
    if (!open || !description) return;
    if (options.length) return;
    setLoading(true);
    onSearch(description)
      .then((next) => setResults(next))
      .finally(() => setLoading(false));
  }, [open, description, options, onSearch]);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const next = await onSearch(query);
      setResults(next);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const code = selected || manual.trim();
    if (!code) return;
    onSave(code);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>HS Code missing</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography>
            Select the best match for: <strong>{description}</strong>
          </Typography>
          <RadioGroup value={selected} onChange={(event) => setSelected(event.target.value)}>
            {results.map((option) => (
              <FormControlLabel
                key={option.code}
                value={option.code}
                control={<Radio />}
                label={`${option.code} — ${option.description}`}
              />
            ))}
          </RadioGroup>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Search again"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              fullWidth
            />
            <Button variant="outlined" onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching…' : 'Search'}
            </Button>
          </Stack>
          <TextField
            label="Enter HS code manually"
            value={manual}
            onChange={(event) => setManual(event.target.value)}
            fullWidth
          />
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
