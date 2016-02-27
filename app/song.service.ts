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

  constructor(private http: Http) { }

  getSongs () {
    return this.http.get(this._songsUrl)
      .map(res => <Song[]> res.json())
      .do(data => console.log(data))
      .catch(this.handleError);
  }

  private handleError (error: Response) {
    // in a real world app, we may send the error to some remote logging infrastructure
    // instead of just logging it to the console
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
    if (this.audio) {
      this.audio.pause();
    }
  }

  startSong() {
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
