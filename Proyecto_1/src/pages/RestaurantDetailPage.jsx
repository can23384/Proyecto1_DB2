import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RatingStars from '../components/RatingStars';

export default function RestaurantDetailPage() {

  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviewForm, setReviewForm] = useState({
    calificacion: 5,
    comentario: ""
  });

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {

    cargarDatos();

  }, [id]);

  const cargarDatos = () => {

    Promise.all([
      fetch(`http://localhost:3000/restaurantes/${id}/info`).then(res => res.json()),
      fetch(`http://localhost:3000/resenas/restaurante/${id}`).then(res => res.json()),
      fetch(`http://localhost:3000/menu/restaurante/${id}`).then(res => res.json())
    ])
    .then(([restaurantData, reviewsData, menuData]) => {

      const formattedReviews = reviewsData.map((r, index) => ({
        id: index,
        user: r.usuario_nombre,
        stars: r.calificacion,
        comment: r.comentario
      }));

      const formattedMenu = menuData.map((item, index) => ({
        id: index,
        name: item.nombre,
        price: item.precio
      }));

      const formattedRestaurant = {
        id: id,
        name: restaurantData.nombre,
        description: restaurantData.descripcion,
        location: `${restaurantData.direccion?.calle ?? ''}, ${restaurantData.direccion?.ciudad ?? ''}`,
        schedule: `${restaurantData.horario?.apertura ?? ''} - ${restaurantData.horario?.cierre ?? ''}`,
        rating: restaurantData.rating_promedio ?? 0,

        accent: "linear-gradient(135deg, #7a0d16 0%, #c1121f 100%)",
        phone: "No disponible",
        eta: "30-40 min",

        reviews: formattedReviews,
        menuItems: formattedMenu
      };

      setRestaurant(formattedRestaurant);
      setLoading(false);

    })
    .catch((error) => {

      console.error("Error cargando restaurante:", error);
      setLoading(false);

    });

  };

  const handleReviewChange = (e) => {

    const { name, value } = e.target;

    setReviewForm((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSubmitReview = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch("http://localhost:3000/resenas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario_id: usuario.id,
          restaurante_id: id,
          calificacion: Number(reviewForm.calificacion),
          comentario: reviewForm.comentario
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error creando reseña");
        return;
      }

      alert("Reseña creada correctamente");

      setReviewForm({
        calificacion: 5,
        comentario: ""
      });

      cargarDatos();

    } catch (error) {

      console.error(error);
      alert("Error conectando con el servidor");

    }

  };

  if (loading) {
    return (
      <main className="page">
        <div className="empty-state">
          <h2>Cargando restaurante...</h2>
        </div>
      </main>
    );
  }

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

          <div className="info-card">

            <h2>Agregar reseña</h2>

            <form onSubmit={handleSubmitReview}>

              <div className="form-group">
                <label>Calificación</label>

                <select
                  name="calificacion"
                  value={reviewForm.calificacion}
                  onChange={handleReviewChange}
                >
                  <option value="5">5 estrellas</option>
                  <option value="4">4 estrellas</option>
                  <option value="3">3 estrellas</option>
                  <option value="2">2 estrellas</option>
                  <option value="1">1 estrella</option>
                </select>
              </div>

              <div className="form-group">
                <label>Comentario</label>

                <textarea
                  name="comentario"
                  value={reviewForm.comentario}
                  onChange={handleReviewChange}
                  placeholder="Escribe tu reseña..."
                  required
                />
              </div>

              <button type="submit" className="primary-btn">
                Publicar reseña
              </button>

            </form>

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