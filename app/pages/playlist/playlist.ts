import {Page, NavController, NavParams} from 'ionic-framework/ionic';
import {LoginService} from '../../login.service';
import {SongService} from '../../song.service'
import {PlaylistService} from '../../playlist.service';
import {Song} from '../../song'

@Page({
  templateUrl: 'build/pages/playlist/playlist.html',
  providers: [LoginService]
})
export class PlaylistPage {
  selectedSong: any;
  myPlaylist: Set<{}>;
  currentSong: Song;

  constructor(
    private nav: NavController,
    navParams: NavParams,
    private _songService: SongService,
    private _playlistService: PlaylistService
  ){
    this.selectedSong = navParams.get('song');
  }

  deleteSong(song) {
    this._songService.removeAudio();
    this._playlistService.deleteSong(song);
  }

  getPlaylist() {
    // return this.myPlaylist = this._playlistService.getPlaylist();

    return this._playlistService.getPlaylist()
      .then(
        songs => {
          this.myPlaylist = songs;
          console.log(this.myPlaylist);
      });
  }

  onPageLoaded() {
    this.getPlaylist();
  }

  // songTapped(event, song) {
  //   this.nav.push(PlaylistPage, {
  //     song: song
  //   });
  // }

  removeAudio() {
    this._songService.removeAudio();
  }

  stopSong() {
    this._songService.stopSong();
  }

  playSong(song) {
    if (song === this.currentSong && this._songService.audio) {
      this._songService.stopSong();
      this.currentSong = null;
    } else {
      this._songService.stopSong();
      this.currentSong = song;
      return this._songService.playSong(song);
    }
  }

  nowPlaying(song) {
    if (song === this.currentSong) {
      return true;
    }
  }
}
