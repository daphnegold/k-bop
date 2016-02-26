import {Song} from './song';
import {SONGS} from './mock-songs';
import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class SongService {
  private _songsUrl = "http://kbop.herokuapp.com/songs";
  // private _songsUrl = "app/songs"

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
}
