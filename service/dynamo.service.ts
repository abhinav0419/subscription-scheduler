import { DynamoDB } from "aws-sdk";
import { ISubscription, IUserSubscripion } from "../types/subscription.types";

export default class DynamoDbService {
  private static tableName = "users-subscriptions";

  public static saveSubscriptionData = async (
    query: ISubscription[] | IUserSubscripion[]
  ) => {
    try {
      const document = new DynamoDB.DocumentClient();
      await Promise.all(
        query.map(async (i: any) => {
          const params = {
            TableName: DynamoDbService.tableName,
            Item: i,
          };
          console.log(params);
          await document.put(params).promise();
        })
      );
    } catch (err) {
      throw err;
    }
  };
}
