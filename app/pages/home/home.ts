import {Page, NavController} from 'ionic-framework/ionic';
import {LoginService} from '../../login.service';
import {PlaylistService} from '../../playlist.service';
import {SongService} from '../../song.service';
import {Song} from '../../song'

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [LoginService]
})
export class HomePage {
  songs: Song[];
  currentSong: Song;
  pullable: boolean = true;

  constructor(
    private _loginService: LoginService,
    private _playlistService: PlaylistService,
    private _songService: SongService) {
   }

   onPageLoaded() {
     if (this._songService.songs) {
       this.currentSong = this._songService.songs[0]

       if (!this._songService.audio) {
         this.playSong().then((success) => {
           console.log("Preview complete")
         }, (error) => {
           alert("Something has gone wrong");
         });
       }
     }
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
                this.playSong().then((success) => {
                  console.log("Preview complete")
                }, (error) => {
                  alert("Something has gone wrong");
                });
              }

              console.log(this.currentSong)},
            error => console.log(<any>error));
     } else {
       this.currentSong = this._songService.songs[0];

       if (!this._songService.audio) {
         this.playSong().then((success) => {
           console.log("Preview complete")
         }, (error) => {
           alert("Something has gone wrong");
         });
       }
     }
   }

   toggleSong() {
     this._songService.toggleSong();
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

     this.playSong().then((success) => {
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
