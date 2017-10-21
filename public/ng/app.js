angular.module('loginapp', ['ui.router', 'ngStorage'])
.config(function($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider){
	
	$httpProvider.interceptors.push('AuthInterceptor');
	
	$locationProvider.html5Mode(true);
    $urlMatcherFactoryProvider.caseInsensitive(true);

	// app routes
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'views/home/index.html',
			controller: 'HomeController'
		})
		.state('profile', {
			url: '/profile',
			templateUrl: 'views/profile/index.html',
			controller: 'ProfileController'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'views/auth/login.html',
			controller: 'LoginController'
		})
		.state('register', {
			url: '/register',
			templateUrl: 'views/auth/register.html',
			controller: 'RegisterController'
		});
})