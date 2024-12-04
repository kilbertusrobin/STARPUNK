// src/App.jsx

import React from 'react';
import './styles.js'; // Assurez-vous que ce fichier existe et contient vos styles
import Admin from './pages/Admin.jsx';
import Menu from './components/menu/menu.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Connect from './pages/Connect';
import Register from './pages/Register.jsx';
import { Provider } from 'react-redux';
import store from './redux/adminStore';
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
    element: <Planet />,
  },
  {
    path: '/admin',
    element: <Admin />,
  }
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

  function AppContent() {
    return (
      <div className="background">
        <Menu />
        {/* <Starpunk /> */}
        <div className="wrapperdivs">
          <div className="div1 svg-hover">
            <img src="./images-post/InterfaceO.svg" alt="" />
            <img src="./images-post/TITRE.svg" className="title" alt="" />
          </div>
          <div className="div3 svg-hover">
            <img src="./images-post/InterfaceB2.svg" alt="" />
            <img src="./images-post/EVENT.svg" className="titleEvent" alt="" />
          </div>

          <div className="div2 svg-hover">
            <img src="./images-post/Interfaceorbital.svg"  alt="" />
            <img src="./images-post/orbitalview.svg" className="titleOrbital" alt="" />

          </div>
          
        </div>
        <div className="div4">
          <img src="./images-post/Interface3.svg" alt="" />
          <div className="test4"> <p>testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest</p> </div>
        </div>
        <section>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </section>
        <div className="satelitte">
          <img src="./images-post/alien.svg" alt="satelitte"/>
        </div>
      </div>
    );
  }

  export default App;