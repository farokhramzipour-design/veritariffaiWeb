import { useParams } from 'react-router-dom';
import { useInvoice } from '@app/invoices';

function formatMoney(value: number | null | undefined) {
  if (value == null) return '—';
  return value.toFixed(2);
}

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams();
  const { data, isLoading, isError, error } = useInvoice(invoiceId ?? '');

  if (isLoading) {
    return (
      <section className="page invoice-detail">
        <p className="status status--loading">Loading invoice…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="page invoice-detail">
        <p className="status status--error">{(error as Error).message}</p>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="page invoice-detail">
      <div className="invoice-detail__header">
        <div>
          <p className="eyebrow">Invoice</p>
          <h2>{data.invoice_number ?? data.id}</h2>
          <p className="muted">{data.vendor_name ?? 'Vendor'}</p>
        </div>
        <div className="invoice-detail__meta">
          <div>
            <span className="muted">Currency</span>
            <strong>{data.currency}</strong>
          </div>
          <div>
            <span className="muted">Invoice date</span>
            <strong>{data.invoice_date ?? '—'}</strong>
          </div>
          <div>
            <span className="muted">Due date</span>
            <strong>{data.due_date ?? '—'}</strong>
          </div>
        </div>
      </div>

      <div className="invoice-detail__summary">
        <div>
          <span className="muted">Subtotal</span>
          <strong>{formatMoney(data.subtotal)}</strong>
        </div>
        <div>
          <span className="muted">Tax</span>
          <strong>{formatMoney(data.tax)}</strong>
        </div>
        <div>
          <span className="muted">Total</span>
          <strong>{formatMoney(data.total)}</strong>
        </div>
      </div>

      <div className="invoice-detail__table">
        <div className="invoice-detail__row invoice-detail__row--head">
          <span>Description</span>
          <span>Qty</span>
          <span>Unit Price</span>
          <span>Tax Rate</span>
          <span>Line Total</span>
          <span>SKU</span>
        </div>
        {data.items.map((item) => (
          <div key={item.id} className="invoice-detail__row">
            <span>{item.description}</span>
            <span>{item.quantity}</span>
            <span>{formatMoney(item.unit_price)}</span>
            <span>{formatMoney(item.tax_rate)}</span>
            <span>{formatMoney(item.line_total)}</span>
            <span>{item.sku ?? '—'}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
