<template>
  <footer class="footer">
    <div class="container">
      <form id="chatTypeSelect" class="mySlider">
        <fieldset>
          <label>
            <input id="chatTypeInput" type="checkbox" v-on:change="changeCommsMethod" checked>
            <div>
              <span class="yes"><i class="fa fa-video-camera" aria-hidden="true"></i></span>
              <span class="no"><i class="fa fa-comments" aria-hidden="true"></i></span>
            </div>
            <a class="slider"></a>
          </label>  
        </fieldset>
      </form>
    </div>
  </footer>
</template>

<script>
  import Store from '../store/store.js'

  export default {
    methods: {
      changeCommsMethod: function() {
        var newView = ( $('#chatTypeInput').is(':checked') ) ? 'video-chat' : 'text-chat';
        Store.changeView(newView);
      }
    }
  }
</script>

<style>
  footer {
    width: 100%;

    background-color: #f5f5f5;

    position: absolute;
    bottom: 0px;

    height: 50px;
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
</style>