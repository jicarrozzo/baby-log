import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async register(form: NgForm) {
    const loading = await this.loadingController.create();
    try {
      await loading.present();
      const { email, password } = form.value;
      await this.authService.signup(email, password);
      await loading.dismiss();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      await loading.dismiss();
      this.notificationService.alert('Registration failed', 'Please try again!');
    }
  }

  async signinWithEmail(form: NgForm) {
    const loading = await this.loadingController.create();
    try {
      await loading.present();
      const { email, password } = form.value;
      await this.authService.signin(email, password);
      await loading.dismiss();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      await loading.dismiss();
      this.notificationService.alert('Sign in failed', 'Please try again!');
    }
  }

  async signinWithGoogle() {
    try {
      await this.authService.signinWithGoogle();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      this.notificationService.alert('Sign in failed', 'Please try again!');
    }
  }
}
