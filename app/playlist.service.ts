// import {Playlist} from './playlist';
import {Injectable} from 'angular2/core';
import {Song} from './song';
import {Headers, RequestOptions} from 'angular2/http';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Storage, LocalStorage} from 'ionic-framework/ionic';
import 'rxjs/Rx';

@Injectable()
export class PlaylistService {
  private _playlistUrl = "http://kbop.herokuapp.com/playlist/"
  private _deleteUrl = "http://kbop.herokuapp.com/user/"
  playlist: Set<{}> = new Set();
  playlistFromApi: boolean;
  local: Storage = new Storage(LocalStorage);

  constructor (private http: Http) { }

  deleteSong(song) {
    // this.playlist.delete(song);
    // console.log("Deleted song:");
    // console.log(song);

    let uid = this.local.get('id')._result;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete(this._deleteUrl + uid + "/song/" + song.uri, options)
        .map(res => res.json())
        .catch(this.handleError)
  }

  getPlaylist() {
    let uid = this.local.get('id')._result;
    // return Promise.resolve(this.playlist);
    console.log('calling api');

    return this.http.get(this._playlistUrl + uid)
      .map(res => <Song[]> res.json())
      .do(songs => {
        songs.forEach((song) => {
          this.playlist.add(song);
        });
        this.playlistFromApi = true;
        console.log(this.playlist);
       })
      .catch(this.handleError);
  }

  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  addSong(song) {
    this.playlist.add(song);
    console.log("Added song:");
    console.log(song);
  }
}
