import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';

type Props = {
  currentCurrency: string;
  selectedCurrency: string;
  onChangeCurrency: (value: string) => void;
  onConvert: () => void;
  fxInfo?: { rate: number; base: string; quote: string; timestamp?: string } | null;
  disabled: boolean;
  error?: string | null;
  canContinue: boolean;
  onContinue: () => void;
};

export default function CurrencySwitcherFooter({
  currentCurrency,
  selectedCurrency,
  onChangeCurrency,
  onConvert,
  fxInfo,
  disabled,
  error,
  canContinue,
  onContinue,
}: Props) {
  return (
    <Card variant="outlined" sx={{ position: 'sticky', bottom: 16 }}>
      <CardContent>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <Stack spacing={1} flex={1}>
            <Typography variant="subtitle1">Currency normalization</Typography>
            {fxInfo && (
              <Typography variant="caption" color="text.secondary">
                Rate: 1 {fxInfo.base} = {fxInfo.rate} {fxInfo.quote}
                {fxInfo.timestamp ? ` · ${fxInfo.timestamp}` : ''}
              </Typography>
            )}
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              label="Currency"
              value={selectedCurrency}
              onChange={(event) => onChangeCurrency(event.target.value)}
            >
              {['USD', 'EUR', 'GBP'].map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={onConvert} disabled={disabled}>
            Convert values
          </Button>
          <Button variant="contained" onClick={onContinue} disabled={!canContinue}>
            Continue &amp; Calculate Duty
          </Button>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Current invoice currency: {currentCurrency}
        </Typography>
      </CardContent>
    </Card>
  );
}
