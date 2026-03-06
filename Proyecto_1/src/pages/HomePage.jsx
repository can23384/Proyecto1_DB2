import { useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import RestaurantCard from '../components/RestaurantCard';
import { restaurants } from '../data/mockData';

export default function HomePage() {
  const [search, setSearch] = useState('');

  const filteredRestaurants = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return restaurants;

    return restaurants.filter((restaurant) =>
      [restaurant.name, restaurant.category, restaurant.location]
        .join(' ')
        .toLowerCase()
        .includes(value)
    );
  }, [search]);

  return (
    <main className="page">
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