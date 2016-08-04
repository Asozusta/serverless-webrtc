<template>
  <div id="mainContainer" class="container">
    <video-chat v-show="commsMethodIsSelected('video-chat')" transition="fade" transition-mode="out-in"></video-chat>
    <text-chat v-show="commsMethodIsSelected('text-chat')" transition="fade" transition-mode="out-in"></text-chat>

    <div class="modal fade" id="showLocalOffer" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" hidden>
      <div class="modal-dialog" role="document">
        <div class="modal-content">      
          <div class="modal-header">
            <h3 id="myModalLabel">Send your local offer to someone else</h3>
          </div>
          <div class="modal-body">
            Here's your "offer" -- it tells someone else how to connect to you.  Send the whole thing to them, for example in an instant message or e-mail.  You can either send the image, or the text. You don't need to send both.
          <br/>
          <form class="mySlider">
            <fieldset>
              <label>
                <input id="codeTypeInput" type="checkbox" v-on:change="changeCodeMethod" checked>
                <div>
                  <span class="yes"><i class="fa fa-picture-o" aria-hidden="true"></i></span>
                  <span class="no"><i class="fa fa-font" aria-hidden="true"></i></span>
                </div>
                <a class="slider"></a>
              </label>  
            </fieldset>
          </form>
          <img id="localOfferImg" v-show="codeMethodIsSelected('image')" transition="fade" transition-mode="out-in" />
          <textarea class="input-large" id="localOffer" name="localOffer" rows="10" cols="100" v-show="codeMethodIsSelected('text')" transition="fade" transition-mode="out-in"></textarea>
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
            Here's your "answer" -- it tells someone else how to connect to you.  Send the whole thing to them, for example in an instant message or e-mail.  You can either send the image, or the text. You don't need to send both.
          <br/>
          <form class="mySlider">
            <fieldset>
              <label>
                <input id="localAnswerTypeInput" type="checkbox" v-on:change="changeLocalAnswerCodeMethod" checked>
                <div>
                  <span class="yes"><i class="fa fa-picture-o" aria-hidden="true"></i></span>
                  <span class="no"><i class="fa fa-font" aria-hidden="true"></i></span>
                </div>
                <a class="slider"></a>
              </label>  
            </fieldset>
          </form>
          <img id="localAnswerImg" v-show="codeMethodIsSelected('image')" transition="fade" transition-mode="out-in" />
          <textarea id="localAnswer" class="input-large" name="localAnswer" rows="10" cols="100" v-show="codeMethodIsSelected('text')" transition="fade" transition-mode="out-in" ></textarea>
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
            The person who created the room will send you an "offer". It will either be an image, or text. Choose the appropriate method through the button, below.
            <br/>
            <form class="mySlider">
              <fieldset>
                <label>
                  <input id="remoteOfferTypeInput" type="checkbox" v-on:change="changeRemoteOfferCodeMethod" checked>
                  <div>
                    <span class="yes"><i class="fa fa-picture-o" aria-hidden="true"></i></span>
                    <span class="no"><i class="fa fa-font" aria-hidden="true"></i></span>
                  </div>
                  <a class="slider"></a>
                </label>  
              </fieldset>
            </form>
            <textarea id="remoteOffer" class="input-large" name="remoteOffer" rows="10" cols="100" placeholder="Paste the 'offer' string, here..." v-show="codeMethodIsSelected('text')" transition="fade" transition-mode="out-in"></textarea>
            <img id="remoteOfferImg" v-show="codeMethodIsSelected('image')" transition="fade" transition-mode="out-in" />
          </div>
          <div class="modal-footer">
            <input id="uploadRemoteOffer" class="custom-file-input" type="file" accept=".png" data-content='Select Image' v-show="codeMethodIsSelected('image')" transition="fade" transition-mode="out-in" v-on:change="readRemoteOffer"/>
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
            Now paste in the "answer" that was sent back to you.  It will either be an image, or text. Choose the appropriate method through the button, below.
          <br/>
          <form class="mySlider">
            <fieldset>
              <label>
                <input id="remoteAnswerTypeInput" type="checkbox" v-on:change="changeRemoteAnswerCodeMethod" checked>
                <div>
                  <span class="yes"><i class="fa fa-picture-o" aria-hidden="true"></i></span>
                  <span class="no"><i class="fa fa-font" aria-hidden="true"></i></span>
                </div>
                <a class="slider"></a>
              </label>  
            </fieldset>
          </form>
          <img id="remoteAnswerImg" v-show="codeMethodIsSelected('image')" transition="fade" transition-mode="out-in" />
          <textarea class="input-large" id="remoteAnswer" name="remoteAnswer" rows="10" cols="100" placeholder="Paste the 'answer' string, here..." v-show="codeMethodIsSelected('text')" transition="fade" transition-mode="out-in"></textarea>
          </div>
          <div class="modal-footer">
            <input id="uploadRemoteAnswer" class="custom-file-input" type="file" accept=".png" data-content='Select Image' v-show="codeMethodIsSelected('image')" transition="fade" transition-mode="out-in" v-on:change="readRemoteAnswer"/>
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
  import VideoChat from './VideoChat'
  import TextChat from './TextChat'
  import MyRTC from '../assets/js/WebRTC.js'
  import PNGStorage from '../assets/js/PNGStorage.js'

  function setVideoProperties() {
    var containerWidth = $("#videoChatWrapper").width();
    var containerHeight = $("#videoChatWrapper").height();

    // is the container tall enough? vids are 4:3; there are 2 streams
    if ( containerHeight >= 2 * ( containerWidth * 3 / 4 ) ) {
      // container is tall enough
      $("video").css({
        "width": containerWidth,
        "height": 3 / 4 * containerWidth
      });
    } else {
      // container is not tall enough
      $("video").css({
        "width": ( containerHeight / 2 ) * 4 / 3,
        "height": containerHeight / 2
      });
    };
  }

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
      var offer = $('#remoteOffer').val();console.log(offer);
      if ( !offer ) {
        offer = PNGStorage.PNGStorage.decode($("#remoteOfferImg").attr("src"), function(data) {
          var offerDesc = new window.myRTC.RTCSessionDescription(JSON.parse(atob(data)))
          console.log('Received remote offer', offerDesc)
          window.myRTC.writeToChatLog('Received remote offer', 'text-success')
          window.myRTC.handleOfferFromPC1(offerDesc)
          $('#showLocalAnswer').modal('show')
        });
      } else {
        var offerDesc = new window.myRTC.RTCSessionDescription(JSON.parse(offer))
        console.log('Received remote offer', offerDesc)
        window.myRTC.writeToChatLog('Received remote offer', 'text-success')
        window.myRTC.handleOfferFromPC1(offerDesc)
        $('#showLocalAnswer').modal('show')
      }
    })

    $('#answerSentBtn').click(function () {
      $('#waitForConnection').modal('show')
    })

    $('#answerRecdBtn').click(function () {
      var answer = $('#remoteAnswer').val()
      if ( !answer ) {
        answer = PNGStorage.PNGStorage.decode($("#remoteAnswerImg").attr("src"), function(data) {
          var answerDesc = new window.myRTC.RTCSessionDescription(JSON.parse(atob(data)))
          window.myRTC.handleAnswerFromPC2(answerDesc)
          $('#waitForConnection').modal('show')
        });
      } else {
        var answerDesc = new window.myRTC.RTCSessionDescription(JSON.parse(answer))
        window.myRTC.handleAnswerFromPC2(answerDesc)
        $('#waitForConnection').modal('show')
      }
    })

    $('#fileBtn').change(function () {
      var file = this.files[0]
      console.log(file)

      window.myRTC.sendFile(file)
    })
    console.log("done running");
  }

  export default {
    components: {
      VideoChat,
      TextChat
    },
    data: function() {
        return {
            'sharedState': Store.state.appData,
            'codeDescription': 'image',
            'bCordova': true
        };
    },
    ready: function() {
      setVideoProperties();

      if ( navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/) ) {
        // cordova!
        this.bCordova = true;

        if ( window.device ) {
          // device ready
          run();
        } else {
          // device not ready
          document.addEventListener('deviceready', function () {
            run();
          });
        };
      } else {
        // not cordova
        this.bCordova = false;

        run();
      };
    },
    methods: {
      commsMethodIsSelected: function (selectedMethod) {
        return this.sharedState.viewEnabled === selectedMethod;
      },
      changeCodeMethod: function() {
        this.codeDescription = ( $('#codeTypeInput').is(':checked') ) ? 'image' : 'text';
      },
      changeLocalAnswerCodeMethod: function() {
        this.codeDescription = ( $('#localAnswerTypeInput').is(':checked') ) ? 'image' : 'text';
      },
      changeRemoteOfferCodeMethod: function() {
        this.codeDescription = ( $('#remoteOfferTypeInput').is(':checked') ) ? 'image' : 'text';
      },
      changeRemoteAnswerCodeMethod: function() {
        this.codeDescription = ( $('#remoteAnswerTypeInput').is(':checked') ) ? 'image' : 'text';
      },
      codeMethodIsSelected: function(selectedMethod) {
        return this.codeDescription === selectedMethod;
      },
      shareLocalOffer: function() {
        var options = {};

        if ( this.codeDescription === 'image' ) {
          options['files'] =  $("#localOfferImg").attr("src");
        } else {
          options['message'] = $('#localOffer').html();
        };

        window.plugins.socialsharing.shareWithOptions(options, function() {}, function() {});
      },
      shareLocalAnswer: function() {
        var options = {};

        if ( this.codeDescription === 'image' ) {
          options['files'] =  $("#localAnswerImg").attr("src");
        } else {
          options['message'] = $('#localAnswer').html();
        };

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
      }
    },
    computed: {

    }
  }
</script>

<style scoped>
  #mainContainer {
    height: calc(100% - 50px);

    padding: 15px;
  }

  img {
    width: 50%;
    height: auto;

    margin-left: 25%;
  }

  .modal-body {
    max-height: calc(100vh - 60px - 155px - 10px); /* 60 for margin, 155 for modal header/footer and 10 for buffer */

    overflow-y: auto;
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
</style>