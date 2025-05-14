import React, { useState } from 'react';
import '../styles/suscribe.css';

function Suscribe() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto (enviar al servidor)
        console.log('Correo enviado:', email);
        // Aquí puedes agregar la lógica para enviar el correo o mostrar un mensaje
    };

    return (
        <div className="home-wrapper">
            {/* PRIMERA FILA */}
            <div className="first-row">
                <div className="left-column">
                    <h2 className="welcome-title">¡Suscríbete!</h2>
                </div>
                <div className="right-column">
                    <p className="description-text">Suscríbete ingresando tu correo</p>
                </div>
            </div>

            {/* SEGUNDA FILA */}
            <div className="second-row">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Ingresar correo</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input type="submit" value="Suscribirse" />
                </form>
            </div>

            {/* TERCERA FILA */}
            <div className="third-row">
                <div className="social-section">
                    <p>Síguenos en redes sociales</p>
                    <div className="social-icons">
                        <img src="/assets/facebook.png" alt="Facebook" />
                        <img src="/assets/instagram.png" alt="Instagram" />
                        <img src="/assets/tiktok.png" alt="TikTok" />
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Suscribe;
