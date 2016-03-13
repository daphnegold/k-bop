import {Injectable} from 'angular2/core';
import {Song} from './song';
import {Headers, RequestOptions} from 'angular2/http';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Storage, LocalStorage} from 'ionic-framework/ionic';
import 'rxjs/Rx';

@Injectable()
export class CommentService {
  private _commentUrl = "https://www.k-bop.ninja/comment/"
  local: Storage = new Storage(LocalStorage);

  constructor (private http: Http) { }

  addComment(song, commentText) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let user_id = this.local.get('id')._result;
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({ "data": { uri: song.uri, comment: commentText, uid: user_id} });

    return this.http.post(this._commentUrl, body, options)
        .map(res => res.json())
        .catch(this.handleError)
  }

  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
