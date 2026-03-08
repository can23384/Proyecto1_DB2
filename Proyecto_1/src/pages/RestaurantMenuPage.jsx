import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [guardandoNuevo, setGuardandoNuevo] = useState(false);

  const [newForm, setNewForm] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
  });

  const [editForm, setEditForm] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    disponible: true,
  });

  const fetchMenu = async () => {
    try {
      setLoading(true);

      const response = await fetch(`http://localhost:3000/menu/restaurante/${id}/todos`);
      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.error || 'Error obteniendo menú');
        setItems([]);
        return;
      }

      setItems(Array.isArray(data) ? data : []);
      setMensaje('');
    } catch (error) {
      console.error('Error cargando menú:', error);
      setMensaje('Error conectando con el servidor');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/', { replace: true });
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;

    setNewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setMensaje('');
    setGuardandoNuevo(true);

    try {
      const payload = {
        restaurante_id: id,
        nombre: newForm.nombre,
        descripcion: newForm.descripcion,
        categoria: newForm.categoria,
        precio: Number(newForm.precio),
      };

      const response = await fetch('http://localhost:3000/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.error || 'Error creando item del menú');
        return;
      }

      setNewForm({
        nombre: '',
        descripcion: '',
        categoria: '',
        precio: '',
      });

      fetchMenu();
    } catch (error) {
      console.error('Error creando item:', error);
      setMensaje('Error conectando con el servidor');
    } finally {
      setGuardandoNuevo(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditForm({
      nombre: item.nombre || '',
      descripcion: item.descripcion || '',
      categoria: item.categoria || '',
      precio: item.precio ?? '',
      disponible: item.disponible ?? true,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: '',
      disponible: true,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdateItem = async (itemId) => {
    try {
      const payload = {
        nombre: editForm.nombre,
        descripcion: editForm.descripcion,
        categoria: editForm.categoria,
        precio: Number(editForm.precio),
        disponible: editForm.disponible,
      };

      const response = await fetch(`http://localhost:3000/menu/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error actualizando item del menú');
        return;
      }

      alert(data.message || 'Item actualizado');
      cancelEdit();
      fetchMenu();
    } catch (error) {
      console.error('Error actualizando item:', error);
      alert('Error conectando con el servidor');
    }
  };

  const handleDeleteItem = async (itemId) => {
    const confirmar = window.confirm('¿Seguro que quieres eliminar este item del menú?');

    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:3000/menu/${itemId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error eliminando item');
        return;
      }

      setItems((prev) => prev.filter((item) => item._id !== itemId));
      alert(data.message || 'Item eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando item:', error);
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
          <h1>Menu items del restaurante</h1>
          <p>Consulta, agrega, modifica o elimina los productos del menú.</p>
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

      <section className="restaurant-form-card" style={{ marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0 }}>Añadir nuevo menu_item</h2>

        <form onSubmit={handleCreateItem} className="restaurant-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nuevo-nombre">Nombre</label>
              <input
                id="nuevo-nombre"
                name="nombre"
                type="text"
                value={newForm.nombre}
                onChange={handleNewChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nuevo-categoria">Categoría</label>
              <input
                id="nuevo-categoria"
                name="categoria"
                type="text"
                value={newForm.categoria}
                onChange={handleNewChange}
              />
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="nuevo-descripcion">Descripción</label>
              <textarea
                id="nuevo-descripcion"
                name="descripcion"
                rows="4"
                value={newForm.descripcion}
                onChange={handleNewChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="nuevo-precio">Precio</label>
              <input
                id="nuevo-precio"
                name="precio"
                type="number"
                step="0.01"
                value={newForm.precio}
                onChange={handleNewChange}
                required
              />
            </div>
          </div>

          <div className="restaurant-form-actions">
            <button type="submit" className="primary-btn" disabled={guardandoNuevo}>
              {guardandoNuevo ? 'Guardando...' : 'Guardar menu_item'}
            </button>
          </div>
        </form>
      </section>

      <section className="orders-list">
        {loading ? (
          <div className="empty-state">
            <h3>Cargando menú...</h3>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <h3>No hay menu items para este restaurante</h3>
          </div>
        ) : (
          items.map((item) => (
            <article key={item._id} className="order-owner-card">
              <div className="order-owner-top">
                <div>
                  <h2>{item.nombre}</h2>
                  <p className="order-items-text">{item.descripcion || 'Sin descripción'}</p>
                </div>

                <div className="owner-actions">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => startEdit(item)}
                  >
                    Modificar
                  </button>

                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => handleDeleteItem(item._id)}
                  >
                    Eliminar item
                  </button>
                </div>
              </div>

              <div className="owner-stats-grid">
                <div className="owner-stat-item">
                  <span>Categoría</span>
                  <strong>{item.categoria || 'Sin categoría'}</strong>
                </div>

                <div className="owner-stat-item">
                  <span>Precio</span>
                  <strong>Q{Number(item.precio || 0).toFixed(2)}</strong>
                </div>

                <div className="owner-stat-item">
                  <span>Total vendidos</span>
                  <strong>{item.total_vendidos ?? 0}</strong>
                </div>

                <div className="owner-stat-item">
                  <span>Disponible</span>
                  <strong>{item.disponible ? 'Sí' : 'No'}</strong>
                </div>
              </div>

              {editingId === item._id && (
                <div className="order-edit-box">
                  <h3>Modificar item del menú</h3>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor={`nombre-${item._id}`}>Nombre</label>
                      <input
                        id={`nombre-${item._id}`}
                        name="nombre"
                        type="text"
                        value={editForm.nombre}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`categoria-${item._id}`}>Categoría</label>
                      <input
                        id={`categoria-${item._id}`}
                        name="categoria"
                        type="text"
                        value={editForm.categoria}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="form-group form-group-full">
                      <label htmlFor={`descripcion-${item._id}`}>Descripción</label>
                      <input
                        id={`descripcion-${item._id}`}
                        name="descripcion"
                        type="text"
                        value={editForm.descripcion}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`precio-${item._id}`}>Precio</label>
                      <input
                        id={`precio-${item._id}`}
                        name="precio"
                        type="number"
                        step="0.01"
                        value={editForm.precio}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="form-group checkbox-group">
                      <label htmlFor={`disponible-${item._id}`}>Disponible</label>
                      <input
                        id={`disponible-${item._id}`}
                        name="disponible"
                        type="checkbox"
                        checked={editForm.disponible}
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
                      onClick={() => handleUpdateItem(item._id)}
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