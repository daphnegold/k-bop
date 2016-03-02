import {Page, Alert, NavController, NavParams} from 'ionic-framework/ionic';
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

  confirmClear() {
    let confirm = Alert.create({
      title: 'Clear your playlist?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Ok clicked');

            this._playlistService.deleteSong("all")
              .subscribe(
                data => {
                  this._playlistService.playlist.clear();
                  console.log("Server response:");
                  console.log(data);
                },
                error => { console.log(<any>error); alert("Something has gone wrong, please try again later"); }
              );
          }
        }
      ]
    });
    this.nav.present(confirm);
  }

  deleteSong(song) {
    this._songService.removeAudio();
    let deletedSong = song;
    this._playlistService.deleteSong(deletedSong.uri)
      .subscribe(
        data => {
          this._playlistService.playlist.delete(deletedSong);
          console.log("Server response:");
          console.log(data);
        },
        error => { console.log(<any>error); alert("Something has gone wrong, please try again later"); }
      );
  }

  getPlaylist() {
    if (this._playlistService.playlistFromApi) {
      this.myPlaylist = this._playlistService.playlist;
    } else {
      this._playlistService.getPlaylist()
         .subscribe(
           songs => this.myPlaylist = this._playlistService.playlist,
           error => { console.log(<any>error); alert("Something has gone wrong, please try again later"); }
         );
    }

    // return this.myPlaylist = this._playlistService.getPlaylist();

    // return this._playlistService.getPlaylist()
    //   .then(
    //     songs => {
    //       this.myPlaylist = songs;
    //       console.log(this.myPlaylist);
    //   });
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
      this._songService.playSong(song)
        .then((success) => {
          this.currentSong = null;
          this._songService.stopSong();
          console.log("Preview 100% complete")
        }, (error) => {
          alert("Something has gone wrong");
        });
    }
  }

  nowPlaying(song) {
    if (song === this.currentSong && !this._songService.paused) {
      return true;
    }
  }
}
