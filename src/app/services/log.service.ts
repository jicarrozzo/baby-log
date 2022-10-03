import { Injectable } from '@angular/core';
import { Auth, } from '@angular/fire/auth';
import { addDoc, collectionData, deleteDoc, doc, docData, Firestore, limit, orderBy, query, updateDoc } from '@angular/fire/firestore';
import { collection, Timestamp } from '@firebase/firestore';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';


export type EventTypes = 'sleep' | 'wakeup' | 'feed' | 'poop' | 'shower';
export interface Event {
  id?: string;
  type: string;
  start: Timestamp;
  end?: Date;
}
export interface DateLog {
  logs: Event[];
  lastLog: Log;
  total: any;
}


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

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }


  get() {
    try {
      // console.log(this.authService.user);

      const logsRef = collection(this.firestore, `logs`);//${this.authService.user.email}

      return collectionData(query(logsRef, limit(20), orderBy('start', 'desc')), { idField: 'id' })
        .pipe(
          map(x => x as Log[]),
          map(x => x.sort((a, b) => b.start.toMillis() - a.start.toMillis()))
        );
    } catch (e) {
      throw e;
    }
  }

  getByID(id: string) {
    const logRef = doc(this.firestore, `logs/${id}`); //`${this.authService.user.email}/${id}`);
    return docData(logRef, { idField: 'id' })
      .pipe(
        map(x => x as Log)
      );
  }
  add(log: Log) {
    const logsRef = collection(this.firestore, `logs`);//${this.authService.user.email}
    return addDoc(logsRef, log);
  }
  remove(id: string) {
    const logRef = doc(this.firestore, `logs/${id}`);//${this.authService.user.email}/${id}
    return deleteDoc(logRef);
  }
  update(log: Log) {
    const logRef = doc(this.firestore, `logs/${log.id}`);//${this.authService.user.email}/${log.id}
    return updateDoc(logRef, { ...log });
  }
}
