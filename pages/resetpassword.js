import styles from '@styles/Home.module.scss';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Card, Input, Button, Space } from 'antd';

function ResetPassword() {
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');


  const router = useRouter();
  const { token } = router.query;

  const handleMotDePasse = () => {
    const requestData = {
      resetToken: token, // Le token de réinitialisation depuis l'URL
      mot_de_passe: motDePasse, // Le nouveau mot de passe saisi par l'utilisateur
    };

    // Envoi de la requête POST au backend pour la réinitialisation du mot de passe
    fetch('https://yours-app-backend.vercel.app/reinisialisermdp/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Gérer la réponse du backend ici
        if (data.result) {
          // Réinitialisation du mot de passe réussie
          setMessage('Mot de passe réinitialisé avec succès');
        } else {
          // Échec de la réinitialisation du mot de passe
          setMessage('Erreur lors de la réinitialisation du mot de passe :' + data.error);
        }
      })
      .catch((error) => {
        // Gérer les erreurs liées à la requête ici
        setMessage('Erreur lors de la requête :' + error.message);
      });
  };

  return (
    <>
      <main>
        <section className={styles.section_connection}>
          <div className='container'>
            <Row gutter={[16, 16]}>
              <Col span={24} md={12} className={styles.wrapCenter}>
              <img src='img/logo.svg' alt='logo yours' className={styles.logo} />
              </Col>
              <Col span={24} md={12} >
                <h1>Réinitialisation du mot de passe</h1>
                <Card>
                  <Space size={24} direction='vertical' className='w-100'>
                    <Input.Password
                      placeholder='Entrer votre nouveau mot de passe'
                      size='large'
                      onChange={(e) => setMotDePasse(e.target.value)}
                      value={motDePasse}
                    />
                    <Button type='default' size='large' className='w-100' onClick={() => handleMotDePasse()}>
                      Valider
                    </Button>
                    <p>{message}</p>
                  </Space>
                  </Card>
              </Col>
            </Row>
          </div>
        </section>
      </main>
    </>
  );
}

export default ResetPassword;
