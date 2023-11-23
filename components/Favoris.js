import React from "react";
import { useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { Avatar, Button, Card, Col, Row, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import Link from 'next/link';

function Favoris() {

  const user = useSelector((state) => state.user);
  const dateFormat = 'DD/MM/YYYY';

  const [annoncesData, setAnnoncesData] = useState([]);
  const [recherche, setRecherche] = useState ('');

  useEffect(() => {
    fetch('http://localhost:3000/eleves/mesfavoris/' + user.token)
    .then(response => response.json())
    .then(data => {
      // afficher les favoris  de annonces de la bdd dans le tableau annonceData
      setAnnoncesData(data.annonces)
    })
  }
  , []);


  return(
    <>
      <div className="container">
        <Space direction="vertical" className="w-100" size={12}>
          <Col span={24}>
            <Col span={24}>Favoris</Col>

            {/* Card favoris des annonces coté élève */}
            <Card>
              <Row gutter={[12, 12]}>
                <Col span={24} md={4}>
                  <div>
                    <Avatar alt='Avatar' size={100}>
                    </Avatar>
                  </div>
                </Col>

                <Col span={24} md={10}>
                  <div>
                    Commentateur TV
                  </div>
                  <div>
                    Canal+
                  </div>
                  <div>
                    Paris
                  </div>
                </Col>

                <Col span={24} md={10}>
                  <div>
                    du 10/09/2023 au 14/09/2023
                  </div>
                  <div>
                    <Button>
                      Voir l'annonce
                    </Button>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faStar} style={{color: "#ead02a"}}/>
                  </div>
                </Col>

                <Col span={24}>
                  <div>
                  Description Rapide: lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem              
                  </div>
                </Col>

              </Row>
            </Card>

             {/* Card profil mes élèves favoris coté pro */}
             <Card>
              <Row gutter={[12, 12]}>
                <Col span={24} md={4}>
                  <div>
                    <Avatar alt='Avatar' size={100}>
                    </Avatar>
                  </div>
                </Col>

                <Col span={24} md={10}>
                  <div>
                    Pierre
                  </div>
                  <div>
                    Menes
                  </div>
                  <div>
                    BigP
                  </div>
                </Col>

                <Col span={24} md={10}>
                  <div>
                    du 10/09/2023 au 14/09/2023
                  </div>
                  <div>
                    <Button>
                      Voir le profil
                    </Button>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faStar} style={{color: "#ead02a"}}></FontAwesomeIcon>
                  </div>
                </Col>

                <Col span={24}>
                  <div>
                  Description Rapide: lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem              
                  </div>
                </Col>

              </Row>
            </Card>

          </Col>
        </Space>
      </div>
    </>
  )
}

export default Favoris;