import React, { useState } from 'react';
import '../styles/register.css';
import { useNavigate } from 'react-router-dom';


export default function Register({ onSwitch }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    correo: '',
    password: '',
    repetirPassword: '',
    telefono: ''
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.repetirPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/usuarios/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro');
      }

      alert('Usuario registrado con éxito');
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleSubmit} className="form-register">
          <div className="form-grid">
            <div>
              <label htmlFor="nombre">Nombre</label>
              <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>

            <div>
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>

            <div>
              <label htmlFor="usuario">Usuario</label>
              <input type="text" id="usuario" name="usuario" value={formData.usuario} onChange={handleChange} required />
            </div>

            <div>
              <label htmlFor="repetirPassword">Repetir contraseña</label>
              <input type="password" id="repetirPassword" name="repetirPassword" value={formData.repetirPassword} onChange={handleChange} required />
            </div>

            <div>
              <label htmlFor="correo">Correo</label>
              <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} required />
            </div>

            <div>
              <label htmlFor="telefono">Teléfono</label>
              <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
            </div>
          </div>

          <input type="submit" value="Crear" className="btn-submit-register" />
        </form>
      </div>
    </div>
  );
}
