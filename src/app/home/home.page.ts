import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EMPTY, from, Observable, of, zip } from 'rxjs';
import { Log, LogService, LogTypes } from '../services/log.service';
import { combineAll, finalize, groupBy, mergeMap, tap, toArray } from 'rxjs/operators';
import { ActionSheetController, IonModal } from '@ionic/angular';

import { NgForm } from '@angular/forms';
import { format } from 'date-fns';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild('logForm', { static: true }) form: NgForm;

  logs$: Observable<any[]>;
  logDate: string;
  logType: LogTypes;

  constructor(
    private logService: LogService,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnDestroy(): void {
  }
  ionViewWillLeave() {
    this.logs$ = of([]);
  }

  ngOnInit(): void {
    this.logDate = format(new Date(), `yyyy-MM-dd'T'HH:mm:ss`);
    this.get();
  }

  get(ev?) {
    this.logs$ = this.logService.get().pipe(
      // //mergeMap(map => map),
      // groupBy(log => log.start.toDate().toISOString().split('T')[0]),
      // tap(x => console.log(x)),
      // mergeMap(group => zip(of(group.key), group.pipe(toArray()))),
      // combineAll(),
      tap(x => console.log(x)),
      tap(() => ev ? ev.target.complete() : null)
    );
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

  async more(log: Log) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Options',
      buttons: [
        {
          text: 'Delete',
          handler: () => this.remove(log),
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    actionSheet.present();
  }
}
