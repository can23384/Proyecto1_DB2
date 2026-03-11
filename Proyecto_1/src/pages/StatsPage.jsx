import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE = 'http://localhost:3000';

const AGGREGATIONS = [
  {
    section: 'Simples',
    items: [
      {
        id: 'count-activos',
        label: 'Restaurantes activos',
        description: 'Total de restaurantes con estado activo',
        endpoint: '/restaurantes/agregaciones/count-activos',
        method: 'GET',
      },
      {
        id: 'ciudades',
        label: 'Ciudades disponibles',
        description: 'Lista de ciudades únicas con restaurantes',
        endpoint: '/restaurantes/agregaciones/ciudades',
        method: 'GET',
        listMode: true,
      },
      {
        id: 'por-categoria',
        label: 'Por categoría',
        description: 'Conteo de restaurantes agrupados por categoría',
        endpoint: '/restaurantes/agregaciones/por-categoria',
        method: 'GET',
      },
    ],
  },
  {
    section: 'Complejas',
    items: [
      {
        id: 'mejor-calificados',
        label: 'Mejor calificados',
        description: 'Top 10 restaurantes por rating promedio de reseñas',
        endpoint: '/restaurantes/agregaciones/mejor-calificados',
        method: 'GET',
      },
      {
        id: 'platillos-mas-vendidos',
        label: 'Platillos más vendidos',
        description: 'Top 10 ítems con más unidades vendidas en órdenes entregadas',
        endpoint: '/restaurantes/agregaciones/platillos-mas-vendidos',
        method: 'GET',
      },
      {
        id: 'ingresos-por-restaurante',
        label: 'Ingresos por restaurante',
        description: 'Total de ingresos y ticket promedio por restaurante',
        endpoint: '/restaurantes/agregaciones/ingresos-por-restaurante',
        method: 'GET',
      },
    ],
  },
  {
    section: 'Manejo de Arrays',
    items: [
      {
        id: 'agregar-item',
        label: 'Agregar ítem a orden ($push)',
        description: 'Inserta un nuevo platillo al array items de una orden',
        endpoint: '/ordenes/{id}/items/agregar',
        method: 'PATCH',
        inputs: [
          { key: 'id', label: 'ID Orden', placeholder: '6641abc...' },
          { key: 'menu_item_id', label: 'ID MenuItem', placeholder: '6641def...' },
          { key: 'nombre', label: 'Nombre', placeholder: 'Tacos al pastor' },
          { key: 'precio_unitario', label: 'Precio', placeholder: '45' },
          { key: 'cantidad', label: 'Cantidad', placeholder: '2' },
        ],
      },
      {
        id: 'eliminar-item',
        label: 'Eliminar ítem de orden ($pull)',
        description: 'Elimina un platillo del array items por nombre',
        endpoint: '/ordenes/{id}/items/eliminar',
        method: 'PATCH',
        inputs: [
          { key: 'id', label: 'ID Orden', placeholder: '6641abc...' },
          { key: 'nombre', label: 'Nombre ítem', placeholder: 'Tacos al pastor' },
          { key: 'subtotal', label: 'Subtotal', placeholder: '90' },
        ],
      },
      {
        id: 'agregar-tag',
        label: 'Agregar tag ($addToSet)',
        description: 'Agrega un tag único al array tags de un restaurante',
        endpoint: '/menu/restaurante/{id}/tags/agregar',
        method: 'PATCH',
        inputs: [
          { key: 'id', label: 'ID Restaurante', placeholder: '6641abc...' },
          { key: 'tag', label: 'Tag', placeholder: 'vegano' },
        ],
      },
      {
        id: 'eliminar-tag',
        label: 'Eliminar tag ($pull)',
        description: 'Elimina un tag específico del array tags',
        endpoint: '/menu/restaurante/{id}/tags/eliminar',
        method: 'PATCH',
        inputs: [
          { key: 'id', label: 'ID Restaurante', placeholder: '6641abc...' },
          { key: 'tag', label: 'Tag', placeholder: 'vegano' },
        ],
      },
    ],
  },
  {
    section: 'Documentos Embebidos',
    items: [
      {
        id: 'agregar-respuesta',
        label: 'Agregar respuesta a reseña',
        description: 'Actualiza el subdocumento respuesta_restaurante dentro de una reseña',
        endpoint: '/resenas/{id}/respuesta',
        method: 'PATCH',
        inputs: [
          { key: 'id', label: 'ID Reseña', placeholder: '6641abc...' },
          { key: 'comentario', label: 'Comentario', placeholder: 'Gracias por tu reseña...' },
        ],
      },
      {
        id: 'eliminar-respuesta',
        label: 'Eliminar respuesta de reseña',
        description: 'Elimina el subdocumento respuesta_restaurante con $unset',
        endpoint: '/resenas/{id}/respuesta/eliminar',
        method: 'PATCH',
        inputs: [
          { key: 'id', label: 'ID Reseña', placeholder: '6641abc...' },
        ],
      },
    ],
  },
];

function ResultView({ data, listMode }) {
  if (!data) return null;

  if (data.error) {
    return (
      <div style={{
        marginTop: 14,
        background: 'rgba(164,22,35,0.06)',
        border: '1px solid rgba(164,22,35,0.15)',
        borderRadius: 14,
        padding: '14px 16px',
        color: 'var(--primary-dark)',
        fontSize: '0.9rem',
      }}>
        ⚠️ {data.error}
      </div>
    );
  }

  // Array de strings — modo lista
  if (Array.isArray(data) && (listMode || typeof data[0] === 'string')) {
    return (
      <div style={{
        marginTop: 14,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        {data.map((item, i) => (
          <span key={i} className="secondary-btn" style={{
            padding: '6px 14px',
            fontSize: '0.88rem',
            borderRadius: 999,
            cursor: 'default',
          }}>
            {item}
          </span>
        ))}
      </div>
    );
  }

  const rows = Array.isArray(data) ? data : [data];

  if (rows.length === 0) {
    return <p style={{ marginTop: 14, color: 'var(--muted)', fontSize: '0.9rem' }}>Sin resultados.</p>;
  }

  const keys = Object.keys(rows[0]);

  return (
    <div style={{ marginTop: 14, overflowX: 'auto', borderRadius: 14, border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {keys.map(k => (
              <th key={k} style={{
                textAlign: 'left',
                padding: '10px 14px',
                color: 'var(--muted)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                background: 'rgba(164,22,35,0.04)',
              }}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
              {keys.map((k, j) => (
                <td key={j} style={{ padding: '10px 14px', color: 'var(--text)' }}>
                  {typeof row[k] === 'object' ? JSON.stringify(row[k]) : String(row[k] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AggCard({ item }) {
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setResult(null);

    let url = item.endpoint;
    const body = {};

    if (item.inputs) {
      item.inputs.forEach(inp => {
        const val = inputs[inp.key] || '';
        if (inp.key === 'id') {
          url = url.replace('{id}', val);
        } else {
          body[inp.key] = val;
        }
      });
    }

    try {
      const opts = {
        method: item.method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (item.method !== 'GET') opts.body = JSON.stringify(body);

      const res = await fetch(`${BASE}${url}`, opts);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="info-card" style={{ padding: 22 }}>
      <div style={{ marginBottom: 6 }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{item.label}</h3>
        <p className="muted" style={{ margin: 0, fontSize: '0.88rem' }}>{item.description}</p>
      </div>

      <p style={{ margin: '8px 0 14px', fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'monospace' }}>
        {item.endpoint}
      </p>

      {item.inputs && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 10,
          marginBottom: 14,
        }}>
          {item.inputs.map(inp => (
            <div key={inp.key} className="form-group">
              <label style={{ fontSize: '0.8rem' }}>{inp.label}</label>
              <input
                placeholder={inp.placeholder}
                value={inputs[inp.key] || ''}
                onChange={e => setInputs(prev => ({ ...prev, [inp.key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      )}

      <button
        className="primary-btn"
        onClick={handleRun}
        disabled={loading}
        style={{ padding: '10px 22px', fontSize: '0.9rem' }}
      >
        {loading ? 'Ejecutando…' : 'Ejecutar'}
      </button>

      <ResultView data={result} listMode={item.listMode} />
    </div>
  );
}

export default function StatsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) navigate('/', { replace: true });
  }, [navigate]);

  return (
    <main className="page">
      <div className="top-user-bar">
        <button className="secondary-btn" onClick={() => navigate(-1)}>← Volver</button>
      </div>

      <section className="hero" style={{ marginBottom: 28 }}>
        <div className="hero-copy">
          <span className="eyebrow">MongoDB</span>
          <h1>Stats & Agregaciones</h1>
          <p>Ejecuta consultas de agregación directamente contra el backend.</p>
        </div>
      </section>

      {AGGREGATIONS.map(group => (
        <div key={group.section} style={{ marginBottom: 32 }}>
          <div className="section-header">
            <div>
              <h2>{group.section}</h2>
              <p>{group.items.length} operación(es)</p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            {group.items.map(item => (
              <AggCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}