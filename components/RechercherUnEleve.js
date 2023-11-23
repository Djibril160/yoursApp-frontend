import React from 'react';
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card, Input, Button, Space, DatePicker, Avatar, Empty, message } from 'antd';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEye, faMagnifyingGlass, faLocationDot, faCalendar, faAngleRight, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

function RechercherUnEleve () {
  const user = useSelector((state) => state.user);
  const dateFormat = 'DD/MM/YYYY';

  const [elevesData, setElevesData] = useState([]);
  const [recherche, setRecherche] = useState ('');


  // use Effect pour récupérer tous les élèves de la base de donnée au chargement du composant
  useEffect(() => {
    fetch('http://localhost:3000/professionnels/recherche/eleves/'+ user.token)
    .then(response => response.json())
    .then(data => {
      // ajouter les elèves de la bdd dans le tableau annonceData
      if (data.result) setElevesData(data.eleve)
    })
  }, []);


  // map sur les elèves et créer une card par elève
  const Eleves = elevesData.filter((data) => {
    return recherche.toLowerCase() === '' ?
      data
    :
      data.nom.toLowerCase().includes(recherche)
      || data.prenom.toLowerCase().includes(recherche)
      || data.ville.toLowerCase().includes(recherche)
      // || data.mot_cle.toLowerCase().includes(recherche)
      || data.motivation.toLowerCase().includes(recherche)
      // || data.ma_recherche_de_stage.toLowerCase().includes(recherche)
      || data.etablissement.toLowerCase().includes(recherche);
  }).map((data, i) => {
    const tokenEleve = data.token;

    return (<>
      <Col span={24}>
        <Card>
          <Row gutter={[12, 12]}>
            <Col span={24} md={3} className="d-flex align-items-center">
              <Avatar src={<img src={data.photos} alt="avatar"/>} size={100}/>
            </Col>

            <Col span={24} md={13} className="d-flex align-items-center">
              <div>
                <div className="fw-bold">{data.nom} {data.prenom}</div>

                {
                  (data.code_postal && data.ville) &&
                    <div className="opacity-50 text-small">
                      <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                      <span className="me-2">{data.code_postal}</span>
                      <span>{data.ville}</span>
                    </div>
                }

                {
                  (data.date_de_debut && data.date_de_fin) &&
                    <div className="opacity-50 text-small">
                      <FontAwesomeIcon icon={faCalendar} className="me-2" />
                      <span>{dayjs(data.date_de_debut).format(dateFormat)}</span>
                      <FontAwesomeIcon icon={faAngleRight} className="mx-1" />
                      <span>{dayjs(data.date_de_fin).format(dateFormat)}</span>
                    </div>
                }
              </div>
            </Col>

            <Col span={24} md={8} className="d-flex align-items-center justify-content-center justify-content-md-end">
              <Link href={'/profil/' + tokenEleve}>
                <Button type="default" size="large" className="mx-2">
                  <FontAwesomeIcon icon={faEye} />
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>
      </Col>
    </>)
  });

  return(
    <main>
      <div className="container">
        <Space direction="vertical" className="w-100" size={12}>
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <h2 className='mb-0 fs-3'>Recherche stagiaire</h2>
            </Col>

            <Col span={24} className='mb-5'>
              <Card>
                <Input placeholder={'Rechercher un stagiaire'} size='large' suffix={<FontAwesomeIcon icon={faMagnifyingGlass} />} onChange={(e) => setRecherche(e.target.value)} />
              </Card>
            </Col>

            {
              Eleves.length === 0 ?
                <Col span={24} className="text-center">
                  <Empty description="Aucun stagiaire trouvé" />
                </Col>
              :
                Eleves
            }
          </Row>
        </Space>
      </div>
    </main>
  )
}

export default RechercherUnEleve;
