import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import News from './pages/Noticia';
import Admin from './pages/Admin';

import './App.css'

const Sobre = () => <h2>Sobre Nós</h2>;
const Escola = () => <h2>Nossa Escola</h2>;
const Colaboradores = () => <h2>Todos os Colaboradores</h2>;

function App() {
  return (

    <BrowserRouter>
     <Navbar></Navbar>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/noticia/:id" element={<News />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/escola" element={<Escola />} />
      <Route path="/colaboradores" element={<Colaboradores />} />
      <Route path="/admin" element={<Admin />} />
     </Routes>
    
    </BrowserRouter>

  )
}

export default App
