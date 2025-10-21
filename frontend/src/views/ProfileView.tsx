import { useEffect, useState } from 'react';
import { getMe } from '../services/profile';

export default function ProfileView() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMe();
        setProfile(data);
      } catch (err:any) {
        setError('No se pudo obtener el perfil');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Perfil de usuario</h1>
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-6 space-y-2">
        <div><b>ID:</b> {profile.id}</div>
        <div><b>Email:</b> {profile.email}</div>
        <div><b>Rol:</b> {profile.role || '-'}</div>
      </div>
    </div>
  );
}
