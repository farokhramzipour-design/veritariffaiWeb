import { Route, Routes } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import TradeFlowLayout from './layouts/TradeFlowLayout';
import ProtectedRoute from './ProtectedRoute';
import Landing from '@pages/Landing';
import Login from '@pages/Login';
import Panel from '@pages/Panel';
import ShipmentDetail from '@pages/ShipmentDetail';
import InvoiceUploadPage from '@pages/InvoiceUploadPage';
import InvoiceDraftReviewPage from '@pages/InvoiceDraftReviewPage';
import InvoiceDetailPage from '@pages/InvoiceDetailPage';
import ChallengesPage from '@pages/ChallengesPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <TradeFlowLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/panel" element={<Panel />} />
          <Route path="/invoices/upload" element={<InvoiceUploadPage />} />
          <Route path="/invoices/drafts/:draftId" element={<InvoiceDraftReviewPage />} />
          <Route path="/invoices/:invoiceId" element={<InvoiceDetailPage />} />
          <Route path="/shipments/:po" element={<ShipmentDetail />} />
          <Route path="/challenges" element={<ChallengesPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
