angular
  .module('RoboticMortgageAdvisor.Directives', [])
  .directive('dynamic', function ($compile) {
    return {
      restrict: 'A',
      replace: true,
      link: function (scope, ele, attrs) {
        scope.$watch(attrs.dynamic, function(html) {
          ele.html(html);
          $compile(ele.contents())(scope);
        });
      }
    };
  })
  .directive('scroll', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        scope.$watchCollection(attr.scroll, function(newVal) {
          $timeout(function() {
           element[0].scrollTop = element[0].scrollHeight;
          });
        });
      }
    }
  })
  .directive('loadAudio', function($parse) {
    return {
      restrict: 'EA',
      scope: {
          source: '=',
      },
      template: '<audio />',
      link: function(scope, iElement, iAttrs) {
        scope.$watch('source', function(value) {
          var audio = iElement.find('audio');
          audio.attr('src',  value);
        }, true);
      }
    }
  })
  .directive('script', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr) {
        if (attr.type === 'text/javascript-lazy') {
          var code = elem.text();
          var f = new Function(code);
          f();
        }
      }
    };
  });
