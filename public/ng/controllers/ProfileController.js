angular.module('loginapp').controller('ProfileController', function($scope, $http) {

	$http.get('/api/profile').then(function(response){
		console.log('asd');
	}, function(){
		console.error('asd');
	})

});