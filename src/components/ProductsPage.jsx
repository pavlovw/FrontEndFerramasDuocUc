import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import '../styles/productsPage.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const categorias = [
  'Herra - Manuales',
  'Materiales Básicos',
  'Equipos de Seguridad',
  'Tornillos - Anclaje',
  'Fijaciones',
  'Equipos Medición',
];

function ProductsPage() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(categorias[0]);
  const [moneda, setMoneda] = useState('CLP');
  const [tasaCambio, setTasaCambio] = useState(1);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const [contadorCarrito, setContadorCarrito] = useState(0);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoria = queryParams.get('categoria');


  // Cargar productos
  useEffect(() => {
    fetch('http://localhost:3000/api/productos')
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  useEffect(() => {
    if (categoria && categorias.includes(decodeURIComponent(categoria))) {
      setCategoriaActiva(decodeURIComponent(categoria));
    }
  }, [categoria]);

  // Cargar usuario desde localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      setUsuario(user);

      // ⚠️ Sincronizar carrito temporal con la base de datos
      const carritoTemp = JSON.parse(localStorage.getItem('carrito_temp')) || [];
      if (carritoTemp.length > 0) {
        carritoTemp.forEach(async (productoId) => {
          try {
            await fetch('http://localhost:3000/api/carrito', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                usuario_id: user.id,
                producto_id: productoId,
              }),
            });
          } catch (error) {
            console.error('Error al sincronizar producto del carrito:', error);
          }
        });

        // Limpiar carrito temporal después de sincronizar
        localStorage.removeItem('carrito_temp');
      }
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      contarCarrito();
    } else {
      const carritoTemp = JSON.parse(localStorage.getItem('carrito_temp')) || [];
      setContadorCarrito(carritoTemp.length);
    }
  }, [usuario]);


  // Cargar tasa de cambio si corresponde
  useEffect(() => {
    if (moneda === 'USD') {
      fetch('http://localhost:3000/api/divisas')
        .then((res) => res.json())
        .then((data) => setTasaCambio(data.tasa))
        .catch((err) => console.error('Error obteniendo tasa de cambio:', err));
    } else {
      setTasaCambio(1);
    }
  }, [moneda]);

  const productosFiltrados = productos.filter(
    (prod) => prod.categoria === categoriaActiva
  );

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    window.location.reload(); // O navigate('/') si quieres una navegación suave
  };

  const agregarAlCarrito = async (productoId) => {
    if (!usuario) {
      // Si no hay usuario, guardar en LocalStorage
      const carritoLocal = JSON.parse(localStorage.getItem('carrito_temp')) || [];
      if (!carritoLocal.includes(productoId)) {
        carritoLocal.push(productoId);
        localStorage.setItem('carrito_temp', JSON.stringify(carritoLocal));
        alert('Producto agregado al carrito (modo visitante)');
        setContadorCarrito(carritoLocal.length);
      } else {
        alert('Este producto ya está en tu carrito (modo visitante)');
      }
      return;
    }

    // Si hay usuario, insertar en BD
    try {
      const res = await fetch('http://localhost:3000/api/carrito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuario.id,
          producto_id: productoId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Error al agregar al carrito');
      } else {
        alert('Producto agregado al carrito');
        contarCarrito(); // 👈 actualizar el contador
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  const contarCarrito = async () => {
    if (!usuario) return;

    try {
      const res = await fetch(`http://localhost:3000/api/carrito/count/${usuario.id}`);
      const data = await res.json();
      setContadorCarrito(data.total || 0);
    } catch (error) {
      console.error('Error al contar carrito:', error);
    }
  };

  return (
    <div className="products-page">
      <header className="header">
        <img onClick={() => navigate('/')} src={logo} alt="Ferramas Logo" className="logo" />
        <h1>Ferramas</h1>

        <div className="moneda-selector">
          <label>Moneda: </label>
          <select value={moneda} onChange={(e) => setMoneda(e.target.value)}>
            <option value="CLP">Pesos chilenos (CLP)</option>
            <option value="USD">Dólares (USD)</option>
          </select>
        </div>

        <div className="carrito-boton">
          <button onClick={() => navigate('/carrito')}>
            🛒 Carrito ({contadorCarrito})
          </button>
        </div>


        <div className="auth-buttons">
          {usuario ? (
            <>
              <span>Bienvenido, {usuario.nombre}</span>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Login</button>
              <button onClick={() => navigate('/register')}>Register</button>
            </>
          )}
        </div>
      </header>

      <nav className="navbar">
        {categorias.map((cat) => (
          <button
            key={cat}
            className={cat === categoriaActiva ? 'active' : ''}
            onClick={() => setCategoriaActiva(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      <section className="products-section">
        {productosFiltrados.length === 0 ? (
          <p>No hay productos para esta categoría.</p>
        ) : (
          productosFiltrados.map(({ id, nombre, precio_clp, stock, imagen }) => (
            <div key={id} className="product-card">
              <img src={`http://localhost:3000/images/${imagen}`} alt={nombre} />
              <div className="product-info">
                <h3>{nombre}</h3>
                <p>
                  Precio: {moneda}{' '}
                  {moneda === 'USD' ? (precio_clp / tasaCambio).toFixed(2) : precio_clp}
                </p>
                <p>Stock: {stock}</p>
                <button onClick={() => agregarAlCarrito(id)}>Agregar al carrito</button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default ProductsPage;
