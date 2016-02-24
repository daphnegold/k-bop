import {Page, NavController} from 'ionic-framework/ionic';
import {LoginService} from '../../login.service';
import {SongService} from '../../song.service'
import {Song} from '../../song'

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [LoginService, SongService]
})
export class HomePage {
  songs: Song[];
  currentSong: Song;

  constructor(private _loginService: LoginService, private _songService: SongService) { }

  getSongs() {
    return this._songService.getSongs()
      .then(
        songs => {
          this.songs = songs;
          this.currentSong = this.songs[0];
      });
  }

  decide(choice) {
    let randomNumber = Math.round(Math.random() * (this.songs.length - 1));

    this.currentSong = this.songs[randomNumber];
  }

  onPageLoaded() {
    this.getSongs();
  }

  loggedIn() {
    return this._loginService.loggedIn();
  }

  login() {
    this._loginService.login();
  }
}
