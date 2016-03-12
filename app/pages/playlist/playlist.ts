import {Page, Alert, NavController, NavParams, Modal, ActionSheet} from 'ionic-framework/ionic';
import {LoginService} from '../../login.service';
import {SongService} from '../../song.service'
import {PlaylistService} from '../../playlist.service';
import {Song} from '../../song'
import {CommentsModal} from '../comments/comments';
import {ArtistFilterPipe, ArtistOrderPipe} from '../../sort.pipe';

@Page({
  templateUrl: 'build/pages/playlist/playlist.html',
  providers: [LoginService],
  pipes: [ArtistFilterPipe, ArtistOrderPipe]
})
export class PlaylistPage {
  selectedSong: any;
  myPlaylist: Song[];
  myLink: string;
  myArtists: Array<string>;
  currentSong: Song;
  searchQuery: string = '';
  showSearch: boolean;
  actionSheet: any;

  constructor(
    private nav: NavController,
    navParams: NavParams,
    private _songService: SongService,
    private _playlistService: PlaylistService
    ){
    this.selectedSong = navParams.get('song');
  }

  onPageWillEnter() {
    this._songService.removeAudio();
    this.getPlaylist();
  }

  showMenu() {
    this.actionSheet = ActionSheet.create({
      buttons: [
        {
          text: 'Clear playlist',
          role: 'destructive',
          handler: () => {
            this.actionSheet.dismiss()
            .then(() => {
              this.confirmClear();
            });
            console.log('Clear clicked');
          }
        },
        {
          text: 'Open in Spotify',
          handler: () => {
            this.launch();
            console.log('Open in Spotify clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    this.nav.present(this.actionSheet);
  }

  launch() {
    cordova.InAppBrowser.open(this.myLink, "_system", "location=true");
  }

  toggleSearch(bool) {
    if (bool) {
      this.showSearch = true;
    } else {
      this.showSearch = false;
    }
  }

  showModal(songInfo) {
    let modal = Modal.create(CommentsModal, songInfo);
    this.nav.present(modal)
  }

  getItems(searchbar) {
    // Reset items back to all of the songs
    // this.myPlaylist = Array.from(this._playlistService.playlist);
    this.myPlaylist.forEach((song) => {
      song.searched = false;
    })
    // set q to the value of the searchbar
    var q = searchbar.value;
    // if the value is an empty string don't filter the songs
    if (q.trim() == '') {
      return;
    }
    this.myPlaylist.forEach((song) => {
      if (song.artist.toLowerCase().indexOf(q.toLowerCase()) > -1 || song.title.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        song.searched = true;
      } else {
        song.searched = false;
      }
    })
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
                error => {
                  console.log(<any>error);
                  window.plugins.toast.show("Something has gone wrong, please try again", "short", "bottom");
                }
              );
          }
        }
      ]
    });
    this.nav.present(confirm);
  }

  deleteSong(song) {
    song.deleted = true;
    let deletedSong = song;
    this._songService.removeAudio();

    this._playlistService.deleteSong(deletedSong.uri)
      .subscribe(
        data => {
          this._playlistService.playlist.delete(deletedSong);
          // this.myPlaylist = Array.from(this._playlistService.playlist).reverse();
          console.log("Server response:");
          console.log(data);
        },
        error => {
          console.log(<any>error);
          deletedSong.deleted = false;
          // this.myPlaylist = Array.from(this._playlistService.playlist).reverse();
          window.plugins.toast.show("Something has gone wrong, please try again", "short", "bottom");
        }
      );
  }

  getPlaylist() {
    if (this._playlistService.playlistFromApi) {
      this.myPlaylist = Array.from(this._playlistService.playlist);
      this.myArtists = this._playlistService.getArtists();
    } else {
      this._playlistService.getPlaylist()
         .subscribe(
           data => {
             this.myPlaylist = Array.from(this._playlistService.playlist);
             this.myLink = this._playlistService.link;
             this.myArtists = this._playlistService.getArtists();
           },
           error => {
             console.log(<any>error);
             window.plugins.toast.show("Something has gone wrong, please try again", "short", "bottom");
           }
         );
    }
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
          window.plugins.toast.show("Something has gone wrong", "short", "bottom");
          this.removeAudio();
          console.error(error);
        });
    }
  }

  nowPlaying(song) {
    if (song === this.currentSong && !this._songService.paused && this._songService.audio) {
      return true;
    }
  }
}
