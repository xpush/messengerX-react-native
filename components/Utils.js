var Contants = require('./Constants');

var Utils = {
  generateChannelId : function(jsonObj){

    // multi user channel = generate uuid
    if( jsonObj.U.length > 2 ){
      return this.getUniqueKey()+"^"+Contants.APP_KEY;;
    } else {
      // 1:1 channel = userId concat friendId
      return jsonObj.U.sort().join( "$" )+"^"+Contants.APP_KEY;
    }
  },

  /**
   * @ngdoc function
   * @name getUniqueKey
   * @module messengerx.services
   * @kind function
   *
   * @description Generate uuid
   * uuid를 생성한다.
   * @return {string} uuid that generated
   */
  getUniqueKey : function () {
    var s = [], itoh = '0123456789ABCDEF';
    for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random()*0x10);
    s[14] = 4;
    s[19] = (s[19] & 0x3) | 0x8;

    for (var x = 0; x < 36; x++) s[x] = itoh[s[x]];
    s[8] = s[13] = s[18] = s[23] = '-';

    return s.join('');
  }
}

module.exports = Utils;