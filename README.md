# Serverless WebRTC Chat
This is a serverless, encrypted, p2p chat. It is available on:
* [Web](https://adam-hanna.github.io/serverless-webrtc/)
* iOS, and
* [Android](https://play.google.com/store/apps/details?id=org.unicomm)

It is a fork of [cjb / serverless-webrtc](https://github.com/cjb/serverless-webrtc) that extends that library to iOS and Android.

Two users who wish to chat with each other exchange png's which contain encoded information. This encoded information is used to establish the connection between the two parties.

There is no third party involved (except stun:23.21.150.121, of Amazon.com, which is used to ascertain the two party's IP addresses), so there is no record kept of the conversation (except for maybe by the ISP), and the data (which is encrypted) is transmitted directly between the two parties. Finally, and best of all, the source code is open and provided, here.

## Preview
<img src="./desktop.png" width="250">

<img src="./mobile_wPhone.png" width="250">

## Usage
### Web
To start the web version (for various reasons, running from the static index.html file in the cordova/platforms/browser/www folder may not work):

~~~ bash
serverless-webrtc 		$ cd vue
serverless-webrtc/vue 	$ npm run dev
~~~

### iOS
~~~ bash
serverless-webrtc 			$ cd vue
serverless-webrtc/vue 		$ npm run build
serverless-webrtc/vue 		$ cd .. && cd cordova
serverless-webrtc/cordova 	$ cordova build ios
~~~

### Android
~~~ bash
serverless-webrtc 			$ cd vue
serverless-webrtc/vue 		$ npm run build
serverless-webrtc/vue 		$ cd .. && cd cordova
serverless-webrtc/cordova 	$ cordova build android
~~~

## TODO
1. Release for other platforms (Windows Phone, Amazon Fire OS, Firefox OS, Tizen, etc.). Any help here would be greatly appreciated. Feel free to release working apps to those stores.
2. Finish file transfer functionality.
3. General UI / UX improvements.
4. Tests!