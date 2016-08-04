import { EventEmitter } from 'events'

const store = new EventEmitter()
export default store

store['state'] = {
  'appData': {
    'viewEnabled': 'video-chat'
  }
};

store['changeView'] = function(newView) {
  this.state.appData.viewEnabled = newView;
  return;
};