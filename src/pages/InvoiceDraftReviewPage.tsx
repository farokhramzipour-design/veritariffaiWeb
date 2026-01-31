import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ConfirmInvoiceRequest,
  ConfirmLineItem,
  LineItemExtract,
  useConfirmInvoice,
  useDraftInvoice,
} from '@app/invoices';
import ConfidenceBadge from '@components/invoices/ConfidenceBadge';
import LineItemsTableEditable from '@components/invoices/LineItemsTableEditable';
import WarningsPanel from '@components/invoices/WarningsPanel';

function normalizeDraftValue(value?: number | null) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function computeLineTotal(item: ConfirmLineItem) {
  if (item.quantity === 0 || item.unit_price == null) return 0;
  return item.quantity * (item.unit_price ?? 0);
}

function sum(values: number[]) {
  return values.reduce((acc, value) => acc + value, 0);
}

function formatMoney(value: number | null | undefined) {
  if (value == null) return '—';
  return value.toFixed(2);
}

export default function InvoiceDraftReviewPage() {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useDraftInvoice(draftId ?? '');
  const confirmMutation = useConfirmInvoice(draftId ?? '');
  const [form, setForm] = useState<ConfirmInvoiceRequest | null>(null);
  const [dirty, setDirty] = useState(false);
  const lineConfidences = useMemo(
    () =>
      data?.extracted_payload?.line_items?.map((item: LineItemExtract) => item.confidence ?? null) ??
      [],
    [data]
  );

  useEffect(() => {
    if (!data || dirty) return;
    if (data.status.toUpperCase() !== 'EXTRACTED' && data.status.toUpperCase() !== 'NEEDS_REVIEW') {
      return;
    }
    const payload = data.extracted_payload;
    if (!payload) return;
    const lineItems: ConfirmLineItem[] = (payload.line_items ?? []).map((item: LineItemExtract) => ({
      description: item.description,
      quantity: item.quantity ?? 0,
      unit_price: normalizeDraftValue(item.unit_price),
      tax_rate: normalizeDraftValue(item.tax_rate),
      line_total: normalizeDraftValue(item.line_total),
      sku: item.sku ?? null,
    }));
    setForm({
      vendor_name: payload.vendor_name ?? null,
      invoice_number: payload.invoice_number ?? null,
      invoice_date: payload.invoice_date ?? '',
      due_date: payload.due_date ?? null,
      currency: payload.currency ?? '',
      subtotal: normalizeDraftValue(payload.subtotal),
      tax: normalizeDraftValue(payload.tax),
      total: normalizeDraftValue(payload.total),
      line_items: lineItems.length ? lineItems : [{ description: '', quantity: 1 }],
    });
  }, [data, dirty]);

  const computedTotals = useMemo(() => {
    if (!form) return null;
    const lineTotals = form.line_items.map((item: ConfirmLineItem) =>
      item.line_total != null ? item.line_total : computeLineTotal(item)
    );
    const subtotal = sum(lineTotals.map((value) => value ?? 0));
    const tax = form.tax ?? 0;
    const total = subtotal + tax;
    return { subtotal, total };
  }, [form]);

  const mismatch =
    form && computedTotals
      ? Math.abs((form.total ?? computedTotals.total) - computedTotals.total) > 1
      : false;

  const handleFieldChange = (patch: Partial<ConfirmInvoiceRequest>) => {
    if (!form) return;
    setDirty(true);
    setForm({ ...form, ...patch });
  };

  const handleConfirm = async () => {
    if (!form) return;
    if (!form.currency) {
      alert('Currency is required.');
      return;
    }
    if (!form.invoice_date) {
      alert('Invoice date is required.');
      return;
    }
    if (!form.line_items.length) {
      alert('At least one line item is required.');
      return;
    }
    const result = await confirmMutation.mutateAsync(form);
    const invoiceId = result?.invoice_id ?? result?.id;
    if (invoiceId) {
      navigate(`/invoices/${invoiceId}`);
      return;
    }
    navigate('/invoices/upload');
  };

  if (isLoading) {
    return (
      <section className="page invoice-draft">
        <p className="status status--loading">Loading draft...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="page invoice-draft">
        <p className="status status--error">{(error as Error).message}</p>
      </section>
    );
  }

  if (!data) return null;

  const status = data.status.toUpperCase();

  return (
    <section className="page invoice-draft">
      <div className="invoice-draft__header">
        <div>
          <p className="eyebrow">Extraction Preview</p>
          <h2>Draft {data.id}</h2>
          <p className="muted">Status: {status}</p>
        </div>
        <ConfidenceBadge label="Overall confidence" value={data.confidence ?? null} />
      </div>

      {(status === 'UPLOADED' || status === 'EXTRACTING') && (
        <div className="invoice-draft__progress">
          <p className="muted">Extracting invoice details…</p>
          <div className="progress-bar">
            <span />
          </div>
        </div>
      )}

      {(status === 'FAILED' || status === 'ERROR') && (
        <p className="status status--error">Extraction failed. Please retry upload.</p>
      )}

      {(status === 'EXTRACTED' || status === 'NEEDS_REVIEW') && form && (
        <>
          <div className="invoice-draft__grid">
            <div className="invoice-form">
              <label>
                Vendor name
                <input
                  value={form.vendor_name ?? ''}
                  onChange={(event) => handleFieldChange({ vendor_name: event.target.value })}
                />
              </label>
              <label>
                Invoice #
                <input
                  value={form.invoice_number ?? ''}
                  onChange={(event) => handleFieldChange({ invoice_number: event.target.value })}
                />
              </label>
              <label>
                Invoice date
                <input
                  type="date"
                  value={form.invoice_date}
                  onChange={(event) => handleFieldChange({ invoice_date: event.target.value })}
                />
              </label>
              <label>
                Due date
                <input
                  type="date"
                  value={form.due_date ?? ''}
                  onChange={(event) => handleFieldChange({ due_date: event.target.value })}
                />
              </label>
              <label>
                Currency
                <input
                  value={form.currency}
                  onChange={(event) => handleFieldChange({ currency: event.target.value.toUpperCase() })}
                />
              </label>
              <label>
                Subtotal
                <input
                  type="number"
                  value={form.subtotal ?? ''}
                  onChange={(event) =>
                    handleFieldChange({
                      subtotal: Number.isFinite(Number(event.target.value))
                        ? Number(event.target.value)
                        : null,
                    })
                  }
                />
              </label>
              <label>
                Tax
                <input
                  type="number"
                  value={form.tax ?? ''}
                  onChange={(event) =>
                    handleFieldChange({
                      tax: Number.isFinite(Number(event.target.value)) ? Number(event.target.value) : null,
                    })
                  }
                />
              </label>
              <label>
                Total
                <input
                  type="number"
                  value={form.total ?? ''}
                  onChange={(event) =>
                    handleFieldChange({
                      total: Number.isFinite(Number(event.target.value)) ? Number(event.target.value) : null,
                    })
                  }
                />
              </label>
            </div>

            <div className="invoice-side">
              <div className="invoice-metrics">
                <h4>Totals check</h4>
                <p>Calculated subtotal: {formatMoney(computedTotals?.subtotal ?? null)}</p>
                <p>Calculated total: {formatMoney(computedTotals?.total ?? null)}</p>
                {mismatch && (
                  <p className="status status--error">Totals mismatch detected.</p>
                )}
              </div>
              <WarningsPanel warnings={data.warnings ?? []} />
            </div>
          </div>

          <LineItemsTableEditable
            items={form.line_items}
            confidences={lineConfidences}
            onChange={(items) => handleFieldChange({ line_items: items })}
          />

          <div className="invoice-actions">
            <button className="button button--ghost" type="button" onClick={() => navigate('/invoices/upload')}>
              Back to upload
            </button>
            <button
              className="button button--primary"
              type="button"
              onClick={handleConfirm}
              disabled={confirmMutation.isPending}
            >
              {confirmMutation.isPending ? 'Confirming…' : 'Confirm invoice'}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
