import fetch from 'node-fetch-commonjs';
import { getConfig } from './config';
import { config } from 'dotenv';
import { resolve } from 'path';

const path = process.env.NODE_ENV === 'production'
  ? resolve(__dirname, '../../.env.production')
  : resolve(__dirname, '../../.env.development');

config({ path });

const configObj = getConfig();

// calls a Lambda function
export const checkStockPrice = async (): Promise<any> => {
  console.log(`url is ${configObj.apiAddress}checkStockPrice`);
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await fetch(configObj.apiAddress + 'checkStockPrice', requestOptions);
  return response.json();
};

// calls a Lambda function
export const generateBuySellRecommendation = async (price: number): Promise<string> => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock_price: price })
  };
  const response = await fetch(configObj.apiAddress + 'generateBuySellRecommendation', requestOptions);
  return response.text();
};

// calls a Lambda function
export const sellStock = async (price: number): Promise<any> => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock_price: price })
  };
  const response = await fetch(configObj.apiAddress + 'sellStock', requestOptions);
  return response.json();
};

// calls a Lambda function
export const buyStock = async (price: number): Promise<any> => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock_price: price })
  };
  const response = await fetch(configObj.apiAddress + 'buyStock', requestOptions);
  return response.json();
};

