// src/routes/Protected.tsx
import { Navigate } from 'react-router-dom';
import { getToken } from '../services/session';

export const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = getToken();
  if (!token) return <Navigate to="/api/login" replace />;
  return <>{children}</>;
};