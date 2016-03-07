import {Platform, Storage, LocalStorage, NavController} from 'ionic-framework/ionic';
import {Injectable} from 'angular2/core';
import {TabsPage} from './pages/tabs/tabs';

@Injectable()
export class LoginService {
  local: Storage = new Storage(LocalStorage);

  constructor(private platform: Platform, private nav: NavController) {
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
        this.nav.setRoot(TabsPage)
        var expiration = new Date().getTime() + 3600000
        // facebook weirdness with "_#_"P
        var uid = success["user"].split('#')[0]
        var display = success["display"]

        this.local.set('id', uid);
        this.local.set('display', display)
        this.local.set('expiration', expiration);
        // alert("Hi " + uid);
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

          // http://localhost:3000/status?display=darkwingdaphne&user=darkwingdaphne
          var responseParameters = ((event.url).split("?")[1]).split("&");
          var parsedResponse = {};
          for (var i = 0; i < responseParameters.length; i++) {
              parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
          }

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
