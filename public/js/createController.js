var myItems = { title: 'your title goes here',
                when: 'when do you like to have the activity',
                where: 'where to have it',
                limits: 'how many buddies can join',
                city: 'city',
                type: 'activity type',
                descr: 'some more words',
                publicity: false };

var result = "error, failed to create";

angular.module('createActv', ['ngRoute'])
  .factory('Items', function(){
    return myItems;
    })

  .controller('CreateController', ['$scope', function ($scope) {
    $scope.items = myItems;
    $scope.actType = [{
                       id: 1,
                       type: '吃饭'
                   }, {
                       id: 2,
                       type: '唱k'
                   }, {
                       id: 3,
                       type: '户外'
                   }, {
                       id: 4,
                       type: '其他'
                   }];

    $scope.typeOfAct = $scope.actType[0].type;
    myItems.type = $scope.actType[0].type;
    $scope.isPublic = myItems.publicity;
    $scope.change = function() {
    }
 
    $scope.check = function(chk) {
      $scope.isPublic = !chk;
    }

    $scope.create = function(openid, actid, city, name, avatar) {
      if ( $scope.city == undefined ) $scope.city = city;
      myItems.title = $scope.title;
      myItems.when = $scope.when;
      myItems.where = $scope.where;
      myItems.limits = $scope.limits;
      myItems.descr = $scope.descr;
      myItems.publicity = $scope.isPublic;
      myItems.city = $scope.city;
      myItems.type = $scope.typeOfAct;

      var Data = {_id: actid,
                  creator: openid,
                  title: myItems.title,
                  when: myItems.when,
                  where: myItems.where,
                  attLimits: myItems.limits,
                  attendeeIds: [openid],
                  attendees: [{name: name, avatar: avatar}],
                  city: myItems.city,
                  type: myItems.type,
                  description: myItems.descr,
                  publicity: myItems.publicity,
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
    
      .when('/actvs/:openid/:actid', {
        templateUrl: '/activity.html',
        controller: 'PrintController'
     });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }]);
