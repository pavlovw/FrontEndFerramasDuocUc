import React, { useState, useEffect } from 'react';
import '../styles/Carrito.css';
import { useNavigate } from 'react-router-dom';

const Carrito = ({ moneda = 'CLP' }) => {
    const [productos, setProductos] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalSinDescuento, setTotalSinDescuento] = useState(0);
    const [totalConDescuento, setTotalConDescuento] = useState(0);
    const [tasaCambio, setTasaCambio] = useState(1);
    const [mostrarTransferencia, setMostrarTransferencia] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    // Cargar usuario desde localStorage
    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
            const usuarioObj = JSON.parse(usuarioGuardado);
            setUsuario(usuarioObj);
        }
    }, []);

    useEffect(() => {
        const obtenerCarrito = async () => {
            let productosObtenidos = [];
            let total = 0;

            if (usuario) {
                try {
                    const res = await fetch(`http://localhost:3000/api/carrito/${usuario.id}`);
                    const data = await res.json();
                    productosObtenidos = data;
                    total = data.reduce((acc, item) => acc + item.precio_clp * item.cantidad, 0);
                } catch (error) {
                    console.error('Error al obtener carrito:', error);
                }
            } else {
                const carritoTemp = JSON.parse(localStorage.getItem('carrito_temp')) || [];
                if (carritoTemp.length === 0) return;

                try {
                    const productosTemp = await Promise.all(
                        carritoTemp.map(async (id) => {
                            const res = await fetch(`http://localhost:3000/api/productos/${id}`);
                            const data = await res.json();
                            return { ...data, cantidad: 1 };
                        })
                    );

                    productosObtenidos = productosTemp;
                    total = productosTemp.reduce((acc, item) => acc + item.precio_clp, 0);
                } catch (error) {
                    console.error('Error con carrito visitante:', error);
                }
            }

            setProductos(productosObtenidos);
            setTotalSinDescuento(total);
            setTotalConDescuento(usuario ? total * 0.9 : total); // 10% descuento
        };

        obtenerCarrito();
    }, [usuario]);

    useEffect(() => {
        if (moneda === 'USD') {
            fetch('http://localhost:3000/api/divisas')
                .then((res) => res.json())
                .then((data) => setTasaCambio(data.tasa))
                .catch((err) => console.error('Error divisa:', err));
        } else {
            setTasaCambio(1);
        }
    }, [moneda]);

    const formatoMoneda = (valor) =>
        moneda === 'CLP'
            ? `$${valor.toLocaleString('es-CL')}`
            : `US$${(valor / tasaCambio).toFixed(2)}`;

    const handlePagarTransferencia = () => {
        setMostrarTransferencia(true);
    };

    const handleEliminar = (carritoId) => {
        if (usuario) {
            fetch(`http://localhost:3000/api/carrito/${carritoId}`, {
                method: 'DELETE',
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Error al eliminar');
                    return fetch(`http://localhost:3000/api/carrito/${usuario.id}`);
                })
                .then((res) => res.json())
                .then((data) => {
                    setProductos(data);
                    let totalCalculado = data.reduce(
                        (acc, item) => acc + item.precio_clp * item.cantidad,
                        0
                    );
                    if (usuario) totalCalculado *= 0.9; // Reaplicar descuento
                    setTotal(totalCalculado);
                })
                .catch((err) => console.error('Error al eliminar producto:', err));
        } else {
            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            const nuevoCarrito = carrito.map(item => {
                if (item.id === carritoId && item.cantidad > 1) {
                    return { ...item, cantidad: item.cantidad - 1 };
                } else if (item.id === carritoId && item.cantidad === 1) {
                    return null;
                }
                return item;
            }).filter(Boolean);

            localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
            setProductos(nuevoCarrito);
            const totalCalculado = nuevoCarrito.reduce(
                (acc, item) => acc + item.precio_clp * item.cantidad,
                0
            );
            setTotal(totalCalculado);
        }
    };

    const handlePagarConTarjeta = async () => {
        if (!usuario) {
            alert('Debes iniciar sesión para pagar');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/webpay/iniciar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario_id: usuario.id,
                    monto: totalConDescuento.toFixed(0), // sin decimales para CLP
                }),
            });

            const data = await response.json();
            if (data.url && data.token) {
                // Redirigir automáticamente a Webpay
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = data.url;

                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'token_ws';
                input.value = data.token;

                form.appendChild(input);
                document.body.appendChild(form);
                form.submit();
            } else {
                alert('Error al iniciar el pago');
            }
        } catch (error) {
            console.error('Error en pago Webpay:', error);
            alert('Error al procesar el pago');
        }
    };

    return (
        <div className="carrito-container">
            <div className="carrito-productos">
                <h2>Mi Compra:</h2>
                {productos.length === 0 ? (
                    <p>No hay productos en el carrito.</p>
                ) : (
                    <div className="carrito-lista">
                        {productos.map((item) => (
                            <div key={item.carrito_id || item.id} className="carrito-item">
                                <img
                                    src={`http://localhost:3000/images/${item.imagen}`}
                                    alt={item.nombre}
                                    className="carrito-img"
                                />
                                <div className="carrito-info">
                                    <h3>{item.nombre}</h3>
                                    <p>Cantidad: {item.cantidad}</p>
                                    <p>Precio Unitario: {formatoMoneda(item.precio_clp)}</p>
                                    <p>Subtotal: {formatoMoneda(item.precio_clp * item.cantidad)}</p>
                                </div>
                                <button
                                    className="boton-eliminar"
                                    onClick={() => handleEliminar(item.carrito_id || item.id)}
                                >
                                    Eliminar uno
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="carrito-resumen">
                <h2 className="carrito-total-titulo">Resumen:</h2>

                <p>Total sin descuento:</p>
                <div className="carrito-total-cuadro">{formatoMoneda(totalSinDescuento)}</div>

                {usuario && (
                    <>
                        <p>Total con descuento (10%):</p>
                        <div className="carrito-total-cuadro descuento">{formatoMoneda(totalConDescuento)}</div>
                        <p className="carrito-descuento">¡Descuento de cliente aplicado!</p>
                    </>
                )}

                {!usuario && (
                    <>
                        <button className="boton-celeste" onClick={() => navigate('/login')}>
                            Iniciar sesión
                        </button>
                        <p className="carrito-descuento">* Se aplica 10% de descuento al iniciar sesión *</p>
                    </>
                )}

                <div className="carrito-botones">
                    <button className="boton-verde" onClick={handlePagarConTarjeta}>
                        Pagar con Tarjeta
                    </button>
                    <button className="boton-verde" onClick={handlePagarTransferencia}>
                        Pagar con Transferencia
                    </button>
                </div>

                {mostrarTransferencia && (
                    <div className="carrito-transferencia">
                        <p><strong>Cuenta para transferir:</strong><br />
                            Trauko Chile<br />
                            Banco Bnc<br />
                            Cuenta Corriente 09-01823-9<br />
                            contacto@traukochile.cl<br />
                            RUT: 76.918.522-4<br />
                            * Poner en descripción el número del pedido *</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Carrito;
