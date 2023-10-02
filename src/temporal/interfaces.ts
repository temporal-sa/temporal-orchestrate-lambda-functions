export interface WorkflowParameterObj {
    amountCents: number;
}

export interface ResultObj {
    result: String;
}

export interface StateObj {
    progressPercentage: number;
    transferState: string;
    workflowStatus?: string;
}