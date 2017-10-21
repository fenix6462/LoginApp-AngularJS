angular.module('loginapp').controller('LoginController', function($scope, $http, $location, $localStorage, $window) {

	$scope.email = '';
	$scope.password = '';
	$scope.errorMessage = '';

	$scope.login = function() {
		$http.post('/api/auth/login', { email: $scope.email, password: $scope.password }).then(function(response){
			if (response.data.token) {
				// store email and token in local storage to keep user logged in between page refreshes
				$localStorage.currentUser = { email: email, token: response.data.token };

				// add jwt token to auth header for all requests made by the $http service
				$http.defaults.headers.common.Authorization = response.data.token;

				// execute callback with true to indicate successful login
				$location.path('/');
			} else {
				// execute callback with false to indicate failed login
				$scope.errorMessage = response.data.error;
			}
		}, function(response){
			$scope.errorMessage = response.data.error;
		});
	};
});