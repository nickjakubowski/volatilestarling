angular.module('whereto', ['whereTo.map', 'where-to.services', 'whereTo.auth', 'ui.router'])

.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'app/views/login.html',
      controller: 'AuthController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/views/signup.html',
      controller: 'AuthController'
    })
    .state('map', {
      url: '/map',
      templateUrl: 'app/views/map.html',
      controller: 'MapController'
    });

    $urlRouterProvider.otherwise('/map');

    $httpProvider.interceptors.push('AttachTokens');

}])
.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.shortly');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});