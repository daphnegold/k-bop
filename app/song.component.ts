import {Component, OnInit} from 'angular2/core';
import {Song}              from './song';
import {SongService}       from './song.service';
import {PlaylistService} from './playlist.service';

@Component({
  selector: 'song',
  template: `
  <ion-item>
    <ion-avatar item-right>
      <ion-icon name="md-musical-note" item-right></ion-icon>
    </ion-avatar>
    <h2>{{ currentSong.artist }}</h2>
  </ion-item>

  <img [src]="currentSong.image" (click)="toggleSong()">

  <ion-card-content>
    <h4>{{ currentSong.title }}</h4>
  </ion-card-content>

  <ion-item class="deciders">
      <button dark clear round item-left (click)="decide(false)">
        <ion-icon name="sad"></ion-icon>
      </button>
      <button dark clear round item-right (click)="decide(true)">
        <ion-icon name="happy"></ion-icon>
      </button>
  </ion-item>
  `,
  styles: ['.error {color:red;}']
})
export class SongComponent implements OnInit {
  errorMessage: string;
  songs: Song[];
  currentSong: Song;
  audio: any;
  paused: boolean;

  constructor (private _songService: SongService, private _playlistService: PlaylistService) { }
  ngOnInit() { this.getSongs(); }

  getSongs() {
    this._songService.getSongs()
       .subscribe(
         songs => this.songs = songs,
         error =>  this.errorMessage = <any>error);
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
}
