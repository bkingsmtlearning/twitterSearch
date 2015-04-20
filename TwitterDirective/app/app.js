var app = angular.module('myApp', ['ui.bootstrap', 'ngResource']);

app.config(function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];	
	app.$httpProvider = $httpProvider;
});

function TwitterCtrl ($scope, $resource, twitter) {

	$scope.twitter = twitter;
	$scope.isUser = false;
	$scope.userError = false;
	
	$scope.callTwitterSearch = function() {
		
		//check for @
		if($scope.query.charAt(0) === "@"){
			
			$scope.isUser = true;
			
			//var query = $scope.query.substring(1);
			//$scope.twitter.get({sub:'statuses', action:"user_timeline.json", screen_name: query}, $scope.getTwitterResults);
			
			var query = "from:" + $scope.query.substring(1);
			$scope.twitter.get({q:query}, $scope.getTwitterResults);
		}else{
			$scope.isUser = false;
			$scope.twitter.get({q:$scope.query}, $scope.getTwitterResults);
		}	
	}
	
	$scope.getTwitterResults = function(data){
		
		/*
		if($scope.isUser){
			$scope.twitterResult = data;
		}else{
			$scope.twitterResult = data.statuses;
		}
		*/
		
		$scope.twitterResult = data.statuses;
		
		$scope.userError = false;
		if(data.statuses.length === 0 && $scope.isUser){
			$scope.userError = true;
		}
	}
}

app.factory('twitter', function ($resource, $http) {
   var consumerKey = encodeURIComponent('xKxmQDgcWiHINVN97WXCKZASL')
   var consumerSecret = encodeURIComponent('9pNPWgqQBMay2shwrCUwG5VWDDRQjpuYbKPNH1OiOo4X5NaUPA')
   var credentials = Base64.encode(consumerKey + ':' + consumerSecret)
   // Twitters OAuth service endpoint
   var twitterOauthEndpoint = $http.post(
       'https://api.twitter.com/oauth2/token'
       , "grant_type=client_credentials"
       , {headers: {'Authorization': 'Basic ' + credentials, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}}
   )
   twitterOauthEndpoint.success(function (response) {
       // a successful response will return
       // the "bearer" token which is registered
       // to the $httpProvider
	   app.$httpProvider.defaults.headers.common['Authorization'] = "Bearer " + response.access_token
   }).error(function (response) {
         // error handling to some meaningful extent
       })

	var r= $resource("https://api.twitter.com/1.1/:sub/:action",
			{sub: "search", action: "tweets.json"});
   
   return r;
});


