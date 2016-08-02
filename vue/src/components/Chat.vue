<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
      <video id="localVideo"></video>
      </div>
      <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
        <video id="remoteVideo"></video>
      </div>
      <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
        <fieldset class="well">
          <p class="head muted">
            Serverless WebRTC chat.
          </p>
          <div class="text-info" id="chatlog" style="height:350px; overflow:auto;">
          </div>
        </fieldset>
        <form class="form-inline" v-on:submit.prevent="sendMessage" action="">
          <input type="text" id="messageTextBox" placeholder="Type your message here">
          <button type="submit" id="sendMessageBtn" class="btn">Send message</button>
        </form>
        <!-- <input type="file" id="fileBtn"> -->
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
            <textarea class="input-large" id="localOffer" name="localOffer" rows="10" cols="100"></textarea>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" id="offerSentBtn" data-dismiss="modal" aria-hidden="true">Okay, I sent it.</button>
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
            <textarea class="input-large" id="localAnswer" name="localAnswer" rows="10" cols="100"></textarea>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" id="answerSentBtn" data-dismiss="modal" aria-hidden="true">Okay, I sent it.</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fad" id="getRemoteOffer" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" hidden>
        <div class="modal-dialog" role="document">
          <div class="modal-content">      
            <div class="modal-header">
              <h3 id="myModalLabel">Paste the "offer" you received</h3>
            </div>
            <div class="modal-body">
              The person who created the room will send you an "offer" string -- paste it here.
            <br/>
            <textarea class="input-large" id="remoteOffer" name="remoteOffer" rows="10" cols="100"></textarea>
            </div>
            <div class="modal-footer">
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
              Now paste in the "answer" that was sent back to you.
            <br/>
            <textarea class="input-large" id="remoteAnswer" name="remoteAnswer" rows="10" cols="100"></textarea>
            </div>
            <div class="modal-footer">
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
  </div>
</template>

<script>
  console.log("in chat");

  var RTCPeerConnection           = null,
      RTCSessionDescription       = null,
      RTCIceCandidate             = null,
      getUserMedia                = null,
      attachMediaStream           = null,
      reattachMediaStream         = null,
      webrtcDetectedBrowser       = null,
      cfg                         = null,
      con                         = null,
      pc1                         = null,
      dc1                         = null,
      tn1                         = null,
      activedc                    = null,
      pc1icedone                  = null,
      sdpConstraints              = null,
      fileSent                    = null,
      fileProgress                = null,
      sendFile                    = null,
      setupDC1                    = null,
      createLocalOffer            = null,
      handleOnaddstream           = null,
      handleOnconnection          = null,
      onsignalingstatechange      = null,
      oniceconnectionstatechange  = null,
      onicegatheringstatechange   = null,
      handleAnswerFromPC2         = null,
      handleCandidateFromPC2      = null,
      pc2                         = null,
      dc2                         = null,
      pc2icedone                  = null,
      handleOfferFromPC1          = null,
      handleCandidateFromPC1      = null,
      getTimestamp                = null,
      writeToChatLog              = null,
      RTCMultiSession             = null,
      FileSender                  = null,
      FileReceiver                = null,
      FileSaver                   = null

  if ( navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/) ) {console.log("cordova");
    // cordova!
    if ( window.device ) {console.log("script: device ready");
      // device ready!
      if (window.device.platform === 'iOS') {console.log("iOS");
        // @adam-hanna: is this async or sync?!
        cordova.plugins.iosrtc.registerGlobals();
      }

      adapt();
      build();
    } else {
      // device not ready!
      document.addEventListener('deviceready', function () {console.log("script: listener - device ready");
        // Just for iOS devices.
        if (window.device.platform === 'iOS') {console.log("iOS");
          // @adam-hanna: is this async or sync?!
          cordova.plugins.iosrtc.registerGlobals();
        }

        adapt();
        build();
      });
    };
    
  } else {console.log("Not cordova");
    // not cordova
    adapt();
    build();
  }

  function adapt() {console.log("adapting");
    if (navigator.mozGetUserMedia) {
      console.log('This appears to be Firefox')

      webrtcDetectedBrowser = 'firefox'

      // The RTCPeerConnection object.
      RTCPeerConnection = mozRTCPeerConnection

      // The RTCSessionDescription object.
      RTCSessionDescription = mozRTCSessionDescription

      // The RTCIceCandidate object.
      RTCIceCandidate = mozRTCIceCandidate

      // Get UserMedia (only difference is the prefix).
      // Code from Adam Barth.
      getUserMedia = navigator.mozGetUserMedia.bind(navigator)

      // Attach a media stream to an element.
      attachMediaStream = function (element, stream) {
        console.log('Attaching media stream')
        element.mozSrcObject = stream
        element.play()
      }

      reattachMediaStream = function (to, from) {
        console.log('Reattaching media stream')
        to.mozSrcObject = from.mozSrcObject
        to.play()
      }

      // Fake get{Video,Audio}Tracks
      MediaStream.prototype.getVideoTracks = function () {
        return []
      }

      MediaStream.prototype.getAudioTracks = function () {
        return []
      }
    } else if (navigator.webkitGetUserMedia) {
      console.log('This appears to be Chrome or iOS using a shim')

      webrtcDetectedBrowser = 'chrome'

      // The RTCPeerConnection object.
      RTCPeerConnection = webkitRTCPeerConnection

      // Get UserMedia (only difference is the prefix).
      // Code from Adam Barth.
      getUserMedia = navigator.webkitGetUserMedia.bind(navigator)

      // Attach a media stream to an element.
      attachMediaStream = function (element, stream) {
        element.src = webkitURL.createObjectURL(stream)
      }

      reattachMediaStream = function (to, from) {
        to.src = from.src
      }

      // The representation of tracks in a stream is changed in M26.
      // Unify them for earlier Chrome versions in the coexisting period.
      if (!webkitMediaStream.prototype.getVideoTracks) {
        webkitMediaStream.prototype.getVideoTracks = function () {
          return this.videoTracks
        }
        webkitMediaStream.prototype.getAudioTracks = function () {
          return this.audioTracks
        }
      }

      // New syntax of getXXXStreams method in M26.
      if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
        webkitRTCPeerConnection.prototype.getLocalStreams = function () {
          return this.localStreams
        }
        webkitRTCPeerConnection.prototype.getRemoteStreams = function () {
          return this.remoteStreams
        }
      }
    } else {
      alert("This browser doesn't support webRTC and cannot be used to chat");
    };
  };

  function build() {console.log("building");
    cfg = {'iceServers': [{'url': 'stun:23.21.150.121'}]}
    con = { 'optional': [{'DtlsSrtpKeyAgreement': true}] }

    /* THIS IS ALICE, THE CALLER/SENDER */
    pc1 = new RTCPeerConnection(cfg, con)
    dc1 = null
    tn1 = null

    // Since the same JS file contains code for both sides of the connection,
    // activedc tracks which of the two possible datachannel variables we're using.
    // var activedc

    pc1icedone = false

    sdpConstraints = {
      optional: [],
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
      }
    }

    fileSent = function(file) {
      console.log(file + ' sent')
    }

    fileProgress = function(file) {
      console.log(file + ' progress')
    }

    sendFile = function(data) {
      if (data.size) {
        FileSender.send({
          file: data,
          onFileSent: fileSent,
          onFileProgress: fileProgress,
        })
      }
    }

    setupDC1 = function() {
      try {
        var fileReceiver1 = new FileReceiver()
        dc1 = pc1.createDataChannel('test', {reliable: true})
        activedc = dc1
        console.log('Created datachannel (pc1)')
        dc1.onopen = function (e) {
          console.log('data channel connect')
          $('#waitForConnection').modal('hide')
          $('#waitForConnection').remove()
        }
        dc1.onmessage = function (e) {
          console.log('Got message (pc1)', e.data)
          if (e.data.size) {
            fileReceiver1.receive(e.data, {})
          } else {
            if (e.data.charCodeAt(0) == 2) {
              // The first message we get from Firefox (but not Chrome)
              // is literal ASCII 2 and I don't understand why -- if we
              // leave it in, JSON.parse() will barf.
              return
            }
            console.log(e)
            var data = JSON.parse(e.data)
            if (data.type === 'file') {
              fileReceiver1.receive(e.data, {})
            } else {
              writeToChatLog(data.message, 'text-info')
              // Scroll chat text area to the bottom on new input.
              $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight)
            }
          }
        }
      } catch (e) { console.warn('No data channel (pc1)', e); }
    }

    createLocalOffer = function() {
      console.log('video1')
      navigator.getUserMedia = navigator.getUserMedia ||
                               navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia ||
                               navigator.msGetUserMedia
      navigator.getUserMedia({video: true, audio: true}, function (stream) {
        var video = document.getElementById('localVideo')
        video.src = window.URL.createObjectURL(stream)
        video.play()
        pc1.addStream(stream)
        console.log(stream)
        console.log('adding stream to pc1')
        setupDC1()
        pc1.createOffer(function (desc) {
          pc1.setLocalDescription(desc, function () {}, function () {})
          console.log('created local offer', desc)
        },
        function () { console.warn("Couldn't create offer") },
        sdpConstraints)
      }, function (error) {
        console.log('Error adding stream to pc1: ' + error)
      })
    }

    pc1.onicecandidate = function (e) {
      console.log('ICE candidate (pc1)', e)
      if (e.candidate == null) {
        $('#localOffer').html(JSON.stringify(pc1.localDescription))
      }
    }

    handleOnaddstream = function(e) {
      console.log('Got remote stream', e.stream)
      var el = document.getElementById('remoteVideo')
      el.autoplay = true
      attachMediaStream(el, e.stream)
    }

    pc1.onaddstream = handleOnaddstream

    handleOnconnection = function() {
      console.log('Datachannel connected')
      writeToChatLog('Datachannel connected', 'text-success')
      $('#waitForConnection').modal('hide')
      // If we didn't call remove() here, there would be a race on pc2:
      //   - first onconnection() hides the dialog, then someone clicks
      //     on answerSentBtn which shows it, and it stays shown forever.
      $('#waitForConnection').remove()
      $('#showLocalAnswer').modal('hide')
      $('#messageTextBox').focus()
      $('.modal-backdrop').hide()
    }

    pc1.onconnection = handleOnconnection

    onsignalingstatechange = function(state) {
      console.info('signaling state change:', state)
    }

    oniceconnectionstatechange = function(state) {
      console.info('ice connection state change:', state)
    }

    onicegatheringstatechange = function(state) {
      console.info('ice gathering state change:', state)
    }

    pc1.onsignalingstatechange = onsignalingstatechange
    pc1.oniceconnectionstatechange = oniceconnectionstatechange
    pc1.onicegatheringstatechange = onicegatheringstatechange

    handleAnswerFromPC2 = function(answerDesc) {
      console.log('Received remote answer: ', answerDesc)
      writeToChatLog('Received remote answer', 'text-success')
      pc1.setRemoteDescription(answerDesc)
    }

    handleCandidateFromPC2 = function(iceCandidate) {
      pc1.addIceCandidate(iceCandidate)
    }

    /* THIS IS BOB, THE ANSWERER/RECEIVER */

    pc2 = new RTCPeerConnection(cfg, con)
    dc2 = null

    pc2icedone = false

    pc2.ondatachannel = function (e) {
      var fileReceiver2 = new FileReceiver()
      var datachannel = e.channel || e; // Chrome sends event, FF sends raw channel
      console.log('Received datachannel (pc2)', arguments)
      dc2 = datachannel
      activedc = dc2
      dc2.onopen = function (e) {
        console.log('data channel connect')
        $('#waitForConnection').modal('hide')
        $('#waitForConnection').remove()
      }
      dc2.onmessage = function (e) {
        console.log('Got message (pc2)', e.data)
        if (e.data.size) {
          fileReceiver2.receive(e.data, {})
        } else {
          var data = JSON.parse(e.data)
          if (data.type === 'file') {
            fileReceiver2.receive(e.data, {})
          } else {
            writeToChatLog(data.message, 'text-info')
            // Scroll chat text area to the bottom on new input.
            $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight)
          }
        }
      }
    }

    handleOfferFromPC1 = function(offerDesc) {
      pc2.setRemoteDescription(offerDesc)
      pc2.createAnswer(function (answerDesc) {
        writeToChatLog('Created local answer', 'text-success')
        console.log('Created local answer: ', answerDesc)
        pc2.setLocalDescription(answerDesc)
      },
      function () { console.warn("Couldn't create offer") },
      sdpConstraints)
    }

    pc2.onicecandidate = function (e) {
      console.log('ICE candidate (pc2)', e)
      if (e.candidate == null) {
        $('#localAnswer').html(JSON.stringify(pc2.localDescription))
      }
    }

    pc2.onsignalingstatechange = onsignalingstatechange
    pc2.oniceconnectionstatechange = oniceconnectionstatechange
    pc2.onicegatheringstatechange = onicegatheringstatechange

    handleCandidateFromPC1 = function(iceCandidate) {
      pc2.addIceCandidate(iceCandidate)
    }

    pc2.onaddstream = handleOnaddstream
    pc2.onconnection = handleOnconnection

    getTimestamp = function() {
      var totalSec = new Date().getTime() / 1000
      var hours = parseInt(totalSec / 3600) % 24
      var minutes = parseInt(totalSec / 60) % 60
      var seconds = parseInt(totalSec % 60)

      var result = (hours < 10 ? '0' + hours : hours) + ':' +
        (minutes < 10 ? '0' + minutes : minutes) + ':' +
        (seconds < 10 ? '0' + seconds : seconds)

      return result
    }

    writeToChatLog = function(message, message_type) {
      document.getElementById('chatlog').innerHTML += '<p class="' + message_type + '">' + '[' + getTimestamp() + '] ' + message + '</p>'
    }

    // file send
    window.moz = !! navigator.mozGetUserMedia

    RTCMultiSession = function (options) {
      return {
        send: function (message) {
          if (moz && message.file)
            var data = message.file
          else
            var data = JSON.stringify(message)

          activedc.send(data)
        }
      }
    }

    FileSender = {
      send: function (config) {
        var channel = config.channel || new RTCMultiSession()
        var file = config.file

        /* if firefox nightly: share file blob directly */
        if (moz) {
          /* used on the receiver side to set received file name */
          channel.send({
            fileName: file.name,
            type: 'file'
          })

          /* sending the entire file at once */
          channel.send({
            file: file
          })

          if (config.onFileSent) config.onFileSent(file)
        }

        /* if chrome */
        if (!moz) {
          var reader = new window.FileReader()
          reader.readAsDataURL(file)
          reader.onload = onReadAsDataURL
        }

        var packetSize = 1000 /* chars */ ,
          textToTransfer = '',
          numberOfPackets = 0,
          packets = 0

        function onReadAsDataURL (event, text) {
          var data = {
            type: 'file'
          }

          if (event) {
            text = event.target.result
            numberOfPackets = packets = data.packets = parseInt(text.length / packetSize)
          }

          if (config.onFileProgress)
            config.onFileProgress({
              remaining: packets--,
              length: numberOfPackets,
              sent: numberOfPackets - packets
            })

          if (text.length > packetSize) {
            data.message = text.slice(0, packetSize)
          } else {
            data.message = text
            data.last = true
            data.name = file.name

            if (config.onFileSent) config.onFileSent(file)
          }

          channel.send(data)

          textToTransfer = text.slice(data.message.length)

          if (textToTransfer.length)
            setTimeout(function () {
              onReadAsDataURL(null, textToTransfer)
            }, 500)
        }
      }
    }

    FileReceiver = function() {
      var content = [],
        fileName = '',
        packets = 0,
        numberOfPackets = 0

      function receive (data, config) {
        /* if firefox nightly & file blob shared */
        if (moz) {
          if (!data.size) {
            var parsedData = JSON.parse(data)
            if (parsedData.fileName) {
              fileName = parsedData.fileName
            }
          } else {
            var reader = new window.FileReader()
            reader.readAsDataURL(data)
            reader.onload = function (event) {
              FileSaver.SaveToDisk(event.target.result, fileName)
              if (config.onFileReceived) config.onFileReceived(fileName)
            }
          }
        }

        if (!moz) {
          if (data.packets)
            numberOfPackets = packets = parseInt(data.packets)

          if (config.onFileProgress)
            config.onFileProgress({
              remaining: packets--,
              length: numberOfPackets,
              received: numberOfPackets - packets
            })

          content.push(data.message)

          if (data.last) {
            FileSaver.SaveToDisk(content.join(''), data.name)
            if (config.onFileReceived)
              config.onFileReceived(data.name)
            content = []
          }
        }
      }

      return {
        receive: receive
      }
    }

    FileSaver = {
      SaveToDisk: function (fileUrl, fileName) {
        var save = document.createElement('a')
        save.href = fileUrl
        save.target = '_blank'
        save.download = fileName || fileUrl

        var evt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        })

        save.dispatchEvent(evt)

        ;(window.URL || window.webkitURL).revokeObjectURL(save.href)
      }
    }
  }

  function run() {console.log("running");
    $('#showLocalOffer').modal('hide')
    $('#getRemoteAnswer').modal('hide')
    $('#waitForConnection').modal('hide')
    $('#createOrJoin').modal('show')

    $('#createBtn').click(function () {
      $('#showLocalOffer').modal('show')
      createLocalOffer()
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
        pc2.addStream(stream)
      }, function (error) {
        console.log('Error adding stream to pc2: ' + error)
      })
      $('#getRemoteOffer').modal('show')
    })

    $('#offerSentBtn').click(function () {
      $('#getRemoteAnswer').modal('show')
    })

    $('#offerRecdBtn').click(function () {
      var offer = $('#remoteOffer').val()
      var offerDesc = new RTCSessionDescription(JSON.parse(offer))
      console.log('Received remote offer', offerDesc)
      writeToChatLog('Received remote offer', 'text-success')
      handleOfferFromPC1(offerDesc)
      $('#showLocalAnswer').modal('show')
    })

    $('#answerSentBtn').click(function () {
      $('#waitForConnection').modal('show')
    })

    $('#answerRecdBtn').click(function () {
      var answer = $('#remoteAnswer').val()
      var answerDesc = new RTCSessionDescription(JSON.parse(answer))
      handleAnswerFromPC2(answerDesc)
      $('#waitForConnection').modal('show')
    })

    $('#fileBtn').change(function () {
      var file = this.files[0]
      console.log(file)

      sendFile(file)
    })
    console.log("done running");
  }

  export default {
    data: function() {
        return {
            cordovaReady: false
        };
    },
    ready: function() {console.log("ready");
      if ( navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/) ) {
        // cordova!
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
        run();
      };
    },
    methods: {
      sendMessage: function() {
        if ($('#messageTextBox').val()) {
          var channel = new RTCMultiSession()
          writeToChatLog($('#messageTextBox').val(), 'text-success')
          channel.send({message: $('#messageTextBox').val()})
          $('#messageTextBox').val('')

          // Scroll chat text area to the bottom on new input.
          $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight)
        }

        return false
      }
    }
  }
</script>

<style scoped>
  textarea {
    resize: none;

    max-width: 100%;
  }

  input {
    width: 100%;

    margin-bottom: 10px;
  }

  video {
     width: 100%;
     height: auto;
  }
</style>