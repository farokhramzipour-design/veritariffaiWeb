import { useMemo } from 'react';
import type { ConfirmLineItem } from '@app/invoices';

type Props = {
  items: ConfirmLineItem[];
  onChange: (items: ConfirmLineItem[]) => void;
  confidences?: Array<number | null | undefined>;
};

const emptyItem: ConfirmLineItem = {
  description: '',
  quantity: 1,
  unit_price: null,
  line_total: null,
  sku: null,
};

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function confidenceTone(value?: number | null) {
  if (value == null) return 'muted';
  if (value >= 0.8) return 'good';
  if (value >= 0.6) return 'warn';
  return 'risk';
}

export default function LineItemsTableEditable({ items, onChange, confidences }: Props) {
  const rows = useMemo(() => (items.length ? items : [emptyItem]), [items]);

  const updateRow = (index: number, patch: Partial<ConfirmLineItem>) => {
    const next = rows.map((row, idx) => (idx === index ? { ...row, ...patch } : row));
    onChange(next);
  };

  const removeRow = (index: number) => {
    const next = rows.filter((_, idx) => idx !== index);
    onChange(next.length ? next : [emptyItem]);
  };

  return (
    <div className="line-items">
      <div className="line-items__header">
        <h4>Line Items</h4>
        <button className="button button--ghost" type="button" onClick={() => onChange([...rows, emptyItem])}>
          Add row
        </button>
      </div>
      <div className="line-items__table">
        <div className="line-items__row line-items__row--head">
          <span>Description</span>
          <span>Qty</span>
          <span>Unit Price</span>
          <span>Line Total</span>
          <span>SKU</span>
          <span>Conf.</span>
          <span />
        </div>
        {rows.map((item, index) => (
          <div key={`${item.description}-${index}`} className="line-items__row">
            <input
              value={item.description}
              onChange={(event) => updateRow(index, { description: event.target.value })}
              placeholder="Steel coils"
            />
            <input
              value={item.quantity ?? ''}
              onChange={(event) => updateRow(index, { quantity: toNumber(event.target.value) ?? 0 })}
              type="number"
              min="0"
            />
            <input
              value={item.unit_price ?? ''}
              onChange={(event) => updateRow(index, { unit_price: toNumber(event.target.value) })}
              type="number"
              min="0"
              step="0.01"
            />
            <input
              value={item.line_total ?? ''}
              onChange={(event) => updateRow(index, { line_total: toNumber(event.target.value) })}
              type="number"
              min="0"
              step="0.01"
            />
            <input
              value={item.sku ?? ''}
              onChange={(event) => updateRow(index, { sku: event.target.value })}
              placeholder="SKU"
            />
            <span
              className={`confidence-dot confidence-dot--${confidenceTone(
                confidences?.[index]
              )}`}
              title={
                confidences?.[index] != null
                  ? `Confidence ${(confidences[index] ?? 0) * 100}%`
                  : 'Confidence N/A'
              }
            />
            <button className="line-items__remove" type="button" onClick={() => removeRow(index)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
