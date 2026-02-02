import type { ValidationTaskOut } from '@app/invoices';

export const mockValidationTasks: ValidationTaskOut[] = [
  {
    id: 'task-freight',
    invoice_id: 'inv-001',
    task_type: 'FREIGHT_REQUIRED',
    status: 'open',
    payload: { incoterm: 'FOB' },
    created_at: new Date().toISOString(),
  },
  {
    id: 'task-insurance',
    invoice_id: 'inv-001',
    task_type: 'INSURANCE_REQUIRED',
    status: 'open',
    payload: { insurance_missing: true },
    created_at: new Date().toISOString(),
  },
  {
    id: 'task-hs-missing',
    invoice_id: 'inv-001',
    line_item_id: 'line-001',
    task_type: 'HS_CODE_MISSING',
    status: 'open',
    payload: {
      options: [
        { code: '7304.11', description: 'Line pipe of a kind used for oil or gas pipelines.' },
        { code: '7208.39', description: 'Flat-rolled products of iron or non-alloy steel.' },
      ],
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'task-hs-refine',
    invoice_id: 'inv-001',
    line_item_id: 'line-002',
    task_type: 'HS_CODE_REFINEMENT',
    status: 'open',
    payload: {
      question: 'Is this product Hot Rolled or Cold Rolled?',
      options: ['Hot Rolled', 'Cold Rolled'],
    },
    created_at: new Date().toISOString(),
  },
];
