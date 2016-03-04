import {Platform, Storage, LocalStorage} from 'ionic-framework/ionic';
import {Injectable} from 'angular2/core';

@Injectable()
export class LoginService {
  local: Storage = new Storage(LocalStorage);

  constructor(private platform: Platform) {
    this.platform = platform;
  }

  loggedIn() {
    let token = this.local.get('id')._result;
    let expiration = this.local.get('expiration')._result;

    if (token && expiration > new Date().getTime()) {
      return true;
    }
  }

  login() {
    this.platform.ready().then(() => {
      this.backendLogin().then((success) => {
        var expiration = new Date().getTime() + 3600000

        this.local.set('id', success["user"]);
        this.local.set('expiration', expiration);
        // alert("Hi " + success["user"]);
      }, (error) => {
        alert(error);
      });
    });
  }

  backendLogin() {
    return new Promise((resolve, reject) => {
      // idea: add query parameters with UID -if- it's in local storage so users don't need to login every time
      var url = "http://kbop.herokuapp.com/auth/spotify";
      // var token = this.local.get('id')._result;
      // if (token) { url += "?uid=" + token }

      var browserRef = window.cordova.InAppBrowser.open(url, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");

      browserRef.addEventListener("loadstart", (event) => {

        // http://kbop.herokuapp.com/status?user=darkwingdaphne
        if ((event.url).indexOf("http://kbop.herokuapp.com/status") === 0) {
          browserRef.removeEventListener("exit", (event) => {});
          browserRef.close();

          var parsedResponse = {};
          var responseParameters = ((event.url).split("?")[1]).split("=");
          parsedResponse[responseParameters[0]] = responseParameters[1];

          if (parsedResponse["user"] !== undefined && parsedResponse["user"] !== null) {
            resolve(parsedResponse);
          } else {
            reject("There was a problem authenticating with Spotify");
          }
        }
      });
      browserRef.addEventListener("exit", (event) => {
        reject("The Spotify sign in was canceled");
      });
    });
  }
}
