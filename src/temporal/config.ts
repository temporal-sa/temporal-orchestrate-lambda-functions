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

export const TASK_QUEUE_WORKFLOW = 'OrchestrateLambda'