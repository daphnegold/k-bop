import {Page, NavController} from 'ionic-framework/ionic';
import {LoginService} from '../../login.service';
import {SongService} from '../../song.service'
import {Song} from '../../song'
import {PlaylistService} from '../../playlist.service';

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [LoginService, SongService]
})
export class HomePage {
  songs: Song[];
  currentSong: Song;
  audio: any;
  paused: boolean;

  constructor(
    private _loginService: LoginService,
    private _songService: SongService,
    private _playlistService: PlaylistService) { }

  playSong() {
    return new Promise((resolve, reject) => {
      this.audio = new Audio(this.currentSong.preview);
      this.audio.autoplay = true;
      this.audio.onerror = reject;
      this.audio.onended = resolve;
    });
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

  toggleSong() {
    if (this.paused) {
      this.startSong();
      this.paused = false
    } else {
      this.stopSong();
      this.paused = true
    }
  }

  getSongs() {
    return this._songService.getSongs()
      .then(
        songs => {
          this.songs = songs;
          this.currentSong = this.songs[0];
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

  onPageLoaded() {
    this.getSongs().then(() => {
      this.playSong().then((success) => {
        console.log("Preview complete")
      }, (error) => {
        alert("Something has gone wrong");
      });
    })
  }

  loggedIn() {
    return this._loginService.loggedIn();
  }

  login() {
    this._loginService.login();
  }
}
