import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import type { InvoiceOut } from '@app/invoices';

type Props = {
  invoice: InvoiceOut;
};

export default function InvoiceHeaderSummary({ invoice }: Props) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
          <Stack spacing={1} flex={1}>
            <Typography variant="overline" color="text.secondary">
              Invoice Review
            </Typography>
            <Typography variant="h5">
              {invoice.invoice_number ?? invoice.id}
            </Typography>
            <Typography color="text.secondary">
              {invoice.supplier_name ?? 'Supplier'} · Incoterm {invoice.incoterm ?? '—'}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={`Currency: ${invoice.currency}`} />
            <Chip label={`Total: ${invoice.total_value ?? '—'}`} />
            <Chip label={`Freight: ${invoice.freight_cost ?? '—'}`} />
            <Chip label={`Insurance: ${invoice.insurance_cost ?? '—'}`} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
