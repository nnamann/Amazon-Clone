import {cart, addToCart, updateCartQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import { loadPage } from './load.js';
import { formatPrice } from './utils/money.js';

await loadPage();

function setupHomepage(){

  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');
  if(search){
    document.querySelector('.js-search-bar').value = search;
  }

  let productHTML ='';

  products.forEach((product) => {
    if (!search ||
    product.name.toLowerCase().includes(search) 
    ||
    product.keywords.some((keyword) =>
      keyword.toLowerCase().includes(search))) 
       productHTML += generateProductHTML(product)
  });

  if(productHTML)  
    document.querySelector('.js-products-grid').innerHTML = productHTML;
  else
    document.querySelector('.main').innerHTML='No Products Matched Your Search.'
  document.querySelector('.js-cart-quantity').innerHTML= `${updateCartQuantity()}`;

  setupAddToCart();
  setupSearchBar();
}

function generateProductHTML(product){
  return ` <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src= "${product.getStarsURL()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${product.getPrice()}
      </div>

      <div class="product-quantity-container">
        <select class="quantity-selector js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      ${product.extraInfoHTML()}

      <div class="product-spacer"></div>

      <div class="added-to-cart added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart-button" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>`;
}

function displayAddedMessage(productId){
  //Displaying the added message
  const addedMessage= document.querySelector(`.added-to-cart-${productId}`);
  
  addedMessage.classList.add('added-visible');

  clearTimeout(addedMessageTimeouts[productId]);
  addedMessageTimeouts[productId] = setTimeout(() => {
    addedMessage.classList.remove('added-visible');
  }, 2000);
}

function setupAddToCart(){
    document.querySelectorAll('.js-add-to-cart-button')
    .forEach((button) => {
      button.addEventListener('click', ()=> {
        
        const productId = button.dataset.productId;
        
        const cartAdditionValue= Number(document.querySelector(`.js-quantity-selector-${productId}`).value)||1;

        addToCart(productId, cartAdditionValue);
        displayAddedMessage(productId);
        document.querySelector('.js-cart-quantity').innerHTML= `${updateCartQuantity()}`;
      });
  });
}


function setupSearchBar(){
  document.querySelector('.js-search-button').addEventListener('click',()=>{renderSearchResults()});

  document.querySelector('.js-search-bar').addEventListener('keydown', (event)=> {
    if(event.key==="Enter")
      renderSearchResults()
    });


    
    const searchBar = document.querySelector('.js-search-bar');
    const suggestionsBox = document.querySelector('.js-search-suggestions');

    document.querySelector('.js-search-bar').addEventListener('input', () => {renderSuggestions()});
}


function renderSuggestions()
{
  
  const searchBar = document.querySelector('.js-search-bar');
  const suggestionsBox = document.querySelector('.js-search-suggestions');

  const search = searchBar.value.toLowerCase().trim();

  if(!search){
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';
    return;
  }

  const matchingProducts = products.filter((product) => {

    return product.name.toLowerCase().includes(search)
      || product.keywords.some((keyword) =>
        keyword.toLowerCase().includes(search)
      );

  });

  suggestionsBox.innerHTML = '';

  matchingProducts.slice(0, 5).forEach((product) => {

    const suggestion = document.createElement('div');

    suggestion.classList.add('search-suggestion');

    suggestion.innerHTML = product.name;

    suggestion.addEventListener('click', () => {
      searchBar.value = product.name;
      suggestionsBox.style.display = 'none';
    });

    suggestionsBox.appendChild(suggestion);

  });

  if(matchingProducts.length > 0){
    suggestionsBox.style.display = 'block';
  } else {
    suggestionsBox.style.display = 'none';
  }

}

function renderSearchResults(){

  const search= document.querySelector('.js-search-bar').value.toLowerCase();

  if(search)
    window.location.href = `amazon.html?search=${encodeURIComponent(search)}`;
  else
    window.location.href = `amazon.html`;
}


const addedMessageTimeouts = {};
setupHomepage();