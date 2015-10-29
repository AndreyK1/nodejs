angular.module("angularRestfulAuth")
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
        /*when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'HomeCtrl'
        }).*/
        when('/me', {
            templateUrl: 'partials/me.html',
            //controller: 'HomeCtrl'
			controller: 'MeCtrl'
        }).
		when('/AllUsers', {
            templateUrl: 'partials/AllUsers.html',
            controller: 'AllUsersCtrl'
        }).
		when('/PageUsers/:beg', {
            templateUrl: 'partials/PageUsers.html',
            controller: 'PageUsersCtrl'
        }).
		/*when('/SaveFile', {
            templateUrl: 'partials/saveFile.html',
            controller: 'SaveFile'
          }).*/
		when('/watch_examlpe', {
            templateUrl: 'partials/watch_ex.html',
            controller: 'watch_examlpe'      
		}).
		when('/confirm/:email', {
            templateUrl: 'partials/confirm.html',
            controller: 'registrCntrl'   
		}).
		when('/toConfirm/:hex', {
            templateUrl: 'partials/toConfirm.html',
            controller: 'registrCntrl'   
		}).	
		when('/NoConfirmed/:mess', {
            templateUrl: 'partials/toConfirm.html',
            controller: 'registrCntrl'   
		}).	
		when('/Chat/:page', {
            templateUrl: 'partials/chat.html',
            controller: 'chatCntrl'   
		}).			
        otherwise({
            redirectTo: '/'
        });
		
  
  
  }])
