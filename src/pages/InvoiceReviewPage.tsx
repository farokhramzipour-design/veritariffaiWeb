import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Stack } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  InvoiceItemOut,
  ValidationTaskOut,
  useFxQuote,
  useInvoice,
  useNormalizeCurrency,
  useResolveHsCode,
  useRefineHsCode,
  useResolveValidationTask,
  useTariffSearch,
  useValidateInvoice,
} from '@app/invoices';
import InvoiceHeaderSummary from '@components/invoices/validation/InvoiceHeaderSummary';
import LineItemsTable from '@components/invoices/validation/LineItemsTable';
import ValidationTaskWizard from '@components/invoices/validation/ValidationTaskWizard';
import ModalFreightInsurance from '@components/invoices/validation/ModalFreightInsurance';
import ModalInsurance from '@components/invoices/validation/ModalInsurance';
import ModalHsCodeSelect from '@components/invoices/validation/ModalHsCodeSelect';
import ModalHsRefine from '@components/invoices/validation/ModalHsRefine';
import CurrencySwitcherFooter from '@components/invoices/validation/CurrencySwitcherFooter';

type TariffOption = {
  code: string;
  description: string;
};

const TASKS_BLOCKING = new Set(['FREIGHT_REQUIRED', 'INSURANCE_REQUIRED', 'HS_CODE_MISSING', 'HS_CODE_REFINEMENT']);

export default function InvoiceReviewPage() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { data: invoice, isLoading, isError, error, refetch } = useInvoice(invoiceId ?? '');
  const validateMutation = useValidateInvoice(invoiceId ?? '');
  const tariffSearch = useTariffSearch();
  const fxQuote = useFxQuote();
  const normalizeCurrency = useNormalizeCurrency(invoiceId ?? '');

  const [tasks, setTasks] = useState<ValidationTaskOut[]>([]);
  const [activeTask, setActiveTask] = useState<ValidationTaskOut | null>(null);
  const [selectedLineItem, setSelectedLineItem] = useState<InvoiceItemOut | null>(null);
  const [hsOptions, setHsOptions] = useState<TariffOption[]>([]);
  const [fxInfo, setFxInfo] = useState<{ rate: number; base: string; quote: string; timestamp?: string } | null>(
    null
  );
  const [currency, setCurrency] = useState('USD');
  const [currencyError, setCurrencyError] = useState<string | null>(null);
  const validatedOnceRef = useRef(false);

  const resolveTaskMutation = useResolveValidationTask(activeTask?.id ?? '');
  const resolveHsMutation = useResolveHsCode(invoiceId ?? '', selectedLineItem?.id ?? '');
  const refineHsMutation = useRefineHsCode(invoiceId ?? '', selectedLineItem?.id ?? '');

  const normalizeTasks = (payload: unknown) => {
    if (Array.isArray(payload)) return payload as ValidationTaskOut[];
    const response = payload as {
      tasks?: Array<
        ValidationTaskOut & { payload_jsonb?: Record<string, unknown>; resolution_jsonb?: Record<string, unknown> }
      >;
    };
    if (!response?.tasks) return [];
    return response.tasks.map((task) => ({
      ...task,
      status: task.status?.toLowerCase?.() ?? task.status,
      payload: task.payload ?? task.payload_jsonb ?? null,
      resolution: task.resolution ?? task.resolution_jsonb ?? null,
    }));
  };

  useEffect(() => {
    if (!invoiceId || validatedOnceRef.current) return;
    validatedOnceRef.current = true;
    validateMutation.mutate(undefined, {
      onSuccess: (payload) => setTasks(normalizeTasks(payload)),
    });
  }, [invoiceId, validateMutation]);

  useEffect(() => {
    if (invoice?.currency) {
      setCurrency(invoice.currency);
    }
  }, [invoice?.currency]);

  const blockingTasks = useMemo(() => {
    const itemMap = new Map(invoice?.items?.map((item) => [item.id, item]) ?? []);
    return tasks.filter((task) => {
      const taskStatus = task.status?.toLowerCase?.() ?? task.status;
      if (!TASKS_BLOCKING.has(task.task_type) || taskStatus === 'resolved') return false;
      if (task.task_type === 'HS_CODE_MISSING' && task.line_item_id) {
        const item = itemMap.get(task.line_item_id);
        if (item?.validated_hs_code) return false;
      }
      return true;
    });
  }, [tasks, invoice]);

  useEffect(() => {
    if (activeTask || blockingTasks.length === 0) return;
    handleResolveTask(blockingTasks[0]);
  }, [blockingTasks, activeTask]);

  const handleResolveTask = (task: ValidationTaskOut) => {
    setActiveTask(task);
    if (task.task_type === 'HS_CODE_MISSING' || task.task_type === 'HS_CODE_REFINEMENT') {
      const item = invoice?.items.find((line) => line.id === task.line_item_id);
      if (item) setSelectedLineItem(item);
    }
    const payload = task.payload as { options?: TariffOption[]; search_suggestions?: TariffOption[] } | undefined;
    const options = payload?.options ?? payload?.search_suggestions ?? [];
    setHsOptions(options);
  };

  const refreshTasks = () => {
    if (!invoiceId) return;
    validateMutation.mutate(undefined, {
      onSuccess: (payload) => setTasks(normalizeTasks(payload)),
    });
    refetch();
  };

  const handleResolve = async (resolution: Record<string, unknown>) => {
    if (!activeTask) return;
    await resolveTaskMutation.mutateAsync(resolution);
    setActiveTask(null);
    refreshTasks();
  };

  const handleHsSave = async (code: string) => {
    if (!selectedLineItem) return;
    await resolveHsMutation.mutateAsync({ selected_code: code });
    setActiveTask(null);
    refreshTasks();
  };

  const handleHsRefine = async (payload: { attribute: string }) => {
    if (!selectedLineItem) return;
    await refineHsMutation.mutateAsync(payload);
    setActiveTask(null);
    refreshTasks();
  };

  const handleSearch = async (q: string) => {
    const results = await tariffSearch.mutateAsync({ q, limit: 5 });
    return results;
  };

  const handleConvert = async () => {
    if (!invoice) return;
    if (currency === invoice.currency) {
      setCurrencyError(null);
      return;
    }
    try {
      setCurrencyError(null);
      const fx = await fxQuote.mutateAsync({ base: invoice.currency, quote: currency, amount: 1 });
      setFxInfo(fx);
      await normalizeCurrency.mutateAsync({ target_currency: currency, fx_provider: 'calculator_api' });
      await refetch();
    } catch (err) {
      setCurrencyError((err as Error).message);
    }
  };

  const canContinue = blockingTasks.length === 0 && (!currencyError || currency === invoice?.currency);

  if (isLoading) {
    return <Alert severity="info">Loading invoice…</Alert>;
  }

  if (isError) {
    return <Alert severity="error">{(error as Error).message}</Alert>;
  }

  if (!invoice) return null;

  return (
    <Stack spacing={3}>
      <InvoiceHeaderSummary invoice={invoice} />
      <ValidationTaskWizard tasks={tasks} onResolveTask={handleResolveTask} />
      <LineItemsTable items={invoice.items} onSelectHs={(item) => setSelectedLineItem(item)} />

      <CurrencySwitcherFooter
        currentCurrency={invoice.currency}
        selectedCurrency={currency}
        onChangeCurrency={setCurrency}
        onConvert={handleConvert}
        fxInfo={fxInfo}
        error={currencyError}
        disabled={normalizeCurrency.isPending}
        canContinue={canContinue}
        onContinue={() => navigate(`/invoices/${invoice.id}`)}
      />

      <ModalFreightInsurance
        open={activeTask?.task_type === 'FREIGHT_REQUIRED'}
        baseValue={invoice.total_value ?? null}
        onClose={() => setActiveTask(null)}
        onSave={(payload) => handleResolve(payload)}
      />
      <ModalInsurance
        open={activeTask?.task_type === 'INSURANCE_REQUIRED'}
        baseValue={invoice.total_value ?? null}
        onClose={() => setActiveTask(null)}
        onSave={(payload) => handleResolve(payload)}
      />
      {selectedLineItem && (
        <ModalHsCodeSelect
          open={activeTask?.task_type === 'HS_CODE_MISSING'}
          description={selectedLineItem.description}
          options={hsOptions}
          onSearch={handleSearch}
          onClose={() => setActiveTask(null)}
          onSave={handleHsSave}
        />
      )}
      <ModalHsRefine
        open={activeTask?.task_type === 'HS_CODE_REFINEMENT'}
        onClose={() => setActiveTask(null)}
        onSave={handleHsRefine}
      />
    </Stack>
  );
}
