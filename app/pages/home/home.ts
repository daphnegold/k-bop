import {Page} from 'ionic-framework/ionic';
import {LoginService} from '../../login.service';

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [LoginService]
})
export class HomePage {
  constructor(private _loginService: LoginService) { }

  loggedIn() {
    this._loginService.loggedIn();
  }

  login() {
    this._loginService.login();
  }
}
