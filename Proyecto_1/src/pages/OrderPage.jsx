import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRestaurantById } from '../data/mockData';

export default function OrderPage() {
  const { id } = useParams();
  const restaurant = getRestaurantById(id);
  const [cart, setCart] = useState({});

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

  const updateQty = (itemId, amount) => {
    setCart((prev) => {
      const nextQty = Math.max((prev[itemId] || 0) + amount, 0);
      return {
        ...prev,
        [itemId]: nextQty,
      };
    });
  };

  const selectedItems = useMemo(() => {
    return restaurant.menuItems
      .filter((item) => cart[item.id] > 0)
      .map((item) => ({
        ...item,
        qty: cart[item.id],
        subtotal: cart[item.id] * item.price,
      }));
  }, [cart, restaurant.menuItems]);

  const subtotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const total = subtotal + (selectedItems.length ? restaurant.deliveryFee : 0);

  return (
    <main className="page">
      <header className="order-header">
        <div>
          <Link to={`/restaurante/${restaurant.id}`} className="back-link dark">
            ← Volver al restaurante
          </Link>
          <span className="eyebrow">Realizar pedido</span>
          <h1>{restaurant.name}</h1>
        </div>
      </header>

      <section className="order-layout">
        <div className="menu-list">
          {restaurant.menuItems.map((item) => (
            <article key={item.id} className="menu-card">
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <strong>Q{item.price}</strong>
              </div>

              <div className="qty-control">
                <button onClick={() => updateQty(item.id, -1)}>-</button>
                <span>{cart[item.id] || 0}</span>
                <button onClick={() => updateQty(item.id, 1)}>+</button>
              </div>
            </article>
          ))}
        </div>

        <aside className="summary-card">
          <h2>Resumen de la orden</h2>

          {selectedItems.length === 0 ? (
            <p className="muted">Todavía no has agregado productos.</p>
          ) : (
            <div className="summary-items">
              {selectedItems.map((item) => (
                <div key={item.id} className="summary-row">
                  <span>
                    {item.qty} x {item.name}
                  </span>
                  <strong>Q{item.subtotal}</strong>
                </div>
              ))}
            </div>
          )}

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>Q{subtotal}</strong>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <strong>Q{selectedItems.length ? restaurant.deliveryFee : 0}</strong>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>Q{total}</strong>
            </div>
          </div>

          <button className="primary-btn full-width" disabled={!selectedItems.length}>
            Confirmar pedido
          </button>
        </aside>
      </section>
    </main>
  );
}
