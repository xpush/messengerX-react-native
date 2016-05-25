
var React = require('react-native');

var {
  DeviceEventEmitter,
  NativeModules
} = React;

var XPushNativeAndroid = NativeModules.XPushNativeAndroid;

var debug = function() {

}

var XPush = {
  init : function(host, appId) {
    this.hostname = host;
    this.appId = appId;
    return this;
  },
  ajax: function(url, cb){
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {

      if( responseJson.status == 'ok' ){
        cb( null, responseJson.result )
      } else {
        cb( responseJson.status )
      }
    })
    .catch((error) => {
      cb(error);
    });
  },
  getNode: function(channel, cb) {
    var self = this;
    var url = self.hostname+self.Context.NODE+'/'+self.appId+'/'+channel;
    self.ajax(url, cb);
  },
  connect: function(channel, cb){
    var self = this;
    self.getNode(channel, function( err, data ){
      var param = data.server;
      param.appId = self.appId;
      param.userId = 'user01';
      param.deviceId = 'web';
      XPushNativeAndroid.connect( param, function(result){
        cb( null, result );
      });
    });
  }
}

XPush.Context = {
  NODE : '/node'
};

module.exports = XPush;