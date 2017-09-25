angular
  .module('RoboticMortgageAdvisor.LoginController', [])
  .controller('LoginController', function ($http, $location, $scope, Authentication) {

    $scope.userCredentials = {
      username: 'laetitia',
      password: 'password'
    };

    $scope.login = function() {
      $http({
        method: 'POST',
        url: 'user/login',
        data: $scope.userCredentials
      }).then(
        function success(response) {
          if (response.data.user) {
            Authentication.setId(response.data.user);
            $location.path('/aip');
          } else {
            $scope.error = response.data.message;
          }
        },
        function fail(response) {
          $scope.error = 'There seems to be an error with your request, please try again';
        }
      )
    }

  });
