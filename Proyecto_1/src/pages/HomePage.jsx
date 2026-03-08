import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import RestaurantCard from '../components/RestaurantCard';

export default function HomePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));

    if (!usuarioGuardado) {
      navigate('/', { replace: true });
      return;
    }

    if (usuarioGuardado.rol === 'owner') {
      navigate('/owner', { replace: true });
      return;
    }

    setUsuario(usuarioGuardado);
  }, [navigate]);

  useEffect(() => {
    fetch('http://localhost:3000/restaurantes')
      .then((res) => res.json())
      .then((data) => {
        const formattedRestaurants = data.map((r) => ({
          id: r._id,
          name: r.nombre,
          category: r.categoria,
          description: r.descripcion,
          location: `${r.direccion?.calle ?? ''}, ${r.direccion?.ciudad ?? ''}`,
          schedule: `${r.horario?.apertura ?? ''} - ${r.horario?.cierre ?? ''}`,
          rating: r.rating_promedio ?? 0,
          accent: 'linear-gradient(135deg, #7a0d16 0%, #c1121f 100%)',
          eta: '30-40 min',
          deliveryFee: 'Q10',
          reviews: 0,
          menuItems: [],
        }));

        setRestaurants(formattedRestaurants);
      })
      .catch((error) => {
        console.error('Error cargando restaurantes:', error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/', { replace: true });
  };

  const filteredRestaurants = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return restaurants;

    return restaurants.filter((restaurant) =>
      [restaurant.name, restaurant.category, restaurant.location]
        .join(' ')
        .toLowerCase()
        .includes(value)
    );
  }, [search, restaurants]);

  return (
    <main className="page">
      <div className="top-user-bar">
        {usuario && (
          <>
            <div className="secondary-btn user-pill">
              {usuario.nombre}
            </div>

            <button onClick={handleLogout} className="primary-btn">
              Cerrar sesión
            </button>
          </>
        )}
      </div>

      <section className="hero">
        <div className="hero-copy">
          <h1>FoodRadar</h1>
          <p>
            Busca restaurantes, entra al detalle, revisa reseñas y realiza una
            orden desde su menú.
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} />
      </section>

      <section className="section-header">
        <div>
          <h2>Restaurantes disponibles</h2>
          <p>{filteredRestaurants.length} resultado(s)</p>
        </div>
      </section>

      <section className="restaurant-grid">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))
        ) : (
          <div className="empty-state">
            <h3>No encontramos resultados</h3>
            <p>Prueba con otro nombre, categoría o ubicación.</p>
          </div>
        )}
      </section>
    </main>
  );
}