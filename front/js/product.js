

// Le constructor new URLSearchParams permet de créer un nouvel objet URLSearchParams.
// La propriété de recherche Window.location.search permet d'extraire la chaîne de requête de l'URL.
// L'objet URLSearchParams permet de récupérer les clefs+valeurs de la chaîne de requète de l'url pour les manipuler.
// La méthode get("id") récupère la valeur de la clef id du produit affiché dans la barre de recherche.

const productId = new URLSearchParams(window.location.search).get("id");

//Je crée une nouvelle URL pour chaque produit sélectionné en concaténant la variable productId à la fin de l'URL.

const fetchProductData = async () => {
  try{
    
    const res = await fetch(`http://localhost:3000/api/products/${productId}`);
    
    const data = await res.json();
    
    displaySelectedProduct(data);
    addProductToCart(data);
  }catch(err) {
    console.error(err)
  }
};
fetchProductData();

//J'affiche les données du produit sélectionné dans la page index.html sur la page product.html 
//en injectant du contenu html aux balises sélectionnées par la méthodes document.querySelector et la propriété innerHTML.

displaySelectedProduct = (product) => {
    document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}" />` ;
    document.querySelector("#title").innerText = `${product.name}`;
    document.querySelector("#price").innerText = `${product.price}`;
    document.querySelector("#description").innerText = `${product.description}`;
    // Boucle intégrant les différentes couleurs du produit dans le html.
    // Pour chaque couleur des couleurs du produit sélectionné...
    for (let color of product.colors) {
      // ... je crée un élément div en html, nommé option, mis dans la variable option.
        let option = document.createElement("option");
      // À laquelle je donne une valeur qui correspond à la variable color.
        option.value = color;
      // J'intègre cette correspondance entre ces deux variables au html avec innerHTML.  
        option.innerHTML = color;
      // Puis j'inclus cette variable option à son parent en html avec la méthode appendChild.
        document.querySelector("#colors").appendChild(option);
    }
}

//Je récupère les données du produit sélectionné par l'utilisateur.
const selectedQuantity = document.querySelector("#quantity");
const selectedColor = document.querySelector("#colors");
const addToCart = document.querySelector("#addToCart");
// La fonction suivante permet d'ajouter des produits à la page panier.
addProductToCart = (data) => {
    // Je configure la méthode addEventListener sur le bouton ajouter au panier.
    // Cela crée une fonction qui sera appelée à chaque click de l'utilisateur.
    addToCart.addEventListener('click', (e) => {
        e.preventDefault();

        if (selectedQuantity.value <= 0 || selectedQuantity.value > 100 || selectedColor.value == "") {
            alert("Veuillez saisir une quantité correcte et la couleur");
        }

        else {
          // Les deux variables suivantes contiennent la quantité et la couleur sélectionnée par l'utilisateur.
            let productQuantity = selectedQuantity.value;
            let productColor = selectedColor.value;
            // Je crée un objet qui contient les données des produits sélectionnés par l'utilisateur.
            let selectedItem = {
                id: productId,
                img: data.imageUrl,
                alt: data.altTxt,
                description: data.description,
                name: data.name,
                quantity: Math.trunc(productQuantity),
                color: productColor
            };
            // Je déclare une variable productInLocalStorage dans laquelle je met la méthode getItem,
            // qui récupère les clefs et valeurs du localstorage. Ces données sont ensuite converties 
            // en objet JavaScript depuis le format j.son avec la méthode JSON.parse.
            let productInLocalStorage = JSON.parse(localStorage.getItem("localBasket"));

            // Je crée une fonction qui permettra d'envoyer les produits sélectionnés au localstorage
            // avec la méthode setItem.
            // Ces données sont converties au format JSON avec la méthode JSON.stringify.
            addToLocalStorage = () => localStorage.setItem("localBasket", JSON.stringify(productInLocalStorage));

            // Ces données sont stockées dans un tableau puis envoyées au localstorage s'il est vide, 
            // et les quantitées sont modifiées si le même produit figure déjà dans le localstorage.
            if (productInLocalStorage === null) {
              productInLocalStorage=[];
              // J'utilise la méthode push qui ajoute les données de l'objet selectedItem au tableau contenu
              // dans la variable productInLocalStorage.
              productInLocalStorage.push(selectedItem)
              addToLocalStorage();
            }else {
              // La variable found, avec la méthode find, permet de savoir si l'id et la couleur du produit 
              // nouvellement ajouté correspond à un produit déjà présent dans le localstorage. 
              const found = productInLocalStorage.find(element => element.id == selectedItem.id && element.color == selectedItem.color);
              // Si non, le nouveau produit est ajouté.
              if (found == undefined) {
                productInLocalStorage.push(selectedItem);
                addToLocalStorage();
              // Si oui la quantité sera actualisée.
            }else {
              found.quantity += selectedItem.quantity;
              addToLocalStorage();
            }
          }
        }}
    );
}











