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
  playlist: Set<{}> = new Set();

  constructor (private http: Http) { }

  getPlaylist() {
    // return Promise.resolve(this.playlist);
    console.log('calling api');

    return this.http.get(this._playlistUrl + "darkwingdaphne")
      .map(res => <Song[]> res.json())
      .do(songs => {
        songs.forEach((song) => {
          this.playlist.add(song);
        });
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

  deleteSong(song) {
    // a.splice(a.indexOf(4))
    this.playlist.delete(song);
    console.log("Deleted song:");
    console.log(song);
  }
}
