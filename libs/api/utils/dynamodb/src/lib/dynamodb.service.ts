import { Inject, Injectable } from '@nestjs/common';
import { DynamodbConfig } from './dynamodb.interfaces';
import * as AWS from 'aws-sdk';

@Injectable()
export class DynamodbService {
  documentClient: AWS.DynamoDB.DocumentClient;

  constructor(@Inject('CONFIG_OPTIONS') config: DynamodbConfig) {
    this.documentClient = new AWS.DynamoDB.DocumentClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.accessKeySecret,
      },
    });

    void this.read('event-idempotency-table', 'item');
  }

  public async write(tableName: string, item: object): Promise<void> {
    await this.documentClient
      .put({
        TableName: tableName,
        Item: item,
      })
      .promise();
  }

  public async read(tableName: string, itemId: string): Promise<any> {
    const result = await this.documentClient
      .get({
        TableName: tableName,
        Key: {
          id: itemId,
        },
      })
      .promise();

    return result.Item;
  }
}
