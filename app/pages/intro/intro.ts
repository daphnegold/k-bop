import {Page, NavController} from 'ionic-framework/ionic';
import {HomePage} from '../home/home';
import {LoginService} from '../../login.service';

@Page({
  templateUrl: 'build/pages/intro/intro.html',
  providers: [LoginService]
})
export class IntroPage {
  constructor(private nav: NavController, private _loginService: LoginService) { }

  goToHome(){
      this.nav.setRoot(HomePage);
  }

  loggedIn() {
    return this._loginService.loggedIn();
  }

  login() {
    this._loginService.login();
  }
}
