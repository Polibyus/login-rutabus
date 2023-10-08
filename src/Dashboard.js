import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";
import { auth, db, logout } from "./config/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
const storage = getStorage();

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [leg, setLeg] = useState("");
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setLeg(data.leg);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName(); // eslint-disable-next-line
  }, [user, loading]);

  // const bajar = async () => {
  //   try {
  //     getDownloadURL(ref(storage, `gs://login-rutabus.appspot.com/Recibos/350-SUE-M-2307-STT-03-ADMINISTRACION-00000501-20231006-125445-USR18.pdf`))
  //       .then((url) => {
  //         const xhr = new XMLHttpRequest();
  //         xhr.responseType = "blob";
  //         xhr.onload = (event) => {
  //           // eslint-disable-next-line
  //           const blob = xhr.response;
  //         };
  //         xhr.open("GET", url);
  //         xhr.send();
  //       })
  //       .catch((error) => {
  //         alert(`error:${error}`);
  //       });
  //   } catch (err) {
  //     alert(`error:${err}`);
  //   }
  // };
  const bajar = async () => {

    const legajoUsuario =`${leg}`;
    try{
    const url = await getDownloadURL(ref(storage, `gs://login-rutabus.appspot.com/Recibos/350-SUE-M-2309-STT-03-ADMINISTRACION-00000${legajoUsuario}-20231006-125638-USR18.pdf`));
      //hay que ver de que manera cambiar el mes del recibo y los ultimos 6 numeros que nose de donde vienen
      
    // Crear un enlace de descarga invisible en el DOM
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "archivo.pdf"; // Nombre que se utilizará para guardar el archivo

    // Simular un clic en el enlace para iniciar la descarga
    downloadLink.click();
    window.open(url, '_blank')
  }catch(error){
    console.log(`Error, ${error}`);
  }
  };
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        Bienvenido
        <div>{name}</div>
        <div>{leg}</div>
        <div>{user?.email}</div>
        <button className="dashboard__btn" onClick={bajar}>
          Descargar
        </button>
        <button className="dashboard__btn" onClick={logout}>
          Salir
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
