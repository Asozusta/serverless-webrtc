<template>
  <div id="mainContainer" class="container">
    <div class="row">
      <div id="mobileView" class="col-xs-12 col-sm-12 hidden-md hidden-lg hidden-xl">
        <fieldset class="well">
          <div id="chatlog" class="text-info">
          </div>
        </fieldset>
        <div id="videoWrapper">
          <video id="localVideo" class="z10" muted="muted"></video>
          <video id="remoteVideo" class="z5" ></video>
        </div>
        <div id="chatWrapper">
          <form class="form-inline" v-on:submit.prevent="sendMessage" action="">
            <textarea id="messageTextBox" type="text" placeholder="Type your message here"></textarea>
            <button id="sendMessageBtn" type="submit" class="btn btn-primary">Send message</button>
          </form>
        </div>
      </div>
      <div id="desktopView" class="hidden-xs hidden-sm col-md-12 col-lg-12 col-xl-12">
        <div id="videoWrapper">
          <video id="localVideo" muted="muted" class="z10"></video>
          <div></div>
          <video id="remoteVideo" class="z5"></video>
        </div>
        <div id="chatWrapper">
          <fieldset class="well">
            <div id="chatlog" class="text-info">
            </div>
          </fieldset>
          <form class="form-inline" v-on:submit.prevent="sendMessage" action="">
            <textarea id="messageTextBox" type="text" placeholder="Type your message here"></textarea>
            <button id="sendMessageBtn" type="submit" class="btn btn-primary">Send message</button>
          </form>
        </div>
      </div>
    </div>


    <div class="modal fade" id="showLocalOffer" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" hidden>
      <div class="modal-dialog" role="document">
        <div class="modal-content">      
          <div class="modal-header">
            <h3 id="myModalLabel">Send your local offer to someone else</h3>
          </div>
          <div class="modal-body">
            Here's your "offer" -- it tells someone else how to connect to you.  Send the whole thing to them, for example in an instant message or e-mail.
          <br/>
          <img id="localOfferImg" class="codedImg" />
          </div>
          <div class="modal-footer">
            <button id="shareButton" v-if="bCordova" v-on:click="shareLocalOffer" type="button" class="btn btn-success">Share</button>
            <button id="offerSentBtn" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">Okay, I sent it.</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="showLocalAnswer" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" hidden>
      <div class="modal-dialog" role="document">
        <div class="modal-content">      
          <div class="modal-header">
            <h3 id="myModalLabel">Send your local answer to someone else</h3>
          </div>
          <div class="modal-body">
            Here's your "answer" -- it tells someone else how to connect to you.  Send the whole thing to them, for example in an instant message or e-mail.
          <br/>
          <img id="localAnswerImg" class="codedImg" />
          </div>
          <div class="modal-footer">
            <button id="shareButton" v-if="bCordova" v-on:click="shareLocalAnswer" type="button" class="btn btn-success">Share</button>
            <button class="btn btn-primary" id="answerSentBtn" data-dismiss="modal" aria-hidden="true">Okay, I sent it.</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="getRemoteOffer" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" hidden>
      <div class="modal-dialog" role="document">
        <div class="modal-content">      
          <div class="modal-header">
            <h3 id="myModalLabel">Paste the "offer" you received</h3>
          </div>
          <div class="modal-body">
            The person who created the room will send you an "offer". It will be a png image. Hit the "Select Image" button, below, to find it on your hard drive.
            <br/>
            <img id="remoteOfferImg" class="codedImg" />
          </div>
          <div class="modal-footer">
            <input id="uploadRemoteOffer" class="custom-file-input" type="file" accept="image/png" data-content='Select Image' v-on:change="readRemoteOffer"/>
            <button class="btn btn-primary" id="offerRecdBtn" data-dismiss="modal" aria-hidden="true">Okay, I pasted it.</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="getRemoteAnswer" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" hidden>
      <div class="modal-dialog" role="document">
        <div class="modal-content">      
          <div class="modal-header">
            <h3 id="myModalLabel">Paste the "answer" you received</h3>
          </div>
          <div class="modal-body">
            Now paste in the "answer" that was sent back to you.  It will be a png image. Hit the "Select Image" button, below, to find the image on your hard drive.
          <br/>
          <img id="remoteAnswerImg" class="codedImg" />
          </div>
          <div class="modal-footer">
            <input id="uploadRemoteAnswer" class="custom-file-input" type="file" accept="image/png" data-content='Select Image' v-on:change="readRemoteAnswer"/>
            <button class="btn btn-primary" id="answerRecdBtn" data-dismiss="modal" aria-hidden="true">Okay, I pasted it.</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="waitForConnection" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" hidden>
      <div class="modal-dialog" role="document">
        <div class="modal-content">    
          <div class="modal-header">
            <h3 id="myModalLabel">Waiting for connection</h3>
          </div>
          <div class="modal-body">
            This dialog will disappear when a connection is made.
          </div>
          <div class="spinner" align="center">
            <img src="../assets/img/spinner.gif"></img>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="createOrJoin" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">    
          <div class="modal-header">
            <h3 id="myModalLabel">Create or join a room?</h3>
          </div>
          <div class="modal-footer">
            <button class="btn" id="joinBtn" data-dismiss="modal" aria-hidden="true">Join</button>
            <button class="btn btn-primary" id="createBtn" data-dismiss="modal" aria-hidden="true">Create</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Store from '../store/store.js'
  import MyRTC from '../assets/js/WebRTC.js'
  import pngCipher from '../assets/js/pngCipher-0.0.7.min.js'

  function run() {
    $('#showLocalOffer').modal('hide')
    $('#getRemoteAnswer').modal('hide')
    $('#waitForConnection').modal('hide')
    $('#createOrJoin').modal('show')

    $('#createBtn').click(function () {
      $('#showLocalOffer').modal('show')
      window.myRTC.createLocalOffer()
    })

    $('#joinBtn').click(function () {
      navigator.getUserMedia = navigator.getUserMedia ||
                               navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia ||
                               navigator.msGetUserMedia
      navigator.getUserMedia({video: true, audio: true}, function (stream) {
        var video = document.getElementById('localVideo')
        video.src = window.URL.createObjectURL(stream)
        video.play()
        // if ( navigator.userAgent.match(/(iPhone|iPod|iPad)/) ) $("#localVideo").hide()
        window.myRTC.pc2.addStream(stream)
      }, function (error) {
        console.log('Error adding stream to pc2: ' + error)
      })
      $('#getRemoteOffer').modal('show')
    })

    $('#offerSentBtn').click(function () {
      $('#getRemoteAnswer').modal('show')
    })

    $('#offerRecdBtn').click(function () {
      var offer = $("#remoteOfferImg").attr("src").replace("data:image/png;base64,", "");
      pngCipher.decode(
        offer,
        function(error) {
          if ( error ) alert("There's been an error!\n\n" + error);
        },
        function(text) {
          if ( text ) {
            var offerDesc = new window.myRTC.RTCSessionDescription(JSON.parse(text))
            console.log('Received remote offer', offerDesc)
            window.myRTC.writeToChatLog('Received remote offer', 'text-success')
            window.myRTC.handleOfferFromPC1(offerDesc)
            $('#showLocalAnswer').modal('show')
          }
        }
      );
    })

    $('#answerSentBtn').click(function () {
      $('#waitForConnection').modal('show')
    })

    $('#answerRecdBtn').click(function () {
      var answer = $("#remoteAnswerImg").attr("src").replace("data:image/png;base64,", "");
      pngCipher.decode(
        answer,
        function(error) {
          if ( error ) alert("There's been an error!\n\n" + error);
        },
        function(text) {
          if ( text ) {
            var answerDesc = new window.myRTC.RTCSessionDescription(JSON.parse(text))
            window.myRTC.handleAnswerFromPC2(answerDesc)
            $('#waitForConnection').modal('show')
          }
        }
      );
    })

    $('#fileBtn').change(function () {
      var file = this.files[0]
      console.log(file)

      window.myRTC.sendFile(file)
    })

    if ( navigator.userAgent.match(/(iPhone|iPod|iPad)/) ) {
      $("#localVideo").removeClass("z10");
      $("#localVideo").addClass("zMinus1");
      $("#remoteVideo").removeClass("z5");
      $("#remoteVideo").addClass("zMinus5");
      $("html, body, #app, #mainContainer, #mainContainer > .row, #mobileView, #mobileView #videoWrapper").css({
        "background-color": "transparent"
      })

      $("#messageTextBox").on("blur", function() {console.log("blur");
        setTimeout(function(){
          $("#localVideo").show();
          $("#remoteVideo").show();
          cordova.plugins.iosrtc.refreshVideos();
          $("#localVideo").hide();
          $("#remoteVideo").hide();
        }, 700);
      })

      $(window).on("resize", function() {console.log("resize");
        setTimeout(function(){
          $("#localVideo").show();
          $("#remoteVideo").show();
          cordova.plugins.iosrtc.refreshVideos();
          $("#localVideo").hide();
          $("#remoteVideo").hide();
        }, 700);
      })
    }

    console.log("done running");
  }

  export default {
    components: {
      
    },
    data: function() {
        return {
            'sharedState': Store.state.appData,
            'bCordova': true
        };
    },
    ready: function() {
      if ( navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/) ) {
        // cordova!
        this.bCordova = true;
        $("#desktopView").remove();

        if ( window.device ) {
          // device ready
          run();
        } else {
          // device not ready
          document.addEventListener('deviceready', function () {
            run();
          });
        };
      } else {console.log("not cordova");
        // not cordova
        this.bCordova = false;
        $("#mobileView").remove();

        run();
      };
    },
    methods: {
      shareLocalOffer: function() {
        var options = {};
        options['files'] = [$("#localOfferImg").attr("src")];

        window.plugins.socialsharing.shareWithOptions(options, function() {}, function() {});
      },
      shareLocalAnswer: function() {
        var options = {};
        options['files'] = [$("#localAnswerImg").attr("src")];

        window.plugins.socialsharing.shareWithOptions(options, function() {}, function() {});
      },
      readRemoteOffer: function() {
        if ( $("#uploadRemoteOffer")[0].files.length > 0 ) {
          var file    = $("#uploadRemoteOffer")[0].files[0];
          var preview = $("#remoteOfferImg");
          var reader  = new FileReader();

          reader.onloadend = function () {
            $("#remoteOfferImg").attr('src', reader.result);
          }

          if (file) {
            reader.readAsDataURL(file);
          } else {
            preview.src = "";
          }
        } else {
          // no img selected
        }
      },
      readRemoteAnswer: function() {
        if ( $("#uploadRemoteAnswer")[0].files.length > 0 ) {
          var file    = $("#uploadRemoteAnswer")[0].files[0];
          var preview = $("#remoteAnswerImg");
          var reader  = new FileReader();

          reader.onloadend = function () {
            $("#remoteAnswerImg").attr('src', reader.result);
          }

          if (file) {
            reader.readAsDataURL(file);
          } else {
            preview.src = "";
          }
        } else {
          // no img selected
        }
      },
      sendMessage: function() {
        if ($('#messageTextBox').val()) {
          var channel = new window.myRTC.RTCMultiSession()
          window.myRTC.writeToChatLog($('#messageTextBox').val(), 'text-success')
          channel.send({message: $('#messageTextBox').val()})
          $('#messageTextBox').val('')

          // Scroll chat text area to the bottom on new input.
          $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight)
        }

        return false
      }
    },
    computed: {

    }
  }
</script>

<style scoped>
  #mainContainer {
    height: 100%;
    width: 100%;

    padding: 15px;
  }

  #mainContainer .row {
    height: 100%;
  }

  #mobileView, #desktopView {
    width: 100%;
    height: 100%;
  }

  #mobileView #videoWrapper {
    width: 100%;
    height: calc((100% - 100px - 30px) * .35);

    position: relative;

    text-align: center;

    background-color: black;
  }

  #desktopView #videoWrapper {
    width: 50%;
    height: 100%;

    text-align: center;

    background-color: black;

    display: inline-block;

    float: left;
  }

  #mobileView #remoteVideo {
    height: 100%;
    width: auto;

    position: relative;
  }

  #mobileView #localVideo {
    height: 35%;
    width: auto;

    position: absolute;

    left: 5%;
    bottom: 5%;
  }

  #desktopView #localVideo, #desktopView #remoteVideo {
    height: 50%;
    width: auto;
  }

  .codedImg {
    width: 50%;
    height: auto;

    margin-left: 25%;
  }

  .modal-body {
    max-height: calc(100vh - 60px - 155px - 10px); /* 60 for margin, 155 for modal header/footer and 10 for buffer */

    overflow-y: auto;
  }

  #desktopView textarea {
    width: 100%;
    height: 70px;
  }

  textarea {
    resize: none;

    max-width: 100%;
  }

  /*
  input {
    width: 100%;

    margin-bottom: 10px;
  }

  video {
     width: 100%;
     height: auto;
  }

  */
  .custom-file-input::-webkit-file-upload-button {
    visibility: hidden;
  }

  .custom-file-input {
    background-color: white !important;
    color: white !important;

    display: inline-block;

    padding: 0px !important;
    margin: 0px !important;

    width: 120px;
    height: 36px;
    position: relative;
    top: 28px;
  }

  .custom-file-input::before {
    content: attr(data-content);

    display: inline-block;

    padding: 7px;
    border-radius: 4px;

    background-image: -webkit-linear-gradient(top,#5cb85c 0,#419641 100%);
    background-image: -o-linear-gradient(top,#5cb85c 0,#419641 100%);
    background-image: -webkit-gradient(linear,left top,left bottom,from(#5cb85c),to(#419641));
    background-color: linear-gradient(to bottom,#5cb85c 0,#419641 100%);
    background-repeat: repeat-x;
    border-color: #419641;

    font-size: 14px;

    color: white;

    -webkit-user-select: none;

    cursor: pointer;

    width: 120px;
    margin-left: calc((100% - 120px)/2);

    text-align: center;
  }

  .custom-file-input:hover::before {
    border-color: white;
  }

  .custom-file-input:active::before {
    background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
  }

  .custom-file-input:focus {
    outline: none;
  }

  #mobileView #chatWrapper {
    height: 100px;
    width: 100%;

    display: inline-block;

    float: right;
  }

  #desktopView #chatWrapper {
    height: 100%;
    width: 50%;

    padding-left: 45px;
    padding-bottom: 15px;

    display: inline-block;
  }

  #mobileView #chatWrapper form, #desktopView #chatWrapper form {
    text-align: center;
  }

  #mobileView #chatlog {
    width: 100%;
    height: 100%;

    overflow-y: auto;
  }

  #mobileView #messageTextBox {
    width: 100%;
    height: 50px;

    resize: none;

    /*
    border: solid 1px #dcdcdc;
    box-shadow: inset 0 1px 3px rgba(0,0,0,.05),0 1px 0 rgba(255,255,255,.1);
    */
  }

  #chatWrapper button {
    margin-top: 3px;
  }

  #mobileView fieldset.well {
    height: calc((100% - 100px - 30px) * .65);
  }

  #desktopView fieldset.well {
    height: calc(100% - 125px);
  }

  #chatWrapper input[type=text], textarea {
    -webkit-transition: all 0.30s ease-in-out;
    -moz-transition: all 0.30s ease-in-out;
    -ms-transition: all 0.30s ease-in-out;
    -o-transition: all 0.30s ease-in-out;
    outline: none;
    padding: 3px 0px 3px 3px;
    margin: 5px 1px 3px 0px;
    border: 1px solid #DDDDDD;
  }
 
  #chatWrapper input[type=text]:focus, textarea:focus {
    box-shadow: 0 0 5px rgba(81, 203, 238, 1);
    padding: 3px 0px 3px 3px;
    margin: 5px 1px 3px 0px;
    border: 1px solid rgba(81, 203, 238, 1);
  }

  .bubbleLeft {
    position: relative;
    width: 250px;
    height: 100px;
    padding: 0px;
    background: #D7E4ED;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 2px 2px 10px 0px #A8A8A8;
    -moz-box-shadow: 2px 2px 10px 0px #A8A8A8;
    box-shadow: 2px 2px 10px 0px #A8A8A8;
  }

  .bubbleLeft:after {
    content: "";
    position: absolute;
    top: 7px;
    left: -15px;
    border-style: solid;
    border-width: 15px 15px 15px 0;
    border-color: transparent #D7E4ED;
    display: block;
    width: 0;
    z-index: 1;
  }

  .bubbleRight {
    position: relative;
    width: 250px;
    height: 100px;
    padding: 0px;
    background: #EEEEEE;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 2px 2px 10px 0px #A8A8A8;
    -moz-box-shadow: 2px 2px 10px 0px #A8A8A8;
    box-shadow: 2px 2px 10px 0px #A8A8A8;
  }

  .bubbleRight:after {
    content: "";
    position: absolute;
    top: 7px;
    right: -15;
    border-style: solid;
    border-width: 15px 0 15px 15px;
    border-color: transparent #EEEEEE;
    display: block;
    width: 0;
    z-index: 1;
  }

  .mySlider i {
    position: relative;
    top: -3px;
  }
  /* Thanks!
   * https://codepen.io/jarmie/pen/tFqJH
   */

  .mySlider label {
    display: inline-block;
    width: 100px;
    height: 30px;
    border: 3px solid rgba(0,0,0,0.07);
    border-radius: 17px;
    position: relative;
    box-shadow:  inset 1px 1px 1px 1px rgba(0,0,0,0.4), 0px 0px 0px 1px rgba(0,0,0,0.1), 0px 0px 0px 2px rgba(0,0,0,0.1), 0px 0px 4px 2px rgba(0,0,0,0.07);
    margin: 0px;
  }

  .mySlider input {
    display: none;
  }
  
  .mySlider input:checked ~ a {
    left: 50%;
  }
  
  .mySlider input:checked ~ div span {
    background-color: rgba(0,158,255,0.5);
  }
  
  .mySlider label span {
    z-index: 1;
    position: absolute;
    display: inline-block;
    height: 24px;
    left: 0;
    width: 50%;
    border-radius: 15px 0px 0px 15px;
    border-color: rgba(0,0,0,0.1);
    border-style: solid;
    border-width: 1px 0px 1px 1px;
    background-color: rgba(200,200,200,0.5);
    background-image:-webkit-linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.0) 100%);
    text-align: center;
    line-height: 30px;
    font-family: helvetica, sans-serif;
    font-size: 14px;
    font-weight: 800;
    color: #555;
    text-shadow: 0px 1px white;
    -webkit-transition: all 1.0s ease-in-out;
    -moz-transition: all 1.0s ease-in-out;
    transition: all 1.0s ease-in-out;
    

  }

  .mySlider label span.no {

    left: 50%;  
    border-radius: 0px 15px 15px 0px;     
    border-width: 1px 1px 1px 0px;

  }
  
  .mySlider .slider {
    display: inline-block;
    position: absolute;
    width: 50%;
    height: 24px;
    background-color: #efefef;
    left: 0%;
    border-radius: 30px;
    z-index: 2;
    border: 1px solid rgba(0,0,0,0.2);
    box-shadow: inset 0px 0px 5px 1px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.2);
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;

  }
  
  .mySlider .slider:after, .mySlider .slider:before {
    content: "";
    width: 30%;
    height: 25px;
    position: absolute;
    top: 2px;
    border-radius: 50%;
  }

  .mySlider .slider:after {
    left: 15%;
    background-image:-webkit-linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.0) 100%);
  }
  .mySlider .slider:before {
    right: 15%;
    background-image:-webkit-linear-gradient(0deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.0) 100%);
  }

  
  form.mySlider {
    width: 100%;
    margin: 0px auto;
    font-family: georgia, times, serif;
  }
  
  .mySlider fieldset {
    padding: 10px;
    text-align: center;
    border-radius: 3px;
    color: #666;
  }

  .spinner {
    text-align: center;
  }

  .spinner img {
    width: 25%;
    height: auto;

    display: inline-block;
  }
</style>