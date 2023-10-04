"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// check-stock-price.ts
var check_stock_price_exports = {};
__export(check_stock_price_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(check_stock_price_exports);
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
var handler = async (event) => {
  const stock_price = getRandomInt(100);
  return {
    statusCode: 200,
    body: `{"stock_price": ${stock_price}}`
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
