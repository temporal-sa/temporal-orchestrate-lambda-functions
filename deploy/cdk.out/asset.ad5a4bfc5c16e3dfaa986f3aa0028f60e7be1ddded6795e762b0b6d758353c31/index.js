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

// generate-buy-sell-recommend.ts
var generate_buy_sell_recommend_exports = {};
__export(generate_buy_sell_recommend_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(generate_buy_sell_recommend_exports);
var handler = async (event) => {
  const body = JSON.parse(event.body);
  const { stock_price } = body;
  console.log(`stock_price: ${stock_price}`);
  const recommendation = stock_price > 50 ? "sell" : "buy";
  return {
    statusCode: 200,
    body: recommendation
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
