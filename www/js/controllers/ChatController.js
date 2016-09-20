(function(){
	angular.module('starter')
	.controller('ChatController', ['$scope', '$state', '$stateParams', 'localStorageService', 'moment', '$ionicScrollDelegate', 'SocketService', ChatController]);

	function ChatController($scope, $state, $stateParams, localStorageService, moment, $ionicScrollDelegate, SocketService){
		var me = this;

		me.matchName = $stateParams.match.name;

		me.recID = $stateParams.match.id;  // $stateParams.userID


		var retreiveCallback = function(recordset){

			me.messages = [];
			
			recordset.forEach(function(item){
				var messageObj = {msg: item.message};

				//for styling
				if(item.receiver === me.recID){
					messageObj.belongsToSelf = true;
				}else{
					messageObj.belongsToSelf = false;
				}
				me.messages.push(messageObj);
			});

			$ionicScrollDelegate.scrollBottom();
		};

		// Retrieve messages from DB on open of chat view
		SocketService.emit('retrieve messages', me.recID, retreiveCallback);


		// not currently used
		$scope.humanize = function(timestamp){
			return moment(timestamp).fromNow();
		};

		$scope.sendMessage = function(){
			var messageObj = {userID: me.recID, msg: me.message};

			// Send message to node server
			SocketService.emit('send message', messageObj);

			// For styling
			messageObj.belongsToSelf = true;
			me.messages.push(messageObj);

			$ionicScrollDelegate.scrollBottom();

			me.message = '';
		};

		SocketService.on('receive message', function(data){

			// For styling
			data.belongsToSelf = false;

			me.messages.push(data);

			$ionicScrollDelegate.scrollBottom();
		});
	}
})();