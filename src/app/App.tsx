import { Route, Routes } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import ProtectedRoute from './ProtectedRoute';
import Landing from '@pages/Landing';
import Login from '@pages/Login';
import Panel from '@pages/Panel';

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
      </Route>
    </Routes>
  );
}
