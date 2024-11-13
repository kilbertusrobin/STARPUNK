// src/App.jsx

import React from 'react';
import './styles.js'; // Assurez-vous que ce fichier existe et contient vos styles
import Menu from './components/menu/menu.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Connect from './pages/Connect';
import Register from './pages/Register.jsx';
import Planet from './pages/Planet.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppContent />,
  },
  {
    path: '/login',
    element: <Connect />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/planete',
    element: <Planet/>,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

function AppContent() {
  return (
    <div className="background">
      <Menu />
      {/* <Starpunk /> */}
      <div className="wrapperdivs">
        <div className="div1">
          <img src="./images-post/InterfaceO.svg" alt="" />
          <img src="./images-post/TITRE.svg" className='title' alt="" />
        </div>
        <div className="div2">
          <img src="./images-post/InterfaceB.svg" alt="" />
        </div>
        <div className="div3">
          <img src="./images-post/InterfaceB2.svg" alt="" />
          <img src="./images-post/EVENT.svg" className='titleEvent' alt="" />
        </div>
      </div>
      <div className="div4">
        <img src="./images-post/Interface3.svg" alt="" />
      </div>

    </div>

  );
}

export default App;