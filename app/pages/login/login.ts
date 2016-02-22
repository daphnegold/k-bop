import {Page, Platform} from 'ionic-framework/ionic';


@Page({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
  constructor(private platform: Platform) {
    this.platform = platform;
  }

  login() {
    this.platform.ready().then(() => {
      this.spotifyCode().then((success) => {
        alert(success.code);
      }, (error) => {
        alert(error);
      });
    });
  }

  spotifyCode() {
    return new Promise(function(resolve, reject) {
      var browserRef = window.cordova.InAppBrowser.open("https://accounts.spotify.com/authorize?client_id=" + "3fe64739f9b84775a7ef6e4ec61d19b6" + "&redirect_uri=http://localhost/callback&response_type=code", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");

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
        reject("The Spotify sign in flow was canceled");
      });
    });
  }
}
