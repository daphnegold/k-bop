import {Page, NavController} from 'ionic-framework/ionic';
import {LoginService} from '../../login.service';
import {PlaylistService} from '../../playlist.service';
import {SongService} from '../../song.service';
import {Song} from '../../song'
// import {SongComponent} from '../../song.component';

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [LoginService]
})
export class HomePage {
  songs: Song[];
  currentSong: Song;
  audio: any;
  paused: boolean;

  constructor(
    private _loginService: LoginService,
    private _playlistService: PlaylistService,
    private _songService: SongService) {
   }

   onPageLoaded() {
     this.getSongs();
     console.log('calling api')
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
     if (this.paused) {
       this.startSong();
       this.paused = false
     } else {
       this.stopSong();
       this.paused = true
     }
   }

   stopSong() {
     if (this.audio) {
       this.audio.pause();
     }
   }

   startSong() {
     if (this.audio) {
       this.audio.play();
     }
   }

   playSong() {
     return new Promise((resolve, reject) => {
       this.audio = new Audio(this.currentSong.preview);
       this.audio.autoplay = true;
       this.audio.onerror = reject;
       this.audio.onended = resolve;
     });
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
}
