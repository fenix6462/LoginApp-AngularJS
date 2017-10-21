angular.module('loginapp').controller('AppController', function($scope, $rootScope, $localStorage, $location, $http, AuthenticationService) {


	
	$rootScope.$on('$locationChangeStart', function (event, next, current) {			
		$scope.currentUser = AuthenticationService.currentUser();
		$scope.isLoggedIn = AuthenticationService.isLoggedIn();
		
		if ($scope.currentUser) {
			$http.defaults.headers.common.Authorization = AuthenticationService.getToken();
		}
		
		debugger;

		var publicPages = ['/login'];
		var authPages = ['/login', '/register'];
		var restrictedPage = publicPages.indexOf($location.path()) === -1;
		var authPage = authPages.indexOf($location.path()) > -1;
		if (restrictedPage && !$scope.isLoggedIn) {
			$location.path('/login');
		} else if(authPage && $scope.isLoggedIn){
			$location.path('/');
		}
	  });
	$scope.logout = function(){
		$scope.isLoggedIn = false;
		$scope.currentUser = {};
		AuthenticationService.Logout();	
	}

});