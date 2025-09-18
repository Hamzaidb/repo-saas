export async function getProducts() {
    const res = await fetch("http://localhost:3001/products", {
      next: { revalidate: 60 }, // ISR → revalidation toutes les 60s
    });
  
    if (!res.ok) {
      throw new Error("Erreur lors du chargement des produits");
    }
  
    return res.json();
  }
  