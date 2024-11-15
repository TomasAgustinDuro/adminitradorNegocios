import { useState, useContext } from "react";
import { ShouldRefreshContext } from "../../Context/ShouldRefreshContext";
import fetchData from "../../services/fetchData";
import { Validator } from "../../Utilities/validator";
import Modal from "../../Modal";

import styles from '../devoluciones.module.css'

function FormDevoluciones() {
  const { setShouldRefresh } = useContext(ShouldRefreshContext);
  const [errors, setErrors] = useState({}); 

  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const data = {
      imagen: formData.get("imagen"),
      fecha: formData.get("fecha"),
    };

    const validationErrors = Validator(data);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Actualizar estado de errores
      return;
    }

    const url = "http://localhost:8000/diarios/api/devoluciones/";

    fetchData(url, form.method, formData)
      .then(() => {
        form.reset();
        setShouldRefresh((prev) => !prev);
        setErrors({}); 
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  return (
    <>
      <form method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
        <label htmlFor="file" className={styles.customFileUpload}>
          <div className="icon">
            <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg">
            </svg>
          </div>
          <div className={styles.text}>
            <span>Click to upload image</span>
          </div>
          <input id="file" type="file" accept="image/*" name="imagen" />
        </label>

        <input
          type="date"
          name="fecha"
          className={styles.ticketDate}
          placeholder="¿Qué día es hoy?"
        />

        <button className="button">Cargar imagen</button>
      </form>

     
      <Modal data={errors} />
    </>
  );
}

export default FormDevoluciones;
