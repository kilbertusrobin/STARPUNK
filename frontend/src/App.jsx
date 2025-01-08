// src/App.jsx

import React from 'react';
import './styles.js'; // Assurez-vous que ce fichier existe et contient vos styles
import Admin from './pages/Admin.jsx';
import Menu from './components/menu/menu.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Connect from './pages/Connect';
import Register from './pages/Register.jsx';
import Artiste from './pages/Artiste.jsx';
import { Provider } from 'react-redux';
import store from './redux/adminStore';
import Artistes from './pages/Artistes.jsx';
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
  },
  {
    path: '/artistes',
    element: <Artistes />,
  }, 
  {
    path: '/artistes/:uid',
    element: <Artiste />,
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
          <div className="wrapper-icon">
                    <div className="reseaux">
                        <a href="#"><img src="/images-post/x.svg" alt="X" className="img-reseaux" /></a>
                        <a href="#"><img src="/images-post/tiktok.svg" alt="tiktok" className="img-reseaux" /></a>
                        <a href="#"><img src="/images-post/instagram.svg" alt="instagram" className="img-reseaux" /></a>
                        <a href="#"><img src="/images-post/youtube.svg" alt="youtube" className="img-reseaux" /></a>
                    </div>
                </div>
          
        </div>
        <div className="div4">
          <img src="./images-post/Interface3.svg" alt="" />
          <div className="test4">

          <p style={{ display: 'flex', flexDirection: 'row' }}>
              <span>Utilisateur </span>
            </p>
            <p className='wrap'>test testtest testtest testtest testtest testtest testtest testtest testtest testtest test</p>
            <p style={{ display: 'flex', flexDirection: 'row' }}>
              <span>Utilisateur </span>
            </p>
            <p className='wrap'>test testtest testtest testtest testtest testtest testtest testtest testtest testtest test</p>
            <p style={{ display: 'flex', flexDirection: 'row' }}>
              <span>Utilisateur </span>
            </p>
            <p className='wrap'>test testtest testtest testtest testtest testtest testtest testtest testtest testtest test</p>
               

                        </div>
        </div>
        <section>
                    <span className="span"></span>
          <span className="span"></span>
          <span className="span"></span>
          <span className="span"></span>
          <span className="span"></span>
          <span className="span"></span>
          <span className="span"></span>
          <span className="span"></span>
          <span className="span"></span>
          <span className="span"></span>
        </section>
        <div className="satelitte">
          <img src="./images-post/alien.svg" alt="satelitte"/>
        </div>
      </div>
    );
  }

  export default App;