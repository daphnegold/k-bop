# k-bop

[![Code Climate](https://codeclimate.com/github/daphnegold/k-bop/badges/gpa.svg)](https://codeclimate.com/github/daphnegold/k-bop)

## Contents
- [General information](#information)
  - [Screenshots](#screenshots)
  - [Dependencies](#dependencies)
- [How to contribute](#contributing)
  - [Configuration](#configuration)
  - [Building for Android](#building-for-android)
  - [Resources](#resources)

## Information
K-Bop is a hybrid mobile application developed with Ionic 2. Users authenticate and swipe to build a K-Pop playlist for Spotify.
- [Back end](https://github.com/daphnegold/k-bop-api)
- [Product Plan](https://github.com/daphnegold/k-bop-api/blob/master/product-plan.md)
- [Trello Board](https://trello.com/b/sn0PXJ4Z/k-bop)

### Screenshots
Home View                  |  Playlist View
:-------------------------:|:-------------------------:
![](https://raw.githubusercontent.com/daphnegold/k-bop/master/www/images/swipe-me.png)  |  ![](https://raw.githubusercontent.com/daphnegold/k-bop/master/www/images/view-playlist.png)

### Dependencies
- Ionic 2
- Typescript
- Node.js

## Contributing
1. Fork & clone the repo
2. `cd k-bop-api`
3. Checkout a new branch
4. Win!

### Configuration
Install Node.js  
`brew install node`  

Install Ionic 2  
`npm install -g ionic@beta`  

Install Cordova  
`npm install -g cordova`  

Install Typescript  
`npm install -g typescript`  

Install packages  
`npm install`

Add the platform  
`ionic platform add android`  

### Building for Android
On a mobile device  
`ionic run android`  

In the Android emulator (Android Studio + SDK Manager required)  
`ionic emulate android`

### Resources
[Installing & Running Ionic](http://ionicframework.com/docs/v2/getting-started/installation/)  
[Installing & Using Typescript](http://www.typescriptlang.org/)  
[Angular 2 for Typescript](https://angular.io/docs/ts/latest/index.html)  
