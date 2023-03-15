// Type
import type {
  APIGatewayEventRequestContextLambdaAuthorizer,
  APIGatewaySimpleAuthorizerWithContextResult,
} from 'aws-lambda';

type ContextType = {
  token: string;
};

export const handler = async (event: any) => {
  console.log({ event });

  let response = {
    isAuthorized: false,
    context: {
      stringKey: 'value',
      numberKey: 1,
      booleanKey: true,
      arrayKey: ['value1', 'value2'],
      mapKey: { value1: 'value2' },
    },
  };

  if (event.headers.authorization === 'secretToken') {
    response = {
      isAuthorized: true,
      context: {
        stringKey: 'value',
        numberKey: 1,
        booleanKey: true,
        arrayKey: ['value1', 'value2'],
        mapKey: { value1: 'value2' },
      },
    };
  }

  return response;
};
