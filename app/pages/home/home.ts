import {Page, NavController, Modal} from 'ionic-framework/ionic';
import {PlaylistService} from '../../playlist.service';
import {SongService} from '../../song.service';
import {HammerService} from '../../hammer.service';
import {Song} from '../../song'
import {CommentsModal} from '../comments/comments';
import {IntroPage} from '../intro/intro';

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [HammerService]
})
export class HomePage {
  songs: Song[];
  currentSong: Song;
  pullable: boolean = true;
  refresherPulled: boolean;
  lastSongChoice: boolean;
  hideImage: boolean = false;

  constructor(
    private _playlistService: PlaylistService,
    private _songService: SongService,
    private _hammerService: HammerService,
    private nav: NavController) { }

  showModal(songInfo) {
    let modal = Modal.create(CommentsModal, songInfo);
    this.nav.present(modal)
  }

  onPageWillEnter() {
    this._hammerService.swipeInit();
    this._hammerService.hammertime.on('swiperight', (event) => {
      if (this._songService.songs) {
        console.log('Swipe right');
        setTimeout(() => {
          this.hideImage = true;
        }, 500);
        this.currentSong.decided = true;
        this.currentSong.choice = true;
        this.decide(true);
      }
    });
    this._hammerService.hammertime.on('swipeleft', (event) => {
      if (this._songService.songs) {
        console.log('Swipe left');
        setTimeout(() => {
          this.hideImage = true;
        }, 500);
        this.currentSong.decided = true;
        this.currentSong.choice = false;
        this.decide(false);
      }
    });

    console.log(this._hammerService.hammertime);

    if (this._songService.songs) {
      this._songService.removeAudio();
      this.currentSong = this._songService.songs[0];

      if (!this._songService.audio) {
        this.songTime();
      }
    }
  }

  onPageWillLeave() {
    console.log("leaving page")
    this._hammerService.swipeDestroy();
  }

  getSongs() {
    if (this._songService.songs) {
      console.log(this._songService.songs.length)
    }

    if (!this._songService.songs || this._songService.songs.length < 10) {

      this._songService.getSongs()
         .subscribe(
           songs => {
             this._songService.songs = songs;
             if (!this.currentSong) {
               this.currentSong = this._songService.songs[0];

               if (!this._songService.audio) {
                 this.songTime();
               }
             }

             console.log(this.currentSong)},
           error => {
             console.log(<any>error);
             window.plugins.toast.show("Something has gone wrong, please try again", "short", "bottom");
           }
         );
    } else {
      this.currentSong = this._songService.songs[0];

      if (!this._songService.audio) {
        this.songTime();
      }
    }
  }

  toggleSong() {
    if (this._songService.played) {
      this._songService.played = false;

      this.songTime();
    } else {
      this._songService.toggleSong();
    }
  }

  stopSong() {
    this._songService.stopSong();
  }

  removeAudio() {
    this._songService.removeAudio();
  }

  startSong() {
    this._songService.startSong();
  }

  playSong() {
    return this._songService.playSong(this.currentSong);
  }

  decide(choice) {
    this._songService.songs.splice(this._songService.songs.indexOf(this.currentSong), 1);
    console.log(this._songService.songs.length);

    if (this._songService.songs.length < 10) {
      this.getSongs();
    }

    if (choice) {
      let addedSong = this.currentSong

      if (this._playlistService.playlist.has(addedSong)) {
        console.log("Already exists:");
        console.log(addedSong);
      } else {
        this._songService.addSong(addedSong.uri)
          .subscribe(
            data => {
              if (data.status !== "Entry already exists") {
                this._playlistService.addSong(addedSong);
              }
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

    let randomNumber = Math.round(Math.random() * (this._songService.songs.length - 1));
    let nextSong = this._songService.songs[randomNumber];
    setTimeout(() => {
      this.hideImage = false;
      this.currentSong = nextSong;
      this.songTime();
    }, 500);
  }

  songTime() {
    this.playSong().then((success) => {
      this._songService.played = true;
      this._songService.stopSong();
      console.log("Preview complete")
    }, (error) => {
      window.plugins.toast.show("Something has gone wrong", "short", "bottom");
      this.removeAudio();
      console.error(error);
    });
  }

  doRefresh(refresher) {
    if (this.pullable) {
      console.log('Doing Refresh', refresher)
      if (this._songService.audio) {
        this._songService.removeAudio();
      }
      this.getSongs();
      this.pullable = false;
      this.refresherPulled = true;

      setTimeout(() => {
        refresher.complete();
        console.log("Complete");
        this.pullable = true;
        this.refresherPulled = false;
       }, 10000);
    }
  }
}
