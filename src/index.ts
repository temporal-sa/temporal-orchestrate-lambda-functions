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

const configtest = getConfig();
console.log(process.env.NODE_ENV);
console.log(configtest.certPath);

// TEMPORARY: Allow CORS for all origins
import cors from 'cors';
import { runWorkflow } from "./temporal/caller";

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

app.get('/health', (req, res) => {
    res.send(`OK`);
});

app.get('/serverinfo', (req, res) => {

    const serverconfig = {
        address: configtest.address,
        namespace: configtest.namespace,
        url: ''
    }

    // if address ends in .tmprl.cloud:7233
    if (serverconfig.address.endsWith('.tmprl.cloud:7233')) {
        // strip port from address
        serverconfig.url = `https://cloud.temporal.io/namespaces/${serverconfig.namespace}/workflows`;
    }

    res.json(serverconfig);
});

// runWorkflow API
app.get('/runWorkflow', async (req: Request, res: Response) => {

    const configObj = getConfig();

    const transactionId = await runWorkflow(configObj);

    console.log(`Started workflow: ${transactionId}`);

    res.send({
        transactionId: transactionId
    });
});

app.get('/testConnect', async (req: Request, res: Response) => {

    // if GET variable 'n' is an integer then set, otherwise default to 1
    const n = parseInt(req.query.n as string) || 1;

    const configObj = getConfig();

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

app.listen(port, () => {
    const configObj = getConfig();
    console.log(`Example app listening at http://localhost:${port}/runWorkflow`);
    console.log(`API location is ${configObj.apiAddress}`);
    console.log(`\nEnsure you run workers with 'npm run worker'`);
});