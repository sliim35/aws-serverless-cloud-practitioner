// Model
import { products } from '../mocks/products';

// Type
import type { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

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
