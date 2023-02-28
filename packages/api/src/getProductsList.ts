// Core
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

// Type
import { APIGatewayProxyResultV2 } from 'aws-lambda';

export const handler = async (): Promise<APIGatewayProxyResultV2> => {
    const dbClient = new DynamoDBClient({ region: 'us-east-1' });
    const command = new ScanCommand({ TableName: process.env.TABLE_NAME });

    return dbClient
        .send(command)
        .then((data) => {
            return {
                statusCode: 200,
                body: JSON.stringify(data.Items?.map((item) => unmarshall(item))),
            };
        })
        .catch((error) => {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'some error happened',
                    error: error.message,
                }),
            };
        });
};
