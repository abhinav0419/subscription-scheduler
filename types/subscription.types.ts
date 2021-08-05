import { firestore } from "firebase-admin";

export interface ISubscription {
  id: string;
  userId: string;
  creatorId: string;
  amount: number;
  count: number;
  ttl: number;
  type: string;
  paymentDue: string;
  uniqueId:string;
  valid: boolean;
}

export interface IUserSubscripion {
  userId: string;
  creatorId: string;
  id: string;
  created_at: number | firestore.Timestamp;
  type: string;
  // subscription_type: string;
  end_date: firestore.Timestamp | any;
  amount: number;
  valid: boolean;
  ttl?: number;
}
