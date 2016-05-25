
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
  _getChannelInfo: function(channel, cb) {
    var self = this;
    this.ajax( self.Context.NODE+'/'+self.appId+'/'+channel , 'GET', {}, cb);
  },
  ajax : function(context, method, data, headers, cb){
    var self = this;

    if(typeof(headers) == 'function' && !cb){
      cb = headers;
      headers = false;
    }

    var xhr;
    try{
      xhr = new XMLHttpRequest();
    }catch (e){
      try{
        xhr = new XDomainRequest();
      } catch (e){
        try{
          xhr = new ActiveXObject('Msxml2.XMLHTTP');
        }catch (e){
          try{
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
          }catch (e){
            console.error('\nYour browser is not compatible with XPUSH AJAX');
          }
        }
      }
    }

    var _url = self.hostname+context;

    var param = Object.keys(data).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');

    method = (method.toLowerCase() == "get") ? "GET":"POST";
    param  = (param == null || param == "") ? null : param;
    if(method == "GET" && param != null){
      _url = _url + "?" + param;
    }

    xhr.open(method, _url, true);
    xhr.onreadystatechange = function() {

      if(xhr.readyState < 4) {
        return;
      }

      if(xhr.status !== 200) {
        debug("xpush : ajax error", self.hostname+context,param);
        cb(xhr.status,{});
      }

      if(xhr.readyState === 4) {
        var r = JSON.parse(xhr.responseText);
        if(r.status != 'ok'){
          cb(r.status,r.message);
        }else{
          cb(null,r);
        }
      }
    };

    debug("xpush : ajax ", self.hostname+context,method,param);

    if(headers) {
      for (var key in headers) {
        if (headers.hasOwnProperty(key)) {
          xhr.setRequestHeader(key, headers[key]);
        }
      }
    }
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send( (method == "POST") ? param : null);

    return;
  }
}

XPush.Context = {
  NODE : '/node'
};

module.exports = XPush;