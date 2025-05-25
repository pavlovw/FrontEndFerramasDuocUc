import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import logo from '../assets/logo.png';
import facebook from '../assets/facebook.png';
import instagram from '../assets/instagram.png';
import gmail from '../assets/gmail.png';
import twitter2 from '../assets/twitter.png';

// Importa las imágenes específicas para cada botón
import imgHerramientas from '../assets/herramientas.png';
import imgMateriales from '../assets/materiales.png';
import imgSeguridad from '../assets/seguridad.png';
import imgTornillos from '../assets/tornillos.png';
import imgFijaciones from '../assets/fijaciones.png';
import imgMedicion from '../assets/medicion.png';

import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  // Estado para controlar el texto y la imagen del logo que se muestran
  const [hoverInfo, setHoverInfo] = useState({
    text: 'Bienvenido a Ferramas',
    img: logo,
  });

  // Estados para controlar la opacidad (fade) del texto y la imagen
  const [fadeText, setFadeText] = useState(true);
  const [fadeImg, setFadeImg] = useState(true);

  // Mapa para relacionar cada botón con texto e imagen
  const hoverMap = {
    'Herra - Manuales': {
      text: 'Herramientas Manuales',
      img: imgHerramientas,
      categoria: 'Herra - Manuales',
    },
    'Materiales Básicos': {
      text: 'Materiales Básicos',
      img: imgMateriales,
      categoria: 'Materiales Básicos',
    },
    'Equipos de Seguridad': {
      text: 'Equipos de Seguridad',
      img: imgSeguridad,
      categoria: 'Equipos de Seguridad',
    },
    'Tornillos - Anclaje': {
      text: 'Tornillos - Anclaje',
      img: imgTornillos,
      categoria: 'Tornillos - Anclaje',
    },
    'Fijaciones': {
      text: 'Fijaciones',
      img: imgFijaciones,
      categoria: 'Fijaciones',
    },
    'Equipos Medición': {
      text: 'Equipos de Medición',
      img: imgMedicion,
      categoria: 'Equipos Medición',
    },
  };


  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }

  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    window.location.reload(); // O navigate('/') si quieres una navegación suave
  };

  // Al poner mouse encima: hacemos fade out, cambiamos contenido y fade in
  const handleMouseEnter = (label) => {
    if (hoverMap[label]) {
      setFadeText(false);
      setFadeImg(false);

      setTimeout(() => {
        setHoverInfo(hoverMap[label]);
        setFadeText(true);
        setFadeImg(true);
      }, 300);
    }
  };

  // Al sacar mouse fuera: volvemos al contenido original con transición
  const handleMouseLeave = () => {
    setFadeText(false);
    setFadeImg(false);

    setTimeout(() => {
      setHoverInfo({ text: 'Bienvenido a Ferramas', img: logo });
      setFadeText(true);
      setFadeImg(true);
    }, 300);
  };

  return (
    <div className="home-wrapper">
      <div className="left-column">
        <div className="top-buttons">
          <div className="top-btn-group">
            {usuario ? (
              <>
                <span className='top-btn' >Bienvenido, {usuario.nombre}</span>
                <button className='top-btn' onClick={handleLogout}>Cerrar sesión</button>
              </>
            ) : (
              <>
                <button className='top-btn' onClick={() => navigate('/login')}>Login</button>
                <button className='top-btn' onClick={() => navigate('/register')}>Register</button>
              </>
            )}
          </div>
          <button onClick={() => navigate('/suscribe')} className="top-btn subscribe-btn">Suscribirse</button>
        </div>

        <h2
          className="welcome-title-home"
          style={{
            opacity: fadeText ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          {hoverInfo.text}
        </h2>

        <img
          src={hoverInfo.img}
          alt="Logo Ferramas"
          className="main-logo"
          style={{
            opacity: fadeImg ? 1 : 0,
            transition: 'opacity 0.3s ease',
            maxWidth: '300px',
            width: '80%',
          }}
        />
      </div>

      <div className="right-column">
        <p className="description-text-home">
          Somos un pequeño centro de distribución con nuestra nueva plataforma web
        </p>

        <div className="button-grid-home">
          {Object.keys(hoverMap).map((label) => (
            <button
              key={label}
              onMouseEnter={() => handleMouseEnter(label)}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                const categoria = hoverMap[label]?.categoria;
                if (categoria) {
                  navigate(`/productos?categoria=${encodeURIComponent(categoria)}`);
                } else {
                  navigate('/suscribe');
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <hr className="divider-home" />

        <div className="social-section-home">
          <p>Síguenos en las redes sociales</p>
          <div className="social-icons-home">
            <img src={instagram} alt="Instagram" />
            <img src={facebook} alt="Facebook" />
            <img src={twitter2} alt="Twitter" />
            <img src={gmail} alt="Gmail" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
