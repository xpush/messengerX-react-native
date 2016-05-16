import React, {Dimensions, Navigator, StyleSheet,  Text, View, TouchableHighlight} from 'react-native';
var GiftedMessenger = require('react-native-gifted-messenger');
var XPush = require('../libs/xpush');
var SessionStore = require('../stores/SessionStore');

var channelId  = "";
var userObject;

var Chat = React.createClass({
  componentDidMount() {
    var data = this.props.data;
    channelId = data.C;
    SessionStore.get(function(user){
      userObject = user;

      XPush.INSTANCE.createChannel(data.US, channelId, function(err, data){
        console.log( 'create channel success : ', data);
      });

      XPush.INSTANCE.on('message', function(ch,name,data){
        console.log( data.MG );
      });
    });

  },
  getMessages() {
    return [
      {text: 'Are you building a chat app?', name: 'React-Native', image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, position: 'left', date: new Date(2015, 0, 16, 19, 0)},
      {text: "Yes, and I use Gifted Messenger!", name: 'Developer', image: null, position: 'right', date: new Date(2015, 0, 17, 19, 0)},
    ];
  },
  handleSend(message = {}, rowID = null) {
    // Send message.text to your server
    var msg = encodeURIComponent( message.text  );
    XPush.INSTANCE.send( channelId, 'message', { 'MG': msg, "UO" : {'NM':userObject.DT.NM,'I':userObject.DT.I,'U':userObject.DT.U} } );
  },
  handleReceive() {
    this._GiftedMessenger.appendMessage({
      text: 'Received message', 
      name: 'Friend', 
      image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, 
      position: 'left', 
      date: new Date(),
    });
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