// import {Playlist} from './playlist';
import {Injectable} from 'angular2/core';

@Injectable()
export class PlaylistService {
  playlist: Set<{}> = new Set();

  constructor () { }

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

  getPlaylist() {
    return Promise.resolve(this.playlist);
  }
}
