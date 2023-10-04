import * as wf from '@temporalio/workflow';
import { StockPriceResultObj, StockTransaction } from './interfaces';
import { defineQuery } from '@temporalio/workflow';

import type * as activities from './activities';

const { checkStockPrice, generateBuySellRecommendation,
  sellStock, buyStock } = wf.proxyActivities<typeof activities>({
    startToCloseTimeout: '5 seconds',
    retry: {
    }
  });

export const getStateQuery = defineQuery<StockTransaction>('getResult');
export const approveSignal = wf.defineSignal('approve');

/** A workflow that simply calls an activity */
export async function stockTradingWorkflow(): Promise<StockTransaction> {
  let isApproved = false;

  let result: StockTransaction = {
    id: '',
    price: '',
    type: 'sell',
    qty: '',
    timestamp: ''
  };

  wf.setHandler(getStateQuery, () => result);
  wf.setHandler(approveSignal, () => void (isApproved = true));

  const stockPrice: StockPriceResultObj = await checkStockPrice();

  wf.log.info(`stockPrice: ${JSON.stringify(stockPrice)}`);

  const buyOrSellRecommendation = await generateBuySellRecommendation(stockPrice.stock_price);

  wf.log.info(`buyOrSellRecommendation: ${buyOrSellRecommendation}`)

  wf.log.info('Waiting for approval');
  await wf.condition(() => isApproved);
  wf.log.info('Approved');

  if (buyOrSellRecommendation === 'sell') {
    const sellStockData:StockTransaction = await sellStock(stockPrice.stock_price);
    wf.log.info(JSON.stringify(sellStockData));
    result = sellStockData;
  } else {
    const buyStockData:StockTransaction = await buyStock(stockPrice.stock_price);
    wf.log.info(JSON.stringify(buyStockData));
    result = buyStockData;
  }

  return result;

}