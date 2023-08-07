import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card, Input, Button, Space, Avatar, Empty, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const { TextArea } = Input;

function ProfilProfessionnel() {
  const user = useSelector((state) => state.user);

  const [messageApi, contextHolder] = message.useMessage();
  const [isToken, setIsToken] = useState(false);
  const [editProfil, setIsEditProfil] = useState(false);
  const [formData, setFormData] = useState({ nom: '', prenom: '', photos: '', societe: '', parcours_professionnel: '', presentation: '', conseil_metier: '' });
  const [formDataPreview, setFormDataPreview] = useState({});

  useEffect(() => {
    if (user.token) {
      fetch('http://localhost:3000/professionnels/' + user.token)
        .then(response => response.json())
        .then(data => {
          if(data.result){
            setIsToken(true);

            const { nom, prenom, photos, societe, parcours_professionnel, presentation, conseil_metier } = data.data;

            setFormData({ nom, prenom, photos, societe, parcours_professionnel, presentation, conseil_metier });
          };
        });
    };
  }, [user.token]);

  useEffect(() => {
    setFormDataPreview({ ...formData });
  }, [formData]);

  const editProfilClick = () => {
    setIsEditProfil(true);
  };

  const saveProfilClick = () => {
    if(!user.token) return;

    setFormData({ ...formDataPreview });

		fetch('http://localhost:3000/professionnels/edit/' + user.token, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formDataPreview })
    }).then(response => response.json())
    .then(data => {
      if (data.result) {
        messageApi.open({
          type: 'success',
          content: data.message
        });
        // todo - réaliser les messages de confirmation
      } else {
        messageApi.open({
          type: 'warning',
          content: data.message
        });
      }
    });

    setIsEditProfil(false);
  };

  const cancelProfilClick = () => {
    setIsEditProfil(false);
    setFormData({ ...formData });
  };

  return (
    <>
      <main>
        {contextHolder /* messages d'information qui apparais en haut de la page après chaque intervention */ }

        <div className='container'>
          {/* todo - choisir entre les deux visuelles // visuel 1 */}
          <Space direction='vertical' className='w-100' size={12}>
            <Row gutter={[12, 12]}>
              <Col span={24} className='text-end'>
                {
                  user.fonction === 'false' ?
                    <>
                      { editProfil && <Button type='danger' size='large' className='mx-2' onClick={() => cancelProfilClick()}>Annuler</Button> }

                      <Button type='default' size='large' onClick={() => {editProfil ? saveProfilClick() : editProfilClick()}}>{ editProfil ? 'Sauvegarder' : 'Editer' }</Button>
                      <Button type='default' size='large'><Link href="/annonce">Poster annonce</Link></Button>
                    </>
                  :
                    <>
                      <Button type='default' size='large' className='me-2'>Contacter</Button>
                    </>
                }
              </Col>

              <Col span={24} md={6}>
                <div>
                  <Card className='card-profil text-center'>
                    <Avatar src={<img src={"https://actu.meilleurmobile.com/wp-content/uploads/2016/02/Sosh.jpg"} alt="avatar" />} size={100} />

                    <div className='mt-5 px-4 text-md-start'>
                      <div className='my-1'>
                        {
                          editProfil ?
                            <Input placeholder='Nom' size='large' onChange={(e) => setFormDataPreview({ ...formDataPreview, nom: e.target.value })} value={formDataPreview.nom} />
                          :
                            <><FontAwesomeIcon icon={ faUser } className='me-1' /> <span className='fw-bold'>{ formData.nom }</span> <span>{ formData.prenom }</span></>
                        }
                      </div>

                      <div className='my-1'>
                        {
                          editProfil && <Input placeholder='Prénom' size='large' onChange={(e) => setFormDataPreview({ ...formDataPreview, prenom: e.target.value })} value={formDataPreview.prenom} />
                        }
                      </div>

                      <div className='my-1'>
                        {
                          editProfil ?
                            <Input placeholder='Societe' size='large' onChange={(e) => setFormDataPreview({ ...formDataPreview, societe: e.target.value })} value={formDataPreview.societe} />
                          :
                            <>{ formData.societe && <><FontAwesomeIcon icon={ faBuilding } className='me-1' /> <span className='fw-bold'>{ formData.societe }</span></> }</>
                        }
                      </div>
                    </div>
                  </Card>
                </div>
              </Col>

              <Col span={24} md={18}>
                <Row gutter={[12, 12]}>
                  {
                    (!formData.presentation && !formData.parcours_professionnel && !formData.conseil_metier && !editProfil) &&
                      <Col span={24} className='py-5'>
                        <Empty description={false} />
                      </Col>
                  }

                  {
                    (formData.presentation || editProfil) &&
                      <Col span ={24} md={(formData.parcours_professionnel || editProfil) && 12}>
                        <Card>
                          <h2>Présentation</h2>

                          {
                            editProfil ?
                              // todo - format n'est pas bon les saut de ligne (<p> et <br/>)
                              <TextArea rows={8} placeholder='Je travaille actuellement chez ..., une entreprise.. avec x collaborateur ...' size='large' onChange={(e) => setFormDataPreview({ ...formDataPreview, presentation: e.target.value })} value={formDataPreview.presentation} />
                            :
                              formData.presentation
                          }
                        </Card>
                      </Col>
                  }

                  {
                    (formData.parcours_professionnel || editProfil) &&
                      <Col span ={24} md={(formData.presentation || editProfil) && 12}>
                        <Card>
                          <h2>Parcours Personnel</h2>

                          {
                            editProfil ?
                              // todo - format n'est pas bon les saut de ligne (<p> et <br/>)
                              <TextArea rows={8} placeholder='Ayant commencé mon parcours à l/université en licence ...' size='large' onChange={(e) => setFormDataPreview({ ...formDataPreview, parcours_professionnel: e.target.value })} value={formDataPreview.parcours_professionnel} />
                            :
                              formData.parcours_professionnel
                          }
                        </Card>
                      </Col>
                  }

                  {
                    (formData.conseil_metier || editProfil) &&
                      <Col span ={24}>
                        <Card>
                          <h2>Conseil métier</h2>

                          {
                            editProfil ?
                              // todo - format n'est pas bon les saut de ligne (<p> et <br/>)
                              <TextArea rows={8} placeholder='Avec l/expérience que j/ai accumulé lors avec toutes ces année, je peux vous donner quelques conseils...' size='large' onChange={(e) => setFormDataPreview({ ...formDataPreview, conseil_metier: e.target.value })} value={formDataPreview.conseil_metier} />
                            :
                              formData.conseil_metier
                          }
                        </Card>
                      </Col>
                  }
                </Row>
              </Col>
            </Row>
          </Space>

          {/* todo - choisir entre les deux visuelles // visuel 2 */}
          <Space direction='vertical' className='w-100 d-none' size={12}>
            <Row gutter={[12, 12]}>
              <Col span={24} className='text-end'>
                {
                  user.fonction === 'false' ?
                    <>
                      { editProfil && <Button type='danger' size='large' className='mx-2' onClick={() => cancelProfilClick()}>Annuler</Button> }

                      <Button type='default' size='large' onClick={() => {editProfil ? saveProfilClick() : editProfilClick()}}>{ editProfil ? 'Sauvegarder' : 'Editer' }</Button>
                    </>
                  :
                    <>
                      <Button type='default' size='large' className='me-2'>Contacter</Button>
                    </>
                }
              </Col>

              <Col span={24}>
                <Card className='card-profil'>
                  <Row gutter={[12, 12]}>
                    <Col span={24} md={4} className='d-flex align-items-center justify-content-center'>
                      <Avatar src={<img src={"https://actu.meilleurmobile.com/wp-content/uploads/2016/02/Sosh.jpg"} alt="avatar" />} size={100} />
                    </Col>

                    <Col span={24} md={10} className={ !editProfil && 'd-flex align-items-center'}>
                      <div>
                        <div className='my-1'>
                          {
                            editProfil ?
                              <Input placeholder='Nom' size='large' onChange={(e) => setFormDataPreview({ ...formDataPreview, nom: e.target.value })} value={formDataPreview.nom} />
                            :
                              <><FontAwesomeIcon icon={ faUser } className='me-1' /> <span className='fw-bold'>{ formData.nom }</span> <span>{ formData.prenom }</span></>
                          }
                        </div>

                        <div className='my-1'>
                          {
                            editProfil && <Input placeholder='Prénom' size='large' onChange={(e) => setFormDataPreview({ ...formDataPreview, prenom: e.target.value })} value={formDataPreview.prenom} />
                          }
                        </div>

                        <div className='my-1'>
                          {
                            editProfil ?
                              <Input placeholder='Societe' size='large' onChange={(e) => setFormDataPreview({ ...formDataPreview, societe: e.target.value })} value={formDataPreview.societe} />
                            :
                              <>{ formData.societe && <><FontAwesomeIcon icon={ faBuilding } className='me-1' /> <span className='fw-bold'>{ formData.societe }</span></> }</>
                          }
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {
                (!formData.presentation && !formData.parcours_professionnel && !formData.conseil_metier && !editProfil) &&
                  <Col span={24} className='py-5'>
                    <Empty description={false} />
                  </Col>
              }

              {
                (formData.presentation || editProfil) &&
                  <Col span ={24} md={(formData.parcours_professionnel || editProfil) && 12}>
                    <Card>
                      <h2>Présentation</h2>

                      {
                        editProfil ?
                          // todo - format n'est pas bon les saut de ligne (<p> et <br/>)
                          <TextArea rows={8} placeholder='Je travaille actuellement chez ..., une entreprise.. avec x collaborateur ...' size='large' onChange={(e) => setFormDataPreview({ ...formDataPreview, presentation: e.target.value })} value={formDataPreview.presentation} />
                        :
                          formData.presentation
                      }
                    </Card>
                  </Col>
              }

              {
                (formData.parcours_professionnel || editProfil) &&
                  <Col span ={24} md={(formData.presentation || editProfil) && 12}>
                    <Card>
                      <h2>Parcours Personnel</h2>

                      {
                        editProfil ?
                          // todo - format n'est pas bon les saut de ligne (<p> et <br/>)
                          <TextArea rows={8} placeholder='Ayant commencé mon parcours à l/université en licence ...' size='large' onChange={(e) => setFormDataPreview({ ...formDataPreview, parcours_professionnel: e.target.value })} value={formDataPreview.parcours_professionnel} />
                        :
                          formData.parcours_professionnel
                      }
                    </Card>
                  </Col>
              }

              {
                (formData.conseil_metier || editProfil) &&
                  <Col span ={24}>
                    <Card>
                      <h2>Conseil métier</h2>

                      {
                        editProfil ?
                          // todo - format n'est pas bon les saut de ligne (<p> et <br/>)
                          <TextArea rows={8} placeholder='Avec l/expérience que j/ai accumulé lors avec toutes ces année, je peux vous donner quelques conseils...' size='large' onChange={(e) => setFormDataPreview({ ...formDataPreview, conseil_metier: e.target.value })} value={formDataPreview.conseil_metier} />
                        :
                          formData.conseil_metier
                      }
                    </Card>
                  </Col>
              }
            </Row>
          </Space>
        </div>
      </main>
    </>
  )
}

export default ProfilProfessionnel;
