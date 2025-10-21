import { useEffect, useState } from 'react';
import { listProducts, createProduct } from '../services/products';
import { listCategories } from '../services/categories';
import { request } from '../services/http';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function ProductsView() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMsg, setOrderMsg] = useState<string|null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addValues, setAddValues] = useState({ name: '', price: '', image: '', description: '', categoryId: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addMsg, setAddMsg] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listProducts({ limit, offset: 0 });
      setItems(data);
    } catch (err: any) {
      setError('No se pudo cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    (async () => {
      try {
        const cats = await listCategories();
        setCategories(Array.isArray(cats) ? cats : []);
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  const toggleSelect = (id: number) => {
    setSelected(sel =>
      sel.includes(id) ? sel.filter(sid => sid !== id) : [...sel, id]
    );
  };

  const handleOrder = async () => {
    if(selected.length === 0) return;
    setOrderLoading(true);
    setOrderMsg(null);
    try {
      // Registrar orden: POST /orders, asume formato esperado: { products: [id, ...] }
      await request('/orders', { method: 'POST', body: { products: selected }, auth: true });
      setOrderMsg('¡Orden registrada correctamente!');
      setSelected([]);
    } catch (err: any) {
      setOrderMsg('Ocurrió un error al registrar la orden.');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddMsg(null);
    try {
      const prod: any = {
        name: addValues.name,
        price: Number(addValues.price),
        description: addValues.description,
        image: addValues.image,
        categoryId: Number(addValues.categoryId)
      };
      await createProduct(prod);
      setAddMsg('¡Producto agregado correctamente!');
      setAddValues({ name: '', price: '', image: '', description: '', categoryId: '' });
      setShowAdd(false);
      fetchData();
    } catch (err) {
      setAddMsg('Error al agregar producto.');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Productos (API)</h1>
      {/* Filtros y agregar producto */}
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-sm">Límite</label>
        <input type="number" value={limit} min={1} onChange={(e) => setLimit(Number(e.target.value))} className="w-24 border rounded px-2 py-1 bg-white dark:bg-slate-900" />
        <button onClick={fetchData} className="px-3 py-1.5 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">Aplicar</button>
        <button onClick={() => setShowAdd(v => !v)} className="px-3 py-1.5 rounded bg-emerald-700 text-white hover:bg-emerald-800 ml-2">{showAdd ? 'Cancelar' : 'Agregar producto'}</button>
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border space-y-2">
          <div>
            <label className="block text-sm">Nombre</label>
            <input type="text" required value={addValues.name} onChange={e => setAddValues(v => ({ ...v, name: e.target.value }))}
                   className="w-full border rounded px-3 py-1 bg-white dark:bg-slate-800" />
          </div>
          <div>
            <label className="block text-sm">Precio</label>
            <input type="number" required value={addValues.price} min={0} step={0.01} onChange={e => setAddValues(v => ({ ...v, price: e.target.value }))}
                   className="w-full border rounded px-3 py-1 bg-white dark:bg-slate-800" />
          </div>
          <div>
            <label className="block text-sm">Descripción</label>
            <textarea required value={addValues.description} onChange={e => setAddValues(v => ({ ...v, description: e.target.value }))}
                      className="w-full border rounded px-3 py-1 bg-white dark:bg-slate-800" />
          </div>
          <div>
            <label className="block text-sm">Imagen (URL)</label>
            <input type="url" required value={addValues.image} onChange={e => setAddValues(v => ({ ...v, image: e.target.value }))}
                   className="w-full border rounded px-3 py-1 bg-white dark:bg-slate-800" />
            {addValues.image !== '' && !/^https?:\/\/.+/i.test(addValues.image) && <span className="text-xs text-red-600">URL inválida</span>}
          </div>
          <div>
            <label className="block text-sm">Categoría</label>
            <select required value={addValues.categoryId} onChange={e => setAddValues(v => ({ ...v, categoryId: e.target.value }))}
                    className="w-full border rounded px-3 py-1 bg-white dark:bg-slate-800">
              <option value="">Seleccione una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-emerald-700 text-white px-4 py-1 rounded hover:bg-emerald-800" disabled={addLoading || (addValues.image !== '' && !/^https?:\/\/.+/i.test(addValues.image))}>{addLoading ? 'Agregando...' : 'Agregar'}</button>
            <button type="button" className="bg-slate-400 text-white px-4 py-1 rounded hover:bg-slate-500" onClick={() => setShowAdd(false)} disabled={addLoading}>Cancelar</button>
          </div>
          {addMsg && <p className="mt-2 text-emerald-700">{addMsg}</p>}
        </form>
      )}
      {loading && <p>Cargando…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No hay resultados.</p>}
      {/* Selección para ordenar */}
      {items.length > 0 && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-300 text-blue-900 rounded">
          <b>Seleccione productos</b> para incluir en su orden:
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <div key={p.id} className={`border rounded p-3 bg-white dark:bg-slate-800 relative ${selected.includes(p.id) ? 'ring-2 ring-emerald-600' : ''}`}>
            <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} className="absolute top-2 right-2 scale-150" />
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded" />
            <div className="mt-2 flex items-center justify-between">
              <span className="font-medium">{p.name}</span>
              <span className="text-emerald-600">${p.price}</span>
            </div>
          </div>
        ))}
      </div>
      {items.length > 0 && (
        <button onClick={handleOrder} disabled={orderLoading || selected.length === 0} className="mt-4 px-6 py-2 rounded bg-emerald-600 text-white font-semibold disabled:opacity-50">
          {orderLoading ? 'Registrando…' : 'Registrar Orden'}
        </button>
      )}
      {orderMsg && <p className="mt-2 text-center text-emerald-700">{orderMsg}</p>}
    </div>
  );
}