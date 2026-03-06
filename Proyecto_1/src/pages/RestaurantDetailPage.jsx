import { Link, useParams } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import { getRestaurantById } from '../data/mockData';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const restaurant = getRestaurantById(id);

  if (!restaurant) {
    return (
      <main className="page">
        <div className="empty-state">
          <h2>Restaurante no encontrado</h2>
          <Link to="/" className="secondary-btn">
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="detail-hero" style={{ background: restaurant.accent }}>
        <Link to="/" className="back-link">
          ← Volver
        </Link>
        <h1>{restaurant.name}</h1>
        <p>{restaurant.description}</p>
      </header>

      <section className="detail-layout">
        <div className="detail-main">
          <div className="info-card">
            <h2>Información general</h2>
            <div className="info-list">
              <p><strong>Ubicación:</strong> {restaurant.location}</p>
              <p><strong>Teléfono:</strong> {restaurant.phone}</p>
              <p><strong>Horario:</strong> {restaurant.schedule}</p>
              <p><strong>Entrega:</strong> {restaurant.eta}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="reviews-header">
              <div>
                <h2>Reseñas de usuarios</h2>
                <RatingStars value={restaurant.rating} />
              </div>
            </div>

            <div className="review-list">
              {restaurant.reviews.map((review) => (
                <article key={review.id} className="review-card">
                  <div className="review-top">
                    <h3>{review.user}</h3>
                    <span>{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</span>
                  </div>
                  <p>{review.comment}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="detail-side">
          <div className="info-card sticky-card">
            <h3>Vista rápida del menú</h3>
            <div className="mini-menu">
              {restaurant.menuItems.map((item) => (
                <div key={item.id} className="mini-menu-item">
                  <span>{item.name}</span>
                  <strong>Q{item.price}</strong>
                </div>
              ))}
            </div>

            <Link
              to={`/restaurante/${restaurant.id}/ordenar`}
              className="primary-btn full-width"
            >
              Ordenar una orden
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}