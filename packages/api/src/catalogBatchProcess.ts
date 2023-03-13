// Core
import { DynamoDBClient, BatchWriteItemCommand, BatchWriteItemCommandInput } from '@aws-sdk/client-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { marshall } from '@aws-sdk/util-dynamodb';

// Type
import type { SQSEvent } from 'aws-lambda';

export const handler = async (event: SQSEvent) => {
    const emailTopicArn = process.env.EMAIL_TOPIC_ARN;
    const region = 'us-east-1';
    const tableName = process.env.TABLE_NAME as string;

    console.log('TABLE_NAME ->', tableName);
    console.log('RECORDS ->', event.Records);
    console.log('EMAIL_TOPIC ->', emailTopicArn);

    const input: BatchWriteItemCommandInput = {
        RequestItems: {
            [tableName]: event.Records.map(({ body }) => ({
                PutRequest: { Item: marshall(JSON.parse(body)) },
            })),
        },
    };

    const dbClient = new DynamoDBClient({ region });
    const snsClient = new SNSClient({ region });

    const command = new BatchWriteItemCommand(input);

    return dbClient
        .send(command)
        .then(async (meta) => {
            await snsClient.send(
                new PublishCommand({
                    Message: `
                        Title: Products were created successful!
                        ----------------------------------------
                        List: ${event.Records.map(({ body }) => body)}
                        ----------------------------------------
                        Meta: ${JSON.stringify(meta, null, 4)}
                    `,
                    TopicArn: emailTopicArn,
                }),
            );
        })
        .catch(console.log);
};
