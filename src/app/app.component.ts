import { Component, OnInit } from '@angular/core';
import { User, UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  user: User;

  constructor(
    private authService: AuthService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.authService.userData$.subscribe((u) => {
      this.user = u;
    });
    this.authService.load();
  }
  ngOnInit(): void { }

  async logout() {
    await this.authService.signout();
    this.router.navigate(['login']);
  }

  async menuActions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.user.displayName ? this.user.displayName : this.user.email,
      buttons: [
        {
          text: 'Logout',
          handler: () => this.logout(),
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
