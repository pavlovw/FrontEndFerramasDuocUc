import React, { useState } from 'react';
import '../styles/suscribe.css';
import facebook from '../assets/facebook.png';
import instagram from '../assets/instagram.png';
import gmail from '../assets/gmail.png';
import twitter2 from '../assets/twitter.png';

function Suscribe() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/suscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Te has suscrito con éxito');
        setEmail('');
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      alert('❌ Hubo un problema al enviar el correo');
    }
  };


  return (
    <div className="home-wrapper-suscribe">
      {/* SECCIÓN 1 */}
      <section className="section-1">
        <div className="section-1-content">
          <h1 className="welcome-title-suscribe">¡Suscríbete!</h1>
          <p className="description-text-suscribe">Suscríbete ingresando tu correo para que<br/>puedas ecibir de forma automatica todo<br />nuestro catalogo de ofertas semanales</p>
        </div>
      </section>

      {/* SECCIÓN 2 */}
      <section className="section-2">
        <form onSubmit={handleSubmit} className="form-suscribe">
          <label htmlFor="email">Ingresar correo</label>
          <div className="input-button-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
            <button type="submit" className="btn-submit">Recibir ofertas</button>
          </div>
        </form>
      </section>

      {/* SECCIÓN 3 */}
      <section className="section-3">

        <div className="social-section-suscribe">
          <p className="social-text">Síguenos también en nuestras redes sociales</p>

          <hr className="divider-suscribe" />

          <div className="social-icons-suscribe">
            <img src={instagram} alt="Instagram" />
            <img src={facebook} alt="Facebook" />
            <img src={twitter2} alt="Twitter" />
            <img src={gmail} alt="Gmail" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Suscribe;
