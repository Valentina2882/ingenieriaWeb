import { useEffect, useState } from 'react';
import { listCategories } from '../services/categories';

export default function CategoriesView() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [is401, setIs401] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setIs401(false);
      setError(null);
      try {
        const data = await listCategories();
        setCategories(data);
      } catch (err:any) {
        if (err.status === 401) {
          setIs401(true);
          setError('No autorizado. (401) Inicia sesión para consultar categorías.');
        } else {
          setError('No se pudieron cargar las categorías');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      {loading && <p>Cargando categorías...</p>}
      {is401 && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-2">
          {error}
          <div className="mt-3">
            <strong>Credenciales de prueba:</strong>
            <div className="mt-2">
              <div className="font-semibold text-blue-600">👨‍💼 Administrador:</div>
              <div>Email: <span className="font-mono">admin@mail.com</span></div>
              <div>Password: <span className="font-mono">admin123</span></div>
            </div>
            <div className="mt-2">
              <div className="font-semibold text-green-600">🛍️ Cliente:</div>
              <div>Email: <span className="font-mono">customer@mail.com</span></div>
              <div>Password: <span className="font-mono">customer123</span></div>
            </div>
          </div>
        </div>
      )}
      {!loading && !is401 && error && <p className="text-red-600">{error}</p>}
      {!is401 && !loading && !error && (
        <>
          <h1 className="text-2xl font-bold">Categorías</h1>
          {categories.length === 0 ? (
            <div>No hay categorías disponibles.</div>
          ) : (
            <ul className="list-disc list-inside">
              {categories.map((cat:any) => (
                <li key={cat.id}>ID: {cat.id} | Nombre: {cat.name}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
