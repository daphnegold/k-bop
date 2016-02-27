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

   getSongs() {
     if (this.songs) {
       console.log(this.songs.length)
     }
     if (!this.songs || this.songs.length < 3) {

       this._songService.getSongs()
          .subscribe(
            songs => {
              this.songs = songs;
              this.currentSong = this.songs[0];

              this.playSong().then((success) => {
                console.log("Preview complete")
              }, (error) => {
                alert("Something has gone wrong");
              });

              console.log(this.currentSong)},
            error => console.log(<any>error));

     }
   }

   toggleSong() {
     this._songService.toggleSong();
   }

   stopSong() {
     this._songService.stopSong();
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
     let randomNumber = Math.round(Math.random() * (this.songs.length - 1));
     this.currentSong = this.songs[randomNumber];

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
      this.getSongs();
      this.pullable = false;
      console.log('calling api')

      setTimeout(() => {
        refresher.complete();
        console.log("Complete");
        this.pullable = true;
       }, 10000);
    }
  }
}
