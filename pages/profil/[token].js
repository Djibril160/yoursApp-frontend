import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProfilEleve from '@components/ProfilEleve'
import { useSelector} from "react-redux";
import { Spin } from 'antd';

export default function ProfilPage() {
  const router = useRouter();
  const { query: { token } } = router;
  const  user = useSelector((state) => state.user);

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // Faire une requête au backend pour obtenir les détails de l'annonce en utilisant le slug
    fetch("https://yours-app-backend.vercel.app/eleves/02/" + token)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          const { nom, prenom, photos, date_de_naissance, etablissement, presentation, motivation, ville, code_postal, disponible, date_de_debut, date_de_fin, ma_recherche_de_stage, mot_cle } = data.eleves;

          setFormData({ nom, prenom, photos, date_de_naissance, etablissement, presentation, motivation, ville, code_postal, disponible, date_de_debut, date_de_fin, ma_recherche_de_stage, mot_cle,});
        }
      })
  }, [token]);

  if (user.fonction === 'false') {
    return (
      <>
        {
          formData ?
            <ProfilEleve token={token} props={formData}/>
          :
            <main>
              <div className="container py-5 text-center">
                <Spin size="large" />
              </div>
            </main>
        }
      </>
    );
  } else {
    if (typeof window !== 'undefined') router.push('/')

    return null;
  }
}
