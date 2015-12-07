angular.module("angularRestfulAuth")
.factory('MyService', function () {//http://stackoverflow.com/questions/21919962/angular-share-data-between-controllers
  return {
    data: {
      mess: "1",
	  err: "",
     // baseUrl: "http://localhost"
	 baseUrl: "http://192.168.123.168"
    }
  };
})
 .factory('Main', ['$rootScope','$http','MyService', '$localStorage', function($rootScope,$http,MyService, $localStorage){
        //var baseUrl = "http://localhost:3001";
		baseUrl=MyService.data.baseUrl;
		//$rootScope.baseUrl = baseUrl; 
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
           // save: function(data, success, error) {
            //    $http.post(baseUrl + '/signin', data).success(success).error(error)
				//$http.get('http://api/user').then(function(response){responseData = response.data; });
				//$http.post('/someUrl', data, config).then(successCallback, errorCallback);
            //},
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
                $http.get(baseUrl + '/AllUsers/'+data.beg+'/'+data.num).success(success).error(error)
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
			
			,
			//saveFile: function (data,file,url) {
				saveFile: function (data) {
				//var url = conf.apiUrl;
				//var fd = new FormData();
				//fd.append('file', file);
				//return $http({
					$http({
					method: 'POST',
					url: baseUrl + '/SaveFile',
					transformRequest: angular.identity,
					data: data,
					//data: fd,
					headers: {'Content-Type': undefined}
				});
			}
			
        };
		
		
 }])
 .factory('UserService', ['$rootScope','$http','MyService', '$localStorage', function($rootScope,$http,MyService, $localStorage){//http://stackoverflow.com/questions/21919962/angular-share-data-between-controllers
	baseUrl=MyService.data.baseUrl;
	
  return {
	ChangeUsersParam: function(col,val,id_user,calback) {//изменение пользовательских данных
		//alert('ChangeUsersParam11');
		var data = {
			column: col,
			value:val,
			id_user:id_user
		}
		$http.post(baseUrl + '/ChangeUsersParam',data).success(function(res){
		if (res.type == false) {
			MyService.data.err = 'сменить чат не удалось'
		   alert(res.data)    
		} else {
			 // $scope.chats = res.data;
			  
			  //alert("ok "+res.data) 
			  MyService.data.mess = "обновили";
			//$rootScope.mess = "обновили";
			//$scope.data.mess = "обновили";
				//alert("обновили")
				if(calback !=null){
					calback();
				}
				//calback;
			  //checkChsats();
			}	  
		  }).error(function() {
			  MyService.data.err ='проверить чаты не удалось'
				MyService.data.err = 'Failed to ChangeUsersParam';
		})	
	}
  };
}])