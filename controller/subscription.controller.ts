import { Request, Response } from "express";
import { firestore } from "firebase-admin";
import moment from "moment";
import { v4 } from "uuid";
import DynamoDbService from "../service/dynamo.service";
import FirebaseService from "../service/firebase.service";
import { ISubscription, IUserSubscripion } from "../types/subscription.types";
import { convertDateToTimeStamp } from "../utils/moment";

export default class SubscriptionController {
  private static id = v4().replace(/-/g, "");
  dynamoDb: typeof DynamoDbService;
  firebase: typeof FirebaseService;

  constructor() {
    this.dynamoDb = DynamoDbService;
    this.firebase = FirebaseService;
  }
  public addNewUserSubscription = async (req: Request, res: Response) => {
    try {
      const { duration, created_at, creatorId, amount, type } = req.body,
        { id: userId } = req.params,
        userSubsData = await this.firebase.findOneSubscription(
          userId,
          creatorId
        );
      let checkValidity: boolean = false;
      if (userSubsData) {
        const { valid } = userSubsData?.data();
        checkValidity = valid;
      }
      if (!checkValidity) {
        let presentDate = created_at,
          payload: ISubscription[] = [];
        for (let i = 0; i < duration; i++) {
          presentDate = moment(created_at)
            .add(i + 1, "M")
            .format("yyyy-MM-DD");
          let data: ISubscription = {
            id: v4().replace(/-/g, ""),
            amount,
            count: i + 1,
            type: "subscription",
            userId,
            creatorId,
            uniqueId: v4().replace(/-/g, ""),
            paymentDue: presentDate,
            ttl: +convertDateToTimeStamp(presentDate),
            valid: true,
          };
          payload.push(data);
        }
        const userSubscription: IUserSubscripion = {
          userId,
          creatorId,
          id: SubscriptionController.id,
          created_at,
          type,
          end_date: firestore.Timestamp.fromDate(
            new Date(
              moment(created_at)
                .add(duration + 1, "M")
                .format("yyyy-MM-DD")
            )
          ),
          amount,
          valid: true,
        };
        this.dynamoDb.saveSubscriptionData(payload),
          await Promise.all([
            ...payload.map((i) => this.firebase.userSubscriptionDue(userId, i)),
            this.firebase.saveSubscription(userId, userSubscription),
          ]);
        await this.endUserSubscription(userSubscription);
        res
          .status(200)
          .header({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST",
          })
          .send();
      } else {
        res
          .status(203)
          .header({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST",
          })
          .send();
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .header({
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST",
        })
        .send({ message: "Internal Server Error." });
    }
  };

  private endUserSubscription = async (userSubscription: IUserSubscripion) => {
    userSubscription.ttl = userSubscription.end_date.seconds;
    userSubscription.type = "end-subscription";
    await this.dynamoDb.saveSubscriptionData([userSubscription]);
  };
}
