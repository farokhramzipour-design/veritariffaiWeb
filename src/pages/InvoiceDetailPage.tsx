import { useParams } from 'react-router-dom';
import { type InvoiceItemOut, useInvoice } from '@app/invoices';

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
          <p className="muted">{data.supplier_name ?? 'Supplier'}</p>
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
          <div>
            <span className="muted">Incoterm</span>
            <strong>{data.incoterm ?? '—'}</strong>
          </div>
        </div>
      </div>

      <div className="invoice-detail__summary">
        <div>
          <span className="muted">Total value</span>
          <strong>{formatMoney(data.total_value)}</strong>
        </div>
        <div>
          <span className="muted">Freight</span>
          <strong>{formatMoney(data.freight_cost)}</strong>
        </div>
        <div>
          <span className="muted">Insurance</span>
          <strong>{formatMoney(data.insurance_cost)}</strong>
        </div>
      </div>

      <div className="invoice-detail__table">
        <div className="invoice-detail__row invoice-detail__row--head">
          <span>Description</span>
          <span>Qty</span>
          <span>Unit Price</span>
          <span>Line Total</span>
          <span>SKU</span>
          <span>HS Code</span>
        </div>
        {data.items.map((item: InvoiceItemOut) => (
          <div key={item.id} className="invoice-detail__row">
            <span>{item.description}</span>
            <span>{item.quantity}</span>
            <span>{formatMoney(item.unit_price)}</span>
            <span>{formatMoney(item.line_total)}</span>
            <span>{item.sku ?? '—'}</span>
            <span>{item.validated_hs_code ?? item.extracted_hs_code ?? '—'}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
