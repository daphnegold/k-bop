import {Song} from './song';
import {SONGS} from './mock-songs';
import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
// import {Observable}     from 'rxjs/Observable';
// import 'rxjs/Rx';

@Injectable()
export class SongService {
  private _songsUrl = "http://kbop.herokuapp.com/songs";  // URL to web api

  constructor(private http: Http) { }

  getSongs() {
    return this.http.get(this._songsUrl)
      .toPromise()
      .then(res => <Song[]> res.json().data, this.handleError)
      .then(data => { console.log(data); return data; });
    // return Promise.resolve(SONGS);
  }

  private handleError (error: Response) {
    // in a real world app, we may send the error to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Promise.reject(error.json().error || 'Server error');
  }
}
