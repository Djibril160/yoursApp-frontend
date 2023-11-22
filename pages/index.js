import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Home from '@components/Home';
import Header from '@components/Header';
import Footer from '@components/Footer';
import ProfilEleve from '@components/ProfilEleve';
import ProfilProfessionnel from '@components/ProfilProfessionnel';

function Index() {
  const user = useSelector((state) => state.user);
  const [isToken, setIsToken] = useState(user.token);
  const [isFonction, setIsFonction] = useState();

  useEffect(() => {
    if (user.fonction !== null) {
      setIsFonction(user.fonction === 'true' ? 'eleves' : 'professionnels');
    }

    if (user.token) {
      fetch('https://yours-app-backend.vercel.app/' + isFonction + '/' + user.token)
        .then(response => response.json())
        .then(data => data.result && setIsToken(true));
    }

    setIsToken(user.token);
  }, [isFonction, user.token]);

  return (
    <>
      { user.fonction === 'true' ? <ProfilEleve /> : <ProfilProfessionnel /> }
    </>
  )
};

export default Index;
