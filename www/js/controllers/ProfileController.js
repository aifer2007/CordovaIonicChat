(function(){
	angular.module('starter')
	.controller('ProfileController', ['$scope', '$state', ProfileController]);

	function ProfileController($scope, $state){

		$scope.callProfileService = function(method){
			//CHANGE TO ANGULAR, NONE OF THIS WILL WORK
			//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
			
			// Disable buttons and remove focus
			// $(".btn").prop("disabled",true);
			// $(".btn").blur();
			// // Show "Splash" or Ajax Loader
			// $('#loading').html('<img src="img/ajax-loader.gif" alt="loader" class="img-responsive"/>');
			// $('#loading').show();
			//REST stub
			var urlREST = 'http://52.1.4.38/Profile/Profile.svc/' + method;
			var onSuccess = function(json) {
				var execTime = (new Date() - startTime)/1000;
				console.log('REST Service Time Taken for' + method + ': ' + execTime);
				console.log(json);
				displayRESTData(true,json,execTime);
			};
			var onError = function(error) {
				var execTime = (new Date() - startTime)/1000;
				console.log('REST Service Time Taken for ' + method + ': ' + execTime);
				console.log(error.responseText);
				alert(JSON.stringify(error));
			};

			// HTML 5 Session Storage from FB - Cleared on Window close or Logout
			var jsonUserString = sessionStorage.authUser;
			var user = JSON.parse(jsonUserString);
			var userID = user.id;
			sessionStorage.authUserID = userID;
			var name = user.name.split(' ');
			var splitName = user.name.split(' ');	
			var middleName = 'None';
			var lastName = splitName[1];
			if(splitName.length > 2){
				middleName = splitName[1];
				lastName = splitName[2];
			}
			var profileRequest;
			if(userID.length >15){
				profileRequest = { UserID: (userID.substring(0,16)) }
			}else{
				profileRequest = { UserID: userID}
			}
				
			var userData = {
				UserID: userID,
				Email: 'UserNeedsToEnter@Test.com',
		        UserName: (user.name).replace(/\s+/g, ''),
				DisplayName: user.name,
		        FirstName: splitName[0],
				MiddleName: middleName,
		        LastName: lastName,
				PhoneNumber: '1234567890',
				Password: 'fakepassword',
				Photo: ''
		        //Photo: user.picture.data.url
		    }
			
			var profileData = {
				UserData: userData,
				//UserResponses: listOfResponses,
				//MatchResponses: listOfMatchResponses
			}
			var data;
			if(method == 'GetProfileData'){
				data = profileRequest;
			}else {
				data = profileData;
			}
			
			// TODO METRIC
			var startTime = new Date();
			$.ajax({
				type: "POST",
				dataType: "json",
				contentType: "application/json;charset=utf-8;",
				url: (urlREST),
				success: onSuccess,
				error: onError,
				data: JSON.stringify({ request: data })
			});
		};
	}
})();