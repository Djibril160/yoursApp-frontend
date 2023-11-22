import React from 'react';
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card, Input, Button, Space, Typography, Avatar, Empty, message } from 'antd';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faMagnifyingGlass, faLocationDot, faAngleRight, faCalendar } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const { Paragraph } = Typography;

function RechercheAnnonces () {
  const user = useSelector((state) => state.user);
  const dateFormat = 'DD/MM/YYYY';

  const [annoncesData, setAnnoncesData] = useState([]);
  const [recherche, setRecherche] = useState ('');


  // use Effect pour récupérer toutes les annonces de la base de donnée au chargement du composant
  useEffect(() => {
    fetch('https://yours-app-backend.vercel.app/eleves/recherche/annonce/' + user.token)
    .then(response => response.json())
    .then(data => {
      // ajouter les annonces de la bdd dans le tableau annonceData
      setAnnoncesData(data.annonce)
    })
  }, []);

  // map sur les annonces et créer une card par annonce
  const Annonces = annoncesData.filter((data) => {
    return recherche.toLowerCase() === '' ?
      data
    :
      data.titre.toLowerCase().includes(recherche)
      || data.ville.toLowerCase().includes(recherche)
      || data.description.toLowerCase().includes(recherche)
  }).map((data, i) => {
    const idAnnonce = data._id;

    return (
      <Col span={24} key={i}>
        <Card>
          <Row gutter={[12, 12]}>
            <Col span={24} md={12} className="d-flex align-items-center">
              <div>
                <h2>{data.titre}</h2>

                {
                  data.description &&
                    <div className="opacity-50 text-small">
                      <Paragraph ellipsis={{rows: 2}}>{data.description}</Paragraph>
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
          </Row>
        </Card>
      </Col>
    )
  });

  return(
    <main>
      <div className="container">
        <Space direction="vertical" className="w-100" size={12}>
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <h2 className='mb-0 fs-3'>Recherche un stage</h2>
            </Col>

            <Col span={24} className='mb-5'>
              <Card>
                <Input placeholder={'Rechercher un stage'} size='large' suffix={<FontAwesomeIcon icon={faMagnifyingGlass} />} onChange={(e) => setRecherche(e.target.value)} />
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
  )
}


export default RechercheAnnonces;
