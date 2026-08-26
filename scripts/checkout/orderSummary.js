import {cart, saveToStorage, updateCartQuantity, deliveryOptionUpdate} from '../../data/cart.js'
import { products } from '../../data/products.js'
import { formatPrice } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary()
{
  let cartSummaryHTML='';

  cart.forEach((cartItem)=> {
  const productId= cartItem.productId;

  let matchingProduct = products.find(
    product => product.id === productId);

  //to find the correct delivery date
  const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

  const today= dayjs();
  const deliveryDate= today.add(deliveryOption.deliveryDays, 'days');

  const dateString= deliveryDate.format('dddd, MMMM D');

  cartSummaryHTML+=`
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatPrice(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity product-quantity-${matchingProduct.id}">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link js-update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
              Update
            </span>
            

            <input type="number" min="0" step="1" value="${cartItem.quantity}" class="quantity-input js-quantity-input-${matchingProduct.id}">
            <span class="save-quantity-link js-save-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Save
            </span>

            <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `
});

document.querySelector('.js-order-summary').innerHTML= cartSummaryHTML;
setupDeleteButtons();
setupUpdateButtons();
setupSaveButtons();
setupDeliveryOptionButtons();
document.querySelector('.js-return-to-home-link').innerHTML= `${updateCartQuantity() } items`;
}


function deliveryOptionsHTML(matchingProduct, cartItem){

  let html='';

  deliveryOptions.forEach((deliveryOption)=>{
    const today= dayjs();
    const deliveryDate= today.add( deliveryOption.deliveryDays, 'days');

    const dateString= deliveryDate.format('dddd, MMMM D');
    
    const priceString= deliveryOption.priceCents===0?
      'FREE':
      `$${formatPrice(deliveryOption.priceCents)} -`;

    const isChecked= deliveryOption.id===cartItem.deliveryOptionId;
    
    html+=
      `
        <div class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked?'checked': ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `
  });
  return html;
}


function setupDeleteButtons(){
  document.querySelectorAll('.js-delete-quantity-link')
  .forEach((link)=>{
    link.addEventListener('click', ()=> {
      removeCartItem(link.dataset.productId)
      }
    );
  });
}

function removeCartItem(productId)
{
  let index= cart.findIndex((item)=> item.productId===productId)
  if(index!==-1)
    cart.splice(index,1);
  saveToStorage();
  document.querySelector(`.js-cart-item-container-${productId}`).remove();
  document.querySelector('.js-return-to-home-link').innerHTML= `${updateCartQuantity()} items`;
  renderPaymentSummary();
}


function setupSaveButtons(){
  document.querySelectorAll('.js-save-quantity-link')
  .forEach((link)=>{
    link.addEventListener('click', ()=> {
      updateQuantityValue(link.dataset.productId);
      }
    );
  });
}

function setupUpdateButtons(){
  document.querySelectorAll('.js-update-quantity-link')
  .forEach((link)=>{
    link.addEventListener('click', ()=> {
      startEditing(link.dataset.productId)
      }
    );
  });
}

function startEditing(productId)
{
  const itemContainer= document.querySelector(`.js-cart-item-container-${productId}`);
  itemContainer.classList.add('is-editing');
}

function stopEditing(productId){
  const itemContainer= document.querySelector(`.js-cart-item-container-${productId}`);
  itemContainer.classList.remove('is-editing');
}

function updateQuantityValue(productId){
    let itemToUpdate= cart.find((item)=> item.productId===productId);

  const quantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);
  
  if(Number.isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
    alert('Please enter a valid whole number.');
  } 
  else if(quantity === 0){
    removeCartItem(productId);
    return
  }
  else{
    itemToUpdate.quantity = quantity;
  }


  document.querySelector('.js-return-to-home-link').innerHTML= `${updateCartQuantity()} items`;
  document.querySelector(`.js-quantity-label-${productId}`).textContent= quantity;
  saveToStorage();
  stopEditing(productId);
  renderPaymentSummary()
}

function setupDeliveryOptionButtons() {
  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const { productId, deliveryOptionId } = element.dataset;

        deliveryOptionUpdate(productId, deliveryOptionId);

        renderOrderSummary();
        renderPaymentSummary();
      });
    });
}



