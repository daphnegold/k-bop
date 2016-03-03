import {Page, NavController} from 'ionic-framework/ionic';
import {TabsPage} from '../tabs/tabs';
import {LoginService} from '../../login.service';

@Page({
  templateUrl: 'build/pages/intro/intro.html',
  providers: [LoginService]
})
export class IntroPage {
  constructor(private nav: NavController, private _loginService: LoginService) { }

  goToHome(){
    if (this.loggedIn()) {
      this.nav.setRoot(TabsPage);
    } else {
      this.nav.setRoot(IntroPage)
    }
  }

  loggedIn() {
    return this._loginService.loggedIn();
  }

  login() {
    this._loginService.login();
  }
}
