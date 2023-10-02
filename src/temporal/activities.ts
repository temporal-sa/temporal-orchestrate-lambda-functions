import { getConfig } from './config';
import { config } from 'dotenv';
import { resolve } from 'path';

const path = process.env.NODE_ENV === 'production'
  ? resolve(__dirname, './../.env.production')
  : resolve(__dirname, './../.env.development');

config({ path });

const configObj = getConfig();

export async function createCharge(idempotencyKey: string,
  amountCents: number): Promise<string> {

  return "dummy-charge-ID";

}
