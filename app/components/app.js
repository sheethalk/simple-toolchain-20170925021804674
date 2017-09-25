google.charts.load('visualization', '1', {
  packages: ['corechart']
});

google.charts.setOnLoadCallback(function() {
  angular.bootstrap(document.body, ['RoboticMortgageAdvisor']);
});

angular
  .module('RoboticMortgageAdvisor', [
    'googlechart',
    'pickadate',
    'ngRoute',
    'ngAnimate',
    'ngFlatDatepicker',
    'ngCookies',
    'RoboticMortgageAdvisor.AnalyticsController',
    'RoboticMortgageAdvisor.AipController',
    'RoboticMortgageAdvisor.ChatController',
    'RoboticMortgageAdvisor.ConversationsController',
    'RoboticMortgageAdvisor.LoginController',
    'RoboticMortgageAdvisor.MLController',
    'RoboticMortgageAdvisor.ProductController',
    'RoboticMortgageAdvisor.ProductsAnalyticsController',
    'RoboticMortgageAdvisor.AdminController',
    'RoboticMortgageAdvisor.Filters',
    'RoboticMortgageAdvisor.Services',
    'RoboticMortgageAdvisor.Directives'
  ])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'LoginController',
        templateUrl: 'components/login/login-view.html'
      })
      .when('/aip', {
        controller: 'AipController',
        templateUrl: 'components/aip/aip-view.html'
      })
      .when('/chat', {
        controller: 'ChatController',
        templateUrl: 'components/chat/chat-view.html'
      })
      .when('/chat/product/:productId', {
        controller: 'ProductController',
        templateUrl: 'components/chat/product-view.html'
      })
      .when('/analytics', {
        controller: 'AnalyticsController',
        templateUrl: 'components/analytics/analytics-view.html'
      })
      .when('/analytics/products', {
        controller: 'ProductsAnalyticsController',
        templateUrl: 'components/analytics/products-analytics-view.html'
      })
      .when('/analytics/ML', {
        controller: 'MLController',
        templateUrl: 'components/analytics/ML-view.html'
      })
      .when('/analytics/:conversationId', {
        controller: 'ConversationsController',
        templateUrl: 'components/analytics/conversations-view.html'
      })
      .when('/verify', {
        templateUrl: 'components/verify/verify.html'
      })
      .when('/admin', {
        controller: 'AdminController',
        templateUrl: 'components/admin/admin.html'
      })
      .when('/buytv', {
        templateUrl: 'components/buytv/buy-tv.html'
      })
      .when('/home', {
        templateUrl: 'components/qa/qa.html'
      })
      .otherwise({ redirectTo: '/' });
  }])
