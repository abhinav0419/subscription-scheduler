import { firestore } from "firebase-admin";
import moment from "moment";
import { app } from "../config/firebaseConfig";
import { ISubscription, IUserSubscripion } from "../types/subscription.types";

export default class FirebaseService {
  public static userSubscriptionDue = async (
    userId: string,
    query: ISubscription
  ) => {
    await app
      .firestore()
      .collection(`users/${userId}/subscription_dues`)
      .add(query);
  };
  public static saveSubscription = async (
    userId: string,
    subscription: IUserSubscripion
  ) => {
    subscription.created_at = firestore.Timestamp.fromDate(
      new Date(moment(subscription.created_at).format("yyyy-MM-DD"))
    );
    await app
      .firestore()
      .collection(`users/${userId}/subscription`)
      .add(subscription);
  };
  public static findOneSubscription = async (userId: string, creatorId: string) => {
    const data = await app
      .firestore()
      .collection(`users/${userId}/subscription`)
      .where("creatorId", "==", creatorId)
      .get();
    return data?.docs[0] ?? null;
  };
}
