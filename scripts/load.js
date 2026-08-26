import { loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";

export async function loadPage() {
  try
  {
    await loadProductsFetch();

    await new Promise((resolve)=>{
      loadCart(resolve);
    });
  }
  catch(error){
    console.log(error)
    console.log("An error was encountered. Please try again later!!!")
  }
}
