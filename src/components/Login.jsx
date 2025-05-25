import React, { useState } from 'react';
import '../styles/login.css';
import { useNavigate } from 'react-router-dom';

export default function Login({ onSwitch }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error al iniciar sesión');
      } else {
        localStorage.setItem('usuario', JSON.stringify(data.usuario)); // 👈 Guardar usuario
        alert('Bienvenido ' + data.usuario.nombre);
        navigate('/productos')
      }

    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="form-login">
          <label htmlFor="login-usuario">Usuario</label>
          <input
            type="text"
            id="login-usuario"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            required
          />

          <label htmlFor="login-password">Contraseña</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <input type="submit" value="Ingresar" className="btn-submit-login" />

          <hr className="divider" />

          <p className="link-switch">
            ¿No tengo cuenta?{' '}
            <button type="button" onClick={() => onSwitch('register')}>
              Crear cuenta
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
