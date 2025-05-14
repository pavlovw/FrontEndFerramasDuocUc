import React from 'react';
import '../styles/home.css';
import logo from '../assets/logo.jpg'; 
import { useNavigate } from 'react-router-dom';

function Home() {

    const navigate = useNavigate(); // inicializar el hook
    return (
        <div className="home-wrapper">
            <div className="left-column">
                <h2 className="welcome-title">Bienvenido a Ferramas</h2>
                <img src={logo} alt="Logo Ferramas" className="main-logo" />
            </div>
            <div className="right-column">
                <p className="description-text">
                    Selecciona una opción para continuar con el sistema:
                </p>

                <div className="button-grid">
                    <button>Herra - Manuales</button>
                    <button>Materiales Básicos</button>
                    <button>Equipos de Seguridad</button>
                    <button>Tornillos - Anclaje</button>
                    <button>Fijaciones</button>
                    <button onClick={() => navigate('/suscribe')}>
                        Ir a Suscribirse
                    </button>
                </div>

                <hr className="divider" />

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

export default Home;