// Core
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb';

// Type
import { APIGatewayProxyResultV2, APIGatewayEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2> => {
    const { pathParameters } = event;
    const dbClient = new DynamoDBClient({ region: 'us-east-1' });
    const command = new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: marshall({
            id: pathParameters?.id ?? 0,
        }),
    });

    return dbClient
        .send(command)
        .then((data) => {
            return {
                statusCode: 200,
                body: data.Item ? JSON.stringify(unmarshall(data.Item)) : 'Item not found',
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
