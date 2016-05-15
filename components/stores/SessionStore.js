'use strict';

var React = require('react-native');
var Constants = require('../Constants');

var {
  AsyncStorage
} = React;

var SessionStore = {
	user : {},
	save : function(data, cb){
		AsyncStorage.setItem(Constants.SESSION_KEY, JSON.stringify( data ) ).then((userData) => {
			cb( userData );
		}).done();
	},
	get : function(cb){
		var self = this;
		AsyncStorage.getItem(Constants.SESSION_KEY).then((userDataStr) => {
			if( userDataStr ){
				self.user = JSON.parse(userDataStr);
				cb( this.user );
			} else {
				cb();
			}
		}).done();
	}
};

module.exports = SessionStore;