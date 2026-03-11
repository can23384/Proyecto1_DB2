import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function OwnerPage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    fetch('http://localhost:3000/restaurantes')
      .then((res) => res.json())
      .then((data) => {
        const normalized = Array.isArray(data) ? data : [];
        setRestaurants(normalized);
      })
      .catch((error) => {
        console.error('Error cargando restaurantes:', error);
        setRestaurants([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/', { replace: true });
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    const confirmar = window.confirm('¿Seguro que quieres eliminar este restaurante?');

    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:3000/restaurantes/${restaurantId}`, {
        method: 'DELETE',
      });

      const text = await response.text();
      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text };
      }

      if (!response.ok) {
        console.error('Respuesta del servidor:', text);
        alert(data.error || 'Error eliminando restaurante');
        return;
      }

      setRestaurants((prev) =>
        prev.filter((restaurant) => (restaurant._id || restaurant.id) !== restaurantId)
      );

      alert(data.message || 'Restaurante eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando restaurante:', error);
      alert('Error conectando con el servidor');
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Sin fecha';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return dateValue;

    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
          <h1>Panel de owner</h1>
          <p>Administra restaurantes, revisa órdenes y consulta sus menú items.</p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/stats" className="secondary-btn">
            Stats & Agregaciones
          </Link>

          <Link to="/owner/nuevo-restaurante" className="primary-btn">
            Añadir nuevo restaurante
          </Link>
        </div>
      </section>

      <section className="owner-list">
        {loading ? (
          <div className="empty-state">
            <h3>Cargando restaurantes...</h3>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="empty-state">
            <h3>No hay restaurantes disponibles</h3>
            <p>Cuando existan restaurantes aparecerán aquí.</p>
          </div>
        ) : (
          restaurants.map((restaurant) => {
            const totalResenas =
              restaurant.total_reseñas ??
              restaurant.total_resenas ??
              restaurant.totalReviews ??
              restaurant.reviews_count ??
              0;

            const totalOrdenes =
              restaurant.total_ordenes ??
              restaurant.totalOrders ??
              restaurant.orders_count ??
              0;

            const ratingPromedio =
              restaurant.rating_promedio ??
              restaurant.rating ??
              0;

            const fechaCreacion =
              restaurant.fecha_creacion ??
              restaurant.createdAt ??
              restaurant.fechaCreacion;

            const activo =
              typeof restaurant.activo === 'boolean'
                ? restaurant.activo
                : false;

            const restaurantId = restaurant._id || restaurant.id;

            return (
              <article key={restaurantId} className="owner-restaurant-card">
                <div className="owner-restaurant-top">
                  <div>
                    <h2>{restaurant.nombre || restaurant.name || 'Restaurante sin nombre'}</h2>
                    <span className={`status-badge ${activo ? 'active' : 'inactive'}`}>
                      {activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="owner-actions">
                    <Link
                      to={`/owner/restaurante/${restaurantId}/ordenes`}
                      className="secondary-btn"
                    >
                      Ver órdenes
                    </Link>

                    <Link
                      to={`/owner/restaurante/${restaurantId}/menu`}
                      className="primary-btn"
                    >
                      Ver menu_items
                    </Link>

                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => handleDeleteRestaurant(restaurantId)}
                    >
                      Eliminar restaurante
                    </button>
                  </div>
                </div>

                <div className="owner-stats-grid">
                  <div className="owner-stat-item">
                    <span>Fecha creación</span>
                    <strong>{formatDate(fechaCreacion)}</strong>
                  </div>

                  <div className="owner-stat-item">
                    <span>Rating promedio</span>
                    <strong>{Number(ratingPromedio).toFixed(1)}</strong>
                  </div>

                  <div className="owner-stat-item">
                    <span>Total reseñas</span>
                    <strong>{totalResenas}</strong>
                  </div>

                  <div className="owner-stat-item">
                    <span>Total órdenes</span>
                    <strong>{totalOrdenes}</strong>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}