import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Space,
  DatePicker,
  Avatar,
  Empty,
  message,
} from "antd";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faUserGraduate,
  faSchool,
  faAngleRight,
  faCakeCandles,
  faLocationDot
} from "@fortawesome/free-solid-svg-icons";

const { TextArea } = Input;

// todo - revoir les mots cles, format des textarea

function ProfilEleve({ props }) {
  const user = useSelector((state) => state.user);
  const dateFormat = "DD/MM/YYYY";
  const currentDate = dayjs();

  const [messageApi, contextHolder] = message.useMessage();
  const [isToken, setIsToken] = useState(false);
  const [editProfil, setIsEditProfil] = useState(false);
  const [formData, setFormData] = useState({ ...props });
  const [formDataPreview, setFormDataPreview] = useState({ ...props });

  useEffect(() => {
    if (user.token) {
      fetch("http://localhost:3000/eleves/token/" + user.token)
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setIsToken(true);

            const {
              nom,
              prenom,
              photos,
              date_de_naissance,
              etablissement,
              presentation,
              motivation,
              ville,
              code_postal,
              disponible,
              date_de_debut,
              date_de_fin,
              ma_recherche_de_stage,
              mot_cle,
            } = data.data;

            setFormData({
              nom,
              prenom,
              photos,
              date_de_naissance,
              etablissement,
              presentation,
              motivation,
              ville,
              code_postal,
              disponible,
              date_de_debut,
              date_de_fin,
              ma_recherche_de_stage,
              mot_cle,
            });
          }
        });
    }
  }, [user.token]);

  useEffect(() => {
    setFormDataPreview({ ...formData });
  }, [formData]);

  const editProfilClick = () => {
    setIsEditProfil(true);
  };

  const saveProfilClick = () => {
    if (!user.token) return;

    setFormData({ ...formDataPreview });

    fetch("http://localhost:3000/eleves/edit/" + user.token, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formDataPreview }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          messageApi.open({
            type: "success",
            content: data.message,
          });
          // todo - réaliser les messages de confirmation
        } else {
          messageApi.open({
            type: "warning",
            content: data.message,
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
        <div className="container">
          <Space direction="vertical" className="w-100" size={12}>
            <Row gutter={[12, 12]}>
              <Col span={24} className="text-end">
                {user.fonction === "true" ? (
                  <>
                    {editProfil && (
                      <Button
                        type="danger"
                        size="large"
                        className="mx-2"
                        onClick={() => cancelProfilClick()}
                      >
                        Annuler
                      </Button>
                    )}

                    <Button
                      type="default"
                      size="large"
                      onClick={() => {
                        editProfil ? saveProfilClick() : editProfilClick();
                      }}
                    >
                      {editProfil ? "Sauvegarder" : "Editer"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button type="default" size="large" className="me-2 d-none">
                      Contacter
                    </Button>
                    <FontAwesomeIcon icon={faStar} className="d-none" />
                  </>
                )}
              </Col>

              <Col span={24}>
                <Card className="card-profil">
                  <Row gutter={[12, 12]}>
                    {
                      // section édtion du profil
                      editProfil &&
                        <>
                          <Col span={24} md={4} className="d-flex align-items-center justify-content-center">
                            <Avatar src={<img src={formDataPreview.photos} alt="avatar" />} size={100} />
                          </Col>

                          <Col span={24} md={10}>
                            <Row gutter={[12, 12]}>
                              <Col span={12}>
                                <Input placeholder="Nom" size="large" onChange={(e) => setFormDataPreview({ ...formDataPreview, nom: e.target.value })} value={formDataPreview.nom} />
                              </Col>
                              <Col span={12}>
                                <Input placeholder="Prénom" size="large" onChange={(e) => setFormDataPreview({ ...formDataPreview, prenom: e.target.value })} value={formDataPreview.prenom} />
                              </Col>
                              <Col span={24}>
                                <DatePicker placeholder="Date de naissance" size="large" format={dateFormat} className="w-100" onChange={(e) => setFormDataPreview({ ...formDataPreview, date_de_naissance: e.toDate() })} />
                              </Col>
                              <Col span={24}>
                                <Input placeholder="Etablissement" size="large" onChange={(e) => setFormDataPreview({ ...formDataPreview, etablissement: e.target.value })} value={formDataPreview.etablissement} />
                              </Col>
                              <Col span={12}>
                                <Input placeholder="Code postal" size="large" onChange={(e) => setFormDataPreview({ ...formDataPreview, code_postal: e.target.value })} value={formDataPreview.code_postal} />
                              </Col>
                              <Col span={12}>
                                <Input placeholder="Ville" size="large" onChange={(e) => setFormDataPreview({ ...formDataPreview, ville: e.target.value })} value={formDataPreview.ville} />
                              </Col>
                            </Row>
                          </Col>

                          <Col span={24} md={10} className="text-center">
                            <h2 className="mb-0 fs-5">Date de stage</h2>

                            <DatePicker placeholder="Date de début" size="large" format={dateFormat} className="mx-2" onChange={(e) => setFormDataPreview({ ...formDataPreview, date_de_debut: e.toDate() })} />
                            <DatePicker placeholder="Date de fin" size="large" format={dateFormat} className="mx-2" onChange={(e) => setFormDataPreview({ ...formDataPreview, date_de_fin: e.toDate() })} />
                          </Col>
                        </>
                    }

                    {
                      // section affichage du profil
                      !editProfil &&
                        <>
                          <Col span={24} md={4} className="d-flex align-items-center justify-content-center">
                            <Avatar src={<img src={formData.photos} alt="avatar" />} size={100} />
                          </Col>

                          <Col span={24} md={10} className='d-flex align-items-center'>
                            <div>
                              <div className="fw-bold">
                                <span className="me-1">{formData.nom}</span> <span>{formData.prenom}</span>
                              </div>

                              {
                                formData.date_de_naissance &&
                                  <div className="opacity-50 text-small">
                                    <FontAwesomeIcon icon={faCakeCandles} className="me-1" /> {dayjs(formData.date_de_naissance).format(dateFormat)} ({currentDate.diff(formData.date_de_naissance, 'year')} ans)
                                  </div>
                              }

                              {
                                formData.etablissement &&
                                  <div className="opacity-50 text-small">
                                    <FontAwesomeIcon icon={faSchool} className="me-1" /> {formData.etablissement}
                                  </div>
                              }

                              {
                                (formData.code_postal && formData.ville) &&
                                  <div className="opacity-50 text-small">
                                    <FontAwesomeIcon icon={faLocationDot} className="me-1" />
                                    <span className="me-2">{formData.code_postal}</span>
                                    <span>{formData.ville}</span>
                                  </div>
                              }
                            </div>

                          </Col>

                          <Col span={24} md={10} className="d-flex flex-column align-items-center justify-content-center">
                            {
                              (formData.date_de_debut && formData.date_de_fin) &&
                                <>
                                  <h2 className="mb-0 fs-5">Date de stage</h2>
                                  <div className="text-small">
                                    {dayjs(formData.date_de_debut).format(dateFormat)}
                                    <FontAwesomeIcon icon={faAngleRight} className="mx-3" />
                                    {dayjs(formData.date_de_fin).format(dateFormat)}
                                  </div>
                                </>
                            }
                          </Col>
                        </>
                    }
                  </Row>
                </Card>
              </Col>

              {!formData.ma_recherche_de_stage &&
                !formData.presentation &&
                !formData.motivation &&
                !editProfil && (
                  <Col span={24} className="py-5">
                    <Empty description={false} />
                  </Col>
                )}

              {(formData.ma_recherche_de_stage || editProfil) && (
                <Col span={24}>
                  <Card>
                    <h2>Mon Stage de rêve</h2>

                    {
                      // todo - ajout de mot_cle // liste de mots
                      editProfil ? (
                        // todo - format n'est pas bon les saut de ligne (<p> et <br/>)
                        <TextArea
                          rows={8}
                          placeholder="Bonjour, je recherche un stage.."
                          size="large"
                          onChange={(e) =>
                            setFormDataPreview({
                              ...formDataPreview,
                              ma_recherche_de_stage: e.target.value,
                            })
                          }
                          value={formDataPreview.ma_recherche_de_stage}
                        />
                      ) : (
                        formData.ma_recherche_de_stage
                      )
                    }
                  </Card>
                </Col>
              )}

              {(formData.presentation || editProfil) && (
                <Col span={24} md={(formData.motivation || editProfil) && 12}>
                  <Card>
                    <h2>Présentation</h2>

                    {editProfil ? (
                      // todo - format n'est pas bon les saut de ligne (<p> et <br/>)
                      <TextArea
                        rows={8}
                        placeholder="Bonjour, je suis très intérressé par le domaine du ..."
                        size="large"
                        onChange={(e) =>
                          setFormDataPreview({
                            ...formDataPreview,
                            presentation: e.target.value,
                          })
                        }
                        value={formDataPreview.presentation}
                      />
                    ) : (
                      formData.presentation
                    )}
                  </Card>
                </Col>
              )}

              {(formData.motivation || editProfil) && (
                <Col span={24} md={(formData.presentation || editProfil) && 12}>
                  <Card>
                    <h2>Motivation</h2>

                    {editProfil ? (
                      // todo - format n'est pas bon les saut de ligne (<p> et <br/>)
                      <TextArea
                        rows={8}
                        placeholder="Je suis particulièrement intérressé par votre ..."
                        size="large"
                        onChange={(e) =>
                          setFormDataPreview({
                            ...formDataPreview,
                            motivation: e.target.value,
                          })
                        }
                        value={formDataPreview.motivation}
                      />
                    ) : (
                      formData.motivation
                    )}
                  </Card>
                </Col>
              )}
            </Row>
          </Space>
        </div>
      </main>

      { contextHolder /* messages d'information qui apparais en haut de la page après chaque intervention */ }
    </>
  );
}

export default ProfilEleve;
