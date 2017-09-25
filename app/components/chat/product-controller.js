angular
  .module('RoboticMortgageAdvisor.ProductController', ['ngRoute'])
  .controller('ProductController', function($http, $scope, $routeParams) {
    var id = $routeParams.productId;
    console.log(id);

    if (id) {
      $http({
        method: 'GET',
        url: 'products/product/' + id,
        'Content-Type': 'application/json'
      }).then(
        function success(response) {
          $scope.product = response.data;
          $scope.product.ercDate = moment().add($scope.product.introductoryTerm, 'years').format('MMMM YYYY')
        }
      );
    }
  });
