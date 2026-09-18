import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import './App.css'

function App() {
  return (

    <BrowserRouter>
     <Navbar></Navbar>
    
    </BrowserRouter>

  )
}

export default App
