import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import csvParser from 'csv-parser';

// Type
import type { Readable } from 'node:stream';
import type { S3Event } from 'aws-lambda';

export const handler = async ({ Records: [record] }: S3Event) => {
  const { awsRegion, s3 } = record;

  const bucketName = s3.bucket.name;
  const objectKey = s3.object.key;
  const sqsUrl = process.env.SQS_URL;

  console.log('config -> ', {
    awsRegion,
    sqs: sqsUrl,
    bucket: bucketName,
    object: objectKey,
  });

  const s3CLient = new S3Client({ region: awsRegion });

  const s3GetCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  const { Body } = await s3CLient.send(s3GetCommand);

  (Body as Readable)
    .pipe(csvParser())
    .on('data', async (row) => {
      console.log(JSON.stringify(row));

      const sqsClient = new SQSClient({ region: awsRegion });
      await sqsClient.send(
        new SendMessageCommand({
          QueueUrl: sqsUrl,
          MessageBody: JSON.stringify(row),
        })
      );
    })
    .on('error', console.log)
    .on('end', () => {
      console.log('on finish');
    });
};
