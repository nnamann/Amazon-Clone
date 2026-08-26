import {deliveryOptions} from './deliveryOptions.js'

export let cart =
  JSON.parse(localStorage.getItem('cart')) || []

export function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateCartQuantity(){
  let cartQuantity=0;      
  cart.forEach((cartItem) =>{
    cartQuantity +=cartItem.quantity;
  });
  
  return cartQuantity;
}

export function addToCart(productId, quantity=1){
  let matchingItem;
  //const cartAdditionValue= Number(document.querySelector(`.js-quantity-selector-${productId}`).value)||1;

  cart.forEach((cartItem)=>{
    if(productId===cartItem.productId)
        matchingItem=cartItem;   //the object refernce is copied
  })
  if(matchingItem)
    matchingItem.quantity+= quantity;
  else
  {
    cart.push({
      productId,
      quantity: quantity,
      deliveryOptionId: '1'
    });
  }
  saveToStorage();
}

export function deliveryOptionUpdate(productId, deliveryOptionId){
  let matchingItem= cart.find(item => item.productId===productId)
  
  matchingItem.deliveryOptionId= deliveryOptionId;
  saveToStorage();
}

export function loadCart(fun){
  const xhr= new XMLHttpRequest();

  xhr.addEventListener('load', ()=>{
    console.log(xhr.response)
    fun();
  });

  xhr.open('GET','https://supersimplebackend.dev/cart');
  xhr.send();
}