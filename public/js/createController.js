var myItems = { title: 'your title goes here',
                when: 'when do you like to have the activity',
                where: 'where to have it',
                limits: 'how many buddies can join',
                descr: 'some more words'};

angular.module('createActv', ['ngRoute'])
  .factory('Items', function(){
    return myItems;
    })

  .controller('CreateController', ['$scope', function ($scope) {
    $scope.items = myItems;

    $scope.create = function() {
      myItems.title = $scope.title;
      myItems.when = $scope.when;
      myItems.where = $scope.where;
      myItems.limits = $scope.limits;
      myItems.descr = $scope.descr;
    }
  }])
  
  .controller('PrintController', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $scope.actv = myItems;
    var openid = $routeParams.openid;
    var actid = $routeParams.actid;
    //TODO
    // use $http here to post data to DB
  }])
  
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
      //doesn't work, don't know why
      //.when('/authen/fetchInfo2create', {
      //  templateUrl: '/form.html',
      //  controller: 'CreateController'
      //})
    
      .when('/attend/:openid/:actid', {
        templateUrl: '/activity.html',
        controller: 'PrintController'
     });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }]);
