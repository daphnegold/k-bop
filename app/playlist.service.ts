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
  private _playlistUrl = "https://k-bop.ninja/playlist/"
  private _deleteUrl = "https://k-bop.ninja/user/"
  playlist: Set<{}> = new Set();
  link: string;
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

    return this.http.delete(this._deleteUrl + uid + "/song/" + song, options)
        .map(res => res.json())
        .catch(this.handleError)
  }

  getArtists() : Array<string> {
    let artists = [];
    this.playlist.forEach((song: Song) => {
      artists.push(song.artist);
    });

    return artists.filter((item, i, ary) => { return ary.indexOf(item) === i; });
  }

  getPlaylist() {
    let uid = this.local.get('id')._result;
    console.log('calling api');

    return this.http.get(this._playlistUrl + uid)
      .map(res => res.json().data)
      .do(data => {
        this.playlist = new Set();
        this.playlistFromApi = true;
        this.link = data.link;

        data.songs.forEach((song) => {
          this.playlist.add(song);
        });

        console.log(this.playlist);
        console.log(this.link);
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
