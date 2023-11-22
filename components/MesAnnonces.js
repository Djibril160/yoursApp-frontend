import React from 'react';
import { useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { Row, Col, Card, Input, DatePicker, Button, Space, Modal, Typography, Empty, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faEye, faCalendar, faAngleRight, faFaceSmile, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import Link from 'next/link';

const { Paragraph } = Typography;
const { TextArea } = Input;

function AnnoncesList() {
  const user = useSelector((state) => state.user);
  const dateFormat = 'DD/MM/YYYY';

  const [annoncesData, setAnnoncesData] = useState([]);
  const [recherche, setRecherche] = useState ('');
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({ titre: '', date_de_creation: new Date(), date_de_publication: null, date_de_debut: null, date_de_fin: null, adresse: '', code_postal: '', ville: '', description: '', professionnel: '', profession: [] });

  // use Effect pour récupérer toutes les annonces de la base de donnée
  useEffect(() => {
    fetch('https://yours-app-backend.vercel.app/professionnels/mesannonces/' + user.token)
    .then(response => response.json())
    .then(data => {
      // ajouter les annonces de la bdd dans le tableau annonceData
      if(data.result) setAnnoncesData(data.annonces)
    })
  }, []);

  // map sur les annonces et créer une card par annonce
  const Annonces = annoncesData.filter((data) => {
    return recherche.toLowerCase() === '' ?
      data
    :
      data.titre.toLowerCase().includes(recherche)
      || data.ville.toLowerCase().includes(recherche);
  }).map((data, i) => {
    const idAnnonce = data._id;

    console.log('id', idAnnonce)

    return (<>
      <Col span={24}>
        <Card key={i}>
          <Row gutter={[12, 12]}>
            <Col span={24} md={12} className="d-flex align-items-center">
              <div>
                <h2>{data.titre}</h2>

                {
                  data.description &&
                    <div className="mb-3 opacity-50 text-small">
                      <Paragraph ellipsis={{rows: 3}}>{data.description}</Paragraph>
                    </div>
                }

                {
                  (data.adresse || (data.code_postal && data.ville)) &&
                    <div className="opacity-50 text-small">
                      <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                      {
                        data.adresse &&
                          <span className="me-1">{data.adresse},</span>
                      }
                      {
                        (data.code_postal && data.ville) &&
                          <>
                            <span className="me-1">{data.code_postal}</span>
                            <span>{data.ville}</span>
                          </>
                      }
                    </div>
                }

                {
                  (data.date_de_debut || data.date_de_fin) &&
                    <div className="opacity-50 text-small">
                      <FontAwesomeIcon icon={faCalendar} className="me-2" />
                      {
                        data.date_de_debut &&
                          dayjs(data.date_de_debut).format(dateFormat)
                      }
                      {
                        (data.date_de_debut && data.date_de_fin) &&
                          <FontAwesomeIcon icon={faAngleRight} className="mx-1" />
                      }
                      {
                        data.date_de_fin &&
                          dayjs(data.date_de_fin).format(dateFormat)
                      }
                    </div>
                }
              </div>
            </Col>

            <Col span={24} md={12} className="d-flex align-items-center justify-content-center justify-content-md-end">
              <Link href={'/annonce/' + idAnnonce}>
                <Button type="default" size="large" className="mx-2">
                  <FontAwesomeIcon icon={faEye} />
                </Button>
              </Link>
            </Col>

            {
              data.date_de_publication &&
                <Col span={24} className="mt-3 opacity-75 text-small text-end">
                  <FontAwesomeIcon icon={faFaceSmile} className='me-1 vertical-align-middle' /> Sera publiée le { dayjs(data.date_de_publication).format(dateFormat) }
                </Col>
            }
          </Row>
        </Card>
      </Col>
    </>)
  });

  // Champs obligatoire : ['titre', 'date_de_creation', 'code_postal', 'ville', 'description', 'token' ]
  const handleCreationAnnonce = () => {
    const annonceData = {
      titre: formData.titre,
      date_de_creation: formData.date_de_creation,
      date_de_publication: formData.date_de_publication,
      date_de_debut: formData.date_de_debut,
      date_de_fin: formData.date_de_fin,
      adresse: formData.adresse,
      code_postal: formData.code_postal,
      ville: formData.ville,
      description: formData.description,
      profession: formData.profession,
      professionnel: formData.professionnel
    };


    fetch('https://yours-app-backend.vercel.app/annonces/create/' + user.token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // todo - retraiter le token :
      body: JSON.stringify(annonceData),
    }).then(response => response.json())
      .then(data => {
        if (data.result) {
          const nouvellesAnnonces = [{ ...formData, _id: data.newAnnonce._id }, ...annoncesData];

          setFormData({ ...formData, titre: '', date_de_creation: new Date(), date_de_publication: null, date_de_debut: null, date_de_fin: null, adresse: '', code_postal: '', ville: '', description: '', profession: [], professionnel:'' });

          setModal(false)
          setAnnoncesData(nouvellesAnnonces)

          messageApi.open({
            type: 'success',
            content: 'Annonce créée'
          });
        };
      });
  };

  // modal - creation d'annonce
  const creationAnnonce = () => {
    return <>
      <Space direction='vertical' className='w-100' size={12}>
        <Row gutter={[12, 18]}>
          <Col span={24}>
            <Input placeholder="Titre" required size="large" onChange={(e) => setFormData({...formData, titre: e.target.value})} value={formData.titre} />
          </Col>

          <Col span={24}>
            <DatePicker placeholder="Date Publication" size="large" className='w-100' format={dateFormat} onChange={(e) => setFormData({...formData, date_de_publication: e})} value={formData.date_de_publication}/>
          </Col>

          <Col span={12}>
            <DatePicker placeholder="Date Début" size="large" className='w-100' format={dateFormat} onChange={(e) => setFormData({...formData, date_de_debut: e})} value={formData.date_de_debut}/>
          </Col>

          <Col span={12}>
            <DatePicker placeholder="Date Fin" size="large" className='w-100' format={dateFormat} onChange={(e) => setFormData({...formData, date_de_fin: e})} value={formData.date_de_fin} />
          </Col>

          <Col span={24}>
            <Input placeholder="Adresse" size="large" onChange={(e) => setFormData({...formData, adresse: e.target.value})} value={formData.adresse} />
          </Col>

          <Col span={12}>
            <Input placeholder="Code postal" size="large" onChange={(e) => setFormData({...formData, code_postal: e.target.value})} value={formData.code_postal} />
          </Col>

          <Col span={12}>
            <Input placeholder="Ville" size="large" onChange={(e) => setFormData({...formData, ville: e.target.value})} value={formData.ville} />
          </Col>

          <Col span={24}>
            <TextArea rows={6} placeholder="Description du stage" onChange={(e) => setFormData({...formData, description: e.target.value})} value={formData.description} />
          </Col>

          <Col span={24}>
            <Input placeholder="Mots clé profession" size="large" onChange={(e) => setFormData({...formData, profession: e.target.value})} value={formData.profession}/>
          </Col>

          <Col span={24} className='text-center'>
            <Button type='default' size='large' onClick={() => handleCreationAnnonce()}>Valider</Button>
          </Col>
        </Row>
      </Space>
    </>
  }

  return (
    <>
      <main>
        <div className='container'>
          <Space direction='vertical' className='w-100' size={12} >
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <h2 className='mb-0 fs-3'>Mes Annonces</h2>
              </Col>

              <Col span={12} className='text-end'>
                <Button type='default' size='large' onClick={() => setModal(true)}>Poster un annonce</Button>
              </Col>

              <Col span={24} className='mb-5'>
                <Card>
                <Input placeholder={'Rechercher une annonce'} size='large' suffix={<FontAwesomeIcon icon={faMagnifyingGlass} />} onChange={(e) => setRecherche(e.target.value)} />
                </Card>
              </Col>

              {
                Annonces.length === 0 ?
                  <Col span={24} className="text-center">
                    <Empty description="Aucune annonce trouvée" />
                  </Col>
                :
                  Annonces
              }

            </Row>
          </Space>
        </div>
      </main>

      <Modal footer={null} centered open={modal} onCancel={() => setModal(false)} title={'Créer une annonce'}>{ creationAnnonce() }</Modal>
      {contextHolder /* messages d'information qui apparais en haut de la page après chaque intervention */ }
    </>
  );
}

export default AnnoncesList;
