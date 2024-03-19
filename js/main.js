// SPA 
async function getTemplates(id) {
    try {
        const response = await (await fetch(`templates/${id}.html`)).text();
        document.querySelector('main').innerHTML = response;
    } catch (error) {
        console.log(error);
    }
}

function changeURL() {
    const hash = window.location.hash;
    const url = hash.substring(1);
    getTemplates(url);
    getModulesJS(url);
    getCards();
}

window.addEventListener('hashchange', changeURL);

getTemplates('home');

const loadedScripts = {};

function getModulesJS(id) {
    try {
        const scriptUrl = `js/modules/${id}.js`;

        // Verificar si el script ya ha sido cargado
        if (loadedScripts[scriptUrl]) {
            return;
        }

        const scriptElement = document.createElement('script');
        scriptElement.src = scriptUrl;
        document.querySelector('body').appendChild(scriptElement);

        // Registrar el script cargado
        loadedScripts[scriptUrl] = true;
    } catch (error) {
        console.log(error);
    }
}

// nav toggle
const btnNav = document.querySelector('.btn-nav');
const nav = document.querySelector('nav');
btnNav.addEventListener('click', () => {
    if (!nav.classList.contains('nav-active')) {
        nav.classList.add('nav-active');
    } else {
        nav.classList.remove('nav-active');
    }
})

//cart
const btnCart = document.querySelector('.btn-cart');
const modalContainer = document.querySelector('.cart-modal-container');
// console.log(btnCart);

let modalVisible = false;
btnCart.addEventListener('click', function () {
    if (modalVisible) {
        console.log('Cerrar carrito');
        closeModal();
    } else {
        console.log('Abrir carrito');
        btnCart.classList.add('btn-cart-active');
        modalContainer.classList.add('cart-modal-container-active');
        modalVisible = true;
    }
});

const closeModal = () => {
    btnCart.classList.remove('btn-cart-active');
    modalContainer.classList.remove('cart-modal-container-active');
    modalVisible = false;
}

const closeModalClick = () => window.addEventListener('click', e => {
    if (!e.target.closest('.cart-modal-container') && !e.target.closest('.btn-cart') && modalVisible == true) {
        closeModal();
        return;
    }
})
// closeModalClick();

window.addEventListener('keydown', function (e) {
    // console.log(e);
    console.log(e.key);
    if (e.key === 'Escape') {
        closeModal();
        console.log('Cerrar modal');
    }
});

modalContainer.addEventListener('click', e => {
    if (e.target.classList.contains('btn-clear-product')) {
        console.log(e.target);
        console.log('Botón de eliminar presionado');
        return;
    }
    if (e.target.classList.contains('btn-close-modal')) {
        closeModal();
        return;
    }
})

//title change
const title = document.getElementsByTagName('title')[0];
title.textContent = title.textContent + ' - ' + 'Manuel Alejandro Rodríguez Guerra' + ' - ' + 'Proyecto Integrador: Juguetería Cósmica';

// cards
async function getCards() {
    try {
        const templateCards = await (await fetch('templates/cards.hbs')).text();
        const cardsArray = await (await fetch('api/products.json')).json();
        const template = Handlebars.compile(templateCards);
        const container = document.querySelector('.products-container');
        for (let i = 0; i < cardsArray.length; i++) {
            container.innerHTML = container.innerHTML + template(cardsArray[i]);
        }
    } catch (error) {
        console.log(error);
    }
}
getCards();

//products cart
let allProduct = [];
const totalPrice = document.querySelector('.totalPrice');

const containerCart = document.querySelector('main');
containerCart.addEventListener('click', e => {
    if (e.target.classList.contains('card-link')) {
        const product = e.target.parentElement;

        const infoProduct = {
            title: product.querySelector('h3').textContent,
            price: product.querySelectorAll('p')[1].textContent,
            quantity: 1
        };
        const exist = allProduct.some(product => product.title === infoProduct.title);
        if (exist){
            const products = allProduct.map(product => {
                if(product.title === infoProduct.title){
                    product.quantity++;
                    return product;
                } else {
                    return product;
                }
            });
            allProduct = [...products]
        } else {
            allProduct = [...allProduct, infoProduct];
        }

        showCartHtml();
    }
});

document.querySelector('tbody').addEventListener('click', e => {
    if (e.target.classList.contains('btn-clear-product')){
        const product = e.target.parentElement.parentElement;
        // console.log(product)
        const title = product.querySelector('td').textContent
        // console.log(title)
        
        allProduct = allProduct.filter(
            product => product.title !== title
        );
        console.log(allProduct);
        showCartHtml();
    }
});

// show product cart
const showCartHtml = () => {
    //clean html 
    document.querySelector('tbody').innerHTML = '';
    let total = 0;

    allProduct.forEach(product => {
        const containerProduct = document.createElement('tr');
        containerProduct.innerHTML = `

        <td colspan = "2">${product.title}</td>
        <td>${product.price}</td>
        <td>${product.quantity}</td>
        <td></td>
        <td><button class="btn-clear-product">X</button></td>
        
        `
        document.querySelector('tbody').append(containerProduct);

        total = total + parseInt(product.quantity * product.price.slice(1));
    })
    totalPrice.innerHTML = `$${total}`; 
}  
