import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';

// Type
import type { Readable } from 'node:stream';
import type { S3Event } from 'aws-lambda';

export const handler = async ({ Records: [record] }: S3Event) => {
  const { awsRegion, s3 } = record;

  const bucketName = s3.bucket.name;
  const objectKey = s3.object.key;

  console.log('aws region -> ', awsRegion);
  console.log('s3 bucket name -> ', bucketName);
  console.log('object key -> ', objectKey);

  const client = new S3Client({ region: awsRegion });
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  return client
    .send(command)
    .then(({ Body }) =>
      (Body as Readable)
        .pipe(csvParser())
        .on('data', console.log)
        .on('error', console.log)
        .on('end', () => console.log('end event...'))
    )
    .catch(console.log);
};
