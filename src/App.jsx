import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import News from './pages/Noticia';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Mural from './pages/GerenciarMural';
import TodasNoticias from './pages/TodasNoticias';
import Autores from './pages/GerenciarAutores';
import Jogos from './pages/Jogos';
import Sobre from './pages/Sobre';
import Escola from './pages/NossaEscola';

import './App.css'

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
      <Route path="/login" element={<Login/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/mural" element={<Mural/>}/>
      <Route path="/todasNoticias" element={<TodasNoticias/>}/>
      <Route path="/autores" element={<Autores/>}/>
      <Route path="/jogos" element={<Jogos/>}/>
     </Routes>
    
    </BrowserRouter>

  )
}

export default App
