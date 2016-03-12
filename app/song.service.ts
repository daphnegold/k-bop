import {Song} from './song';
import {SONGS} from './mock-songs';
import {Injectable} from 'angular2/core';
import {Headers, RequestOptions} from 'angular2/http';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Storage, LocalStorage} from 'ionic-framework/ionic';
import 'rxjs/Rx';

@Injectable()
export class SongService {
  private _songsUrl = "http://kbop.herokuapp.com/recs/";
  private _addUrl = "http://kbop.herokuapp.com/add"
  local: Storage = new Storage(LocalStorage);
  audio: any;
  paused: boolean;
  songs: Song[];
  played: boolean;
  // currentSong: Song;

  constructor(private http: Http) { }

  addSong(songUri: string) : Observable<any> {
    let user_id = this.local.get('id')._result;
    let body = JSON.stringify({ "data": { uri: songUri, uid: user_id } });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._addUrl, body, options)
        .map(res => res.json())
        .catch(this.handleError)
  }

  getSongs () {
    console.log('calling api');
    let user_id = this.local.get('id')._result;

    return this.http.get(this._songsUrl + user_id)
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
    } else {
      this.stopSong();
    }
  }

  stopSong() {
    if (this.audio) {
      console.log("stop song")
      this.paused = true;
      this.audio.pause();
    }
  }

  removeAudio() {
    if (this.audio) {
      this.paused = false;
      this.audio.pause();
      this.audio = null;
    }
  }

  startSong() {
    if (this.audio) {
      console.log("start song");
      this.paused = false;
      this.audio.play();
    }
  }

  playSong(current) {
    this.paused = false;
    this.played = false;
    console.log("start new song");
    return new Promise((resolve, reject) => {
      if (!this.audio) {
        this.audio = new Audio();
        console.log("new audio object")
      }
      this.audio.src = current.preview;
      this.audio.autoplay = true;
      this.audio.onerror = reject;
      this.audio.onended = resolve;
    });
  }
}
