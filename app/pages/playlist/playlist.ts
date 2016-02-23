import {Page, NavController, NavParams} from 'ionic-framework/ionic';
import {LoginService} from '../../login.service';
import {SongService} from '../../song.service'
import {Song} from '../../song'

@Page({
  templateUrl: 'build/pages/playlist/playlist.html',
  providers: [LoginService, SongService]
})
export class PlaylistPage {
  selectedSong: any;
  // icons: string[];
  // items: Array<{title: string, note: string, icon: string}>;
  songs: Song[];

  constructor(private nav: NavController, navParams: NavParams, private _songService: SongService) {
    // If we navigated to this page, we will have an item available as a nav param
    // this.selectedItem = navParams.get('item');
    this.selectedSong = navParams.get('song');
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

  getSongs() {
    return this._songService.getSongs()
      .then(
        songs => {
          this.songs = songs;
          console.log(this.songs);
      });
  }

  onPageLoaded() {
    this.getSongs();
  }

  songTapped(event, song) {
    this.nav.push(PlaylistPage, {
      song: song
    });
  }
}
