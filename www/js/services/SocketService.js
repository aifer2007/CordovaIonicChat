(function(){
	angular.module('starter')
	.service('SocketService', ['socketFactory', 'UserService', SocketService]);

	function SocketService(socketFactory, UserService){
		return socketFactory({

			// localhost
        	ioSocket: io.connect('http://localhost:3000', {query: 'userID=' + (UserService.getUser().userID || '123')})

		});
	}
})();
