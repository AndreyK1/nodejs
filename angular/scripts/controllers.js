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
		
	//	$rootScope.PathToNode = '../';
		
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
                   if(res.message){
					   alert(res.message);
				   }else{
						alert(document.location.href.split('#')[0] + '#/confirm/'+res.data.email)
						document.location.href = document.location.href.split('#')[0] + '#/confirm/'+res.data.email;
				   }
				 /*  
				   $localStorage.token = res.data.token;
                    $scope.token =$localStorage.token;
					$scope.user = res.data;
					$scope.CurrentUser= res.data;
				*/	
					
					
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
					//alert('here')
					if(res.data.token){
					   $localStorage.token = res.data.token;
						$scope.token =$localStorage.token;
						$scope.user = res.data;
						$scope.CurrentUser= res.data;
						//$rootScope.user =  $scope.user;
						//$scope.user = JSON.parse(res.data);
					}else{//пользователь не подтвержден
						alert(res.data)
						document.location.href = document.location.href.split('#')[0] + '#/NoConfirmed/1';
					}
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
    .controller('MeCtrl', ['$rootScope', '$scope','$http', '$location', 'Main', function($rootScope, $scope,$http, $location, Main) {
	  var baseUrl = $rootScope.baseUrl
	 // var baseUrl = "http://localhost:3001";
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

			$scope.uploadFile = function(files) {
					var fd = new FormData();
						/*var fd = {
							email: "uytuyt",
							password: "ytuytuyt"
						}*/
					//Take the first selected file
					//fd.append("file", files[0]);
					fd.append("user_id", $scope.user.id);
					fd.append("file", files[0]);

					$http.post(baseUrl + '/SaveFile', fd, {
						withCredentials: true,
						headers: {'Content-Type': undefined },
						transformRequest: angular.identity
					})

				}
			//добавление фото
/*			function ss(data) {
				var baseUrl = "http://localhost:3001";
				 $http({
					method: 'POST',
					url: baseUrl + '/SaveFile',
					transformRequest: angular.identity,
					data: data,
					//data: fd,
					headers: {'Content-Type': undefined}
				});
			}
			
			$scope.savefile = function() {
				var fileInput = document.querySelector("#myfiles");
				var files = fileInput.files;
				var file = files[0];
				 var fd = new FormData();
				//fd.append('file', file,'chris.doc');
				 fd.append('file', file);
				var data = {
					dddd: 'fdfdsffdsfgfdgfdg',
					//file: file,
					email: 'fdgfdgfdg'
					//password: $scope.password
				}					
				//Main.saveFile(data);
				ss(fd);
			}	*/		

}])
   .controller('AllUsersCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {
           Main.AllUsers(function(res) {
				$scope.AllUsersCol = res.data;				
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            })	  

}])
   .controller('PageUsersCtrl', ['$rootScope', '$scope','$routeParams','$sce', '$http','$location', 'Main', function($rootScope, $scope,$routeParams,$sce,$http,$location, Main) {
         // alert('hhhhh');
		  var baseUrl = $rootScope.baseUrl
	//	  var PathToNode = $rootScope.PathToNode
		  
		  $scope.sce = $sce;
		  $scope.pageslist = '';
		  $scope.currentPageNum = 1;
		  $scope.PageNum = 1;
		  $scope.pageSize = 12;
		  $scope.numUssers =0;
		/*  
		$scope.checkPage = function(){
			alert($scope.currentPageNum)
			if($scope.currentPageNum < 1){ $scope.currentPageNum =1;}
			if($scope.currentPageNum > $scope.pages.length){ $scope.currentPageNum =$scope.pages.length;}
		}*/
		  
		  if($routeParams.beg)
		  $scope.currentPageNum =  $routeParams.beg;
		  
		  
		  $scope.GetUsers = function(beg,num){
			 // alert("beg-"+beg+" num-"+num)
			  //page[0] < pagesShow[0]

			  var dat={
				  beg:beg,
				  num:num
			  }
			  Main.AllUsersWithin(dat,function(res) {
					//$scope.UsersOnPage = res.data;
					//fotoCheck();
						
					$scope.UsersOnPage = fotoCheckCom(res.data)						
							
							
							//var target = angular.element('appBusyIndicator');
							//var myEl = angular.element( document.querySelector( '#some-id' ) );
							//var myEl = $document.find('#some-id'));
							//var myElement = angular.element($document[0].querySelector('#MyID'))
								/*
								$scope.$watch(function () {
								   //return angular.element('#wrvv-1').val()
								   //return angular.elements( document.querySelector('.popo'))[2].attr('title');
								   return $document.find('.popo')[0];
								   //angular.element($document.querySelector('#wr-1'))
								}, function(val) {
								   alert(val);
								});	
**/
					
					//alert($scope.UsersOnPage);					
				}, function() {
					$rootScope.error = 'Failed to fetch UsersOnPage';
				}
			  )
			  
		  }
		  
/*		  
		  //проверяем фотки, если нету, товставляем no foto
		  function fotoCheck(){
			  for(var i=0; i<$scope.UsersOnPage.length;i++){
				  if($scope.UsersOnPage[i].foto ==null){
					  //alert('null-'+$scope.UsersOnPage[i].email)
					  $scope.UsersOnPage[i].foto = 'img/no.jpg'
				  }else{
					  $scope.UsersOnPage[i].foto = 'foto/'+$scope.UsersOnPage[i].foto;
				  }
			  }
		  }
*/		  
		  //GetUsers(1,$scope.pageSize+1);
		 // $scope.GetUsers($scope.currentPageNum*$scope.pageSize-$scope.pageSize, $scope.currentPageNum*$scope.pageSize+1 )
		  $scope.GetUsers($scope.currentPageNum*$scope.pageSize-$scope.pageSize, $scope.pageSize )

		  
		  $http.get(baseUrl + '/numUssers').success(function(res){
			  	if (res.type == false) {
                   // alert(res.data)    
                } else {
					//alert(res.data);
                   $scope.numUssers = res.data;
				   $scope.PageNum = Math.ceil($scope.numUssers/$scope.pageSize);
				   
				   GetPagesRow();
				}	  
		  }).error(function() {
                $rootScope.error = 'Failed to numUssers';
				}	  
		  )
		  
		$scope.pages=[];
		$scope.pagesShow=[];
		  function GetPagesRow(){//рисуем страницы
				//alert($scope.pages); 			  
			  for(var i=1; i< $scope.PageNum+1;i++){
					$scope.pages.push({num : i//, 
									//beg : i*$scope.pageSize-$scope.pageSize+1, 
									//end : i*$scope.pageSize+1	
									})				  
				  
				  if((i>$scope.currentPageNum-2) && (i<$scope.currentPageNum-1+3)){//отсекаем только нужные 
					//console.log(' i-'+i+' currentPageNum-'+$scope.currentPageNum)
							$scope.pagesShow.push({num : i//, 
									//beg : i*$scope.pageSize-$scope.pageSize+1, 
									//end : i*$scope.pageSize+1	
							})
				  }				
				  //$scope.pageslist += " "+i.toString();
					//$scope.pageslist += "<span ng-click=\"ChangePage("+i+")\"  > "+i+" </span>";
				 //<p ng-bind-html="sce.trustAsHtml(pageslist)"></p> 
			  }
			//alert($scope.pages);
			
			/*if($scope.pages){ 
			  console.log('pages[0]-'+$scope.pages[0].num+' pagesShow[0]-'+$scope.pagesShow[0].num)
			  console.log('pages[pages.length]-'+$scope.pages[$scope.pages.length-1].num+' pagesShow[pagesShow.length]-'+$scope.pagesShow[$scope.pagesShow.length-1].num)
			 
			 }*/
		  }		  
		  
}])
 .directive('popoverEl', function() {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function(scope, element, attrs) {
            //$(element).toolbar(scope.$eval(attrs.toolbarTip));
			$(element).popover(scope.$eval(attrs.popoverEl));
        }
    };
})

 /*  .controller('SaveFile', ['$rootScope', '$scope', '$http', '$location', 'Main', function($rootScope, $scope, $http, $location, Main) {
           var baseUrl = "http://localhost:3001";
		   var url = "http://localhost:3001";
		  // var url = $rootScope.baseUrl
		   //var url = conf.apiUrl;
			/*
			saveFile: function (file) {
				var url = conf.apiUrl;
				var fd = new FormData();
				fd.append('file', file);
				return $http({
					method: 'POST',
					url: url,
					transformRequest: angular.identity,
					data: fd,
					headers: {'Content-Type': undefined}
				});
			}*/
			
/*			function ss(data) {
				var baseUrl = "http://localhost:3001";
				//var url = conf.apiUrl;
				//var fd = new FormData();
				//fd.append('file', file);
			  // function(data, success, error) {
              

			 // $http.post(baseUrl + '/signin', data).success(success).error(error)
			 //$http.post(baseUrl + '/SaveFile', data)
				
				
				
				 $http({
					method: 'POST',
					url: baseUrl + '/SaveFile',
					transformRequest: angular.identity,
					data: data,
					//data: fd,
					headers: {'Content-Type': undefined}
				});
			}
			

			//alert('signin1');
			
			$scope.savefile = function() {
				//alert('signin');
				
				
				
				var fileInput = document.querySelector("#myfiles");
				var files = fileInput.files;
				//alert(fileInput)
				var file = files[0];
				alert(file.name)
				//file = {"dsfdsf":"sadsadsattt6666"}
				var ff = JSON.stringify(file)
				alert(ff)

					//password: $scope.password
				 var fd = new FormData();
				fd.append('file', file,'chris.doc');
				 
				var data = {
					dddd: 'fdfdsffdsfgfdgfdg',
					//file: file,
					email: 'fdgfdgfdg'
					//password: $scope.password
				}					
				//Main.saveFile(data);
				ss(fd);
			}

			
			/*
			//еще один способ отправки
			//<input type="file" name="file" onchange="angular.element(this).scope().uploadFile(this.files)"/>
			$scope.uploadFile = function(files) {
					var fd = new FormData();
					//Take the first selected file
					fd.append("file", files[0]);

					$http.post(baseUrl + '/SaveFile', fd, {
						withCredentials: true,
						headers: {'Content-Type': undefined },
						transformRequest: angular.identity
					})

				};*/
//}])
   .controller('watch_examlpe', ['$rootScope', '$scope','$sce', '$document', '$location', 'Main', function($rootScope, $scope,$sce,$document,$location, Main) {
		
		// good example in directive
		//https://thinkster.io/egghead/angular-element
		
		//  var target = angular.element('#appBusyIndicator');
		//var target = angular.element('appBusyIndicator');
		//var myEl = angular.element( document.querySelector( '#some-id' ) );
		//var myEl = $document.find('#some-id'));
		//var myElement = angular.element($document[0].querySelector('#MyID'))
		
		
		/*1 прим*/
		$scope.lss=0;
			$scope.$watch('lss'
			, function(val) {
			   alert(val);
			});		
		
		

		/*2 прим*/
			$scope.$watch(function () {
			   //return angular.element('#wrvv-1').val()
			   return angular.element( document.querySelector( '#wrvv-1' )).attr('class');
			   //angular.element($document.querySelector('#wr-1'))
			}, function(val) {
			   alert(val);
			});		
		
		$scope.sce = $sce;
		$scope.list ='';
		var n=2;
		for(var i=0; i<n; i++){
			
			$scope.list +="<input type='text' id='w-"+i+"' value='"+i+"'  />";

			//$scope.pageslist += " <span  ng-click=\"ChangePage("+i+")\"  > "+i+" </span> ";
			//<p ng-bind-html="sce.trustAsHtml(pageslist)"></p> 			
		}
		/*
			$scope.$watch(function () {
			   return angular.element( document.querySelector( '#wr-1' ));
			   //angular.element($document.querySelector('#wr-1'))
			}, function(val) {
			   alert(val);
			});*/
		
		/*$scope.$watch(function () {
			   //return document.body.innerHTML;
			   //return angular.element( document.querySelector( '#for-Watch' ));
			   //return angular.element( document.querySelector( '#for-Watch' ));
			   return angular.element($document[0].querySelector('#for-Watch'))
			}, function(val) {
			   alert(val);
			   //TODO: write code here, slit wrists, etc. etc.
			});*/

}])
   .controller('registrCntrl', ['$rootScope', '$scope','$routeParams','$http','$document', '$location', 'Main', function($rootScope, $scope,$routeParams,$http,$document,$location, Main) {
 		if($routeParams.email){
			$scope.email =  $routeParams.email;
			//$scope.mess = 
			//$scope.hex = hex_md5(email);
		}
		if($routeParams.hex){
			var baseUrl = $rootScope.baseUrl
			$scope.hex =  $routeParams.hex;
			$scope.mess = '';
			//проверяем есть ли такой ользователь, и если есть активизируем
			
				$http.get(baseUrl + '/toConfirm/'+$scope.hex).success(function(res){
			  	if (res.type == false) {
					$scope.mess = 'подтверждение не удалось'
                   //alert('подтверждение не удалось')    
                } else {
					$scope.mess = res.data
                  //alert('подтверждение Удалось!')  
				  // $scope.numUssers = res.data;
				   //$scope.PageNum = Math.ceil($scope.numUssers/$scope.pageSize);
				   
				  // GetPagesRow();
				}	  
				  }).error(function() {
					  $scope.mess ='подтверждение не удалось'
						$rootScope.error = 'Failed to toConfirm';
						}	  
				  )
			
			
			//$scope.mess = 
			//$scope.hex = hex_md5(email);
		}
		if($routeParams.mess){
			$scope.mess = "Вы не подтавердили регистрацю, проверьте свою почту."
		}
		
}])		
   .controller('chatCntrl', ['$rootScope', '$scope','$routeParams','$http','$document', '$location', 'Main', function($rootScope, $scope,$routeParams,$http,$document,$location, Main) {
	//	  $scope.sce = $sce;
	//	  $scope.pageslist = '';
		//$scope.chat_id;
		  $scope.currentPageNum = 1;
		  $scope.PageNum = 1;
		  $scope.pageSize = 4;
		  $scope.numMessages =0;
		
		$scope.myMess = '';
		
		$scope.messages = [];
		var baseUrl = $rootScope.baseUrl
		
		
		if($routeParams.page)
			$scope.currentPageNum =  $routeParams.page;		  
		  
		 // $scope.GetUsers = function(beg_id,end_id){
		
		
		//получение сообщений из чата
		$scope.GetMess  = function(beg,num){
			  //alert("beg-"+beg+" num-"+num)
			  var data={
				  beg:beg,
				  num:num
			  }
			//$http.get(baseUrl + '/chatMess/'+$scope.currentPageNum+"/"+).success(function(res){
			$http.post(baseUrl + '/chatMess',data).success(function(res){
					if (res.type == false) {
						$scope.mess = 'получить сообщкения не удалось'
					   //alert('подтверждение не удалось')    
					} else {
						$scope.messages = res.data
					//	alert('scope.messages[0].text-'+$scope.messages[0].text)
					//	GetnumChatMess(res.data[0].user.id_chat)
						for(var i=0; i<$scope.messages.length; i++){
							//alert($scope.messages[i].user.foto)
							//alert('i='+i+fotoCheckCom(new Array($scope.messages[i].user))[0].foto)
							$scope.messages[i].user = fotoCheckCom(new Array($scope.messages[i].user))[0];
						}
						//$scope.UsersOnPage = fotoCheckCom(res.data)	
						
					  //alert(res.data)  
					  // $scope.numUssers = res.data;
					   //$scope.PageNum = Math.ceil($scope.numUssers/$scope.pageSize);
					   
					  // GetPagesRow();
					}	  
					  }).error(function() {
						  $scope.err ='получить сообщкения не удалось'
							$rootScope.error = 'Failed to chatMess';
					})
		}
		//$scope.GetMess($scope.currentPageNum*$scope.pageSize-$scope.pageSize, $scope.currentPageNum*$scope.pageSize+1 )
		$scope.GetMess($scope.currentPageNum*$scope.pageSize-$scope.pageSize, $scope.pageSize )
		
		//сохранение сообщения
		$scope.saveMess = function(){
			//alert($scope.myMess);
						var data = {
							//id_user: 675,
							chatMess: $scope.myMess
						}

					$http.post(baseUrl + '/SaveChatMess', data).success(function(res){
			  	if (res.type == false) {
					$scope.err = 'coхранить сообщкение не удалось'
                   alert(res.data)    
                } else {
					  
					  alert("ok "+res.data)  
					  $scope.GetMess($scope.currentPageNum*$scope.pageSize-$scope.pageSize, $scope.pageSize )
					  // $scope.numUssers = res.data;
					   //$scope.PageNum = Math.ceil($scope.numUssers/$scope.pageSize);
					   
					  // GetPagesRow();
					}	  
				  }).error(function() {
					  $scope.err ='coхранить сообщкение не удалось'
						$rootScope.error = 'Failed to chatMess';
				})
			
		}
		
		
		function GetnumChatMess(){
			//alert('GetnumChatMess-')
			//$http.get(baseUrl + '/numChatMess/'+id_chat).success(function(res){
			$http.get(baseUrl + '/numChatMess').success(function(res){
					if (res.type == false) {
					   // alert(res.data)    
					} else {
						//alert(res.data);
					   $scope.numMess = res.data;
					   //alert('scope.numMess-'+$scope.numMess)
					   $scope.PageNum = Math.ceil($scope.numMess/$scope.pageSize);
					   
					   GetPagesRow();
					}	  
			  }).error(function() {
					$rootScope.error = 'Failed to numUssers';
					}	  
			  )
		}
		GetnumChatMess()
		
		$scope.pages=[];
		$scope.pagesShow=[];
		  function GetPagesRow(){//рисуем страницы
				//alert($scope.pages); 			  
			  for(var i=1; i< $scope.PageNum+1;i++){
					$scope.pages.push({num : i//, 
									//beg : i*$scope.pageSize-$scope.pageSize+1, 
									//end : i*$scope.pageSize+1	
									})				  
				  
				  if((i>$scope.currentPageNum-2) && (i<$scope.currentPageNum-1+3)){//отсекаем только нужные 
					//console.log(' i-'+i+' currentPageNum-'+$scope.currentPageNum)
							$scope.pagesShow.push({num : i//, 
							})
				  }				
			  }
			//alert($scope.pages);
		  }	
		
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