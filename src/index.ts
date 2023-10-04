import { config } from 'dotenv';
import { resolve } from 'path';
import express, { Request, Response } from 'express';
import { getConfig } from "./temporal/config";
import bodyParser from "body-parser";
import filepath from 'path';

const path = process.env.NODE_ENV === 'production'
    ? resolve(__dirname, '../.env.production')
    : resolve(__dirname, '../.env.development');

config({ path });

const configObj = getConfig();
console.log(process.env.NODE_ENV);

import { approveSignalWorkflow, runWorkflow } from "./temporal/caller";

// express handler for GET /
const app = express();

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const staticFilesPath = filepath.resolve(__dirname, 'build');
app.use(express.static(staticFilesPath));

const port = process.env.PORT || 3000;

app.get('/serverinfo', (req, res) => {

    const serverconfig = {
        address: configObj.address,
        namespace: configObj.namespace,
        url: '',
        api: configObj.apiAddress,
    }

    // if address ends in .tmprl.cloud:7233
    if (serverconfig.address.endsWith('.tmprl.cloud:7233')) {
        // strip port from address
        serverconfig.url = `https://cloud.temporal.io/namespaces/${serverconfig.namespace}/workflows`;
    }

    res.json(serverconfig);
});

// runWorkflow API
app.get('/', async (req: Request, res: Response) => {
    res.send(
        `<a href="/runWorkflow">Run Workflow</a> <br/><br/>` +
        `<a href="/serverinfo">Server Config</a>`
    );
});

// runWorkflow API
app.get('/runWorkflow', async (req: Request, res: Response) => {

    const transactionId = await runWorkflow(configObj);

    console.log(`Started workflow: ${transactionId}`);

    res.send(
        `Started workflow: ${transactionId} <br/><br/>` +
        `<a href="/approve?id=${transactionId}">Approve</a>`
    );
});

app.get('/runBatch', async (req: Request, res: Response) => {

    // if GET variable 'n' is an integer then set, otherwise default to 1
    const n = parseInt(req.query.n as string) || 1;

    const transactionIds = [];

    // run n times
    for (let i = 0; i < n; i++) {
        console.log(`run ${i} of ${n}`);
        const transactionId = await runWorkflow(configObj);
        transactionIds.push(transactionId);
    }

    res.send({
        transactionIds: transactionIds
    });
});

app.get('/approve', async (req: Request, res: Response) => {

    const id = req.query.id as string || '';

    await approveSignalWorkflow(configObj, id);

    res.send(
        `Approved transaction ${id}`
    );
});

app.listen(port, () => {

    console.log(`Example app listening at http://localhost:${port}/runWorkflow`);
    console.log(`API location is ${configObj.apiAddress}`);
    console.log(`\nEnsure you run workers with 'npm run worker'`);
});