import { formatPrice } from "../scripts/utils/money.js";


export function getProduct(productId){
  let matchingProduct = products.find(
    product => product.id === productId);
    return matchingProduct;
}



class Product {
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;

  constructor(productDetails){
  this.id= productDetails.id;
  this.image= productDetails.image;
  this.name= productDetails.name;
  this.rating= productDetails.rating;
  this.priceCents= productDetails.priceCents;
  this.keywords= productDetails.keywords;
  }

  getStarsURL(){
    return `images/ratings/rating-${this.rating.stars *10}.png`;
  }
  getPrice(){
    return `$${formatPrice(this.priceCents)}`;
  }

  extraInfoHTML(){
    return '';
  }
}


class Clothing extends Product{
  sizeChartLink;

  constructor(productDetails){
    super(productDetails);
    this.sizeChartLink= productDetails.sizeChartLink;
  }

  extraInfoHTML(){
    return `
      <a href="${this.sizeChartLink}" target="_blank">
        Size Chart
      </a>
    `
  }
}

class Appliance extends Product{
  instructionsLink;
  warrantyLink;

  constructor(productDetails){
    super(productDetails);
    this.warrantyLink= productDetails.warrantyLink;
    this.instructionsLink= productDetails.instructionsLink;
  }

  extraInfoHTML(){
    return `
      <a href="${this.instructionsLink}" target="_blank">
        Instructions
      </a>
      <a href="${this.warrantyLink}" target="_blank">
        Warranty
      </a>
    `
  }
}

export let products;

export function loadProductsFetch(){
  const promise= fetch('https://supersimplebackend.dev/products').then((response)=>{
    return response.json();
  })
  .then((productsData)=>{
    products= productsData.map((productDetails) => {
    if(productDetails.type ==='clothing')
      return new Clothing(productDetails);
    else if(productDetails.type === 'appliance')
      return new Appliance(productDetails);

    return new Product(productDetails);
    });
  }).catch((error)=> {
    alert(`An error was encountered!!!\n\nCheck your internet connection,\nor try again later.`);
    console.log(error);
  });
  console.log("load products => i was summoned")
  return promise;
}
