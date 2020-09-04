import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { SharedService } from '../../shared/shared.service';
import { WebApiURL } from '../../shared/WebApiNames';
import { MessageTypes } from '../../shared/properties';
import { AuthService } from '../../shared/Authentication/AuthService';

/**
 * Component
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit {

  public loginPageForm: FormGroup;

  /**
   * Creates an instance of login component.
   * @param router
   * @param sharedService
   * @param authService
   */
  constructor(private router: Router,
    private sharedService: SharedService,
    public authService: AuthService) {
  }

  /**
   * on init
   */
  ngOnInit() {
    this.loginForm();
    this.authService.logout();
  }

  /**
   * Logins form
   */
  public loginForm() {
    this.loginPageForm = new FormGroup({
      EmailID: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required])
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginPageForm.controls; }

  /**
   * Submits login
   */
  public submitLogin() {
    this.sharedService.send(WebApiURL.login.doLogin, this.loginPageForm['value']).subscribe((result) => {
      if (result.hasOwnProperty('status') && !result['status']) {
        this.sharedService.toasterMessage(MessageTypes['error'], result['message']);
      } else {
        const resultData = result;
        localStorage.setItem('userData', JSON.stringify(resultData[0]));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', this.f.EmailID.value);
        this.router.navigate(['/auth/dashboard']);
        this.sharedService.toasterMessage(MessageTypes['success'], 'Login Successful');
      }
    }, (error) => {
      localStorage.clear();
      console.log(error);
      this.sharedService.toasterMessage(MessageTypes['error'], 'Something went wrong!');
    });
  }
}

