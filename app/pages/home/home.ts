import {Page, NavController} from 'ionic-framework/ionic';
import {LoginService} from '../../login.service';
import {Song} from '../../song'
import {SongService} from '../../song.service'

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

  onPageLoaded() {
    this.getSongs();
  }

  loggedIn() {
    this._loginService.loggedIn();
  }

  login() {
    this._loginService.login();
  }
}
