import { useMutation, useQuery, type Query } from '@tanstack/react-query';
import { apiGet, apiPostFile, apiPostJson } from '@app/api';

export type LineItemExtract = {
  description: string;
  quantity?: number | null;
  unit_price?: number | null;
  tax_rate?: number | null;
  line_total?: number | null;
  sku?: string | null;
  confidence?: number | null;
  extracted_hs_code?: string | null;
  validated_hs_code?: string | null;
};

export type ExtractedInvoicePayload = {
  supplier_name?: string | null;
  invoice_number?: string | null;
  invoice_date?: string | null;
  due_date?: string | null;
  incoterm?: string | null;
  currency?: string | null;
  total_value?: number | null;
  freight_cost?: number | null;
  insurance_cost?: number | null;
  line_items: LineItemExtract[];
  field_confidence?: Record<string, number | null>;
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
  line_total?: number | null;
  sku?: string | null;
  extracted_hs_code?: string | null;
  validated_hs_code?: string | null;
};

export type ConfirmInvoiceRequest = {
  supplier_name?: string | null;
  invoice_number?: string | null;
  invoice_date: string;
  due_date?: string | null;
  incoterm?: string | null;
  currency: string;
  total_value?: number | null;
  freight_cost?: number | null;
  insurance_cost?: number | null;
  line_items: ConfirmLineItem[];
};

export type InvoiceItemOut = {
  id: string;
  description: string;
  sku?: string | null;
  quantity: number;
  unit_price?: number | null;
  line_total?: number | null;
  extracted_hs_code?: string | null;
  validated_hs_code?: string | null;
  hs_confidence?: number | null;
  sort_order: number;
};

export type InvoiceOut = {
  id: string;
  supplier_name?: string | null;
  invoice_number?: string | null;
  invoice_date?: string | null;
  due_date?: string | null;
  incoterm?: string | null;
  currency: string;
  total_value?: number | null;
  freight_cost?: number | null;
  insurance_cost?: number | null;
  created_at: string;
  items: InvoiceItemOut[];
};

export type ValidationTaskOut = {
  id: string;
  invoice_id: string;
  line_item_id?: string | null;
  task_type: string;
  status: string;
  payload?: Record<string, unknown> | null;
  resolution?: Record<string, unknown> | null;
  created_at: string;
  resolved_at?: string | null;
};

export type TariffSearchResult = {
  code: string;
  description: string;
};

type TariffSearchResponse = {
  results?: TariffSearchResult[];
};

export type FxQuote = {
  rate: number;
  base: string;
  quote: string;
  timestamp?: string;
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
    refetchInterval: (query: Query<DraftInvoiceOut>) => {
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

export function useValidateInvoice(invoiceId: string) {
  return useMutation({
    mutationFn: async () =>
      apiPostJson<ValidationTaskOut[]>(`/api/v1/invoices/${invoiceId}/validate`, {}),
  });
}

export function useResolveValidationTask(taskId: string) {
  return useMutation({
    mutationFn: async (resolution: Record<string, unknown>) =>
      apiPostJson<ValidationTaskOut>(`/api/v1/validation-tasks/${taskId}/resolve`, {
        resolution,
      }),
  });
}

export function useTariffSearch() {
  return useMutation({
    mutationFn: async (payload: { q: string; limit?: number }) => {
      const response = await apiPostJson<TariffSearchResult[] | TariffSearchResponse>(
        `/api/v1/tariff/search`,
        payload
      );
      if (Array.isArray(response)) return response;
      return response.results ?? [];
    },
  });
}

export function useNormalizeCurrency(invoiceId: string) {
  return useMutation({
    mutationFn: async (payload: { target_currency: string; fx_provider: string }) =>
      apiPostJson<void>(`/api/v1/invoices/${invoiceId}/normalize-currency`, payload),
  });
}

export function useFxQuote() {
  return useMutation({
    mutationFn: async (payload: { base: string; quote: string; amount: number }) =>
      apiGet<FxQuote>(
        `/api/v1/fx/quote?base=${encodeURIComponent(payload.base)}&quote=${encodeURIComponent(
          payload.quote
        )}&amount=${payload.amount}`
      ),
  });
}

export function useResolveHsCode(invoiceId: string, lineItemId: string) {
  return useMutation({
    mutationFn: async (payload: { selected_code: string }) =>
      apiPostJson<void>(
        `/api/v1/invoices/${invoiceId}/line-items/${lineItemId}/hs-code/resolve`,
        payload
      ),
  });
}

export function useRefineHsCode(invoiceId: string, lineItemId: string) {
  return useMutation({
    mutationFn: async (payload: { attribute: string; chosen_child_code?: string }) =>
      apiPostJson<void>(
        `/api/v1/invoices/${invoiceId}/line-items/${lineItemId}/hs-code/refine`,
        payload
      ),
  });
}
