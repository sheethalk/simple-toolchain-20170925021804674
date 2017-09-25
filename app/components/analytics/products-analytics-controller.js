angular
  .module('RoboticMortgageAdvisor.ProductsAnalyticsController', ['ngRoute', '720kb.datepicker', 'googlechart'])
  .controller('ProductsAnalyticsController', function($http, $rootScope, $scope, $sce, $timeout, Authentication, Analytics) {

    // Remove the repayment notice from the analytics page.
    var repaymentNotice = angular.element(document.getElementsByClassName('repayment-notice')[0]);
    repaymentNotice.remove();

    $scope.today = new Date().toString()
    $scope.yesterday = new Date(moment().subtract(1, 'days')).toString()

    $scope.dateTo = moment().endOf('day');
    $scope.dateFrom = moment().subtract(1, 'days').startOf('day');

    $scope.reverse = true;

    //Make a request to get the conversations data
    $scope.getProducts = function() {
      $http({
        method: 'POST',
        url: 'analytics/data/products',
        data: {
          dateFrom: $scope.dateFrom,
          dateTo: $scope.dateTo
        }
      }).then(
        function success(response) {
          if (response.data) {
            $scope.products = response.data;
          } else {
            $scope.error = response.data;
            $scope.isEmpty = true;
          }
        },
        function fail(response) {
          $scope.error = 'There seems to be an error with your request, please try again';
        }
      );
    };

    $scope.getProducts();
  });
