import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, CardContent, Stack, Typography } from '@mui/material';
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
          <Typography variant="h5">New Shipments</Typography>
          <Typography color="text.secondary">
            Previous invoices and shipment drafts.
          </Typography>
        </div>
        <Button
          variant="contained"
          onClick={() => navigate('/invoices/upload')}
          sx={{ marginLeft: 'auto' }}
        >
          Add new invoice
        </Button>
      </Stack>

      {invoices.length === 0 ? (
        <Alert severity="info">No invoices found yet. Upload your first invoice.</Alert>
      ) : (
        <Stack spacing={2}>
          {invoices.map((invoice) => (
            <Card key={invoice.id} variant="outlined">
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                  <div>
                    <Typography variant="subtitle1">
                      {invoice.invoice_number ?? invoice.id}
                    </Typography>
                    <Typography color="text.secondary">
                      {invoice.supplier_name ?? 'Supplier'} · {invoice.currency}
                    </Typography>
                  </div>
                  <Stack direction="row" spacing={1} sx={{ marginLeft: 'auto' }}>
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
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
