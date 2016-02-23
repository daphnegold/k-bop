import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Headers, RequestOptions} from 'angular2/http';
import {Token} from "./token";
import 'rxjs/Rx';

@Injectable()
export class LoginService {
  constructor (private http: Http) {}

  private _tokenUrl = 'https://accounts.spotify.com/api/token';

  getToken(userCode: string) : Observable<Token> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let clientId = '3fe64739f9b84775a7ef6e4ec61d19b6';
    let clientSecret = '';

    let body = "grant_type=authorization_code&code=" + userCode + "&redirect_uri=http://localhost/callback&client_id=3fe64739f9b84775a7ef6e4ec61d19b6&client_secret=a4c625681cab4b4d8052b1ba0268bb52"

    const response = this.http.post(this._tokenUrl, body)
    console.log(response)
    return response
                    .map(res => <Token> res.json().data)
                    .catch(this.handleError)

  }

  private handleError (error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
