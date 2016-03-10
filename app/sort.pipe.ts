import {Pipe} from "angular2/core";
import {Song} from "./song";

@Pipe({
  name: "sort"
})
export class PlaylistSortPipe {
  transform(array: Song[], args: Song): Song[] {
    array.sort((a: any, b: any) => {
      if (a.artist.toLowerCase() < b.artist.toLowerCase()) {
        return -1;
      } else if (a.artist.toLowerCase() > b.artist.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
