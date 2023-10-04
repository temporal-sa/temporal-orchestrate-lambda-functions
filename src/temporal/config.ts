export interface ConfigObj {
    certPath: string,
    keyPath: string,
    certContent: string,
    keyContent: string,
    address: string,
    namespace: string,
    prometheusAddress: string,
    apiAddress: string,
}

// function that returns a ConfigObj with input environment variables
export function getConfig(): ConfigObj {
    return {
        certPath: process.env.CERT_PATH || '',
        keyPath: process.env.KEY_PATH || '',
        certContent: process.env.CERT_CONTENT || '',
        keyContent: process.env.KEY_CONTENT || '',
        address: process.env.ADDRESS || 'localhost:7233',
        namespace: process.env.NAMESPACE || 'default',
        prometheusAddress: process.env.PROMETHEUS_ADDRESS || '',
        apiAddress: process.env.API_ADDRESS || '',
    }
}

// this is a convenience function and needs to be more robust :)
export function getServerUrl(config: ConfigObj): string {
    // if address ends in .tmprl.cloud:7233
    if (config.address.endsWith('.tmprl.cloud:7233')) {
        // strip port from address
        return `https://cloud.temporal.io/namespaces/${config.namespace}/workflows`;
    }
    // if server is local then assume http
    if (config.address.startsWith('localhost') || config.address.startsWith('127.0.0.1')) {
        if(config.address == 'localhost:7233') {
            // catering for temporal server start-dev
            return `http://localhost:8233/namespaces/${config.namespace}/workflows`;
        }
        return `http://${config.address}/namespaces/${config.namespace}/workflows`;
    }
    // otherwise assume https
    else {
        return `https://${config.address}/namespaces/${config.namespace}/workflows`;
    }
}

export const TASK_QUEUE_WORKFLOW = 'OrchestrateLambda'