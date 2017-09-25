angular
    .module('RoboticMortgageAdvisor.ConversationsController', ['ngRoute'])
    .controller('ConversationsController', function($scope, $sce, $routeParams, $http, Authentication, Analytics) {

        var conversationId = $routeParams.conversationId;

        var CMessage = [];

        var repaymentNotice = angular.element(document.getElementsByClassName('repayment-notice')[0]);
        repaymentNotice.remove();

        $scope.conversation = Analytics.getConversation(conversationId);

        $scope.trustAsHtml = function(html) {
            return $sce.trustAsHtml(html);
            $compile();
        };

        $scope.conversation.messages.forEach(function(message) {
            if (message.client == "true") {
                CMessage.push(message.message)
            }
        });

        // $scope.NLU=function(){
        //
        //     $http({
        //       method: 'POST',
        //       url: 'analyze',
        //       data: {
        //         text:CMessage
        //       }
        //     }).then(
        //       function success(response) {
        //   console.log("analyse success");
        //
        //       },
        //       function fail(response) {
        //         $scope.error = 'There seems to be an error with your request, please try again';
        //       }
        //     );
        //     console.log("user message is " + CMessage);
        //   };

        $scope.tone = function() {

            $http({
                method: 'POST',
                url: 'tone',
                data: {
                    text: CMessage
                }
            }).then(
                function success(response) {
                    console.log("hi");
                    console.log("response is " + JSON.stringify(response.data,null, 2));
                    $scope.emotion = response.data.document_tone.tone_categories[0].tones;
                    $scope.language = response.data.document_tone.tone_categories[1].tones;
                    $scope.social = response.data.document_tone.tone_categories[2].tones;
                    $scope.toneClicked = true;
                },
                function fail(response) {
                    $scope.error = 'There seems to be an error with your request, please try again';
                }
            );
        };


    });
