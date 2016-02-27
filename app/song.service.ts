import {Song} from './song';
import {SONGS} from './mock-songs';
import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class SongService {
  private _songsUrl = "http://kbop.herokuapp.com/songs";
  audio: any;
  paused: boolean;
  songs: Song[];
  // currentSong: Song;

  constructor(private http: Http) { }

  getSongs () {
    console.log('calling api');

    return this.http.get(this._songsUrl)
      .map(res => <Song[]> res.json())
      .do(data => console.log(data))
      .catch(this.handleError);
  }

  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
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
    console.log("stop song")
    if (this.audio) {
      this.audio.pause();
    }
  }

  removeAudio() {
    if (this.audio) {
      this.audio.pause()
      this.audio = null;
    }
  }

  startSong() {
    console.log("start song")
    if (this.audio) {
      this.audio.play();
    }
  }

  playSong(current) {
    return new Promise((resolve, reject) => {
      this.audio = new Audio(current.preview);
      this.audio.autoplay = true;
      this.audio.onerror = reject;
      this.audio.onended = resolve;
    });
  }
}
