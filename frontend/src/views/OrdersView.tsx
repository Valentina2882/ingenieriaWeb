import { useEffect, useState } from 'react';
import { getMyOrders, getMe, createCustomer } from '../services/profile';
import { createOrderWithProducts } from '../services/orders';
import { listProducts } from '../services/products';

export default function OrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [newOrderItems, setNewOrderItems] = useState<{productId: number, amount: number}[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [selectedAmount, setSelectedAmount] = useState<number>(1);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [customerForm, setCustomerForm] = useState({ name: '', lastName: '', phone: '' });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [ordersData, productsData, userData] = await Promise.all([
          getMyOrders(),
          listProducts(),
          getMe()
        ]);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setUser(userData);
      } catch (err: any) {
        setError('No se pudieron obtener los datos');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddProduct = () => {
    if (selectedProduct > 0 && selectedAmount > 0) {
      setNewOrderItems([...newOrderItems, { productId: selectedProduct, amount: selectedAmount }]);
      setSelectedProduct(0);
      setSelectedAmount(1);
    }
  };

  const handleRemoveProduct = (index: number) => {
    setNewOrderItems(newOrderItems.filter((_, i) => i !== index));
  };

  const handleCreateCustomer = async () => {
    if (!customerForm.name || !customerForm.lastName || !customerForm.phone) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await createCustomer(customerForm);
      
      // Recargar datos del usuario
      const userData = await getMe();
      setUser(userData);
      setShowCreateCustomer(false);
      setCustomerForm({ name: '', lastName: '', phone: '' });
    } catch (err: any) {
      console.error('Error creating customer:', err);
      setError(`Error al crear el perfil de cliente: ${err.data?.message || err.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    console.log('User data:', user);
    console.log('Customer data:', user?.customer);
    console.log('New order items:', newOrderItems);
    
    if (!user?.customer?.id) {
      setError('No se encontró información del cliente. Por favor crea un perfil de cliente primero.');
      setShowCreateCustomer(true);
      return;
    }
    
    if (newOrderItems.length === 0) {
      setError('No hay productos en la orden');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('Creating order with customerId:', user.customer.id);
      console.log('Products to add:', newOrderItems);
      console.log('Data being sent:', { customerId: user.customer.id, products: newOrderItems });
      
      // Crear orden con productos directamente
      const newOrder = await createOrderWithProducts(user.customer.id, newOrderItems);
      console.log('Order created with products:', newOrder);
      
      // Recargar órdenes
      const updatedOrders = await getMyOrders();
      setOrders(Array.isArray(updatedOrders) ? updatedOrders : []);
      
      // Limpiar formulario
      setNewOrderItems([]);
      setShowCreateOrder(false);
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(`Error al crear la orden: ${err.data?.message || err.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Mis Órdenes</h1>
        <button
          onClick={() => setShowCreateOrder(!showCreateOrder)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showCreateOrder ? 'Cancelar' : 'Nueva Orden'}
        </button>
      </div>

      {showCreateCustomer && (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4">Crear Perfil de Cliente</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Necesitas crear un perfil de cliente para poder hacer órdenes.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={customerForm.name}
                onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Tu nombre"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Apellido</label>
              <input
                type="text"
                value={customerForm.lastName}
                onChange={(e) => setCustomerForm({...customerForm, lastName: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Tu apellido"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="text"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Tu teléfono"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleCreateCustomer}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Crear Perfil
              </button>
              <button
                onClick={() => setShowCreateCustomer(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateOrder && (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4">Crear Nueva Orden</h2>
          
          {/* Debug info */}
          <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>Usuario: {user?.email || 'No cargado'}</p>
            <p>Customer ID: {user?.customer?.id || 'No encontrado'}</p>
            <p>Customer Name: {user?.customer?.name || 'No encontrado'}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(Number(e.target.value))}
                className="flex-1 p-2 border rounded"
              >
                <option value={0}>Seleccionar producto</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
              
              <input
                type="number"
                min="1"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(Number(e.target.value))}
                className="w-20 p-2 border rounded"
                placeholder="Cantidad"
              />
              
              <button
                onClick={handleAddProduct}
                disabled={selectedProduct === 0}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                Agregar
              </button>
            </div>

            {newOrderItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Productos en la orden:</h3>
                {newOrderItems.map((item, index) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div key={index} className="flex justify-between items-center bg-white dark:bg-gray-700 p-2 rounded">
                      <span>
                        {product?.name} x {item.amount} = ${product ? product.price * item.amount : 0}
                      </span>
                      <button
                        onClick={() => handleRemoveProduct(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </div>
                  );
                })}
                
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateOrder}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Crear Orden
                  </button>
                  <button
                    onClick={() => {
                      setNewOrderItems([]);
                      setShowCreateOrder(false);
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Orden #{order.id}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${order.total || '0'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Productos ({order.items?.length || 0})
              </h4>
              <div className="space-y-2">
                {Array.isArray(order.items) && order.items.length > 0
                  ? order.items.map((item:any) => {
                      console.log('Item structure:', item);
                      const amount = item.OrderProduct?.amount || item.amount || 1;
                      const price = item.price || 0;
                      const subtotal = price * amount;
                      
                      return (
                        <div key={item.id || Math.random()} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {item.name || 'Producto sin nombre'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Cantidad: {amount} | Precio unitario: ${price}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              ${subtotal}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Subtotal
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No hay productos en esta orden
                    </div>
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && !showCreateOrder && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No tienes órdenes registradas.</p>
          <button
            onClick={() => setShowCreateOrder(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear tu primera orden
          </button>
        </div>
      )}
    </div>
  );
}
