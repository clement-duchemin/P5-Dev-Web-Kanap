

const paramSearch = new URLSearchParams(window.location.search);
const id = paramSearch.get('id');
console.log(id);

//const url = `http://localhost:3000/api/products/${id}`;


fetchProductDatas = () => {
    fetch(`http://localhost:3000/api/products/${id}`)
    .then(res => res.json())
    .then( data => {
        console.log(data);
        displayProductData(data);
        })
    .catch(error => {
            console.log("Une erreur s'est produite : " + error);
})
}
fetchProductDatas();

displayProductData = (data) => {
    document.querySelector(".item__img").innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}" />` ;
    document.querySelector("#title").innerText = `${data.name}`;
    document.querySelector("#price").innerText = `${data.price}`;
    document.querySelector("#description").innerText = `${data.description}`;
    for (let color of data.colors) {
        let option = document.createElement("option");
        option.value = color;
        option.innerHTML = color;
        document.querySelector("#colors").appendChild(option);
    }
}

