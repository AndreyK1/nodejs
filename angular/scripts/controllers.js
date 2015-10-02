'use strict';


angular.module("angularRestfulAuth", [
    'ngStorage',
    'ngRoute'
])
    .controller('HomeCtrl',  ['$rootScope', '$scope', '$location', '$localStorage', 'Main', function($rootScope, $scope, $location, $localStorage, Main)
{
	//$rootScope.baseUrl = "http://localhost:3001";
	
	//alert('here');
		//$scope.user={};
		$scope.registr=null
		
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
                    $scope.token =$localStorage.token;
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
	/*
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
			
        };*/
		/*
		$scope.AllUsers = function() {
			//alert('AllUsers');
           Main.AllUsers(function(res) {
				//alert('its ok')		
				$scope.AllUsersCol = res.data;				
				//alert($scope.AllUsersCol[0].email);
				//$scope.AllUsers = JSON.parse(res.data);

				//$scope.CurrentUser = Main.getCurrentUser();
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            })
			
        };		
		*/
		$scope.logout = function() {
			//alert('AllUsers');
           Main.logout(function(res) {
				//alert('LOGOUT')
				$scope.token =	null;
				//$scope.AllUsersCol = res.data;				
				//alert($scope.AllUsersCol[0].email);
				//$scope.AllUsers = JSON.parse(res.data);

				//$scope.CurrentUser = Main.getCurrentUser();
            }, function() {
                $rootScope.error = 'Failed to LOGOUT';
            })
			
        };		
		
		$scope.login = function() {
			//alert('getme');
			var formData = {
                email: $scope.email,
                password: $scope.password
            }
           /*Main.login(formData,function(res) {
                $scope.myDetails = res;
				$scope.user = res.data;
				$scope.CurrentUser= res.data;
				//alert('its ok')
				//$scope.CurrentUser = Main.getCurrentUser();
            }, function() {
                $rootScope.error = 'Failed to fetch user';
            })*/
			Main.login(formData,function(res) {
				if (res.type == false) {
                    alert(res.data)    
                } else {
                   $localStorage.token = res.data.token;
                    $scope.token =$localStorage.token;
					$scope.user = res.data;
					$scope.CurrentUser= res.data;
					//$rootScope.user =  $scope.user;
					//$scope.user = JSON.parse(res.data);

					//alert('its ok')
					//window.location = "/";  
					//$scope.CurrentUser = Main.getCurrentUser();
			}}, function() {
                $rootScope.error = 'Failed to login';
				})
			
        };		
		
		
	
		$scope.token = $localStorage.token;
}])
 .factory('Main', ['$rootScope','$http', '$localStorage', function($rootScope,$http, $localStorage){
        var baseUrl = "http://localhost:3001";
		$rootScope.baseUrl = baseUrl; 
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
			//localhost:3001/AllUsers/5/15
			AllUsersWithin: function(data,success, error) {
                $http.get(baseUrl + '/AllUsers/'+data.beg_id+'/'+data.end_id).success(success).error(error)
            },
            getCurrentUser: function(r) {
                return currentUser;
            },			
            logout: function(success) {
                changeUser({});
                delete $localStorage.token;
                success();
            },			
            login: function(data,success,error) {
				$http.post(baseUrl + '/login', data).success(success).error(error)
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
		when('/PageUsers/:beg_id', {
            templateUrl: 'partials/PageUsers.html',
            controller: 'PageUsersCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
  
  
  }])
   .controller('MeCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {
	  //$scope.user.token = 'shit';
           Main.me(function(res) {
                //$scope.myDetails = res;
				$scope.user = res.data;
				//$scope.CurrentUser= res.data;
				//alert('MeCtrl '+$scope.user)
				//$scope.CurrentUser = Main.getCurrentUser();
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            })	  

}])
   .controller('AllUsersCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {
           Main.AllUsers(function(res) {
				$scope.AllUsersCol = res.data;				
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            })	  

}])
   .controller('PageUsersCtrl', ['$rootScope', '$scope','$routeParams','$sce', '$http','$location', 'Main', function($rootScope, $scope,$routeParams,$sce,$http,$location, Main) {
          var baseUrl = $rootScope.baseUrl
		  $scope.sce = $sce;
		  $scope.pageslist = '';
		  $scope.currentPageNum = 1;
		  $scope.PageNum = 1;
		  $scope.pageSize = 3;
		  $scope.numUssers =0;
		  
		  if($routeParams.beg_id)
		  $scope.currentPageNum =  $routeParams.beg_id;
		  
		  
		  $scope.GetUsers = function(beg_id,end_id){
			  var dat={
				  beg_id:beg_id,
				  end_id:end_id
			  }
			  Main.AllUsersWithin(dat,function(res) {
					$scope.UsersOnPage = res.data;
					//alert($scope.UsersOnPage);					
				}, function() {
					$rootScope.error = 'Failed to fetch UsersOnPage';
				}
			  )
		  }
		  
		  //GetUsers(1,$scope.pageSize+1);
		  $scope.GetUsers($scope.currentPageNum*$scope.pageSize-$scope.pageSize, $scope.currentPageNum*$scope.pageSize+1 )
		  
		  $http.get(baseUrl + '/numUssers').success(function(res){
			  	if (res.type == false) {
                    alert(res.data)    
                } else {
                   $scope.numUssers = res.data;
				   $scope.PageNum = Math.round($scope.numUssers/$scope.pageSize);
				   
				   GetPagesRow();
				}	  
		  }).error(function() {
                $rootScope.error = 'Failed to numUssers';
				}	  
		  )
		  
		  /*
		  $scope.ChangePage = function(beg_id,end_id){
			  alert('beg_id-'+beg_id+ " end_id-"+end_id);
		  }*/
		  
		  
		  $scope.pages=[];
		  function GetPagesRow(){//рисуем страницы
				alert($scope.pages); 			  
			  for(var i=1; i< $scope.PageNum+1;i++){
				  
				  $scope.pages.push({num : i//, 
									//beg : i*$scope.pageSize-$scope.pageSize+1, 
									//end : i*$scope.pageSize+1	
									})
				  //$scope.pageslist += " "+i.toString();
					//$scope.pageslist += "<span ng-click=\"ChangePage("+i+")\"  > "+i+" </span>";
				 //<p ng-bind-html="sce.trustAsHtml(pageslist)"></p> 
			  }
			alert($scope.pages);
		  }		  
		  
		  //GetPagesRow();
		  
		  /* Main.AllUsers(function(res) {
				$scope.AllUsersCol = res.data;				
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            })	*/  

}])

 
 
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