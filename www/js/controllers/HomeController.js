(function(){
  angular.module('starter')
  .controller('HomeController', ['$scope', '$state', '$ionicPopover', '$ionicActionSheet', '$ionicLoading', 'UserService', 'SocketService', HomeController]);

  function HomeController($scope, $state, $ionicPopover, $ionicActionSheet, $ionicLoading, UserService, SocketService){
    var me = this;

    me.user = UserService.getUser();

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
      scope: $scope
    }).then(function(popover){
      me.popover = popover;
    });

    // Sample matches. If able to connect to server, these shouldn't show up
    // because me.matches gets set in 'users changed' socket event below
    me.matches = [{id: '35', name: 'Brenda'},
    {id: '78', name:'LaTisha'},
    {id: '89', name:'Linda'},
    {id: '99', name:'Felicia'}];

    //just for the demo (displaying all online users)
    SocketService.on('users changed', function(data){
      me.matches = [];
      data.forEach(function(item){
        // Hard code names. In future, get the name from PuppyLove DB using
        // user's facebook id (item)
        if(item === '456'){
          me.matches.push({id:item, name: 'Ba'});
        }else if(item === '123' || item === '1122218207824140'){
          me.matches.push({id:item, name: 'Grant'});
        }else if(item === '789'){
          me.matches.push({id:item, name: 'Naz'});
        }else{
          me.matches.push({id:item, name: item});
        }
      });
    });

    $scope.openChat = function(match){
      $state.go('menu.chat', {match: match});
    };

    $scope.showLogoutMenu = function(){

      me.popover.hide();
      var hideSheet = $ionicActionSheet.show({
        destructiveText: 'Logout',
        titleText: 'Are you sure you want to logout?',
        cancelText: 'Cancel',
        cancel: function() {},
        buttonClicked: function(index) {
          return true;
        },
        destructiveButtonClicked: function(){
          $ionicLoading.show({
            template: 'Logging out...'
          });

          facebookConnectPlugin.logout(function(){
            $ionicLoading.hide();
            $state.go('login');
          },
          function(fail){
            $ionicLoading.hide();
          });
        }
      });
    };
  }
})();
