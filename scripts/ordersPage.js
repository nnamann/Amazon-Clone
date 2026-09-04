import { orders } from "../data/orders.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { formatPrice } from "./utils/money.js";
import { getProduct } from "../data/products.js";
import { loadPage } from "./load.js";
import { addToCart, updateCartQuantity } from "../data/cart.js";

function renderOrdersPage(){
  let HTML='';

  orders.forEach((order)=>{
    HTML+=
    `<div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${dayjs(order.orderTime).format("MMMM D")}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatPrice(order.totalCostCents)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div>
    `;  //the order header was added

    HTML+= `<div class="order-details-grid">`; 
    order.products.forEach((product)=>{
      //individual product html is added
      
      let matchingProduct= getProduct(product.productId);

      HTML+=
        `<div class="product-image-container">
          <img src="${matchingProduct.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${dayjs(product.estimatedDeliveryTime).format("MMMM D")}
          </div>
          <div class="product-quantity">
            Quantity: ${product.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.productId}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.productId}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>`;
    
    });
    HTML+=
      ` </div>
      </div>`; 

  });

  document.querySelector('.js-orders-grid').innerHTML = HTML || 'MAKE ORDERS TO DISPLAY!!!';
  document.querySelector('.js-cart-quantity').innerHTML= updateCartQuantity();
  setupBuyAgainButton();
  setupSearchBar();
}

function setupBuyAgainButton(){
  document.querySelectorAll('.js-buy-again').forEach((button)=>{
    button.addEventListener('click', ()=>{
      addToCart(button.dataset.productId);
      document.querySelector('.js-cart-quantity').innerHTML= updateCartQuantity();
    });
  });
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
renderOrdersPage();