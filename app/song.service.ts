import {Song} from './song';
import {SONGS} from './mock-songs';
import {Injectable} from 'angular2/core';
import {Headers, RequestOptions} from 'angular2/http';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class SongService {
  private _songsUrl = "http://kbop.herokuapp.com/recs";
  private _addUrl = "http://kbop.herokuapp.com/add"
  audio: any;
  paused: boolean;
  songs: Song[];
  played: boolean;
  // currentSong: Song;

  constructor(private http: Http) { }

  addSong(songUri: string) : Observable<Song>  {
    let body = JSON.stringify({ "data": { uri: songUri, user: "darkwingdaphne" } });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._addUrl, body, options)
        .map(res => res.json())
        .catch(this.handleError)
  }


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
      this.audio = new Audio(current.preview);
      this.audio.autoplay = true;
      this.audio.onerror = reject;
      this.audio.onended = resolve;
    });
  }
}
