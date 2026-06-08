import { useEffect, useState } from "react";

import { api } from "../services/api";

export function Products() {
  const [products, setProducts] = useState([]);

  async function loadProducts() {
    try {
      const response = await api.get("/products");

      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleRequest(productId) {
    try {
      await api.post("/requests", {
        productId,
        observation: "Solicitação enviada pelo frontend",
      });

      alert("Solicitação enviada!");
    } catch (error) {
      console.error(error);

      alert("Erro ao solicitar");
    }
  }

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <h1>Produtos</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",

              borderRadius: 10,

              padding: 16,
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.title}
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />

            <h2>{product.title}</h2>

            <p>{product.description}</p>

            <strong>{product.category}</strong>

            <br />
            <br />

            <button onClick={() => handleRequest(product.id)}>Solicitar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
