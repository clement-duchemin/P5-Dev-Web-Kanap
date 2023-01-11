// La variable orderId, qui contient l'url confirmation.html avec l'id de commande en paramètre,
// est injectée dans la balise html dont l'id est "orderId" pour afficher le message commande validée
// avec le numéro de commande.

let params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");
document.getElementById("orderId").innerHTML += `${orderId}`;

