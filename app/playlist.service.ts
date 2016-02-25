import {Playlist} from './playlist';
import {Injectable} from 'angular2/core';

@Injectable()
export class PlaylistService {
  playlist: Playlist[] = [];

  constructor () { }

  addSong(song) {
    this.playlist.push(song);
    console.log("Added song:");
    console.log(song);
  }

  deleteSong(song) {
    // a.splice(a.indexOf(4))
    this.playlist.splice(this.playlist.indexOf(song));
    console.log("Deleted song:");
    console.log(song);
  }

  getPlaylist() {
    return Promise.resolve(this.playlist);
  }
}
