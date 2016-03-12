import {Pipe} from "angular2/core";
import {Song} from "./song";

@Pipe({
  name: "artistFilter"
})
export class ArtistFilterPipe {
  transform(array, args) {
    let artistSongs = [];
    array.forEach((song) => {
      if (song.artist.toLowerCase() === args[0].toLowerCase()) {
        artistSongs.push(song);
      }
    });
    return artistSongs;
  }
}

@Pipe({
  name: "artistOrder"
})
export class ArtistOrderPipe {
  transform(array: Array<string>, args: string) {
    array.sort((a: any, b: any) => {
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      } else if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
