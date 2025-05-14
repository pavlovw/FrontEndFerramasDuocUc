import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Suscribe from './components/Suscribe';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suscribe" element={<Suscribe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

