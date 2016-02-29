import {Injectable} from "angular2/core";

@Injectable()
export class HammerService {
  hammertime: any;
  cardElement: any;

  swipeInit() {
    this.cardElement = this.cardElement || document.getElementById('swiperrific');
    this.hammertime = this.hammertime || new Hammer(this.cardElement);
  }
}
