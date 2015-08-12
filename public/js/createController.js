var myItems = { title: 'your title goes here',
                when: 'when do you like to have the activity',
                where: 'where to have it',
                limits: 'how many buddies can join',
                descr: 'some more words'};

var result = "error, failed to create";

angular.module('createActv', ['ngRoute'])
  .factory('Items', function(){
    return myItems;
    })

  .controller('CreateController', ['$scope', function ($scope) {
    $scope.items = myItems;

    $scope.create = function(openid, actid) {
      myItems.title = $scope.title;
      myItems.when = $scope.when;
      myItems.where = $scope.where;
      myItems.limits = $scope.limits;
      myItems.descr = $scope.descr;

      var Data = {_id: actid,
                  creator: openid,
                  title: myItems.title,
                  when: myItems.when,
                  where: myItems.where,
                  attLimits: myItems.limits,
                  description: myItems.descr,
                  isActive: true};

      // have to use jquery for post, angular $http is async
      $.ajax({ 
              type : "post", 
              url : "../../resource/actvs", 
              data : Data,
              async : false, 
              success : function(data){ 
                  result = "activity is created"
                },
              error : function(xhr, status, text) {
                  result = "failed to create activity!"
                }
             });  
    }
  }])
  
  .controller('PrintController', ['$scope', '$routeParams', 
                                  function ($scope, $routeParams) {
    $scope.actv = myItems;
    $scope.result = result;
  }])
  
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/authen/fetchInfo2create', {
        templateUrl: '/form.html',
        controller: 'CreateController'
      })
    
      .when('/attend/:openid/:actid', {
        templateUrl: '/activity.html',
        controller: 'PrintController'
     });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }]);
