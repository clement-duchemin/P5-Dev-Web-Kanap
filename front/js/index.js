// Url to get datas from the API


//Get all product from server 

let fetchProducts = () => {
    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            listProducts(data);
        })
        .catch(error => {
            console.log("Une erreur s'est produite : " + error);
        })
}
fetchProducts();

let listProducts = (data) => {
    for (product of data){
        const productItem = document.getElementById("items");
        productItem.innerHTML += `<a href="./product.html?id=${product._id}">
                                        <article>
                                        <img src="${product.imageUrl}" alt="${product.altTxt}">
                                        <h3 class="productName">${product.name}</h3>
                                        <p class="productDescription">${product.description}</p>
                                        </article>
                                  </a>`
    }

}