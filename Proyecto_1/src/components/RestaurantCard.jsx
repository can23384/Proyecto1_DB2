import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';

export default function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurante/${restaurant.id}`} className="card-link">
      <article className="restaurant-card">
        <div
          className="restaurant-card-cover"
          style={{ background: restaurant.accent }}
        >
          <span className="restaurant-badge">{restaurant.category}</span>
          <h3>{restaurant.name}</h3>
          <p>{restaurant.description}</p>
        </div>

        <div className="restaurant-card-body">
          <RatingStars value={restaurant.rating} />
          <div className="meta-grid">
            <span>📍 {restaurant.location}</span>
            <span>🕒 {restaurant.schedule}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}