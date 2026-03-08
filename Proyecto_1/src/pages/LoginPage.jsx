import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error al iniciar sesión');
        return;
      }

      const usuario = data.usuario;

      localStorage.setItem('usuario', JSON.stringify(usuario));

      if (usuario?.rol === 'owner') {
        navigate('/owner', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error conectando con el servidor');
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <h1>Iniciar sesión</h1>
          <p>Accede a tu cuenta para ordenar y guardar tus datos.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="primary-btn full-width">
            Entrar
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes cuenta?{' '}
          <Link to="/registrarse" className="auth-link">
            Regístrate
          </Link>
        </p>
      </section>
    </main>
  );
}