// Model
import { products } from '../mocks/products';

// Type
import type { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const { pathParameters } = event;

    try {
        return {
            statusCode: 200,
            body: JSON.stringify(products.find(({ id }) => pathParameters?.productId === id) ?? null),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
