<template>
  <div id="chatWrapper">
    <fieldset class="well">
      <div id="chatlog" class="text-info" style="height:350px; overflow:auto;">
      </div>
    </fieldset>
    <form class="form-inline" v-on:submit.prevent="sendMessage" action="">
      <textarea id="messageTextBox" type="text" placeholder="Type your message here"></textarea>
      <button id="sendMessageBtn" type="submit" class="btn btn-primary">Send message</button>
    </form>
  </div>
</template>

<script>
  export default {
    methods: {
      sendMessage: function() {console.log(window.myRTC.RTCMultiSession);
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
    }
  }
</script>

<style scoped>
  #chatWrapper {
    height: 100%;
    width: 100%;
  }
  #chatlog {
    width: 100%;
    height: 100%;

    overflow-y: auto;
  }

  #messageTextBox {
    width: 100%;
    height: 50px;

    resize: none;

    /*
    border: solid 1px #dcdcdc;
    box-shadow: inset 0 1px 3px rgba(0,0,0,.05),0 1px 0 rgba(255,255,255,.1);
    */
  }

  form {
    text-align: center;
  }

  button {
    margin-top: 3px;
  }

  fieldset {
    height: calc(100% - 100px - 25px);
  }

  input[type=text], textarea {
    -webkit-transition: all 0.30s ease-in-out;
    -moz-transition: all 0.30s ease-in-out;
    -ms-transition: all 0.30s ease-in-out;
    -o-transition: all 0.30s ease-in-out;
    outline: none;
    padding: 3px 0px 3px 3px;
    margin: 5px 1px 3px 0px;
    border: 1px solid #DDDDDD;
  }
 
  input[type=text]:focus, textarea:focus {
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
</style>