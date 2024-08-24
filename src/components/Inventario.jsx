// import { CargaInventario } from "./CargaInventario";
import { useState, useEffect, useRef } from "react";

export function Inventario() {
  const [articulos, setArticulos] = useState([]);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const nombreRef = useRef(null);
  const stockRef = useRef(null);
  const vendidoRef = useRef(null);
  const codigoBarrasRef = useRef(null);
  const sellUpdateRef = useRef(null);

  async function postArticulo(formMethod, formData) {
    const url = "http://localhost:8000/diarios/api/inventarios/";
    try {
      const response = await fetch(url, {
        method: formMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      setShouldRefresh((prev) => !prev);
    } catch (error) {
      console.error(error.message);
    }
  }

  function handleDelete(articuloCodigo) {
    const url = `http://localhost:8000/diarios/api/inventarios/${articuloCodigo}/`;

    fetch(url, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Articulo eliminado con exito");
          setArticulos(articulos.filter((item) => item.id !== articuloCodigo));
        } else {
          console.error("Error al eliminar articulo");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
  }

  useEffect(() => {
    const url = "http://localhost:8000/diarios/api/inventarios";

    fetch(url, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        return response.json();
      })
      .then((articulosInventario) => {
        const datosArticulos = articulosInventario.map((articulo) => ({
          id: articulo.id,
          nombre: articulo.nombre,
          stock: articulo.stock,
          restante: articulo.restante,
          codigoBarras: articulo.codigo_barras,
        }));

        setArticulos(datosArticulos);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [shouldRefresh]);

  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const data = {
      codigo_barras: formData.get("codigo"),
      nombre: formData.get("nombre"),
      stock: formData.get("stock"),
      vendido: formData.get("vendido"),
    };

    postArticulo(form.method, data);

    nombreRef.current.value = "";
    stockRef.current.value = "";
    codigoBarrasRef.current.value = "";
    vendidoRef.current.value = "";
  }

  useEffect(() => {
    const url = "http://localhost:8000/diarios/api/inventarios";

    fetch(url, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        return response.json();
      })
      .then((articulosInventario) => {
        const datosArticulos = articulosInventario.map((articulo) => ({
          id: articulo.id,
          nombre: articulo.nombre,
          stock: articulo.stock,
          restante: articulo.restante,
          codigoBarras: articulo.codigo_barras,
        }));

        setArticulos(datosArticulos);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [shouldRefresh]);

  const mostrarInformacion = () => {
    return articulos.map((articulo, id) => (
      <div key={id}>
        <h2>{articulo.nombre}</h2>
        <p><strong>Codigo:</strong> {articulo.codigoBarras}</p>
        <p><strong>Entraron:</strong> {articulo.stock}</p>
        <p><strong>Quedan:</strong> {articulo.restante}</p>

        <div className="containers-modifiers">
          <button
            className="modifier-delete button"
            onClick={() => {
              handleDelete(articulo.id);
            }}
          >
            Borrar elemento
          </button>

          <button
            className="modifier-modify-quantity button"
            onClick={() => {
              updateSell(sellUpdateRef.current.value, articulo.id);
              sellUpdateRef.current.value = "";
            }}
          >
            Modificar cantidad
          </button>

          <input
            type="number"
            ref={sellUpdateRef}
            name="sellUpdateInput"
            placeholder="Nuevo valor"
          />
        </div>
        <hr />
      </div>
    ));
  };

  function updateSell(valor, articuloCodigo) {
    const url = `http://localhost:8000/diarios/api/inventarios/${articuloCodigo}/`;

    const dataUpdate = {
      vendido: valor,
    };

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataUpdate),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Articulo actualizado con exito");
          setShouldRefresh((prev) => !prev);
        } else {
          console.error("Error al actualizar articulo");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
  }

  return (
    <>
      <section className="form-inventory">
        <form method="POST" onSubmit={handleSubmit}>
          <input
            type="text"
            ref={codigoBarrasRef}
            name="codigo"
            placeholder="Codigo"
          />
          <input
            type="text"
            ref={nombreRef}
            name="nombre"
            placeholder="Nombre"
          />
          <input
            type="number"
            ref={stockRef}
            name="stock"
            placeholder="Stock"
          />
          <input
            type="number"
            ref={vendidoRef}
            name="vendido"
            placeholder="Vendido"
          />

          <button className="button">Cargar articulo</button>
        </form>
      </section>
      <section>
        <div className="div-articulo">{mostrarInformacion()}</div>
      </section>
    </>
  );
}
