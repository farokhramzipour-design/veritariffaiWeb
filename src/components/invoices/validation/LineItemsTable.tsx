import {
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { InvoiceItemOut } from '@app/invoices';

type Props = {
  items: InvoiceItemOut[];
  onSelectHs: (item: InvoiceItemOut) => void;
};

function formatMoney(value?: number | null) {
  if (value == null) return '—';
  return value.toFixed(2);
}

export default function LineItemsTable({ items, onSelectHs }: Props) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Line Items</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Line Total</TableCell>
                <TableCell>HS Code</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const hs = item.validated_hs_code ?? item.extracted_hs_code;
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatMoney(item.unit_price)}</TableCell>
                    <TableCell>{formatMoney(item.line_total)}</TableCell>
                    <TableCell>{hs ?? 'Missing'}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onSelectHs(item)}
                      >
                        {hs ? 'Refine HS' : 'Add HS'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Stack>
      </CardContent>
    </Card>
  );
}
