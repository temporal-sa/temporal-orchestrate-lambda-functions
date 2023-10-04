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

// buy-stock.ts
var buy_stock_exports = {};
__export(buy_stock_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(buy_stock_exports);
var crypto = require("crypto");
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
var handler = async (event) => {
  const body = JSON.parse(event.body);
  const { stock_price } = body;
  var date = /* @__PURE__ */ new Date();
  let transaction_result = {
    "id": crypto.randomBytes(16).toString("hex"),
    // Unique ID for the transaction
    "price": stock_price.toString(),
    // Price of each share
    "type": "buy",
    // Type of transaction(buy/ sell)
    "qty": getRandomInt(10).toString(),
    // Number of shares bought / sold(We are mocking this as a random integer between 1 and 10)
    "timestamp": date.toISOString()
    // Timestamp of the when the transaction was completed
  };
  return {
    statusCode: 200,
    body: JSON.stringify(transaction_result)
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
