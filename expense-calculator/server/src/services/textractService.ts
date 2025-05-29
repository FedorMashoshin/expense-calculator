import { StartDocumentAnalysisCommand, GetDocumentAnalysisCommand, Block } from "@aws-sdk/client-textract";
import { textractClient } from "../config/textractClient";

export const analyzeDocument = async (bucketName: string, fileName: string) => {
    const startCommand = new StartDocumentAnalysisCommand({
        DocumentLocation: {
            S3Object: {
                Bucket: bucketName,
                Name: fileName
            }
        },
        FeatureTypes: ["TABLES"]
    });

    const { JobId } = await textractClient.send(startCommand);
    if (!JobId) throw new Error('No JobId returned from Textract');
    return JobId;
};

export const waitForJob = async (jobId: string, interval: number = 5000): Promise<void> => {
    while (true) {
        const command = new GetDocumentAnalysisCommand({ JobId: jobId });
        const response = await textractClient.send(command);
        const status = response.JobStatus;

        if (status === 'SUCCEEDED') {
            return;
        }
        if (status === 'FAILED') {
            throw new Error(`Textract job ${jobId} failed`);
        }

        await new Promise(resolve => setTimeout(resolve, interval));
    }
};

export const getAnalysisResults = async (jobId: string) => {
    let nextToken: string | undefined;
    let blocks: Block[] = [];

    do {
        const command = new GetDocumentAnalysisCommand({
            JobId: jobId,
            NextToken: nextToken
        });

        const response = await textractClient.send(command);
        if (response.Blocks) {
            blocks = blocks.concat(response.Blocks);
        }
        nextToken = response.NextToken;
    } while (nextToken);

    return blocks;
}; 