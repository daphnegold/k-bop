import {App, IonicApp, Platform, Storage, LocalStorage} from 'ionic-framework/ionic';
import {IntroPage} from './pages/intro/intro';
import {TabsPage} from './pages/tabs/tabs';
import {GridPage} from './pages/grid/grid';
import {PlaylistService} from './playlist.service';
import {SongService} from './song.service';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';

@App({
  templateUrl: 'build/app.html',
  config: {
    tabbarPlacement: 'bottom'
  }, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [PlaylistService, SongService]
})
class MyApp {
  rootPage: Type = TabsPage;
  // pages: Array<{title: string, component: Type}>

  constructor(private app: IonicApp, private platform: Platform, private _songService: SongService) {
    let local = new Storage(LocalStorage);

    local.get('id').then((result) => {
      if (result) {
        this.rootPage = TabsPage;
      } else {
        // local.set('introShown', true);
        this.rootPage = IntroPage;
      }
    });

    this.initializeApp();

    // used for an example of ngFor and navigation
    // this.pages = [
    //   { title: 'Home', component: HomePage },
    //   { title: 'Playlist', component: PlaylistPage },
    //   // { title: 'Grid Icons', component: GridPage }
    // ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
    });
  }

  // openPage(page) {
  //   // Reset the content nav to have just this page
  //   // we wouldn't want the back button to show in this scenario
  //   let nav = this.app.getComponent('nav');
  //   nav.setRoot(page.component);
  // }

  removeAudio() {
    this._songService.removeAudio();
  }
}
