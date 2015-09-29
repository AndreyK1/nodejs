'use strict';


angular.module("angularRestfulAuth", [
    'ngStorage',
    'ngRoute'
])
    .controller('HomeCtrl',  ['$rootScope', '$scope', '$location', '$localStorage', 'Main', function($rootScope, $scope, $location, $localStorage, Main)
{
	//alert('here');
		$scope.user={};
		$scope.signin = function() {
			alert('signin');
            var formData = {
                email: $scope.email,
                password: $scope.password
            }
 
            Main.signin(formData, function(res) {
                if (res.type == false) {
                    alert(res.data)    
                } else {
                   $localStorage.token = res.data.token;
                    $scope.user = res.data;
					//$scope.user = JSON.parse(res.data);

					alert('its ok')
					//window.location = "/";    
                }
            }, function() {
                $rootScope.error = 'Failed to signin';
            })
        };
	
		$scope.getme = function() {
			alert('getme');
           Main.me(function(res) {
                //$scope.myDetails = res;
				$scope.user = res.data;
				alert('its ok')
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            })
        };
	
		$scope.tokenll = $localStorage.token;
}])
 .factory('Main', ['$http', '$localStorage', function($http, $localStorage){
        var baseUrl = "http://localhost:3001";
		
		/*
		function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }
 
        var currentUser = getUserFromToken();
 */
 
        return {
            save: function(data, success, error) {
                $http.post(baseUrl + '/signin', data).success(success).error(error)
				//$http.get('http://api/user').then(function(response){responseData = response.data; });
				//$http.post('/someUrl', data, config).then(successCallback, errorCallback);
            },
            signin: function(data, success, error) {
                $http.post(baseUrl + '/signin', data).success(success).error(error)
            },
            me: function(success, error) {
                $http.get(baseUrl + '/me').success(success).error(error)
            },
            logout: function(success) {
                changeUser({});
                delete $localStorage.token;
                success();
            }
        };
		
		
 }])
 .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
   $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
            alert('here-1');
			return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        }]);
		
		//http://viralpatel.net/blogs/angularjs-routing-and-views-tutorial-with-example/
		$routeProvider.
        when('/', {
            templateUrl: './partials/home.html',
            controller: 'HomeCtrl'
        }).
        when('/signin', {
            templateUrl: './partials/signin.html',
            controller: 'HomeCtrl'
        }).
        when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'HomeCtrl'
        }).
        when('/me', {
            templateUrl: 'partials/me.html',
            controller: 'HomeCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
  
  
  }]);
 

 
 
 /*;

angular.module('angularRestfulAuth', [
    'ngStorage',
    'ngRoute'
])*/
/*
.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
 
    $routeProvider.
        when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        }).
        when('/signin', {
            templateUrl: 'partials/signin.html',
            controller: 'HomeCtrl'
        }).
        when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'HomeCtrl'
        }).
        when('/me', {
            templateUrl: 'partials/me.html',
            controller: 'HomeCtrl'
        }).
        otherwise({
            redirectTo: '/'
        }); 
		 }])
//}]);*/