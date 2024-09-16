import React from "react";

import { useState, useEffect } from "react";
import BackSidebarInventory from "../Buttons/BackSidebarInventory";

import Styles from "./createInventoryForm.module.css";

const CreateInventoryForm = () => {
  // Estado para cada campo del formulario
  const [productName, setProductName] = useState("");
  const [productCost, setProductCost] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
  
    // Crear el objeto del producto con los estados individuales
    const product = {
      category_product_id: selectedCategoryId,
      product_amount: productName,
      product_cost: productCost,
      product_price: productPrice
    };
  
    try {
      const result = await fetch("http://localhost:3000/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el header
        },
        body: JSON.stringify(product) // Convertir el objeto a JSON
      });
  
      const data = await result.json(); // Parsear la respuesta como JSON
      if (result.ok) {
        alert("Producto creado exitosamente");
        // Opcional: Redirigir o realizar otras acciones aquí
      } else {
        alert(`Error al crear producto: ${data.message}`);
      }
    } catch (error) {
      alert(`Error en la solicitud: ${error.message}`);
    }
  };


  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // Recuperar el token del localStorage
        const token = localStorage.getItem("token");

        // Verificar que el token esté disponible
        if (!token) {
          console.error("Token not found");
          return;
        }

        // Hacer la petición con el token en los encabezados
        const result = await fetch("http://localhost:3000/inventory/category", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // Enviar el token en el header
          }
        });

        const data = await result.json();

        // Asegúrate de guardar solo las categorías del objeto de respuesta
        if (data.success) {
          setProductCategory(data.categories);
        } else {
          console.error("Error fetching categories:", data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategory();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  console.log(productCategory);

  return (
    <div className={Styles.containerCreateInventoryForm}>
      <BackSidebarInventory />
      <h2 className={Styles.h2}>Crear producto para el inventario</h2>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <label className={Styles.label}>Stock del producto</label>
        <input
        className={Styles.input}
          type="number" step="0.01"
          placeholder="Nombre del producto"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        <label className={Styles.label} >Costo del producto</label>
        <input
        className={Styles.input}
         type="number" step="0.01"
          placeholder="Costo del producto"
          value={productCost}
          onChange={(e) => setProductCost(e.target.value)}
        />

        <label className={Styles.label}>Precio del producto</label>
        <input
        className={Styles.input}
          type="number"  step="0.01"
          placeholder="Precio del producto"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />

        <label className={Styles.label}>Categoria del producto</label>
        <select className={Styles.select} value={selectedCategoryId} onChange={handleCategoryChange}>
          <option value="">Seleccione una categoría</option>
          {productCategory.map((category) => (
            <option
              key={category.category_product_id}
              value={category.category_product_id}
            >
              {category.category_product_name}
            </option>
          ))}
        </select>

        <button className={Styles.button} type="submit">Crear producto</button>
      </form>
     
    </div>
  );
};

export default CreateInventoryForm;
