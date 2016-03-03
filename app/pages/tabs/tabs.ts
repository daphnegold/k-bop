import {Page, NavController} from 'ionic-framework/ionic';
import {HomePage} from '../home/home';
import {PlaylistPage} from '../playlist/playlist';

@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = PlaylistPage;
}
