'use strict';


angular.module("angularRestfulAuth", [
    'ngStorage',
    'ngRoute'
])
    .controller('HomeCtrl',  ['$rootScope', '$scope', '$location', '$localStorage', 'Main', function($rootScope, $scope, $location, $localStorage, Main)
{
	//alert('here');
		//$scope.user={};
		$scope.CurrentUser = Main.getCurrentUser();
		
		$scope.signin = function() {
			//alert('signin');
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
					$scope.CurrentUser= res.data;
					//$rootScope.user =  $scope.user;
					//$scope.user = JSON.parse(res.data);

					//alert('its ok')
					//window.location = "/";  
					//$scope.CurrentUser = Main.getCurrentUser();
                }
            }, function() {
                $rootScope.error = 'Failed to signin';
            })
			
        };
	
		$scope.getme = function() {
			//alert('getme');
           Main.me(function(res) {
                $scope.myDetails = res;
				$scope.user = res.data;
				$scope.CurrentUser= res.data;
				//alert('its ok')
				//$scope.CurrentUser = Main.getCurrentUser();
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            })
			
        };
		
		$scope.AllUsers = function() {
			alert('AllUsers');
           Main.AllUsers(function(res) {
				//alert('its ok')		
				$scope.AllUsersCol = res.data;				
				alert($scope.AllUsersCol[0].email);
				//$scope.AllUsers = JSON.parse(res.data);

				//$scope.CurrentUser = Main.getCurrentUser();
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            })
			
        };		
		
		
		
	
		$scope.tokenll = $localStorage.token;
}])
 .factory('Main', ['$http', '$localStorage', function($http, $localStorage){
        var baseUrl = "http://localhost:3001";
		
        function changeUser(user) {
            angular.extend(currentUser, user);
        }
 
        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }
 
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
			AllUsers: function(success, error) {
                $http.get(baseUrl + '/AllUsers').success(success).error(error)
            },
            getCurrentUser: function(r) {
                return currentUser;
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
            //alert('here-1');
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
			//foodata: $scope.user;
        }).
        when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'HomeCtrl'
        }).
        when('/me', {
            templateUrl: 'partials/me.html',
            controller: 'HomeCtrl'
        }).
		when('/AllUsers', {
            templateUrl: 'partials/AllUsers.html',
            controller: 'HomeCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
  
  
  }])
  
  
  
  /*
  .controller('MeCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {
	  $scope.user.token = 'shit';

}]);
 */

 
 
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