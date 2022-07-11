import { Injectable } from '@angular/core';
import { addDoc, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { collection, Timestamp } from '@firebase/firestore';
import { map } from 'rxjs/operators';

export type LogTypes = 'sleep' | 'wakeup' | 'feed' | 'poop' | 'shower';

export interface Log {
  id?: string;
  type: LogTypes;
  start: Timestamp;
  end?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private firestore: Firestore) { }


  get() {
    const logsRef = collection(this.firestore, 'logs');
    return collectionData(logsRef, { idField: 'id' })
      .pipe(
        map(x => x as Log[]),
        map(x => x.sort((a, b) => b.start.toMillis() - a.start.toMillis()))
      );
  }
  getByID(id: string) {
    const logRef = doc(this.firestore, `logs/${id}`);
    return docData(logRef, { idField: 'id' })
      .pipe(
        map(x => x as Log)
      );
  }
  add(log: Log) {
    const logsRef = collection(this.firestore, 'logs');
    return addDoc(logsRef, log);
  }
  remove(id: string) {
    const logRef = doc(this.firestore, `logs/${id}`);
    return deleteDoc(logRef);
  }
  update(log: Log) {
    const logRef = doc(this.firestore, `logs/${log.id}`);
    return updateDoc(logRef, { ...log });
  }
}
