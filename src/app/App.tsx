import { Route, Routes } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import ProtectedRoute from './ProtectedRoute';
import Landing from '@pages/Landing';
import Login from '@pages/Login';
import Panel from '@pages/Panel';
import ShipmentDetail from '@pages/ShipmentDetail';
import InvoiceUploadPage from '@pages/InvoiceUploadPage';
import InvoiceDraftReviewPage from '@pages/InvoiceDraftReviewPage';
import InvoiceDetailPage from '@pages/InvoiceDetailPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/panel"
          element={
            <ProtectedRoute>
              <Panel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices/upload"
          element={
            <ProtectedRoute>
              <InvoiceUploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices/drafts/:draftId"
          element={
            <ProtectedRoute>
              <InvoiceDraftReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices/:invoiceId"
          element={
            <ProtectedRoute>
              <InvoiceDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipments/:po"
          element={
            <ProtectedRoute>
              <ShipmentDetail />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
