import * as wf from '@temporalio/workflow';
import { StockPriceResultObj, StockTransaction } from './interfaces';

import type * as activities from './activities';

const { checkStockPrice, generateBuySellRecommendation,
  sellStock, buyStock } = wf.proxyActivities<typeof activities>({
    startToCloseTimeout: '5 seconds',
    retry: {
    }
  });

export const approveSignal = wf.defineSignal('approve');

/** Temporal Version of AWS Step Functions example: 
 * https://docs.aws.amazon.com/step-functions/latest/dg/sample-lambda-orchestration.html */
export async function stockTradingWorkflow(): Promise<StockTransaction> {
  let isApproved = false;

  let result: StockTransaction = {
    id: '',
    price: '',
    type: 'sell',
    qty: '',
    timestamp: ''
  };

  wf.setHandler(approveSignal, () => void (isApproved = true));

  const stockPrice: StockPriceResultObj = await checkStockPrice();
  wf.log.info(`Retrieved a stock price: ${JSON.stringify(stockPrice)}`);

  const buyOrSellRecommendation = await generateBuySellRecommendation(stockPrice.stock_price);
  wf.log.info(`Got recommendation based on price: ${buyOrSellRecommendation}`)

  wf.log.info('Waiting on human approval for recommendation.');

  // The workflow will block here until an approve signal is received
  await wf.condition(() => isApproved);
  wf.log.info('Recommendation Approved.');

  wf.log.info(`${buyOrSellRecommendation}ing stock`);
  if (buyOrSellRecommendation === 'sell') {
    const sellStockData: StockTransaction = await sellStock(stockPrice.stock_price);
    wf.log.info(JSON.stringify(sellStockData));

    result = sellStockData;
  } else {
    const buyStockData: StockTransaction = await buyStock(stockPrice.stock_price);
    wf.log.info(JSON.stringify(buyStockData));

    result = buyStockData;
  }

  return result;

}