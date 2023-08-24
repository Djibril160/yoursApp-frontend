import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Row, Col, Card, Avatar, DatePicker, Input, Button, Space, Modal, message } from "antd";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTag, faFaceSmile, faCalendar, faLocationDot, faAngleRight, faEye, faCakeCandles } from "@fortawesome/free-solid-svg-icons";

const { TextArea } = Input;

function Annonce({ id, props }) {
  const user = useSelector((state) => state.user);
  const dateFormat = 'DD/MM/YYYY';
  const currentDate = dayjs();

  const [messageApi, contextHolder] = message.useMessage();
  const [modal, setModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAnnonce, setEditAnnonce] = useState(false);
  const [verifiePostuler, setVerifiePostuler] = useState();
  const [nombrePostulant, setNombrePostulant] = useState();
  const [messagePostuler, setMessagePostuler] = useState('');
  const [archiveAnnonce, setArchiveAnnonce] = useState(props?.archive);
  const [formData, setFormData] = useState({...props});
  const [formDataPreview, setFormDataPreview] = useState({...props});
  const [annonceEnFavori, setAnnonceEnFavori] = useState(false);

  console.log()

  useEffect(() => {
    setVerifiePostuler(props.eleves_postulants.some((eleve) => eleve.eleve === user.token))
    setNombrePostulant(props.eleves_postulants.length)
  }, []);

  // fonction pour ouvrir modal
  const clickModalOpen = (boolean) => {
    setModal(true)
    setModalOpen(boolean) // (true > modal postuler / eleve) ou (false > modal postulants / pro)
  }

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

  // fetch archiver une annonce
  const HandleArchiverAnnonce = () => {
    const isArchive = archiveAnnonce ? false : true;

    fetch('http://localhost:3000/annonces/edit/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archive: isArchive, token: user.token })
    }).then(response => response.json())
      .then(data => {
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

  // fetch eleve postule à l'annonce
  const postulerEleveAnnonce = () => {
    setModal(false)

    fetch('http://localhost:3000/eleves/postuler/' + id + '/' + user.token, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messagePostuler })
    }).then(response => response.json())
      .then(data => {
        if (data.result) {
          messageApi.open({
            type: 'success',
            content: data.message
          });

          setVerifiePostuler(true)
        } else {
          messageApi.open({
            type: 'warning',
            content: data.message
          });
        };
      });
  };

  // modal - eleve postuler à l'annonce
  const postulerAnnonce = () => {
    return <>
      <Space direction='vertical' className='w-100' size={12}>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <TextArea
              rows={6}
              placeholder="Message de motivation pour postuler"
              onChange={(e) => setMessagePostuler(e.target.value)}
            />
          </Col>
          <Col span={24} className="mt-3 text-center">
            <Button type="default" size="large" onClick={() => postulerEleveAnnonce()}>Poster</Button>
          </Col>
        </Row>
      </Space>
    </>
  }

  // fetch mettre l'annonce en favoris
  //Ajout d'un message "ajouter avec succès / retirer des favoris"
  const mettreAnnonceEnFavori = () => {
    fetch('http://localhost:3000/eleves/favoris/' + id + '/' + user.token, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json())
      .then(data => {
      if (data.result) {
        setAnnonceEnFavori(!annonceEnFavori);
        // console.log("Annonce ajoutée aux favoris !");
        // Mettez à jour votre état ou effectuez d'autres actions en conséquence
      } else {
        // setAnnonceEnFavori(false);
        // console.log("Erreur lors de l'ajout de l'annonce aux favoris.");
        // Gérez l'erreur ou affichez un message à l'utilisateur
      }
    })
  };


  // fonction accepter ou refuser un eleve qui postule
  const postulerChoix = (status, tokenEleve) => {
    console.log('tokenEleve', tokenEleve)
    fetch('http://localhost:3000/professionnels/postuler/' + id + '/' + user.token, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenEleve, statut: status })
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
        };
      });
  }

  // modal - eleves postulants sur l'annonce
  const elevesPostulantsAnnonce = () => {
    const eleve = props.eleves_postulants
    const models = []


    for(let i=0; i < eleve.length; i++){
      const info = eleve[i].info

      models.push(<>
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col span={7} md={3} className="d-flex align-items-center">
              <Avatar src={<img src={"https://www.photo-identite-bordeaux.fr/wp-content/uploads/2020/10/Enfant-04-2.jpg"} alt="avatar"/>} size={100}/>
            </Col>

            <Col span={17} md={5} className="d-flex align-items-center">
              <div>
                <div className="fw-bold">{info.nom} {info.prenom}</div>

                {
                  (info.code_postal && info.ville) &&
                    <div className="opacity-50 text-small">
                      <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                      <span className="me-2">{info.code_postal}</span>
                      <span>{info.ville}</span>
                    </div>
                }

                {
                  (info.date_de_debut && info.date_de_fin) &&
                    <div className="opacity-50 text-small">
                      <FontAwesomeIcon icon={faCalendar} className="me-2" />
                      <span>{dayjs(info.date_de_debut).format(dateFormat)}</span> <FontAwesomeIcon icon={faAngleRight} className="mx-1" /> <span>{dayjs(info.date_de_fin).format(dateFormat)}</span>
                    </div>
                }
              </div>
            </Col>

            <Col span={24} md={8} className="d-flex flex-column align-items-center justify-content-center">
              {
                eleve[i].message &&
                  <>
                    <h2 className="mb-0 fs-5">Message</h2>
                    <div className="opacity-50 text-small text-center">{eleve[i].message}</div>
                  </>
              }
            </Col>

            <Col span={24} md={8} className="d-flex align-items-center justify-content-center justify-content-md-end">
              {
                eleve[i].statut === 'en cours' ?
                  <>
                    <Button type="danger" size="large" className="m-1" onClick={() => postulerChoix('refuser', eleve[i].eleve)}>Refuser</Button>
                    <Button type="default" size="large" className="m-1" onClick={() => postulerChoix('accepter', eleve[i].eleve)}>Accepter</Button>
                  </>
                :
                  eleve[i].statut === 'refuser' ?
                    <span className="mx-3 text-danger fw-bold">Profil refusé</span>
                  :
                    <span className="mx-3 text-success fw-bold">Profil accépté</span>
              }
              <Link href={'/profil/' + eleve[i].eleve}>
                <Button type="default" size="large" className="m-1">
                  <FontAwesomeIcon icon={faEye} />
                </Button>
              </Link>
            </Col>
          </Row>
        </Col>
      </>)
    }

    return <>
      <Space direction='vertical' className='w-100' size={12}>
        <Row gutter={[12, 50]}>
          {models}
        </Row>
      </Space>
    </>
  }

  return (
    <>
      <main>
        <div className="container">
          <Space direction="vertical" className="w-100" size={12}>
            <Row gutter={[12, 12]}>
              {
                // 1/4 - partie card + boutons pour les éléves
                user.fonction === 'true' &&
                  <>
                    <Col span={24} className="text-end">
                      {
                        !verifiePostuler ?
                          <Button
                            type="default"
                            size="large"
                            className="ms-2"
                            disabled={archiveAnnonce}
                            onClick={() => clickModalOpen(true)}
                          >
                            Postuler
                          </Button>
                        :
                          <small className="fw-bold text-default">Tu à déjà postuler</small>
                      }

                      <Button type="link" size="large" className="d-none">
                        <FontAwesomeIcon icon={faStar} style={{ color: annonceEnFavori ? "#f2e12c" : "gray" }} onClick={()=>{mettreAnnonceEnFavori();
                        setAnnonceEnFavori(!annonceEnFavori);
                        }}/>
                      </Button>
                    </Col>

                    {/* todo - dynamiser le profil pro */}
                    <Col span={24} className="d-none">
                      <Card>
                        <Row gutter={[12, 12]}>
                          <Col span={24} md={4} className='d-flex align-items-center justify-content-center'>
                            <Avatar src={<img src={"https://cdn.britannica.com/01/236601-050-2CFDF711/Julia-Roberts-2019.jpg"} alt="Photo de profile" />} size={100} />
                          </Col>

                          <Col className="d-flex flex-column justify-content-center">
                            <div>Poste</div>
                            <div>Entreprise</div>
                            <div>Localisation</div>
                          </Col>
                        </Row>
                      </Card>
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
                            {
                              (!editAnnonce && nombrePostulant > 0) &&
                                <Button type='secondary' size='large' className="me-2" onClick={() => clickModalOpen(false)}>Postulants</Button>
                            }

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



              <Col span={24}>
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

                              <small className="opacity-50"><FontAwesomeIcon icon={faCalendar} className="me-2" /> { dayjs(formData.date_de_creation).format(dateFormat) }</small>
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

                          <Col span={24}>
                            { formData.description }
                          </Col>

                          {
                            formData.profession &&
                              <Col span={24} className="d-none">
                                <FontAwesomeIcon icon={faTag} className="me-2 vertical-align-middle" /> {formData.profession}
                              </Col>
                          }

                          {
                            (formData.date_de_debut || formData.date_de_fin) &&
                              <Col span={24} md={12} className="mt-5">
                                <FontAwesomeIcon icon={faCalendar} className="me-2" />
                                {
                                  formData.date_de_debut &&
                                    dayjs(formData.date_de_debut).format(dateFormat)
                                }
                                {
                                  (formData.date_de_debut && formData.date_de_fin) &&
                                    <FontAwesomeIcon icon={faAngleRight} className="mx-1" />
                                }
                                {
                                  formData.date_de_fin &&
                                    dayjs(formData.date_de_fin).format(dateFormat)
                                }
                              </Col>
                          }

                          {
                            (formData.adresse || (formData.code_postal && formData.ville)) &&
                              <Col span={24} md={12} className="mt-5 text-md-end">
                                <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                                {
                                  formData.adresse &&
                                    <span className="me-1">{formData.adresse},</span>
                                }
                                {
                                  (formData.code_postal && formData.ville) &&
                                    <>
                                      <span className="me-1">{formData.code_postal}</span>
                                      <span>{formData.ville}</span>
                                    </>
                                }
                              </Col>
                          }

                          {
                            (formData.date_de_publication && user.fonction == 'false') &&
                              <Col span={24} className="mt-3 text-small text-center">
                                <FontAwesomeIcon icon={faFaceSmile} className='me-1 vertical-align-middle' /> Sera publiée le { dayjs(formData.date_de_publication).format(dateFormat) }
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

      {
        user.fonction &&
          <Modal footer={null} width={modalOpen ? 520 : 1200} centered open={modal} onCancel={() => setModal(false)} title={modalOpen ? 'Postuler pour : ' + formData.titre : 'Eleves postulants pour : ' + formData.titre}>{ user.fonction === 'true' ? postulerAnnonce() : elevesPostulantsAnnonce() }</Modal>
      }

      {contextHolder /* messages d'information qui apparais en haut de la page après chaque intervention */ }
    </>
  );
}

export default Annonce;
