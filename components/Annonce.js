import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Row, Col, Card, Avatar, DatePicker, Input, Button, Space, message } from "antd";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTag, faCalendar, faLocationDot } from "@fortawesome/free-solid-svg-icons";

const { TextArea } = Input;

function Annonce({ id, props }) {
  const user = useSelector((state) => state.user);

  const dateFormat = 'DD/MM/YYYY';

  const [messageApi, contextHolder] = message.useMessage();
  const [editAnnonce, setEditAnnonce] = useState(false);
  const [archiveAnnonce, setArchiveAnnonce] = useState(props.archive);
  const [formData, setFormData] = useState({...props});
  const [formDataPreview, setFormDataPreview] = useState({...props});

  const editAnnnonceClick = () => {
    setEditAnnonce(true);
  };

  const saveAnnonceClick = () => {
    if(!user.token) return;

		fetch('http://localhost:3000/annonces/edit/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formDataPreview, token: user.token })
    }).then(response => response.json())
    .then(data => {
      if (data.result) {
        messageApi.open({
          type: 'success',
          content: data.message
        });
      } else {
        messageApi.open({
          type: 'warning',
          content: data.message
        });
      }
    });

    setFormData({ ...formDataPreview });
    setEditAnnonce(false);
  };

  const cancelAnnonceClick = () => {
    setEditAnnonce(false);
    setFormData({ ...formData });
  };

  const HandleArchiverAnnonce = () => {
    const isArchive = archiveAnnonce ? false : true;

    fetch('http://localhost:3000/annonces/edit/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archive: isArchive, token: user.token })
    }).then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.result) {
          messageApi.open({
            type: 'success',
            content: data.message
          });

          if(isArchive){
            messageApi.open({
              type: 'success',
              content: 'Annonce archivée'
            });
          } else {
            messageApi.open({
              type: 'success',
              content: 'Annonce désarchivée'
            });
          }

          setArchiveAnnonce(isArchive)
        } else {
          messageApi.open({
            type: 'success',
            content: data.message
          });
        }
      });
  }

  return (
    <>
      <main>
        <div className="container">
          <Space direction="vertical" className="w-100" size={12}>
            <Row gutter={[12, 12]}>
              {
                // 1/4 - partie card pour les éléves
                user.fonction === 'true' &&
                  <>
                    <Col span={24}>
                      <Card>
                        <Row gutter={[12, 12]}>
                          <Col span={24} md={4}>
                            <Avatar src={<img src={"https://cdn.britannica.com/01/236601-050-2CFDF711/Julia-Roberts-2019.jpg"} alt="Photo de profile" />} size={100} />
                          </Col>

                          <Col span={24} md={10}>
                            <div>Poste</div>
                            <div>Entreprise</div>
                            <div>Localisation</div>
                          </Col>

                          <Col span={24} md={10}>
                            <div>Date du stage</div>
                            <div><FontAwesomeIcon icon={faStar} size={50} style={{ color: "#f2e12c" }} /></div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>

                    <Col span={24}>
                      <div className="d-flex justify-content-end align-items-center">
                        <span>Postulé</span>
                        <Button
                          type="default"
                          size="large"
                          className="mx-2"
                          onClick={() => fonctionachanger()}
                        >
                          Postuler
                        </Button>
                        <Button
                          type="default"
                          size="large"
                          className="mx-2"
                          onClick={() => fonctionachanger()}
                        >
                          Contacter le professionnel
                        </Button>
                      </div>
                    </Col>
                  </>
              }



              {
                // 2/4 - partie boutons édition, uniquement pour les professionnelles

                user.fonction === 'false' &&
                  <>
                    <Col span={24}>
                      <div className="d-flex justify-content-end align-items-center">
                        {
                          <>
                            { !editAnnonce && <Button type="danger" size="large" onClick={() => HandleArchiverAnnonce()}>{ archiveAnnonce ? 'Désarchiver' : 'Archiver' }</Button> }

                            {
                              // si l'annonce n'est pas archivé, alors il affiche les boutons pour l'éditon de l'annonce
                              !archiveAnnonce &&
                                <>
                                  { editAnnonce && <Button type='danger' size='large' onClick={() => cancelAnnonceClick()}>Annuler</Button> }

                                  <Button type='default' size='large' className="ms-2" onClick={() => {editAnnonce ? saveAnnonceClick() : editAnnnonceClick()}}>{ editAnnonce ? 'Sauvegarder' : 'Editer' }</Button>
                                </>
                            }
                          </>
                        }
                      </div>
                    </Col>
                  </>
              }


              <Col span={24} className={archiveAnnonce && 'text-disabled'}>
                <Card>
                  <Row gutter={[12, 12]}>
                    {
                      // 3/4 - partie édition, uniquement pour les professionnelles

                      editAnnonce && user.fonction === 'false' &&
                        <>
                          <Col span={24}>
                            <Input placeholder="Titre" size="large" onChange={(e) => setFormDataPreview({ ...formDataPreview, titre: e.target.value })} value={formDataPreview.titre} />
                          </Col>
                          <Col span={24}>
                            <DatePicker
                              placeholder="Date de publication"
                              size="large"
                              className="w-100"
                              format={dateFormat}
                              onChange={(e) => setFormDataPreview({ ...formDataPreview, date_de_publication: e.toDate() })}
                            />
                          </Col>
                          <Col span={12}>
                            <DatePicker
                              placeholder="Date de début"
                              format={dateFormat}
                              size="large"
                              className="w-100"
                              onChange={(e) => setFormDataPreview({ ...formDataPreview, date_de_debut: e.toDate() })}
                            />
                          </Col>
                          <Col span={12}>
                            <DatePicker
                              placeholder="Date de fin"
                              format={dateFormat}
                              size="large"
                              className="w-100"
                              onChange={(e) => setFormDataPreview({ ...formDataPreview, date_de_fin: e.toDate() })}
                            />
                          </Col>
                          <Col span={24}>
                            <Input
                              placeholder="Adresse"
                              size="large"
                              onChange={(e) => setFormDataPreview({ ...formDataPreview, adresse: e.target.value })}
                              value={formDataPreview.adresse}
                            />
                          </Col>
                          <Col span={12}>
                            <Input
                              placeholder="Code postal"
                              size="large"
                              onChange={(e) => setFormDataPreview({ ...formDataPreview, code_postal: e.target.value })}
                              value={formDataPreview.code_postal}
                            />
                          </Col>
                          <Col span={12}>
                            <Input
                              placeholder="Ville"
                              size="large"
                              onChange={(e) => setFormDataPreview({ ...formDataPreview, ville: e.target.value })}
                              value={formDataPreview.ville}
                            />
                          </Col>
                          <Col span={24}>
                            <TextArea
                              rows={6}
                              placeholder="Description du stage"
                              onChange={(e) => setFormDataPreview({ ...formDataPreview, description: e.target.value })}
                              value={formDataPreview.description}
                            />
                          </Col>
                          <Col span={24}>
                            <Input
                              placeholder="Mots clé profession"
                              size="large"
                              onChange={(e) => setFormDataPreview({ ...formDataPreview, profession: e.target.value })}
                              value={formDataPreview.profession}
                            />
                          </Col>
                        </>
                    }



                    {
                      // 4/4 - partie affichage des elements

                      !editAnnonce &&
                        <>
                          <Col span={24}>
                            <div className="d-flex align-items-center justify-content-between">
                              <h2 className="mb-0">{ formData.titre }</h2>
                              <small className="text-disabled"><FontAwesomeIcon icon={faCalendar} className="me-2" /> { dayjs(formData.date_de_creation).format(dateFormat) }</small>
                            </div>
                          </Col>
                          {
                            formData.date_de_publication && user.fonction === 'false' &&
                              <Col span={24}>
                                <>
                                  Sera publiée le : { dayjs(formData.date_de_publication).format(dateFormat) }
                                </>
                              </Col>
                          }
                          {
                            (formData.date_de_debut || formData.date_de_fin) &&
                              <Col span={24}>
                                { formData.date_de_debut && dayjs(formData.date_de_debut).format(dateFormat) }
                                { formData.date_de_fin && dayjs(formData.date_de_fin).format(dateFormat) }
                              </Col>
                          }
                          <Col span={24}>
                            <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                            { formData.adresse && <span className="me-1">{formData.adresse},</span> }
                            <span className="me-1">{formData.code_postal}</span> <span>{formData.ville}</span>
                          </Col>
                          <Col span={24}>
                            { formData.description }
                          </Col>
                          {
                            formData.profession &&
                              <Col span={24}>
                                <FontAwesomeIcon icon={faTag} className="me-2 vertical-align-middle" /> {formData.profession}
                              </Col>
                          }
                        </>
                    }
                  </Row>
                </Card>
              </Col>
            </Row>
          </Space>
        </div>
      </main>

      {contextHolder /* messages d'information qui apparais en haut de la page après chaque intervention */ }
    </>
  );
}

export default Annonce;
