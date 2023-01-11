


////////////////// PANIER //////////////////////////////

// Je récupère les produits stockés dans le localstorage
let basket = JSON.parse(localStorage.getItem("localBasket"));

// Je récupère les données des produits par ID depuis l'API pour obtenir le prix de chaque produit
 getProductDatas = async (idProduct) => {
  let response = await fetch('http://localhost:3000/api/products/' + idProduct);
  let data = await response.json();
  try {
     return data;
   } catch (err) {
     console.log(err);
   }
}


// J'affiche les produits du panier
getBasket = async () => {
  if (basket === null || basket == 0) {
    let h1 = document.querySelector('h1');
    h1.innerText = "Votre panier est vide";
  } else {
    for (let i = 0; i < basket.length; i++) {
// Je met dans la variable item, le produit sélectionné dans le panier à chaque tour de boucle jusqu'à ce qu'il y en ait plus.      
      let item = basket[i];
// La méthode await met le code en pause pendant que la fonction getProductDatas récupère les données
// du produit sélectionné par ID, depuis l'API. 
      let productData = await getProductDatas(item.id);
// Ces données sont ensuite affichées en étant injecté dans la <section id="cart__items"> du html avec le template suivant.
      
      let article = document.createElement('article');
      article.className = "cart__item";
      article.setAttribute("data-id", item.id);
      article.setAttribute("data-color", item.color);
      document.querySelector("#cart__items").appendChild(article);
      article.innerHTML += `<div class="cart__item__img">
                               <img src="${item.img}" alt="${item.alt}">
                            </div>
                            <div class="cart__item__content">
                              <div class="cart__item__content__description">
                                <h2>${item.name}</h2>
                                <p>${item.color}</p>
                                <p>${productData.price} €</p>
                             </div>
                             <div class="cart__item__content__settings">
                               <div class="cart__item__content__settings__quantity">
                                 <p>Qté : </p>
                                 <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                               </div>
                               <div class="cart__item__content__settings__delete">
                                 <p class="deleteItem">Supprimer</p>
                               </div>
                              </div>
                            </div>`;
    }
  }
    productTotal();
    priceTotal();
    changeQty();
    deleteProduct();
  }
getBasket();

// Je crée une fonction pour modifier la quantité des produits dans le panier.
changeQty = () => {
  const inputQty = document.querySelectorAll(".itemQuantity");
  for (let i = 0; i < inputQty.length; i++) {
    inputQty[i].addEventListener("change", (event) => {
      event.preventDefault();
        // La nouvelle quantité du produit selectionné sera envoyée dans le localStorage.
        let newValue = inputQty[i].value;
        let item = basket[i];
        item.quantity = newValue;
        // Ces données seront converties en chaîne de caractère.
        localStorage.setItem("localBasket", JSON.stringify(basket));
        // J'appelle les fonctions suivantes pour mettre à jour la quantité totale d'articles 
        // dans le panier ainsi que le prix total après modification.
        productTotal();
        priceTotal();
      })
  }
}

// Je crée une fonction pour supprimer des articles du panier.
deleteProduct = () => {
  const deleteItemBtn = document.querySelectorAll(".deleteItem");
  for (let i = 0; i < deleteItemBtn.length; i++) {
    deleteItemBtn[i].addEventListener("click", (event) => {
      event.preventDefault();
      // Je fais confirmer à l'utilisateur son intention de supprimer l'article sélectionné.
      if (confirm("Voulez-vous supprimer cet article du panier ? ") == true) {
       // L'ID et la couleur du produit sélectionné dans le localStorage
       // sont enregistré dans les variables suivantes.
        let deletedProductId = basket[i].id;
        let deletedProductColor = basket[i].color;
        // Le produit cliqué par le bouton supprimer est filtré par son ID ou sa couleur.
        basket = basket.filter(item => item.id !== deletedProductId || item.color !== deletedProductColor);
        // Les nouvelles données sont envoyées au localStorage en étant changées en chaîne de caractères.
        localStorage.setItem("localBasket", JSON.stringify(basket));
        // La page est automatiquement rechargée pour ne plus afficher les produits supprimés.
        window.location.reload();
      }
    })
  }
}

// La fonction suivante me permet d'afficher le total des articles dans le panier.
productTotal = () => {
  const qty = document.querySelectorAll(".itemQuantity");
  let totalQty = 0;
  for (let i = 0; i < qty.length; i++) {
    // J'attribue à la variable value, la valeur de la classe .itemQuantity dans l'input.
    let value = qty[i].value;
    // La méthode parseInt renvoie un nombre entier de cette valeur.
    totalQty += parseInt(value);
  }
  // J'attribue la valeur de la variable totalQty retourné par la méthode parseInt
  // à L'ID #totalQuantity pour l'afficher dans le dom.
  document.querySelector("#totalQuantity").innerText = totalQty;
}
// La fonction suivante me permet d'afficher le prix total des articles dans le panier.
priceTotal = async () => {
  let totalPrice = 0;
  const qty = document.querySelectorAll(".itemQuantity");
  for (let i = 0; i < basket.length; i++) {
    // Je met dans la variable item, le produit sélectionné par la boucle d'incrémentation "for" dans l'API.
    let item = basket[i];
    // La méthode await met le code en pause pendant que la fonction getProductDatas récupère les données
    // du produit sélectionné par son ID, depuis l'API.
    productData = await getProductDatas(item.id);
    // Je met dans la variable totalPrice le produit de la multiplication des articles avec leur prix.
    totalPrice += qty[i].value * productData.price;
  }
  // Le résultat du produit est ensuite injecté dans le dom par l'ID #totalPrice.
  document.querySelector("#totalPrice").innerHTML = totalPrice;
}






//////////////////////////   Contrôle de validité et envoi du formulaire avec un post request   ////////////////////////////////

// J'assigne une variable à chaque élément du HTML concernés avec querySelector.

const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const address = document.querySelector("#address");
const city = document.querySelector("#city");
const email = document.querySelector("#email");

const firstNameErr = document.querySelector("#firstNameErrorMsg");
const lastNameErr = document.querySelector("#lastNameErrorMsg");
const addressErr = document.querySelector("#addressErrorMsg");
const cityErr = document.querySelector("#cityErrorMsg");
const emailErr = document.querySelector("#emailErrorMsg");

// J'établis des regex pour le contrôle des champs.
const cityNameRegEx = /^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$/;
const addressRegEx = /^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)*$/;
const emailRegEx = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

// La fonction suivante permet de vérifier la validité des informations
// rentrées par l'utilisateur dans les champs du formulaire.
formControl = () => {

  const testFormFields = (name, regEx, error) => {
    if ((name.value).match(regEx)) {
      error.innerHTML = "";
    } else {
      error.innerHTML = "Le format de saisie est incorrect";
      return false;
    }
  };
// Je met un event change dans la méthode addeventlistener pour qu'un éventuel message d'erreur
// ne s'affiche que lorsque l'utilisateur a quitté le champ de saisi.
  firstName.addEventListener("change", () => {
    testFormFields(firstName, cityNameRegEx, firstNameErr);
  });
  lastName.addEventListener("change", () => {
    testFormFields(lastName, cityNameRegEx, lastNameErr);
  });
  address.addEventListener("change", () => {
    testFormFields(address, addressRegEx, addressErr);
  });
  city.addEventListener("change", () => {
    testFormFields(city, cityNameRegEx, cityErr);
  });
  email.addEventListener("change", () => {
    testFormFields(email, emailRegEx, emailErr);
  });
}

formControl();

// La fonction suivante permet de vérifier s'il n'y a pas de champs vides ou d'erreurs dans le formulaire
// ou si le panier n'est pas vide.

const orderBtn = document.querySelector("#order");

orderBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (firstName.value == "" || lastName.value == "" || address.value == "" || city.value == "" || email.value == "") {
    alert("Veuillez remplir tous les champs du formulaire");
  }
  else if (firstNameErr.innerHTML !== "" || lastNameErr.innerHTML !== "" || addressErr.innerHTML !== "" || cityErr.innerHTML !== "" || emailErr.innerHTML !== "") {
    alert("Veuillez vérifier les erreurs dans le formulaire");
  }
  else if (basket === null || basket == 0) {
    alert('Votre panier est vide, veuillez choisir un article');
    window.location.href = "index.html";
  }
  else if (confirm("Confirmez-vous votre commande ? ") == true) {

    let basketItems = [];

    for (let i = 0; i < basket.length; i++) {
      basketItems.push(basket[i].id);
    }
// Les informations du formulaire et les produits sélectionnés sont récupérés
// dans l'objet order.    
    let order = {
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value
      },
      products: basketItems
    };
// Les données de l'objet order sont envoyées au serveur avec la méthode post.
    const options = {
      method: 'POST',
      body: JSON.stringify(order),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    fetch('http://localhost:3000/api/products/order', options)
      .then(res => res.json())
      .then(data => {
        localStorage.clear();

        // La propriété window.location.href avec l'url confirmation.html nous redirige vers cette 
        // dernière si la commande est réussi. On passe l'id de commande en valeur de la variable
        // ?orderId dans la chaîne de requête. La réponse du post nous renvoi un numéro de commande 
        // qui sera affiché dans la page confirmation.html.
        window.location.href = "confirmation.html?orderId=" + data.orderId;

      })
      .catch(error => {
        alert(error);
      })
  }
  else {
    return false;
  }
})













