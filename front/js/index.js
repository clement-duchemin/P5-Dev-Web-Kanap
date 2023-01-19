

//Je récupère toutes les données de l'API depuis son url avec la méthode fetch.
// Le mot clef async transforme ma fonction en promesse et lui confère un comportement asynchrone.
const fetchProducts = async () => {
    try{
    // Le mot clef await va nous permettre d'attendre le résultat d'une promesse.    
    const res = await fetch('http://localhost:3000/api/products');
    // Cette deuxième promesse transforme la réponse du fetch en json pour permettre
    // au navigateur de l'interpréter. Elle est contenue dans la variable data puis passé en argument
    // dans la fonction displayProducts qui affiche les produits de l'API.
    const data = await res.json();

        displayProducts(data);

    }catch(err) {
        console.error(err)
      }
}
fetchProducts();

// J'affiche tous les produits sur la page index.html avec la boucle for of qui me permet de parcourir
// un élément itérable. Ici les données renvoyées par l'API dans l'argument data.

let displayProducts = (data) => {
    for (let product of data){
        // La méthode document.getElementById me permet de sélectionner l'id item de la balise section
        // de la page index.html et de lui injecter pour chaque produit le template suivant, 
        // avec la propriété innerHTML.
        const productItem = document.getElementById("items");
        productItem.innerHTML += `<a href="./product.html?id=${product._id}">
                                        <article>
                                        <img src="${product.imageUrl}" alt="${product.altTxt}">
                                        <h3 class="productName">${product.name}</h3>
                                        <p class="productDescription">${product.description}</p>
                                        </article>
                                  </a>`
    }
        // Le dollar-accolades permet de concaténer des variables, ici product,
        // et des clefs, ici les infos de chaque produit dans le template contenu dans des backticks. 
}