import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function OrderPage() {

  const { id } = useParams();

  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {

    fetch(`http://localhost:3000/menu/restaurante/${id}/todos`)
      .then(res => res.json())
      .then(data => {

        const formattedMenu = data.map((item) => ({
          id: item._id,
          name: item.nombre,
          description: item.descripcion,
          price: Number(item.precio),
          category: item.categoria
        }));

        setMenuItems(formattedMenu);

      })
      .catch(err => console.error(err));

  }, [id]);

  const addItem = (item) => {

    const existing = orderItems.find(i => i.id === item.id);

    if (existing) {

      setOrderItems(orderItems.map(i =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));

    } else {

      setOrderItems([
        ...orderItems,
        { ...item, quantity: 1 }
      ]);

    }

  };

  const removeItem = (id) => {

    setOrderItems(orderItems.filter(i => i.id !== id));

  };

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const confirmarOrden = async () => {

    if (orderItems.length === 0) {
      alert("Debes agregar al menos un item");
      return;
    }

    try {

      const items = orderItems.map(item => ({
        menu_item_id: item.id,
        nombre: item.name,
        precio_unitario: Number(item.price),
        cantidad: Number(item.quantity)
      }));

      const response = await fetch("http://localhost:3000/ordenes", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          usuario_id: usuario.id,
          restaurante_id: id,
          items: items
        })

      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert(data.error || "Error creando orden");
        return;
      }

      alert("Orden completada ✅");

      setOrderItems([]);

    } catch (error) {

      console.error(error);
      alert("Error conectando con el servidor");

    }

  };

  return (
    <main className="page">

      <header className="section-header">
        <Link to={`/restaurante/${id}`} className="back-link">
          ← Volver
        </Link>

        <h1>Ordenar comida</h1>
      </header>

      <section className="order-layout">

        <div className="menu-list">

          {menuItems.map((item) => (

            <div key={item.id} className="menu-card">

              <div className="menu-card-info">

                <h3>{item.name}</h3>
                <p>{item.description}</p>

                <strong>Q{item.price}</strong>

              </div>

              <button
                className="primary-btn"
                onClick={() => addItem(item)}
              >
                Agregar
              </button>

            </div>

          ))}

        </div>

        <aside className="order-summary">

          <h2>Tu orden</h2>

          {orderItems.length === 0 ? (

            <p>No has agregado items</p>

          ) : (

            <div className="order-items">

              {orderItems.map((item) => (

                <div key={item.id} className="order-item">

                  <div>
                    <strong>{item.name}</strong>
                    <p>Cantidad: {item.quantity}</p>
                  </div>

                  <div>
                    <span>Q{item.price * item.quantity}</span>

                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      ✕
                    </button>
                  </div>

                </div>

              ))}

            </div>

          )}

          <div className="order-total">

            <strong>Total</strong>
            <span>Q{total}</span>

          </div>

          <button
            className="primary-btn full-width"
            onClick={confirmarOrden}
          >
            Confirmar orden
          </button>

        </aside>

      </section>

    </main>
  );
}