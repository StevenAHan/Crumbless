import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import NavPreLogin from './components/NavPreLogin';
import Home from './components/Home';
import CreateDish from './components/CreateDish';
import CreateIngredient from './components/CreateIngredient';



function App() {

  return (
    <>
      <NavPreLogin />
      <BrowserRouter>
        <Routes>
          <Route path='/' exact element={<Home/>} />
          <Route path='/create/dish' element={<CreateDish/>} />
          <Route path='/create/ingredient' element={<CreateIngredient/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
