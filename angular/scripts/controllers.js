'use strict';


angular.module("angularRestfulAuth", [
    'ngStorage',
    'ngRoute'
])
    .controller('HomeCtrl',  ['$rootScope', 'MyService' ,'$scope', '$location', '$localStorage', 'Main', function($rootScope, MyService,$scope, $location, $localStorage, Main)
{
	$scope.data = MyService.data;
	//$scope.mess = $rootScope.mess;
	//$rootScope.baseUrl = "http://localhost:3001";
	$scope.PostUser = $localStorage.user;
	
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
				$localStorage.user = null;
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
					$localStorage.user = res.data;
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

    .controller('MeCtrl', ['$rootScope', '$scope','MyService','$http', '$location', 'Main', function($rootScope, $scope,MyService,$http, $location, Main) {
	  //var baseUrl = $rootScope.baseUrl
	  baseUrl=MyService.data.baseUrl;
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
   .controller('PageUsersCtrl', ['$rootScope', '$scope','MyService','$routeParams','$sce', '$http','$location', 'Main', function($rootScope, $scope,MyService,$routeParams,$sce,$http,$location, Main) {
         // alert('hhhhh');
		   baseUrl=MyService.data.baseUrl;
		  //var baseUrl = $rootScope.baseUrl
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
   .controller('chatCntrl', ['$rootScope', '$scope', '$localStorage', 'MyService','UserService','$timeout','$routeParams','$http','$document', '$location', 'Main', function($rootScope, $scope,$localStorage,MyService,UserService,$timeout,$routeParams,$http,$document,$location, Main) {
		  $scope.currentPageNum = 1;
		  $scope.PageNum = 1;
		  $scope.pageSize = 4;
		  $scope.numMessages =0;
		  if(!$scope.mychats) $scope.mychats = [];
		  $scope.mychats= $localStorage.mychats;
		  
		$scope.$watch('mychats', function() {
			//alert('hey, myVar has changed!');
			$localStorage.mychats =  $scope.mychats;
		});	
		 
		  baseUrl=MyService.data.baseUrl;
			//$scope.mychats.push({name:"mch1"})
			//$scope.mychats.push({name:"mch2"})
		
		$scope.myMess = '';
		
		$scope.messages = [];
		//var baseUrl = $rootScope.baseUrl
		
		
		if($routeParams.page)
			$scope.currentPageNum =  $routeParams.page;		  
		
		//получение сообщений из чата
		$scope.GetMess  = function(beg,num){
			  var data={
				  beg:beg,
				  num:num
			  }
			$http.post(baseUrl + '/chatMess',data).success(function(res){
					if (res.type == false) {
						MyService.data.mess = 'получить сообщкения не удалось'
					} else {
						$scope.messages = res.data
						for(var i=0; i<$scope.messages.length; i++){
							$scope.messages[i].user = fotoCheckCom(new Array($scope.messages[i].user))[0];
						}
					}	  
					  }).error(function() {
						 MyService.data.err ='получить сообщкения не удалось'
							
					})
		}
		//$scope.GetMess($scope.currentPageNum*$scope.pageSize-$scope.pageSize, $scope.currentPageNum*$scope.pageSize+1 )
		$scope.GetMess($scope.currentPageNum*$scope.pageSize-$scope.pageSize, $scope.pageSize )
		
		//сохранение сообщения
		$scope.saveMess = function(){
						var data = {
							chatMess: $scope.myMess
						}

					$http.post(baseUrl + '/SaveChatMess', data).success(function(res){
			  	if (res.type == false) {
					MyService.data.err = 'coхранить сообщкение не удалось'
                   alert(res.data)    
                } else {
					  
					  alert("ok "+res.data)  
					  $scope.GetMess($scope.currentPageNum*$scope.pageSize-$scope.pageSize, $scope.pageSize )
					}	  
				  }).error(function() {
					  MyService.data.err ='coхранить сообщкение не удалось'
						
				})
			
		}
		
		
		function GetnumChatMess(){
			$http.get(baseUrl + '/numChatMess').success(function(res){
					if (res.type == false) {
						MyService.data.mess = res.data;
					} else {
					   $scope.numMess = res.data;
					   $scope.PageNum = Math.ceil($scope.numMess/$scope.pageSize);
						GetPagesRow();
					}	  
			  }).error(function() {
					MyService.data.err = 'Failed to numUssers';
					}	  
			  )
		}
		GetnumChatMess()
		
		$scope.pages=[];
		$scope.pagesShow=[];
		  function GetPagesRow(){//рисуем страницы
  
			  for(var i=1; i< $scope.PageNum+1;i++){
					$scope.pages.push({num : i//, 
									})				  
				  
				  if((i>$scope.currentPageNum-2) && (i<$scope.currentPageNum-1+3)){//отсекаем только нужные 
							$scope.pagesShow.push({num : i//, 
							})
				  }				
			  }
		  }

		  $scope.id_meeted = 0;
		  $scope.chats = []
		  //var baseUrl = $rootScope.baseUrl
		  //встретить пользователя
		  $scope.MeetUser = function(){
			  //-=-!!!!!!!!
/**/		  //Важно создать массив пользователей, с которыми встретился (и время), чтобы повторно не запрашивать сервер (или запрашивать если встретился более 10мин назад)

			  if($scope.id_meeted == 0) return;
			  
			  //сравнивается ваш и его id_chat, если они разные, 
			  //то сравнивается, в каком больше пользователей и туда и переходит пользователь
			  //если кол-во людей в чате одинаковое, то переход на с меньшим индексом
				var data = {
					id_meeted: $scope.id_meeted
				}
				$http.post(baseUrl + '/CheckChats',data).success(function(res){
			  	if (res.type == false) {
					MyService.data.err = 'проверить чаты не удалось'
                   alert(res.data)    
                } else {
					  $scope.chats = res.data;
					   checkChsats($scope.chats);
					}	  
				  }).error(function() {
					  MyService.data.err ='проверить чаты не удалось'
						$rootScope.error = 'Failed to CheckChats';
				})			  
			  
		  }
		  
		  //проверяем в чьем (из встретившихся) чате больше человек, и если, что предлагаем сменить чат
		  function checkChsats(chats){
				if(chats.length >1){
					var meChat=[];
					var otherChat=[];
					for(var i=0; i<chats.length; i++){
						if(chats[i].email == $scope.CurrentUser.email){
							meChat=chats[i];
						}else{
							otherChat=chats[i];
						}
					}
					if(meChat.id_chat && otherChat.id_chat){
						if(meChat.id_chat == otherChat.id_chat){
							alert("чаты одинаковы");
							return;
						}else{
							var active = false; //активным ли будет чат (перейдем ли в него)
							AddChatToMychats(meChat,true);
							
							var str = '';
							if(meChat.col_us > otherChat.col_us){
								str = "В нашем чате больше человек!";
							}
							if(meChat.col_us <= otherChat.col_us){
								str = "В другом чате больше человек!";
							}
							var go =confirm(str+" Хотите перейти?");
							if(go){ 	
								//ChangeUsersParam('id_chat',otherChat.id_chat,0);
								//var callbacArray = array($scope.currentPageNum*$scope.pageSize,$scope.pageSize, $scope.pageSize)
									//	otherChat.id_chat
									$scope.ChangeChat(otherChat.id_chat);							

								
								/*$timeout(function(){ $scope.GetMess(1*$scope.pageSize-$scope.pageSize, $scope.pageSize);
								$scope.pages=[]; $scope.pagesShow=[]; GetnumChatMess(); $scope.currentPageNum = 1;//GetPagesRow();
								},2000);*/
								active = true;
								
							}							
							$scope.mychats = AddChatToMychats(otherChat,active,$scope.mychats);
							//$localStorage.mychats = AddChatToMychats(otherChat,active,$scope.mychats);
						}
					}
				}	  
		  }
		  
		
		function AddChatToMychats(chat,active,mychats){
			//var i=3;
			//for(var i=0;i<mychats.length;)
			var newA = [];
			for (var key in mychats){
				if(active = true){
					mychats[key]['active'] = false;
				}
				if(mychats[key]['id_chat'] != chat['id_chat']){
					newA.push(mychats[key]);
				}
			}
			AddChatToTable(chat['id_chat'],$localStorage.user.id);
			chat['active'] = active;
			newA.push(chat);
			return newA;
		}
		
		function AddChatToTable(id_chat,id_user){//внесение меня в таблицу чата
				//alert('добавление-'+id_chat+' '+id_user)
				if(!id_user){ MyService.data.err ='нет id пользователя'; return; }
				$http.put(baseUrl + '/AddToChats/'+id_chat+"/"+id_user).success(function(res){
			  	if (res.type == false) {
					MyService.data.err = 'добавить к чату не удалось'
                  // alert(res.data)    
                } else {
					  MyService.data.mess = res.data;
					  //$scope.chats = res.data;
					  // checkChsats($scope.chats);
					}	  
				  }).error(function() {
					  MyService.data.err ='добавить к чату не удалось'
				})
		}
		//otherChat.id_chat
		$scope.ChangeChat = function(id_chat){
			//alert(id_chat);
			UserService.ChangeUsersParam('id_chat',id_chat,0,function(){
				//alert('cb');
				$scope.GetMess(1*$scope.pageSize-$scope.pageSize, $scope.pageSize);
				$scope.pages=[]; $scope.pagesShow=[]; GetnumChatMess(); $scope.currentPageNum = 1;//GetPagesRow();
			});			
		}
		
		$scope.updateChats = function(){
	/**/	//в будущем сделаем чтобы если чаты более чем 20 минут как не посещялись, то убиваем их
				//1. обновляем время посещения чата
				//2. вытаскиваем чаты и кол-во человек в них
				//new Date().getTime();
				var data = {
					id_user: $localStorage.user.id
				}
				$http.post(baseUrl + '/updateChats/',data).success(function(res){
			  	if (res.type == false) {
					MyService.data.err = 'обновить чаты не удалось'
                   alert(res.data)    
                } else {
					 MyService.data.mess ='чаты обновлены'
					for (var key in $scope.mychats){
						for (var key2 in res.data){
							if($scope.mychats[key]['id_chat'] == res.data[key2]['id_chat']){
								//alert('id_chat='+$scope.mychats[key]['id_chat'])
								$scope.mychats[key]['col_us'] = res.data[key2]['col_us']
							}
						}
							//$scope.mychats[key]['active'] = false;
						/*if(mychats[key]['id_chat'] != chat['id_chat']){
							newA.push(mychats[key]);
						}*/
					}

					 //$scope.mychats
					 
					 // $scope.chats = res.data;
					 //  checkChsats($scope.chats);
					}	  
				  }).error(function() {
					  MyService.data.err ='обновить чаты не удалось'
				})		
		}
		  
		
 }])	
   .controller('adminCntrl', ['$rootScope', 'MyService','UserService','$scope','$routeParams','$http','$document', '$location', 'Main', function($rootScope, MyService,UserService,$scope,$routeParams,$http,$document,$location, Main) {

		  
		  
		  //$scope.data = MyService.data;
		  
		  //$scope.data.mess = "обновили";
		  //изменение пользовательских данных
		 /* function ChangeUsersParam(col,val,id_user){
			  //если id_user=0, то у текущего пользователя
			  alert('ChangeUsersParam');
			  	var data = {
					column: col,
					value:val,
					id_user:id_user
				}
				$http.post(baseUrl + '/ChangeUsersParam',data).success(function(res){
			  	if (res.type == false) {
					$scope.err = 'сменить чат не удалось'
                   alert(res.data)    
                } else {
					 // $scope.chats = res.data;
					  
					  alert("ok "+res.data) 
					  $scope.data.mess = "обновили";
					//$rootScope.mess = "обновили";
					//$scope.data.mess = "обновили";
						alert("обновили")
					  //checkChsats();
					}	  
				  }).error(function() {
					  $scope.err ='проверить чаты не удалось'
						$rootScope.error = 'Failed to ChangeUsersParam';
				})	
		  }*/
 }])