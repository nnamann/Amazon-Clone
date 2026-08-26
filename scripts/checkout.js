import {renderOrderSummary} from "./checkout/orderSummary.js";
import {renderPaymentSummary} from "./checkout/paymentSummary.js";
import { loadPage } from "./load.js";


await loadPage();
renderOrderSummary();
renderPaymentSummary();
