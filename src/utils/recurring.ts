// utils/recurring.ts
import { addDoc, updateDoc, doc, collection } from "firebase/firestore";
import dayjs from "dayjs";
import { db } from "./firebase";

type RecurringItem = {
  id: string;
  uid: string;
  type: string;
  category: string;
  amount: number;
  recurring: boolean;
  nextDate: string | Date;
  frequency: dayjs.ManipulateType;
};

export async function processRecurring(items: RecurringItem[] = []) {
  const now = dayjs();
  for (const item of items) {
    if (!item.recurring) continue;
    const next = dayjs(item.nextDate);
    if (now.isAfter(next)) {
      await addDoc(collection(db, "transactions"), {
        uid: item.uid,
        type: item.type,
        category: item.category,
        amount: item.amount,
        createdAt: now.toDate(),
      });
      await updateDoc(doc(db, "recurring", item.id), {
        nextDate: next.add(1, item.frequency).toDate(),
      });
    }
  }
}
