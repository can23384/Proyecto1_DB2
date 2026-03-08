import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState('');

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion_principal: {
      calle: '',
      ciudad: '',
      referencia: '',
      ubicacion: {
        type: 'Point',
        coordinates: ['', ''],
      },
    },
    rol: 'usuario',
  });

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) return;

    if (usuario.rol === 'owner') {
      navigate('/owner', { replace: true });
    } else {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      direccion_principal: {
        ...prev.direccion_principal,
        [name]: value,
      },
    }));
  };

  const handleCoordinateChange = (index, value) => {
    const nextCoordinates = [...form.direccion_principal.ubicacion.coordinates];
    nextCoordinates[index] = value;

    setForm((prev) => ({
      ...prev,
      direccion_principal: {
        ...prev.direccion_principal,
        ubicacion: {
          ...prev.direccion_principal.ubicacion,
          coordinates: nextCoordinates,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        telefono: form.telefono,
        rol: form.rol === 'usuario' ? 'cliente' : 'owner',
        direccion: {
          calle: form.direccion_principal.calle,
          ciudad: form.direccion_principal.ciudad,
          referencia: form.direccion_principal.referencia,
          lat: Number(form.direccion_principal.ubicacion.coordinates[0]),
          lng: Number(form.direccion_principal.ubicacion.coordinates[1]),
        },
      };

      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.error || 'Error registrando usuario');
        return;
      }

      setMensaje('Registro exitoso 🎉');

      const usuarioGuardado = data.usuario || {
        nombre: form.nombre,
        email: form.email,
        rol: form.rol,
      };

      localStorage.setItem('usuario', JSON.stringify(usuarioGuardado));

      if (usuarioGuardado?.rol === 'owner') {
        navigate('/owner', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error conectando con el servidor');
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-register">
        <div className="auth-header">
          <Link to="/" className="back-link dark">
            ← Volver
          </Link>
          <h1>Crear cuenta</h1>
          <p>Completa los datos para registrarte en FoodRadar.</p>
        </div>

        {mensaje && (
          <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Correo</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                name="telefono"
                type="tel"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="address-block">
            <h2>Dirección principal</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Calle</label>
                <input
                  name="calle"
                  value={form.direccion_principal.calle}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Ciudad</label>
                <input
                  name="ciudad"
                  value={form.direccion_principal.ciudad}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label>Referencia</label>
                <input
                  name="referencia"
                  value={form.direccion_principal.referencia}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Latitud</label>
                <input
                  type="number"
                  step="any"
                  value={form.direccion_principal.ubicacion.coordinates[0]}
                  onChange={(e) => handleCoordinateChange(0, e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Longitud</label>
                <input
                  type="number"
                  step="any"
                  value={form.direccion_principal.ubicacion.coordinates[1]}
                  onChange={(e) => handleCoordinateChange(1, e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Rol</label>
                <select name="rol" value={form.rol} onChange={handleChange}>
                  <option value="usuario">usuario</option>
                  <option value="owner">owner</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="primary-btn full-width">
            Registrarse
          </button>
        </form>
      </section>
    </main>
  );
}