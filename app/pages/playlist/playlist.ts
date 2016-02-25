import {Page, NavController, NavParams} from 'ionic-framework/ionic';

import {LoginService} from '../../login.service';
import {SongService} from '../../song.service'
import {PlaylistService} from '../../playlist.service';

import {Song} from '../../song'
// import {Playlist} from '../../playlist';

@Page({
  templateUrl: 'build/pages/playlist/playlist.html',
  providers: [LoginService, SongService]
})
export class PlaylistPage {
  // icons: string[];
  // items: Array<{title: string, note: string, icon: string}>;

  selectedSong: any;
  songs: Song[];
  myPlaylist: Set<{}>;

  constructor(
    private nav: NavController,
    navParams: NavParams,
    private _songService: SongService,
    private _playlistService: PlaylistService
  ){
    this.selectedSong = navParams.get('song');

    // If we navigated to this page, we will have an item available as a nav param
    // this.selectedItem = navParams.get('item');
    // this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    // 'american-football', 'boat', 'bluetooth', 'build'];

    // this.items = [];
    // for(let i = 1; i < 11; i++) {
    //   this.items.push({
    //     title: 'Item ' + i,
    //     note: 'This is item #' + i,
    //     icon: this.icons[Math.floor(Math.random() * this.icons.length)]
    //   });
    // }
  }

  deleteSong(song) {
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
    // this.getSongs();
  }

  songTapped(event, song) {
    this.nav.push(PlaylistPage, {
      song: song
    });
  }
}
