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

  const bajar = async () => {
    await getDownloadURL(
      ref(
        storage,
        `gs://login-rutabus.appspot.com/Recibos/350-SUE-M-2307-STT-03-ADMINISTRACION-00000${leg}-20231006-125445-USR18.pdf`
      )
    )
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {// eslint-disable-next-line
          const blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();
      })
      .catch((error) => {
        
        alert(`Error al descargar: ${error}`);
      });
  }
  
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
