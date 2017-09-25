angular
    .module('RoboticMortgageAdvisor.AnalyticsController', ['ngRoute', '720kb.datepicker', 'googlechart'])
    .controller('AnalyticsController', function($http, $rootScope, $scope, $sce, $timeout, Authentication, Analytics, ML) {

        // Remove the repayment notice from the analytics page.
        var repaymentNotice = angular.element(document.getElementsByClassName('repayment-notice')[0]);
        repaymentNotice.remove();

        $scope.today = new Date().toString()
        $scope.yesterday = new Date(moment().subtract(1, 'month')).toString()

        $scope.dateTo = moment().endOf('day');
        $scope.dateFrom = moment().subtract(1, 'days').startOf('day');

        // Initialise the isEmpty variable to true - indicates whether there is at least one conversation in the specified date range.
        $scope.isEmpty = true;

        // Initialise empty filtered conversation array
        $scope.filteredConversations = [];

        $scope.delegated = 0;
        $scope.completed = 0;
        $scope.abandoned = 0;



        /**
         * Filter function used to filter the list of conversations
         * Uses filteredConversations array to store conversations that are within the specified time period
         */
        $scope.topics = {
            'PayFee': 'Fee Payments',
            'FeeUpfront': 'Fee Schedule',
            'FullTerm': 'Term',
            'RateType': 'Rate Type',
            'InitTerm': 'Introductory Term',
            'Overpayment': 'Overpayments',
            'Affordability': 'Affordability',
            'Recommend': 'Product Recommendation',
            'Completed: Application Progressed': 'Application Progressed',
            'Completed: Application Not Progressed': 'Application Not Progressed',
        }

        $scope.filterArray = {
            formSort: 'ascending'
        };

        $scope.reverse = true;

        $scope.phrasesExtracted = false;
        $scope.phrasesSuggested = false;
        $scope.filterConversations = function() {
            $scope.filterArray.formSort === 'ascending' ?
                $scope.reverse = true :
                $scope.reverse = false
        };

        $scope.criteriaMatch = function() {
            return function(conversation) {

                /**
                 * If formName doesn't exist within the filterArray return conversations this will display
                 * all. Otherwise run filter checking if customer_name features within the filterArray
                 */
                if (!$scope.filterArray.formName) return conversation;
                if ($scope.filterArray.formName.indexOf(conversation.profile[0].name) > -1) {
                    return conversation;
                }
            }
        };

        // Status of the conversation topic
        $scope.criteriaStatusTopic = function() {
            return function(conversation) {
                if (!$scope.filterArray.formTopic) return conversation;
                if ($scope.filterArray.formTopic.indexOf(conversation.profile[0].topic) > -1) {
                    return conversation;
                }
            }
        };

        $scope.clearFilter = function() {
            $scope.filterArray = {
                formSort: 'ascending'
            };
        };

        $scope.criteriaStatus = function() {
            return function(conversation) {

                /**
                 * If formStatus doesn't exist within the filterArray return conversations this will display
                 * all. Otherwise run filter checking if conversation_status features within the filterArray
                 */
                if (!$scope.filterArray.formStatus) return conversation;
                if ($scope.filterArray.formStatus == 'Completed') {
                    if (conversation.status.indexOf('Completed') > -1) {
                        return conversation;
                    }
                } else if ($scope.filterArray.formStatus.indexOf(conversation.status) > -1) {
                    return conversation;
                }
            }
        };


        $scope.extractPhrases = function() {
            var userPhrases = [];

            // within the date range, extract all phrases that are of a minimum length of three
            $scope.filteredConversations.forEach(function(conversation) {
                conversation.messages.forEach(function(message) {
                    // if the length is more than three and is user input
                    //conversation.conversationId
                    if (message.client == 'true' && message.message.length > 4) userPhrases.push(message.message);
                });
            });

            $http({
                method: 'POST',
                url: 'classify',
                data: {
                    phrases: userPhrases
                }
            }).then(
                function success(response) {
                    $scope.phrasesExtracted = true;
                    getResults();

                },
                function fail(response) {
                    $scope.error = 'There seems to be an error with your request, please try again';
                }
            );
        };

        var getResults = function() {
            $http({
                    method: 'GET',
                    url: 'classifyResults'
                })
                .then(
                    function success(response) {
                        ML.setConf(response.data.confident, response.data.unmatched);
                        window.location.href = '#/analytics/ML';
                    },
                    function fail(response) {
                        $scope.error = 'There seems to be an error with your request, please try again';
                    }
                );

        }

        $scope.filter = function() {

            getGraphData();
            // Reset the button to extract the phrases
            $scope.phrasesExtracted = false;
            $scope.phrasesSuggested = false;
            /**
             * Each time the date values change, this function ($scope.filter) is executed
             * Therefore clear the filteredConversations array and reset the conversation status counts
             */
            $scope.filteredConversations = [];

            // For each conversation in the conversations list filter by comparing date values
            $scope.conversations.forEach(function(conversation) {

                var conversationDate = moment(conversation.messages[0].timestamp);

                // Re-declare the timings, a fix due to the date picker
                var dateFrom = moment($scope.dateFrom).startOf('day');
                var dateTo = moment($scope.dateTo).endOf('day');

                // Push conversation if within the date range
                if (moment(conversationDate).isSameOrAfter(dateFrom) && conversationDate.isSameOrBefore(dateTo)) {
                    $scope.filteredConversations.push(conversation);
                }
            });

            /**
             * If the filteredConversations array is not empty, then set isEmpty to false - indicating
             * that there is data to display
             * Else set isEmpty to false - indicats no data found within the time period
             * isEmpty is used to hide and show the table and charts depending on if there is any data to
             * display
             */
            $scope.filteredConversations.length > 0 ?
                $scope.isEmpty = false :
                $scope.isEmpty = true;


            //delegatedDrawChart();
            //abandonedDrawChart();
        }

        // google.charts.setOnLoadCallback(drawChart)
        function drawChart(d) {
            var data = google.visualization.arrayToDataTable(d);
            var options = {
                title: 'Overall',
                backgroundColor: {
                    fill: 'transparent'
                },
                colors: ['#db2445', '#4e90b7', '#f6c13c'],
                width: 1000,
                height: 500
            }
            var chart = new google.visualization.PieChart(document.getElementById('pieChart'));

            chart.draw(data, options);
        };

        function delegatedDrawChart(d) {
            var data = google.visualization.arrayToDataTable(d);

            var options = {
                title: 'Delegated Results',
                colors: ['#fef7e7', '#fdf0ce', '#fce8b6', '#fae09e', '#f9d885', '#f7c955', '#f6c13c', '#f5b924'],
                backgroundColor: {
                    fill: 'transparent'
                },
                width: 480,
                height: 300,
                pieSliceText: "none"
            }
            var chart = new google.visualization.PieChart(document.getElementById('delegatedPieChart'));

            chart.draw(data, options);
        };

        function completedDrawChart(c) {
            var data = google.visualization.arrayToDataTable(c);

            var options = {
                title: 'Completed Results',
                colors: ['#75AFD1', '#A9D1E9'],
                backgroundColor: {
                    fill: 'transparent'
                },
                width: 500,
                height: 300,
                pieSliceText: "none"
            }

            var chart = new google.visualization.PieChart(document.getElementById('completedPieChart'));

            chart.draw(data, options);
        };

        // Create the abandoned pie chart
        function abandonedDrawChart(a) {
            var data = google.visualization.arrayToDataTable(a);

            var options = {
                title: 'Abandoned Results',
                colors: ['#F3C8D3', '#EC98Ae', '#E35C7B', '#DF3A58', '#DB2445', '#C5203E', '#AF1D37', '#9A1931'],
                backgroundColor: {
                    fill: 'transparent'
                },
                width: 500,
                height: 300,
                pieSliceText: "none"
            }
            var chart = new google.visualization.PieChart(document.getElementById('abandonedPieChart'));

            chart.draw(data, options);
        };

        function drawStacked() {
            var stackedBarData = [
                ['Question', 'Help 1', 'Help 2', 'Help 3'],
                ['Fee Payments', 0, 0, 0],
                ['Fee Schedule', 0, 0, 0],
                ['Term', 0, 0, 0],
                ['Rate Type', 0, 0, 0],
                ['Intro Term', 0, 0, 0],
                ['Overpayments', 0, 0, 0],
                ['Affordability', 0, 0, 0]
            ];

// $(document).resize(function(){
//     drawChart(d);
//     delegatedDrawChart(d);
//     completedDrawChart(c);
//     abandonedDrawChart(a);
//     drawStacked() ;
// });
            $scope.filteredConversations.forEach(function(conversation) {
                var profile = conversation.profile[0];
                for (var key in profile) {

                    /** Leave here till another solution fully works/find a way to use this
                    var match = key.match(/^(\d)\w{0,1}h$/i);

                    if (match) {
                      stackedBarData[match[1]][profile[key]]++
                    }*/

                    if (key == '1AH') stackedBarData[1][profile[key]]++;
                    else if (key == '1BH') stackedBarData[2][profile[key]]++;
                    else if (key == '2H') stackedBarData[3][profile[key]]++;
                    else if (key == '3AH') stackedBarData[4][profile[key]]++;
                    else if (key == '3BH') stackedBarData[5][profile[key]]++;
                    else if (key == '4H') stackedBarData[6][profile[key]]++;
                    else if (key == '5H') stackedBarData[7][profile[key]]++;
                }
            });

            var data = google.visualization.arrayToDataTable(stackedBarData);

            var options = {
                title: 'Help Metrics',
                width: 1350,
                height: 750,
                colors: ['#587EB9', '#9AB1D5', '#2B405C'],
                backgroundColor: {
                    fill: 'transparent'
                },
                isStacked: true,
                legend: {
                    position: 'top',
                    maxLines: 3
                },
                hAxis: {
                    minValue: 0,
                },
                vAxis: {
                    title: 'Hits',
                    format: '#,###',
                    minValue: 0,
                    maxValue: 4

                }
            };
            var chart = new google.visualization.ColumnChart(document.getElementById('HelpStackChart'));
            chart.draw(data, options);
        }

        var getGraphData = function() {
            $http({
                method: 'POST',
                url: 'analytics/status',
                data: {
                    dateFrom: $scope.dateFrom,
                    dateTo: $scope.dateTo
                }
            }).then(
                function success(response) {
                    var p = [
                        ['Status', 'Total'],
                        ['Abandoned', 0],
                        ['Completed', 0],
                        ['Delegated', 0]
                    ];
                    var c = [
                        ['Question', 'Total']
                    ];
                    var d = [
                        ['Topic', 'Total']
                    ];
                    var a = [
                        ['Topic', 'Total']
                    ];

                    var completedTotal = 0;
                    response.data.forEach(function(r) {
                        if (r.status) {
                            r.status.forEach(function(dp) {

                                if ((dp._id == 'Completed: Product Selected') || (dp._id == 'Completed: Product Recommended')) {
                                    c.push([dp._id.replace("Completed: ", ""), dp.number])
                                    completedTotal = completedTotal + dp.number;
                                } else if (dp._id == 'Abandoned') {
                                    p[1] = [dp._id, dp.number]
                                }

                                else if (dp._id == 'Delegated') {
                                    p[3] = [dp._id, dp.number]
                                }
                            });

                            p[2] = ['Completed', completedTotal]
                            $scope.completed = completedTotal
                        }

                        if (r.delegated) {
                            $scope.delegated = r.delegated.length;
                            r.delegated.forEach(function(dp) {
                                d.push([$scope.topics[dp._id], dp.number])
                            });
                        }

                        if (r.abandoned) {
                            $scope.abandoned = r.abandoned.length;
                            r.abandoned.forEach(function(dp) {
                                a.push([$scope.topics[dp._id], dp.number])
                            });
                        }



                        //If google chart funcs not quite loaded, wait half a second and try again.
                        if(google.visualization.arrayToDataTable == undefined){
                          setTimeout(function () {
                            drawChart(p)
                          }, 1000)
                        } else {
                          drawChart(p);
                        }

                        // abandonedDrawChart(a);
                        // completedDrawChart(c);
                        // delegatedDrawChart(d);
                        // drawStacked();
                    })

                },
                function fail(response) {
                    $scope.error = 'There seems to be an error with your request, please try again';
                }
            );
        };

        // Make a request to get the conversations data
        (function() {
            $http({
                method: 'GET',
                url: 'analytics/data'
            }).then(
                function success(response) {
                    //console.log("Sucess "+JSON.stringify(response))
                    if (response.data) {
                        $scope.conversations = response.data;
                        Analytics.setConversations($scope.conversations);
                        $scope.filter();
                    } else {
                        $scope.error = response.data;
                        $scope.isEmpty = true;
                    }
                },
                function fail(response) {
                    $scope.error = 'There seems to be an error with your request, please try again';
                }
            );
        })();
    });
