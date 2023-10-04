import { Client, Connection, WorkflowFailedError, WorkflowNotFoundError } from '@temporalio/client';
import fs from 'fs-extra';
import { TASK_QUEUE_WORKFLOW } from './config';
import { v4 as uuidv4 } from 'uuid';
import { stockTradingWorkflow } from './workflows';
import { ConfigObj } from './config';
import { getCertKeyBuffers } from './certificate_helpers';
import { getDataConverter } from './data-converter';
import { approveSignal } from './workflows';

async function createClient(config: ConfigObj): Promise<Client> {

  const { cert, key } = await getCertKeyBuffers(config);

  // todo make this meaningful
  const { NODE_ENV = 'production' } = process.env;
  let isDeployed = ['production', 'staging'].includes(NODE_ENV);

  let connectionOptions = {};

  // if cert and key are null
  if (cert === null && key === null) {
    connectionOptions = {
      address: config.address
    };
  }
  else {
    connectionOptions = {
      address: config.address,
      tls: {
        clientCertPair: {
          crt: cert,
          key: key,
        },
      },
    };
  }

  console.log(`About to connect to Temporal server... ${config.address}`);

  const connection = await Connection.connect(connectionOptions);

  const client = new Client({
    connection,
    namespace: config.namespace,
    // dataConverter: await getDataConverter(), // enable for encrypted payloads
  });

  return client;
}

export async function runWorkflow(config: ConfigObj): Promise<String> {

  const client = await createClient(config);

  const transactionId = 'StockTrading-' + uuidv4();

  // start() returns a WorkflowHandle that can be used to await the result
  const handle = await client.workflow.start(stockTradingWorkflow, {
    // type inference works! args: [name: string]
    args: [],
    taskQueue: TASK_QUEUE_WORKFLOW,
    // in practice, use a meaningful business ID, like customerId or transactionId
    workflowId: transactionId
  });

  // don't wait for workflow to finish
  // let result = await handle.result()
  // console.log(result); // Hello, Temporal!

  await client.connection.close();

  return transactionId;

}

export async function approveSignalWorkflow(config: ConfigObj, id: string): Promise<void> {

  const client = await createClient(config);

  // start() returns a WorkflowHandle that can be used to await the result
  const handle = await client.workflow.getHandle(id);

  // don't wait for workflow to finish
  // let result = await handle.result()
  // console.log(result); // Hello, Temporal!
  try {
    await handle.signal(approveSignal);
    console.log('Approve signal sent');
  } catch (e: unknown) { // Explicitly annotate e as unknown
    if (e instanceof Error) { // Narrow down the type to Error
      if ('name' in e && e.name === 'WorkflowNotFoundError') {
        console.log('Caught WorkflowNotFoundError:', e.message);
      } else {
        console.log('An unexpected error occurred:', e.message);
      }
    } else {
      console.log('An error of an unknown type occurred:', e);
    }
  }



  await client.connection.close();

}