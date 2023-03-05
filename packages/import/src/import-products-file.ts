import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Type
import type { APIGatewayEvent, APIGatewayProxyResultV2 } from 'aws-lambda';

export const handler = async ({
  queryStringParameters,
}: APIGatewayEvent): Promise<APIGatewayProxyResultV2> => {
  const fileName = queryStringParameters?.name ?? 'errorname';
  console.log('query string -> ', queryStringParameters);

  const REGION = 'us-east-1';
  const BUCKET = 'www.import.mdvoy.ru';
  const KEY = `uploaded/${fileName}`;

  const client = new S3Client({ region: REGION });
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: KEY,
    ContentType: 'text/csv',
  });

  const url = await getSignedUrl(client, command, { expiresIn: 3600 });

  console.log('presigned url -> ', url);
  return url;
};
