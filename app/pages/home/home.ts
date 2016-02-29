import {Page, NavController} from 'ionic-framework/ionic';
import {LoginService} from '../../login.service';
import {PlaylistService} from '../../playlist.service';
import {SongService} from '../../song.service';
import {HammerService} from '../../hammer.service';
import {Song} from '../../song'

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [LoginService, HammerService]
})
export class HomePage {
  songs: Song[];
  currentSong: Song;
  pullable: boolean = true;
  // hammertime: any;
  // cardElement: any;

  constructor(
    private _loginService: LoginService,
    private _playlistService: PlaylistService,
    private _songService: SongService,
    private _hammerService: HammerService,
    private nav: NavController) { }

   onPageDidEnter() {
    //  this.cardElement = document.getElementById('swiperrific');
    //  this.hammertime = new Hammer(this.cardElement);

     this._hammerService.swipeInit();
     this._hammerService.hammertime.on('swiperight', (event) => {
       console.log('Swipe right');
       this.decide(true);
     });
     this._hammerService.hammertime.on('swipeleft', (event) => {
       console.log('Swipe left');
       this.decide(false);
     });

     console.log(this._hammerService.hammertime);

     if (this._songService.songs) {
       this.currentSong = this._songService.songs[0];

       if (!this._songService.audio) {
         this.songTime();
       }
     }
   }

   onPageWillLeave() {
     console.log("leaving page")
     this._hammerService.swipeDestroy();
   }

   getSongs() {
     if (this._songService.songs) {
       console.log(this._songService.songs.length)
     }

     if (!this._songService.songs || this._songService.songs.length < 3) {

       this._songService.getSongs()
          .subscribe(
            songs => {
              this._songService.songs = songs;
              this.currentSong = this._songService.songs[0];

              if (!this._songService.audio) {
                this.songTime();
              }

              console.log(this.currentSong)},
            error => { console.log(<any>error); alert("Something has gone wrong, please try again later"); }
          );
     } else {
       this.currentSong = this._songService.songs[0];

       if (!this._songService.audio) {
         this.songTime();
       }
     }
   }

   toggleSong() {
     if (this._songService.played) {
       this._songService.played = false;

       this.songTime();
     } else {
       this._songService.toggleSong();
     }
   }

   stopSong() {
     this._songService.stopSong();
   }

   removeAudio() {
     this._songService.removeAudio();
   }

   startSong() {
     this._songService.startSong();
   }

   playSong() {
     return this._songService.playSong(this.currentSong);
   }

   decide(choice) {
     if (choice) {
       this._playlistService.addSong(this.currentSong);
     }

     this.stopSong();
     let randomNumber = Math.round(Math.random() * (this._songService.songs.length - 1));
     this.currentSong = this._songService.songs[randomNumber];

     this.songTime();
   }

   songTime() {
     this.playSong().then((success) => {
       this._songService.played = true;
       this._songService.stopSong();
       console.log("Preview complete")
     }, (error) => {
       alert("Something has gone wrong");
     });
   }

  loggedIn() {
    return this._loginService.loggedIn();
  }

  login() {
    this._loginService.login();
  }

  doRefresh(refresher) {
    if (this.pullable) {
      console.log('Doing Refresh', refresher)
      if (this._songService.audio) {
        this._songService.removeAudio();
      }
      this.getSongs();
      this.pullable = false;

      setTimeout(() => {
        refresher.complete();
        console.log("Complete");
        this.pullable = true;
       }, 10000);
    }
  }
}
