angular
  .module('RoboticMortgageAdvisor.AipController', [])
  .controller('AipController', function ($location, $rootScope, $scope, PersonalDetails, Utility, Authentication) {

    // Override Math.log function to be able to change the base of the log
    Math.log = (function() {
      var log = Math.log;
      return function(n, base) {
        return log(n)/(base ? log(base) : 1);
      };
    })();

    // Display the overlay for customer details
    $scope.displayStatus = true;

    // Get the personal details from the service
    $scope.personalDetails = PersonalDetails.getPersonalDetails();

    // Create a random number to be different on each load for reference number
    $scope.personalDetails.referenceNumber = Math.floor((Math.random() * 10000000) + 1);

    $scope.personalDetails.expiryDate = Utility.getDate();

    // Define a year as 12 months
    var months = 12;

    // Stressed Rate as monthly percentage
    var stressedRate = (7/months)/100;

    $scope.showHide = function () {
      $scope.personalDetails.maxTerm = $scope.personalDetails.retirementAge - ($scope.personalDetails.age + 1);
      $scope.personalDetails.totalBorrowing = $scope.personalDetails.propertyValue * ($scope.personalDetails.ltv / 100);
      $scope.personalDetails.stressedBorrowingTotal = (stressedRate * $scope.personalDetails.totalBorrowing) / $scope.personalDetails.budget;
      $scope.personalDetails.minTerm = Math.ceil((Math.log((1-$scope.personalDetails.stressedBorrowingTotal), (1+stressedRate))*-1)/months);

      // converting property value from string to float
      $scope.personalDetails.propertyValue = parseFloat($scope.personalDetails.propertyValue);

      // working out the deposit
      $scope.personalDetails.deposit = $scope.personalDetails.propertyValue - ($scope.personalDetails.propertyValue * ($scope.personalDetails.ltv / 100));

      if ($scope.personalDetails.minTerm < $scope.personalDetails.maxTerm) {
        PersonalDetails.setPersonalDetails($scope.personalDetails);
        $scope.displayStatus = $scope.displayStatus ? false : true;
      } else {
        $scope.error = 'Please adjust your budget, LTV and property value, to recalculate your term.'
      }
    };
  });
