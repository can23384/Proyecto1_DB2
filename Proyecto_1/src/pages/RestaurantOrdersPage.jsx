import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function RestaurantOrdersPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    estado: '',
    total: '',
    calle: '',
    ciudad: '',
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/ordenes/restaurante/${id}`);
      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.error || 'Error obteniendo órdenes');
        setOrders([]);
        return;
      }

      setOrders(Array.isArray(data) ? data : []);
      setMensaje('');
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      setMensaje('Error conectando con el servidor');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/', { replace: true });
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Sin fecha';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return dateValue;

    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatItems = (items = []) => {
    if (!Array.isArray(items) || items.length === 0) return 'Sin items';

    return items.map((item) => `${item.cantidad} x ${item.nombre}`).join(', ');
  };

  const startEdit = (order) => {
    setEditingId(order._id);
    setEditForm({
      estado: order.estado || '',
      total: order.total ?? '',
      calle: order.direccion_entrega?.calle || '',
      ciudad: order.direccion_entrega?.ciudad || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      estado: '',
      total: '',
      calle: '',
      ciudad: '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateOrder = async (orderId) => {
    try {
      const payload = {
        estado: editForm.estado,
        total: Number(editForm.total),
        direccion_entrega: {
          calle: editForm.calle,
          ciudad: editForm.ciudad,
        },
      };

      const response = await fetch(`http://localhost:3000/ordenes/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error actualizando orden');
        return;
      }

      alert(data.message || 'Orden actualizada');
      cancelEdit();
      fetchOrders();
    } catch (error) {
      console.error('Error actualizando orden:', error);
      alert('Error conectando con el servidor');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmar = window.confirm('¿Seguro que quieres eliminar esta orden?');

    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:3000/ordenes/${orderId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error eliminando orden');
        return;
      }

      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      alert(data.message || 'Orden eliminada correctamente');
    } catch (error) {
      console.error('Error eliminando orden:', error);
      alert('Error conectando con el servidor');
    }
  };

  return (
    <main className="page">
      <div className="top-user-bar">
        <div className="secondary-btn user-pill">
          {usuario?.nombre || 'Owner'}
        </div>

        <button onClick={handleLogout} className="primary-btn">
          Cerrar sesión
        </button>
      </div>

      <section className="owner-header-card">
        <div>
          <h1>Órdenes del restaurante</h1>
          <p>Consulta, modifica o elimina las órdenes registradas.</p>
        </div>

        <Link to="/owner" className="secondary-btn">
          Volver al panel
        </Link>
      </section>

      {mensaje && (
        <div className="empty-state" style={{ marginBottom: '20px' }}>
          <p>{mensaje}</p>
        </div>
      )}

      <section className="orders-list">
        {loading ? (
          <div className="empty-state">
            <h3>Cargando órdenes...</h3>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <h3>No hay órdenes para este restaurante</h3>
          </div>
        ) : (
          orders.map((order) => (
            <article key={order._id} className="order-owner-card">
              <div className="order-owner-top">
                <div>
                  <h2>{order.usuario_nombre}</h2>
                  <p className="order-items-text">{formatItems(order.items)}</p>
                </div>

                <div className="owner-actions">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => startEdit(order)}
                  >
                    Modificar
                  </button>

                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => handleDeleteOrder(order._id)}
                  >
                    Eliminar orden
                  </button>
                </div>
              </div>

              <div className="owner-stats-grid">
                <div className="owner-stat-item">
                  <span>Total</span>
                  <strong>Q{Number(order.total || 0).toFixed(2)}</strong>
                </div>

                <div className="owner-stat-item">
                  <span>Estado</span>
                  <strong>{order.estado || 'Sin estado'}</strong>
                </div>

                <div className="owner-stat-item">
                  <span>Fecha creación</span>
                  <strong>{formatDate(order.fecha_creacion)}</strong>
                </div>

                <div className="owner-stat-item">
                  <span>Dirección entrega</span>
                  <strong>
                    {order.direccion_entrega?.calle || 'Sin calle'}
                    {order.direccion_entrega?.ciudad
                      ? `, ${order.direccion_entrega.ciudad}`
                      : ''}
                  </strong>
                </div>
              </div>

              {editingId === order._id && (
                <div className="order-edit-box">
                  <h3>Modificar orden</h3>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor={`estado-${order._id}`}>Estado</label>
                      <select
                        id={`estado-${order._id}`}
                        name="estado"
                        value={editForm.estado}
                        onChange={handleEditChange}
                      >
                        <option value="creada">creada</option>
                        <option value="preparando">preparando</option>
                        <option value="en camino">en camino</option>
                        <option value="entregada">entregada</option>
                        <option value="cancelada">cancelada</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor={`total-${order._id}`}>Total</label>
                      <input
                        id={`total-${order._id}`}
                        name="total"
                        type="number"
                        step="0.01"
                        value={editForm.total}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`calle-${order._id}`}>Calle</label>
                      <input
                        id={`calle-${order._id}`}
                        name="calle"
                        type="text"
                        value={editForm.calle}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`ciudad-${order._id}`}>Ciudad</label>
                      <input
                        id={`ciudad-${order._id}`}
                        name="ciudad"
                        type="text"
                        value={editForm.ciudad}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>

                  <div className="restaurant-form-actions">
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={cancelEdit}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() => handleUpdateOrder(order._id)}
                    >
                      Guardar cambios
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}