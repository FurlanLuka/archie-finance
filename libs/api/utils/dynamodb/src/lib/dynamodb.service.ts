import { Inject, Injectable, Logger } from '@nestjs/common';
import { DynamodbConfig } from './dynamodb.interfaces';
import * as AWS from 'aws-sdk';
import { Agent } from 'http';

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
      endpoint: config.endpoint,
      httpOptions: {
        agent: new Agent({
          keepAlive: true,
          maxSockets: Infinity,
        }),
      },
    });
  }

  public async write(tableName: string, item: object): Promise<void> {
    try {
      await this.documentClient
        .put({
          TableName: tableName,
          Item: item,
        })
        .promise();
    } catch (error) {
      Logger.error({
        message: 'FAILED_WRITING_EVENT_LOG',
        metadata: {
          tableName,
          item,
          error,
        },
      });
    }
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
