import { cart,saveToStorage } from "../../data/cart.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { getProduct } from "../../data/products.js";
import { formatPrice } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary(){
  
  let productPriceCents=0;
  let shippingPriceCents=0;
  let totalCartQuantity=0;

  cart.forEach((cartItem)=>{
    const product= getProduct(cartItem.productId);
    const deliveryOption= getDeliveryOption(cartItem.deliveryOptionId);
    productPriceCents += cartItem.quantity * product.priceCents;
    shippingPriceCents +=  deliveryOption.priceCents;
    totalCartQuantity +=cartItem.quantity;
  });
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents= totalBeforeTaxCents*0.1;
  const totalCents= totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML= `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${totalCartQuantity}):</div>
      <div class="payment-summary-money">$${formatPrice(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatPrice(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatPrice(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatPrice(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatPrice(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order-button">
      Place your order
    </button>
  `
  
  document.querySelector('.js-payment-summary').innerHTML=paymentSummaryHTML;
  
  document.querySelector('.js-place-order-button').addEventListener('click', async ()=>{
    try{
      const response = await fetch('https://supersimplebackend.dev/orders', {
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cart: cart
      })
    });

    const order = await response.json();
    addOrder(order);
    //cart value updation
    cart.length=0;
    saveToStorage();
    window.location.href='orders.html'

    }
    catch(error){
      console.log('Unexpected Error!!! Try again Later.')
      console.log(error);
    }
  });
}

