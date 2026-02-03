import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { apiGet } from '@app/api';
import { useQuery } from '@tanstack/react-query';
import type { InvoiceOut } from '@app/invoices';

type ListResponse<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

export default function InvoicesListPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => apiGet<ListResponse<InvoiceOut>>('/api/v1/invoices?limit=50&offset=0'),
  });

  if (isLoading) {
    return <Alert severity="info">Loading invoices…</Alert>;
  }

  if (isError) {
    return <Alert severity="error">{(error as Error).message}</Alert>;
  }

  const invoices = data?.items ?? [];

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
        <div>
          <Typography variant="h5">Previous invoices & shipment drafts</Typography>
          <Typography color="text.secondary">
            Track validation state, currency, totals, and item count at a glance.
          </Typography>
        </div>
        <Stack direction="row" spacing={2} sx={{ marginLeft: 'auto' }}>
          <Chip label={`${data?.total ?? invoices.length} total`} color="primary" variant="outlined" />
          <Button variant="contained" onClick={() => navigate('/invoices/upload')}>
            Add new invoice
          </Button>
        </Stack>
      </Stack>

      {invoices.length === 0 ? (
        <Alert severity="info">No invoices found yet. Upload your first invoice.</Alert>
      ) : (
        <Stack spacing={2}>
          {invoices.map((invoice) => (
            <Card key={invoice.id} variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <Stack spacing={0.5} flex={1}>
                      <Typography variant="subtitle1">
                        {invoice.invoice_number ?? invoice.id}
                      </Typography>
                      <Typography color="text.secondary">
                        {invoice.supplier_name ?? 'Supplier'} · {invoice.currency}
                      </Typography>
                      <Typography color="text.secondary" variant="caption">
                        Created {new Date(invoice.created_at).toLocaleString()}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip label={`Items: ${invoice.items?.length ?? 0}`} />
                      <Chip label={`Incoterm: ${invoice.incoterm ?? '—'}`} variant="outlined" />
                      <Chip label={`Total: ${invoice.total_value ?? '—'}`} color="success" />
                      <Chip label={`Freight: ${invoice.freight_cost ?? '—'}`} variant="outlined" />
                      <Chip label={`Insurance: ${invoice.insurance_cost ?? '—'}`} variant="outlined" />
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ marginLeft: { md: 'auto' } }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/invoices/${invoice.id}/review`)}
                      >
                        Review
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                      >
                        Details
                      </Button>
                    </Stack>
                  </Stack>
                  <Divider />
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <Stack spacing={0.5} flex={1}>
                      <Typography variant="caption" color="text.secondary">
                        Quick notes
                      </Typography>
                      <Typography variant="body2">
                        Review HS codes and freight/insurance values before continuing to duty
                        calculation.
                      </Typography>
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Invoice dates
                      </Typography>
                      <Typography variant="body2">
                        Invoice: {invoice.invoice_date ?? '—'}
                      </Typography>
                      <Typography variant="body2">Due: {invoice.due_date ?? '—'}</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
