'use strict';

import React, {
  Component,
} from 'react';
import {
  Linking,
  Platform,
  ActionSheetIOS,
  Dimensions,
  View,
  Text,
  Navigator,
  StyleSheet,
  PushNotificationIOS
} from 'react-native';

var GiftedMessenger = require('react-native-gifted-messenger');
var XPush = require('../libs/xpush');
var SessionStore = require('../stores/SessionStore');

var channelId  = "";

var userObject;

class Chat extends Component {

  constructor(props) {
    super(props);
    this._messages = [];

    this.state = {
      messages: this._messages,
    }

    this.handleSend = this.handleSend.bind(this);
  }

  componentDidMount() {

    PushNotificationIOS.addEventListener('notification', this._onNotification);

    var self = this;
    var data = this.props.data;
    channelId = data.C;

    SessionStore.get(function(user){
      userObject = user;

      if( data.US ){
        XPush.INSTANCE.createChannel(data.US, channelId, function(err, data){
          console.log( 'create channel success : ', data);
        });
      }

      XPush.INSTANCE.on('message', function(ch,name,data){

        if( data.UO.U != userObject.U ){
          var message = {
            text: data.MG, 
            name: data.UO.U, 
            //image: {uri: data.UO.I}, 
            position: 'left', 
            date: new Date(data.TS),
            uniqueId : data.C+"_"+data.TS
          };
          self.handleReceive( message );
        }
      });

      XPush.INSTANCE.getUnreadMessage( channelId, function(err, messages) {
        for( var inx = 0; inx < messages.length ;inx++ ){
          if( messages[inx].NM != 'message' ){
            continue;
          }

          var data = JSON.parse( messages[inx].DT );

          var side = "right";
          var image = {};
          if (data.UO.U != userObject.U) {
            side = "left";
            image = { "uri":data.UO.I};
          } else {
            image = null;
          }
          var uniqueId = data.C+"_"+data.TS

          var tmpMsg = {text: decodeURIComponent(data.MG), name: data.UO.NM, image: image, position: side, date: new Date(data.TS), uniqueId:uniqueId}
          self.setMessages(self._messages.concat(tmpMsg));
        }
      });
    });

  }

  _onNotification(notification){
    AlertIOS.alert(
      'Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  setMessages(messages) {
    this._messages = messages;

    // append the message
    this.setState({
      messages: messages,
    });
  }

  handleSend(message = {}) {
    // Send message.text to your server
    var msg = encodeURIComponent( message.text  );
    XPush.INSTANCE.send( channelId, 'message', { 'MG': msg, "UO" : {'NM':userObject.DT.NM,'I':userObject.DT.I,'U':userObject.U} } );
  
    message.uniqueId = Math.round(Math.random() * 10000); // simulating server-side unique id generation
    this.setMessages(this._messages.concat(message));
  }

  handleReceive(message = {}) {
    this.setMessages(this._messages.concat(message));
  }

  render() {

    return (

      <View style={styles.container}>
        <View style={styles.navBar}>
          <Text style={styles.navTitle}>{this.props.data.NM}</Text>
        </View>
        <GiftedMessenger
          ref={(c) => this._GiftedMessenger = c}

          styles={{
            bubbleRight: {
              marginLeft: 70,
              backgroundColor: '#007aff',
            },
          }}

          autoFocus={false}

          messages={this.state.messages}
          handleSend={this.handleSend.bind(this)}
          maxHeight={Dimensions.get('window').height - 64} // 64 for the navBar
        />
      </View>
    );
  }
}

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