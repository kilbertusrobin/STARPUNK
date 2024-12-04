import '../styles.js';
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnvalidatedImages } from '../redux/adminStore.js';
import ValidateImage from '../services/images/validate.js';

const Admin = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.app);

  const toggleValidate = useCallback(
    (id) => async () => {
      try {
        await ValidateImage(id);
        dispatch(fetchUnvalidatedImages());
      } catch (err) {
        console.error('Erreur lors de la validation de l\'image', err);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchUnvalidatedImages());
  }, [dispatch]);

  if (loading) return <p>Chargement des données...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <ul>
      {data.map((image) => (
        <li key={image.id} style={{ borderBottom: 'solid white 1px' }}>
          <h3>{image.title}</h3>
          <img src={image.url} alt={image.title} style={{ width: '10vw' }} />
          <p>{image.description}</p>
          <p>Proposé par : {image.user.username} ({image.user.email})</p>
          <button onClick={toggleValidate(image.id)}>Valider</button>
        </li>
      ))}
    </ul>
  );
};

export default Admin;
