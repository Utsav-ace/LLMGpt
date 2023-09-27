import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import Homepage from './Homepage'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    //  <Layout/>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/homepage' element={<Homepage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


