import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/context';
import { useReducer, useState } from 'react';
import './App.css';

import Home from "../src/components/pages/home"
import Header from './components/common/header';
import Footer from './components/common/footer';
import ScrollUp from './components/common/scrollUp'
import Login from './components/pages/login';
import Register from './components/pages/register';
import Test from './components/home/tes';
import Profile from './components/pages/profile';
import Order from './components/pages/order';
function App() {
  return (
    <UserProvider>
        <Header />
        <main>
          <Routes>
            <Route path='/' Component={Home}/>
            <Route path='/login' Component={Login}/>
            <Route path='/register' Component={Register}/>
            <Route path='/test' Component={Test}/>
            <Route path='/profile' Component={Profile}/>
            <Route path='/orderDetail/:id' Component={Order}/>
          </Routes>
        </main>
        <Footer />
    </UserProvider>
  );
}

export default App;
