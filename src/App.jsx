import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Suscribe from './components/Suscribe';
import Login from './components/Login';
import Register from './components/Register';
import ProductsPage from './components/productsPage';  
import Carrito from './components/Carrito'; 
import WebpayRespuesta from './components/WebpayRespuesta'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suscribe" element={<Suscribe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/productos" element={<ProductsPage />} />  {/* Nueva ruta para mostrar productos */}
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/webpayrespuesta" element={<WebpayRespuesta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



