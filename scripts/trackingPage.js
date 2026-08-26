import { getOrder } from "../data/orders.js"
import { getProduct } from "../data/products.js"
import { loadPage } from "./load.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

function renderTrackingPage(){

  const url= new URL(window.location.href)
  console.log(url)

  const matchingOrder= getOrder(url.searchParams.get('orderId'))
  const productId= url.searchParams.get('productId');
  const matchingProduct= getProduct(productId);
  const orderedProduct=  matchingOrder.products.find((product) => product.productId === productId);
  const deliveryTime= orderedProduct.estimatedDeliveryTime;

  const deliveryProgress = Math.min(
    100,
    Math.max(0,
      ((dayjs().valueOf() - dayjs(matchingOrder.orderTime).valueOf()) /
        (dayjs(deliveryTime).valueOf() - dayjs(matchingOrder.orderTime).valueOf()))* 100));

  document.querySelector('.js-order-tracking').innerHTML=
    ` <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        Arriving on ${dayjs(deliveryTime).format("MMMM D")}
      </div>

      <div class="product-info">
        ${matchingProduct.name}
      </div>

      <div class="product-info">
        Quantity: ${orderedProduct.quantity}
      </div>

      <img class="product-image" src="${matchingProduct.image}">

      <div class="progress-labels-container">
        <div class="progress-label preparing">
          Preparing
        </div>
        <div class="progress-label shipped">
          Shipped
        </div>
        <div class="progress-label delivered">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar"></div>
      </div>
    `;
  
  document.querySelector('.progress-bar').style.width= `${deliveryProgress}%`
  
  if(deliveryProgress<50)
    document.querySelector('.preparing').style.color= 'green';
  else if(deliveryProgress<100)
    document.querySelector('.shipped').style.color= 'green';
  else
    document.querySelector('.delivered').style.color= 'green';
  
  setupSearchBar();
}


function setupSearchBar(){
  document.querySelector('.js-search-button').addEventListener('click',()=>{renderSearchResults()});

  document.querySelector('.js-search-bar').addEventListener('keydown', (event)=> {
    if(event.key==="Enter")
      renderSearchResults()
    });
}

function renderSearchResults(){

  const search= document.querySelector('.js-search-bar').value.toLowerCase();

  if(search)
    window.location.href = `amazon.html?search=${encodeURIComponent(search)}`;
  else
    window.location.href = `amazon.html`;
}


await loadPage();
renderTrackingPage();