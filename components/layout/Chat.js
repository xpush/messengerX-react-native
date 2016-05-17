import React, {Dimensions, Navigator, StyleSheet,  Text, View, TouchableHighlight} from 'react-native';
var GiftedMessenger = require('react-native-gifted-messenger');
var XPush = require('../libs/xpush');
var SessionStore = require('../stores/SessionStore');

var channelId  = "";
var userObject;

var Chat = React.createClass({
  componentDidMount() {
    var self = this;
    var data = this.props.data;
    channelId = data.C;
    SessionStore.get(function(user){
      userObject = user;

      XPush.INSTANCE.createChannel(data.US, channelId, function(err, data){
        console.log( 'create channel success : ', data);
      });

      XPush.INSTANCE.on('message', function(ch,name,data){
        self.handleReceive( data );
      });
    });

  },
  getMessages() {
    return [];
  },
  handleSend(message = {}, rowID = null) {
    // Send message.text to your server
    var msg = encodeURIComponent( message.text  );
    XPush.INSTANCE.send( channelId, 'message', { 'MG': msg, "UO" : {'NM':userObject.DT.NM,'I':userObject.DT.I,'U':userObject.U} } );
  },
  handleReceive(data) {

    if( data.UO.U != userObject.U ) {
      this._GiftedMessenger.appendMessage({
        text: decodeURIComponent(data.MG), 
        name: data.UO.NM, 
        image: {uri: data.UO.I}, 
        position: 'left', 
        date: new Date(data.TS),
      });
    }
  },
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navBar}>
          <Text style={styles.navTitle}>Friend name</Text>
        </View>
        <GiftedMessenger
          ref={(c) => this._GiftedMessenger = c}

          messages={this.getMessages()}
          handleSend={this.handleSend}
          maxHeight={Dimensions.get('window').height - 64} // 64 for the navBar

          styles={{
            bubbleLeft: {
              backgroundColor: '#e6e6eb',
              marginRight: 70,
            },
            bubbleRight: {
              backgroundColor: '#007aff',
              marginLeft: 70,
            },
          }}
        />
      </View>
    );
  },
});

var styles = StyleSheet.create({
   container: {
      justifyContent: 'center',
      alignItems: 'stretch',
      backgroundColor: '#ffffff'
    },
    navBar: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F8F8F8',
      height: 64
    },
    navTitle: {
      alignSelf: 'center',
      textAlign: 'center',
      justifyContent:'center',
      color: '#000'
    }
});

module.exports = Chat;