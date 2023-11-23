import styles from '@styles/Home.module.scss';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useRouter } from 'next/router'
import { Row, Col, Card, Input, Select, Button, Space, Modal } from 'antd';
import { login } from '@reducers/user';

function Home() {
  const dispatch = useDispatch();
  const router = useRouter()

  const [modal, setModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '', mot_de_passe: '', fonction: null });

  const[signInEmail, setSignInEmail] = useState("")
  const[signInMot_de_passe, setSignInMot_de_passe] = useState("")
  const[resetMot_de_passe, setResetMot_de_passe] = useState("")
  const[reinitialisationMot_de_passe, setReinitialisationMot_de_passe] = useState("")

  // fonction connexion de l'utilisateur
  const handleConnection = () => {
    fetch('http://localhost:3000/connexion/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: signInEmail, mot_de_passe: signInMot_de_passe }),
    }).then(response => response.json())
      .then(data => {
        // Si la connnexion est réussie et que le backend renvoie un token
        if (data.result) {
          // Stockez le token dans le Redux store
          dispatch(login({ token: data.token, fonction: data.fonction }));
          setSignInEmail('');
          setSignInMot_de_passe('');
        }
      });
  };

  // fonction ouvrir modal
  const clickModalOpen = (data) => {
    setModal(true)
    setModalOpen(data)
  }

  // modal - creation de compte utilisateur
  const creationCompte = () => {
    return <>
      <p>Veuillez renseigner vos informations personnelles</p>

      <Space direction='vertical' className='w-100' size={12}>
        <Row gutter={[12, 12]}>
          <Col span={12}><Input placeholder='Nom' size='large'
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}/></Col>
          <Col span={12}><Input placeholder='Prénom' size='large'
          value={formData.prenom}
          onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}/></Col>
          <Col span={24}><Input placeholder='Email' size='large'
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}/></Col>

          <Col span={24}><Input.Password placeholder='Mot de passe' size='large'
          value={formData.mot_de_passe}
          onChange={(e) => setFormData({ ...formData, mot_de_passe: e.target.value })}/></Col>

          <Col span={24}>
            <Select placeholder='Fonction' className='w-100' size='large'
             value={formData.fonction}
             onChange={(value) => setFormData({ ...formData, fonction: value })}>
              <Option value="true">Eleve</Option>
              <Option value="false">Professionnel</Option>
            </Select>
          </Col>
          <Col span={24} className='text-center'><Button type='default' size='large' onClick={() =>handleSignup() } >Valider</Button></Col>
        </Row>
      </Space>
    </>
  }

  // fonction creation d'un compte utilisateur
  const handleSignup = () => {
    const userData = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      mot_de_passe: formData.mot_de_passe,
      fonction: formData.fonction,
    };

    fetch('http://localhost:3000/inscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then((response) => response.json())
      .then((data) => {
        // Si l'inscription est réussie et que le backend renvoie un token
        if (data && data.token) {
          // Stockez le token dans le Redux store
          dispatch(login({ token: data.token, fonction: data.fonction }));
          setFormData({...formData, nom:(''), prenom:(''), email:(''), mot_de_passe:(''), fonction:('')});
        };
      });
  }

  // modal - mot de passe oublié
  const mdpOublie = () => {
    return <>
      <p>Veuillez renseigner votre adresse e-mail pour réinitialiser votre mot de passe</p>

      <Space direction='vertical' className='w-100 text-center' size={12}>
        <Input placeholder='Email' size='large' onChange={(e) => setResetMot_de_passe(e.target.value)} value={resetMot_de_passe}/>
        <Button type='default' size='large' onClick={() => handleMot_de_passeOublie()}>Valider</Button>
      </Space>
    </>
  }

  // todo - revoir la partie reinisialiser mot de passe
  // fonction demande de reinisialisation de mot de passe
  const handleMot_de_passeOublie = () => {
    const requestData = {
      email: resetMot_de_passe,
    };
    fetch('http://localhost:3000/reinisialisermdp/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
      }).then(response => response.json())
      .then(data => {
        if (!data.result) {
          // todo - réaliser les effets de refus (message sur le frontend)
          return;
        }
      });
  };

  // todo - faire la partie changement de mot de passe
  const réinitialisationMDP = () => {
    const requestData = {
      email: email,
      resetToken: resetToken,
      mot_de_passe: mot_de_passe,
    }

  fetch('http://localhost:3000/reinisialisermdp/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
    }).then(response => response.json())
      .then(data => {
            console.log('01', data)
        if (!data.result) {
            return;
        }
        // setResetMot_de_passe('')
      });
  }

  return (
    <>
      <main>
        <section className={styles.section_connection}>
          <div className='container'>
            <Row gutter={[16, 16]}>
              <Col span={24} md={12} className={styles.wrapCenter}>
                <img src='/img/logo.svg' alt='logo yours' className={styles.logo} />
              </Col>

              <Col span={24} md={12} className={styles.wrapCenter}>
                <Card className={styles.wrapConnection}>
                  <Space size={24} direction='vertical' className='w-100'>
                    <Space direction='vertical' className='w-100 text-center'>
                      <Input placeholder='Email' size='large' onChange={(e) => setSignInEmail(e.target.value)} value={signInEmail}/>
                      <Input.Password placeholder='Mot de passe' size='large' onChange={(e) => setSignInMot_de_passe(e.target.value)} value={signInMot_de_passe}/>

                      <Button type='default' size='large' className='w-100' onClick={() => handleConnection()}>Se connecter</Button>
                      <Button type='link' onClick={ () => clickModalOpen(true)}>Mot de passe oublié ?</Button>
                    </Space>

                    <Space direction='vertical' className='w-100 text-center'>
                      <Button type='success' size='large' onClick={() => clickModalOpen(false) }>Créer un compte</Button>
                    </Space>
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>
        </section>
      </main>

      <Modal footer={null} centered open={modal} onCancel={() => setModal(false)} title={modalOpen ? 'Réinitialisation mot de passe' : 'Créer un compte'}>{ modalOpen ? mdpOublie() : creationCompte() }</Modal>
    </>
  )
}

export default Home;
