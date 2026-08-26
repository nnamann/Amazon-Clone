import { formatPrice } from "../scripts/utils/money.js";

describe('test suite : formatCurrency', () => {
  it('converts cents into dollars', () => {
    expect(formatPrice(2095)).toEqual('20.95');
  });

  it('works with 0', ()=>{
    expect(formatPrice(0)).toEqual('0.00');
  });
  it('rounds upto nearest cent', ()=> {
    expect(formatPrice(2000.5)).toEqual('20.01')
  });
});