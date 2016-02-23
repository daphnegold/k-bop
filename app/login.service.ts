import {Platform, Storage, LocalStorage} from 'ionic-framework/ionic';
import {Injectable} from 'angular2/core';

@Injectable()
export class LoginService {
  local: Storage = new Storage(LocalStorage);

  constructor(private platform: Platform) {
    this.platform = platform;
  }

  loggedIn() {
    let token = this.local.get('access_token')._result;
    let expiration = this.local.get('expiration')._result;

    if (token && expiration > new Date().getTime()) {
      console.log(token)
      return true;
    }
  }

  login() {
    this.platform.ready().then(() => {
      this.spotifyToken().then((success) => {
        var expiration = new Date().getTime() + 3600000

        this.local.set('access_token', success.access_token);
        this.local.set('expiration', expiration);
        alert(success.access_token);
        alert(expiration);
      }, (error) => {
        alert(error);
      });
    });
  }

  spotifyToken() {
    return new Promise(function(resolve, reject) {
      var browserRef = window.cordova.InAppBrowser.open("https://accounts.spotify.com/authorize?client_id=3fe64739f9b84775a7ef6e4ec61d19b6&redirect_uri=http://localhost/callback&response_type=token&scope=playlist-modify-public%20playlist-modify-private", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");

      browserRef.addEventListener("loadstart", (event) => {
        if ((event.url).indexOf("http://localhost/callback") === 0) {

          browserRef.removeEventListener("exit", (event) => {});
          browserRef.close();

          var responseParameters = ((event.url).split("#")[1]).split("&");
          var parsedResponse = {};
          for (var i = 0; i < responseParameters.length; i++) {
            parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
          }
          if (parsedResponse["access_token"] !== undefined && parsedResponse["access_token"] !== null) {
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
}
