import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Log, LogService, LogTypes } from '../services/log.service';
import { tap } from 'rxjs/operators';
import { IonModal } from '@ionic/angular';

import { NgForm } from '@angular/forms';
import { format } from 'date-fns';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild('logForm', { static: true }) form: NgForm;

  logs$: Observable<Log[]>;
  logDate: string;
  logType: LogTypes;

  constructor(private logService: LogService) {
    this.logs$ = this.logService.get().pipe(
      tap(console.log)
    );
  }
  ngOnInit(): void {
    this.logDate = format(new Date(), `yyyy-MM-dd'T'HH:mm:ss`);
  }


  add() {
    const newLog: Log = { type: this.logType, start: Timestamp.fromDate(new Date(this.logDate)) };
    this.logService.add(newLog);
    this.modal.dismiss();
  }
  remove(log: Log) {
    this.logService.remove(log.id);
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  loadValues() {
    this.logDate = format(new Date(), `yyyy-MM-dd'T'HH:mm:ss`);
  }

  ready() {
    return this.logDate && this.logType;
  }
}
