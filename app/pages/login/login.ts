import {Page, Platform, Storage, LocalStorage} from 'ionic-framework/ionic';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Headers, RequestOptions} from 'angular2/http';

import {Token} from "./token";
import {LoginService} from "./login.service";
import {Observable} from 'rxjs/Observable';


@Page({
  templateUrl: 'build/pages/login/login.html',
  providers: [LoginService]
})
export class LoginPage {
  local: Storage = new Storage(LocalStorage);

  constructor(private platform: Platform, private _loginService: LoginService) {
    this.platform = platform;
  }

  errorMessage: string;

  loggedIn() {
    let token = this.local.get('id_token')._result;

    if (token) {
      console.log(token)
      return true;
    }
  }

  login() {
    this.platform.ready().then(() => {
      this.spotifyCode().then((success) => {
        this.local.set('id_token', "I'm a test token!");
        alert(success.code);
        this.spotifyToken(success.code)
      }, (error) => {
        alert(error);
      });
    });
  }

  spotifyCode() {
    return new Promise(function(resolve, reject) {
      var browserRef = window.cordova.InAppBrowser.open("https://accounts.spotify.com/authorize?client_id=" + "3fe64739f9b84775a7ef6e4ec61d19b6" + "&redirect_uri=http://localhost/callback&response_type=code&scope=playlist-modify-public%20playlist-modify-private", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");

      browserRef.addEventListener("loadstart", (event) => {
        if ((event.url).indexOf("http://localhost/callback") === 0) {

          browserRef.removeEventListener("exit", (event) => {});
          browserRef.close();

          var responseParameters = ((event.url).split("?")[1]);
          var parsedResponse = {};
          parsedResponse[responseParameters.split("=")[0]] = responseParameters.split("=")[1];

          if (parsedResponse["code"] !== undefined && parsedResponse["code"] !== null) {
            resolve(parsedResponse);
          } else {
            reject("There was a problem authenticating with Spotify");
          }
        }
      });
      browserRef.addEventListener("exit", function(event) {
        reject("The Spotify sign in was canceled");
      });
    });
  }

  spotifyToken(code: string) {
    if (!code) {return;}
    this._loginService.getToken(code)
      .subscribe(
         token  => alert(token),
         error =>  this.errorMessage = <any>error);
    }
}
