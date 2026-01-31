import { useMutation, useQuery } from '@tanstack/react-query';
import { apiGet, apiPostFile, apiPostJson } from '@app/api';

export type LineItemExtract = {
  description: string;
  quantity?: number | null;
  unit_price?: number | null;
  tax_rate?: number | null;
  line_total?: number | null;
  sku?: string | null;
  confidence?: number | null;
};

export type ExtractedInvoicePayload = {
  vendor_name?: string | null;
  invoice_number?: string | null;
  invoice_date?: string | null;
  due_date?: string | null;
  currency?: string | null;
  subtotal?: number | null;
  tax?: number | null;
  total?: number | null;
  line_items: LineItemExtract[];
  field_confidence?: Record<string, number>;
};

export type DraftInvoiceOut = {
  id: string;
  upload_id: string;
  status: string;
  extracted_payload?: ExtractedInvoicePayload | null;
  confirmed_payload?: Record<string, unknown> | null;
  confidence?: number | null;
  warnings?: string[];
  raw_text_excerpt?: string | null;
  created_at: string;
  updated_at: string;
};

export type UploadResponse = {
  upload_id: string;
};

export type ExtractResponse = {
  draft_id: string;
  status: string;
};

export type ConfirmLineItem = {
  description: string;
  quantity: number;
  unit_price?: number | null;
  tax_rate?: number | null;
  line_total?: number | null;
  sku?: string | null;
};

export type ConfirmInvoiceRequest = {
  vendor_name?: string | null;
  invoice_number?: string | null;
  invoice_date: string;
  due_date?: string | null;
  currency: string;
  subtotal?: number | null;
  tax?: number | null;
  total?: number | null;
  line_items: ConfirmLineItem[];
};

export type InvoiceItemOut = {
  id: string;
  description: string;
  sku?: string | null;
  quantity: number;
  unit_price?: number | null;
  tax_rate?: number | null;
  line_total?: number | null;
  sort_order: number;
};

export type InvoiceOut = {
  id: string;
  vendor_name?: string | null;
  invoice_number?: string | null;
  invoice_date?: string | null;
  due_date?: string | null;
  currency: string;
  subtotal?: number | null;
  tax?: number | null;
  total?: number | null;
  created_at: string;
  items: InvoiceItemOut[];
};

export function useUploadInvoice() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiPostFile<UploadResponse>('/api/v1/invoices/uploads', formData);
    },
  });
}

export function useExtractInvoice() {
  return useMutation({
    mutationFn: async (uploadId: string) =>
      apiPostJson<ExtractResponse>(`/api/v1/invoices/uploads/${uploadId}/extract`, {}),
  });
}

export function useDraftInvoice(draftId: string) {
  return useQuery({
    queryKey: ['draft-invoice', draftId],
    queryFn: () => apiGet<DraftInvoiceOut>(`/api/v1/invoices/drafts/${draftId}`),
    enabled: Boolean(draftId),
    refetchInterval: (query) => {
      const status = query.state.data?.status?.toUpperCase();
      if (!status) return 2000;
      if (['UPLOADED', 'EXTRACTING'].includes(status)) return 2000;
      return false;
    },
  });
}

export function useConfirmInvoice(draftId: string) {
  return useMutation({
    mutationFn: async (payload: ConfirmInvoiceRequest) =>
      apiPostJson<{ invoice_id?: string; id?: string }>(
        `/api/v1/invoices/drafts/${draftId}/confirm`,
        payload
      ),
  });
}

export function useInvoice(invoiceId: string) {
  return useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => apiGet<InvoiceOut>(`/api/v1/invoices/${invoiceId}`),
    enabled: Boolean(invoiceId),
  });
}
