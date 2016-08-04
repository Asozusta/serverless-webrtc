import PNGStorage from './PNGStorage.js'

window.myRTC                             = {};

window.myRTC.RTCPeerConnection           = null;
window.myRTC.RTCSessionDescription       = null;
window.myRTC.RTCIceCandidate             = null;
window.myRTC.getUserMedia                = null;
window.myRTC.attachMediaStream           = null;
window.myRTC.reattachMediaStream         = null;
window.myRTC.webrtcDetectedBrowser       = null;
window.myRTC.cfg                         = null;
window.myRTC.con                         = null;
window.myRTC.pc1                         = null;
window.myRTC.dc1                         = null;
window.myRTC.tn1                         = null;
window.myRTC.activedc                    = null;
window.myRTC.pc1icedone                  = null;
window.myRTC.sdpConstraints              = null;
window.myRTC.fileSent                    = null;
window.myRTC.fileProgress                = null;
window.myRTC.sendFile                    = null;
window.myRTC.setupDC1                    = null;
window.myRTC.createLocalOffer            = null;
window.myRTC.handleOnaddstream           = null;
window.myRTC.handleOnconnection          = null;
window.myRTC.onsignalingstatechange      = null;
window.myRTC.oniceconnectionstatechange  = null;
window.myRTC.onicegatheringstatechange   = null;
window.myRTC.handleAnswerFromPC2         = null;
window.myRTC.handleCandidateFromPC2      = null;
window.myRTC.pc2                         = null;
window.myRTC.dc2                         = null;
window.myRTC.pc2icedone                  = null;
window.myRTC.handleOfferFromPC1          = null;
window.myRTC.handleCandidateFromPC1      = null;
window.myRTC.getTimestamp                = null;
window.myRTC.writeToChatLog              = null;
window.myRTC.RTCMultiSession             = null;
window.myRTC.FileSender                  = null;
window.myRTC.FileReceiver                = null;
window.myRTC.FileSaver                   = null;

if ( navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/) ) {
  // cordova!
  if ( window.device ) {
    // device ready!
    if (window.device.platform === 'iOS') {
      // @adam-hanna: is this async or sync?!
      cordova.plugins.iosrtc.registerGlobals();
    }

    adapt();
    build();
  } else {
    // device not ready!
    document.addEventListener('deviceready', function () {
      // Just for iOS devices.
      if (window.device.platform === 'iOS') {
        // @adam-hanna: is this async or sync?!
        cordova.plugins.iosrtc.registerGlobals();
      }

      adapt();
      build();
    });
  };
  
} else {
  // not cordova
  adapt();
  build();
}

function adapt() {console.log("adapting");
  if (navigator.mozGetUserMedia) {
    // console.log('This appears to be Firefox')

    window.myRTC.webrtcDetectedBrowser = 'firefox'

    // The RTCPeerConnection object.
    window.myRTC.RTCPeerConnection = mozRTCPeerConnection

    // The RTCSessionDescription object.
    window.myRTC.RTCSessionDescription = mozRTCSessionDescription

    // The RTCIceCandidate object.
    window.myRTC.RTCIceCandidate = mozRTCIceCandidate

    // Get UserMedia (only difference is the prefix).
    // Code from Adam Barth.
    window.myRTC.getUserMedia = navigator.mozGetUserMedia.bind(navigator)

    // Attach a media stream to an element.
    window.myRTC.attachMediaStream = function (element, stream) {
      // console.log('Attaching media stream')
      element.mozSrcObject = stream
      element.play()
    }

    window.myRTC.reattachMediaStream = function (to, from) {
      // console.log('Reattaching media stream')
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
    // console.log('This appears to be Chrome or iOS using a shim')

    window.myRTC.webrtcDetectedBrowser = 'chrome'

    // The RTCPeerConnection object.
    window.myRTC.RTCPeerConnection = webkitRTCPeerConnection

    // The RTCSessionDescription object.
    // ?
    window.myRTC.RTCSessionDescription = RTCSessionDescription

    // The RTCIceCandidate object.
    // ?
    window.myRTC.RTCIceCandidate = RTCIceCandidate

    // Get UserMedia (only difference is the prefix).
    // Code from Adam Barth.
    window.myRTC.getUserMedia = navigator.webkitGetUserMedia.bind(navigator)

    // Attach a media stream to an element.
    window.myRTC.attachMediaStream = function (element, stream) {
      element.src = webkitURL.createObjectURL(stream)
    }

    window.myRTC.reattachMediaStream = function (to, from) {
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
  window.myRTC.cfg = {'iceServers': [{'url': 'stun:23.21.150.121'}]}
  window.myRTC.con = { 'optional': [{'DtlsSrtpKeyAgreement': true}] }

  /* THIS IS ALICE, THE CALLER/SENDER */
  window.myRTC.pc1 = new window.myRTC.RTCPeerConnection(window.myRTC.cfg, window.myRTC.con)
  window.myRTC.dc1 = null
  window.myRTC.tn1 = null

  // Since the same JS file contains code for both sides of the connection,
  // activedc tracks which of the two possible datachannel variables we're using.
  // var activedc

  window.myRTC.pc1icedone = false

  window.myRTC.sdpConstraints = {
    optional: [],
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    }
  }

  window.myRTC.fileSent = function(file) {
    console.log(file + ' sent')
  }

  window.myRTC.fileProgress = function(file) {
    console.log(file + ' progress')
  }

  window.myRTC.sendFile = function(data) {
    if (data.size) {
      window.myRTC.FileSender.send({
        file: data,
        onFileSent: window.myRTC.fileSent,
        onFileProgress: window.myRTC.fileProgress,
      })
    }
  }

  window.myRTC.setupDC1 = function() {
    try {
      var fileReceiver1 = new window.myRTC.FileReceiver()
      window.myRTC.dc1 = window.myRTC.pc1.createDataChannel('test', {reliable: true})
      window.myRTC.activedc = window.myRTC.dc1
      // console.log('Created datachannel (window.myRTC.pc1)')
      window.myRTC.dc1.onopen = function (e) {
        console.log('data channel connect')
        $('#waitForConnection').modal('hide')
        $('#waitForConnection').remove()
      }
      window.myRTC.dc1.onmessage = function (e) {
        // console.log('Got message (window.myRTC.pc1)', e.data)
        if (e.data.size) {
          fileReceiver1.receive(e.data, {})
        } else {
          if (e.data.charCodeAt(0) == 2) {
            // The first message we get from Firefox (but not Chrome)
            // is literal ASCII 2 and I don't understand why -- if we
            // leave it in, JSON.parse() will barf.
            return
          }
          // console.log(e)
          var data = JSON.parse(e.data)
          if (data.type === 'file') {
            fileReceiver1.receive(e.data, {})
          } else {
            window.myRTC.writeToChatLog(data.message, 'text-info')
            // Scroll chat text area to the bottom on new input.
            $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight)
          }
        }
      }
    } catch (e) { console.warn('No data channel (pc1)', e); }
  }

  window.myRTC.createLocalOffer = function() {
    console.log('video1')
    navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia
    navigator.getUserMedia({video: true, audio: true}, function (stream) {
      var video = document.getElementById('localVideo')
      video.src = window.URL.createObjectURL(stream)
      video.play()
      window.myRTC.pc1.addStream(stream)
      console.log(stream)
      console.log('adding stream to pc1')
      window.myRTC.setupDC1()
      window.myRTC.pc1.createOffer(function (desc) {
        window.myRTC.pc1.setLocalDescription(desc, function () {}, function () {})
        console.log('created local offer', desc)
      },
      function () { console.warn("Couldn't create offer") },
      window.myRTC.sdpConstraints)
    }, function (error) {
      console.log('Error adding stream to pc1: ' + error)
    })
  }

  window.myRTC.pc1.onicecandidate = function (e) {
    console.log('ICE candidate (pc1)', e)
    if (e.candidate == null) {
      $('#localOffer').html(JSON.stringify(window.myRTC.pc1.localDescription))
      $("#localOfferImg").attr("src", PNGStorage.PNGStorage.encode(JSON.stringify(window.myRTC.pc1.localDescription)))
    }
  }

  window.myRTC.handleOnaddstream = function(e) {
    console.log('Got remote stream', e.stream)
    var el = document.getElementById('remoteVideo')
    el.autoplay = true
    window.myRTC.attachMediaStream(el, e.stream)
  }

  window.myRTC.pc1.onaddstream = window.myRTC.handleOnaddstream

  window.myRTC.handleOnconnection = function() {
    console.log('Datachannel connected')
    window.myRTC.writeToChatLog('Datachannel connected', 'text-success')
    $('#waitForConnection').modal('hide')
    // If we didn't call remove() here, there would be a race on pc2:
    //   - first onconnection() hides the dialog, then someone clicks
    //     on answerSentBtn which shows it, and it stays shown forever.
    $('#waitForConnection').remove()
    $('#showLocalAnswer').modal('hide')
    $('#messageTextBox').focus()
    $('.modal-backdrop').hide()
  }

  window.myRTC.pc1.onconnection = window.myRTC.handleOnconnection

  window.myRTC.onsignalingstatechange = function(state) {
    console.info('signaling state change:', state)
  }

  window.myRTC.oniceconnectionstatechange = function(state) {
    console.info('ice connection state change:', state)
  }

  window.myRTC.onicegatheringstatechange = function(state) {
    console.info('ice gathering state change:', state)
  }

  window.myRTC.pc1.onsignalingstatechange = window.myRTC.onsignalingstatechange
  window.myRTC.pc1.oniceconnectionstatechange = window.myRTC.oniceconnectionstatechange
  window.myRTC.pc1.onicegatheringstatechange = window.myRTC.onicegatheringstatechange

  window.myRTC.handleAnswerFromPC2 = function(answerDesc) {
    console.log('Received remote answer: ', answerDesc)
    window.myRTC.writeToChatLog('Received remote answer', 'text-success')
    window.myRTC.pc1.setRemoteDescription(answerDesc)
  }

  window.myRTC.handleCandidateFromPC2 = function(iceCandidate) {
    window.myRTC.pc1.addIceCandidate(iceCandidate)
  }

  /* THIS IS BOB, THE ANSWERER/RECEIVER */

  window.myRTC.pc2 = new window.myRTC.RTCPeerConnection(window.myRTC.cfg, window.myRTC.con)
  window.myRTC.dc2 = null

  window.myRTC.pc2icedone = false

  window.myRTC.pc2.ondatachannel = function (e) {
    var fileReceiver2 = new window.myRTC.FileReceiver()
    var datachannel = e.channel || e; // Chrome sends event, FF sends raw channel
    console.log('Received datachannel (pc2)', arguments)
    window.myRTC.dc2 = datachannel
    window.myRTC.activedc = window.myRTC.dc2
    window.myRTC.dc2.onopen = function (e) {
      console.log('data channel connect')
      $('#waitForConnection').modal('hide')
      $('#waitForConnection').remove()
    }
    window.myRTC.dc2.onmessage = function (e) {
      console.log('Got message (pc2)', e.data)
      if (e.data.size) {
        fileReceiver2.receive(e.data, {})
      } else {
        var data = JSON.parse(e.data)
        if (data.type === 'file') {
          fileReceiver2.receive(e.data, {})
        } else {
          window.myRTC.writeToChatLog(data.message, 'text-info')
          // Scroll chat text area to the bottom on new input.
          $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight)
        }
      }
    }
  }

  window.myRTC.handleOfferFromPC1 = function(offerDesc) {
    window.myRTC.pc2.setRemoteDescription(offerDesc)
    window.myRTC.pc2.createAnswer(function (answerDesc) {
      window.myRTC.writeToChatLog('Created local answer', 'text-success')
      console.log('Created local answer: ', answerDesc)
      window.myRTC.pc2.setLocalDescription(answerDesc)
    },
    function () { console.warn("Couldn't create offer") },
    window.myRTC.sdpConstraints)
  }

  window.myRTC.pc2.onicecandidate = function (e) {
    console.log('ICE candidate (pc2)', e)
    if (e.candidate == null) {
      $('#localAnswer').html(JSON.stringify(window.myRTC.pc2.localDescription));
      $("#localAnswerImg").attr("src", PNGStorage.PNGStorage.encode(JSON.stringify(window.myRTC.pc2.localDescription)))
    }
  }

  window.myRTC.pc2.onsignalingstatechange = window.myRTC.onsignalingstatechange
  window.myRTC.pc2.oniceconnectionstatechange = window.myRTC.oniceconnectionstatechange
  window.myRTC.pc2.onicegatheringstatechange = window.myRTC.onicegatheringstatechange

  window.myRTC.handleCandidateFromPC1 = function(iceCandidate) {
    window.myRTC.pc2.addIceCandidate(iceCandidate)
  }

  window.myRTC.pc2.onaddstream = window.myRTC.handleOnaddstream
  window.myRTC.pc2.onconnection = window.myRTC.handleOnconnection

  window.myRTC.getTimestamp = function() {
    var totalSec = new Date().getTime() / 1000
    var hours = parseInt(totalSec / 3600) % 24
    var minutes = parseInt(totalSec / 60) % 60
    var seconds = parseInt(totalSec % 60)

    var result = (hours < 10 ? '0' + hours : hours) + ':' +
      (minutes < 10 ? '0' + minutes : minutes) + ':' +
      (seconds < 10 ? '0' + seconds : seconds)

    return result
  }

  window.myRTC.writeToChatLog = function(message, message_type) {
    document.getElementById('chatlog').innerHTML += '<p class="' + message_type + '">' + '[' + window.myRTC.getTimestamp() + '] ' + message + '</p>'
  }

  // file send
  window.moz = !! navigator.mozGetUserMedia

  window.myRTC.RTCMultiSession = function (options) {
    return {
      send: function (message) {
        if (moz && message.file)
          var data = message.file
        else
          var data = JSON.stringify(message)

        window.myRTC.activedc.send(data)
      }
    }
  }

  window.myRTC.FileSender = {
    send: function (config) {
      var channel = config.channel || new window.myRTC.RTCMultiSession()
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

  window.myRTC.FileReceiver = function() {
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
            window.myRTC.FileSaver.SaveToDisk(event.target.result, fileName)
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
          window.myRTC.FileSaver.SaveToDisk(content.join(''), data.name)
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

  window.myRTC.FileSaver = {
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