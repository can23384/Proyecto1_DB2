import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AddRestaurantPage() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    activo: true,
    fecha_creacion: '',
    direccion: {
      calle: '',
      ciudad: '',
      ubicacion: {
        type: 'Point',
        coordinates: ['', ''],
      },
    },
    horario: {
      apertura: '',
      cierre: '',
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDireccionChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      direccion: {
        ...prev.direccion,
        [name]: value,
      },
    }));
  };

  const handleCoordinateChange = (index, value) => {
    const nextCoordinates = [...form.direccion.ubicacion.coordinates];
    nextCoordinates[index] = value;

    setForm((prev) => ({
      ...prev,
      direccion: {
        ...prev.direccion,
        ubicacion: {
          ...prev.direccion.ubicacion,
          coordinates: nextCoordinates,
        },
      },
    }));
  };

  const handleHorarioChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      horario: {
        ...prev.horario,
        [name]: value,
      },
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/', { replace: true });
  };

  const handleCancel = () => {
    navigate('/owner');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setGuardando(true);

    try {
      const payload = {
  nombre: form.nombre,
  descripcion: form.descripcion,
  categoria: form.categoria,
  activo: form.activo,
  calle: form.direccion.calle,
  ciudad: form.direccion.ciudad,
  lat: Number(form.direccion.ubicacion.coordinates[0]),
  lng: Number(form.direccion.ubicacion.coordinates[1]),
  apertura: form.horario.apertura,
  cierre: form.horario.cierre,
};

      const response = await fetch('http://localhost:3000/restaurantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.error || 'Error creando restaurante');
        return;
      }

      setMensaje(data.message || 'Restaurante creado correctamente');

      navigate('/owner', { replace: true });
    } catch (error) {
      console.error(error);
      setMensaje('Error conectando con el servidor');
    } finally {
      setGuardando(false);
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
          <h1>Nuevo restaurante</h1>
          <p>Completa los campos para registrar un restaurante.</p>
        </div>

        <Link to="/owner" className="secondary-btn">
          Volver al panel
        </Link>
      </section>

      <section className="restaurant-form-card">
        {mensaje && (
          <p style={{ marginBottom: '16px', fontWeight: '600' }}>
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit} className="restaurant-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoria">Categoría</label>
              <input
                id="categoria"
                name="categoria"
                type="text"
                value={form.categoria}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="4"
                value={form.descripcion}
                onChange={handleChange}
              />
            </div>


            <div className="form-group checkbox-group">
              <label htmlFor="activo">Activo</label>
              <input
                id="activo"
                name="activo"
                type="checkbox"
                checked={form.activo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="address-block">
            <h2>Dirección</h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="calle">Calle</label>
                <input
                  id="calle"
                  name="calle"
                  type="text"
                  value={form.direccion.calle}
                  onChange={handleDireccionChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  id="ciudad"
                  name="ciudad"
                  type="text"
                  value={form.direccion.ciudad}
                  onChange={handleDireccionChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="latitud">Latitud</label>
                <input
                  id="latitud"
                  type="number"
                  step="any"
                  value={form.direccion.ubicacion.coordinates[0]}
                  onChange={(e) => handleCoordinateChange(0, e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="longitud">Longitud</label>
                <input
                  id="longitud"
                  type="number"
                  step="any"
                  value={form.direccion.ubicacion.coordinates[1]}
                  onChange={(e) => handleCoordinateChange(1, e.target.value)}
                  required
                />
              </div>

              
            </div>
          </div>

          <div className="address-block">
            <h2>Horario</h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="apertura">Apertura</label>
                <input
                  id="apertura"
                  name="apertura"
                  type="time"
                  value={form.horario.apertura}
                  onChange={handleHorarioChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cierre">Cierre</label>
                <input
                  id="cierre"
                  name="cierre"
                  type="time"
                  value={form.horario.cierre}
                  onChange={handleHorarioChange}
                />
              </div>
            </div>
          </div>

          <div className="restaurant-form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={handleCancel}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : 'Guardar restaurante'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}