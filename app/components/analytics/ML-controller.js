angular
    .module('RoboticMortgageAdvisor.MLController', ['ngRoute'])
    .controller('MLController', function($scope, Analytics, $http, ML) {


        //get the conf array sent over from the classify page
        var conf = ML.getConf();

        //counter to record amount of hits
        var counts = {};

        //counters used for removing duplicates
        var unmatchedCount = 0;
        var confCount = 0;

        //unpack it for the ng-repeat table to display in tables
        $scope.confident = conf[0];
        $scope.unmatched = conf[1];

//function to remove duplicate entries, leaving only unique entries with correct hit count
        var del = function(array) {
            array.slice().reverse().forEach(function(item, index, object) {
                var e = item.phrase.toString().toLowerCase();
                if (item.hits < counts[e]) {
                    array.splice(object.length - 1 - index, 1);
                }
            });
        };
        //count hits, push to array and call delete function
        $scope.confident.forEach(function(x) {
            var e = x.phrase.toString().toLowerCase();
            counts[e] = (counts[e] || 0) + 1;
            confCount++;
            x.hits = counts[e];
            if (confCount === $scope.confident.length) {
                del($scope.confident);
            }
        });


        $scope.unmatched.forEach(function(x) {
            var e = x.phrase.toString().toLowerCase();
            counts[e] = (counts[e] || 0) + 1;
            unmatchedCount++;
            x.hits = counts[e];
            if (unmatchedCount === $scope.unmatched.length) {
                del($scope.unmatched);
            }
        });

        //sort the two alphabetically
        $scope.unmatched.sort(function(a, b) {
            if (a.phrase.toString().toLowerCase() < b.phrase.toString().toLowerCase()) return -1;
            if (a.phrase.toString().toLowerCase() > b.phrase.toString().toLowerCase()) return 1;
            return 0;
        });

        $scope.confident.sort(function(a, b) {
            if (a.phrase.toString().toLowerCase() < b.phrase.toString().toLowerCase()) return -1;
            if (a.phrase.toString().toLowerCase() > b.phrase.toString().toLowerCase()) return 1;
            return 0;
        });





        //set the variable for training data to be added to for training
        var training_data = [];

        //function to approve into training data from matched
        $scope.approveM = function(index) {

            var table = document.getElementById("matched");
            var i = index + 1;
            var data = {
                phrase: $(table.rows[i].cells.item(0).innerHTML).text(),
                class: table.rows[i].cells.item(1).innerHTML
            }
            $scope.confident.splice(index, 1);

            $http({
                method: 'POST',
                url: 'train',
                data: {
                    row: data
                }
            }).then(
                function success(response) {
                    console.log("train success");

                },
                function fail(response) {
                    $scope.error = 'There seems to be an error with your request, please try again';
                }
            );
        };


        //function to approve into training data from unmatched
        $scope.approveU = function(index) {
            var table2 = document.getElementById("unmatched");
            var i = index + 1;
            if ($(table2.rows[i].cells).find('input').val()) {
                var data = {
                    phrase: $(table2.rows[i].cells.item(0).innerHTML).text(),
                    class: $(table2.rows[i].cells).find('input').val()
                }
                $scope.unmatched.splice(index, 1);

                $http({
                    method: 'POST',
                    url: 'train',
                    data: {
                        row: data
                    }
                }).then(
                    function success(response) {
                        console.log("train success");

                    },
                    function fail(response) {
                        $scope.error = 'There seems to be an error with your request, please try again';
                    }
                );
            } else if (!$(table2.rows[i].cells).find('input').val()) {

                alert("please input a class to submit");
            }


        };


        //function to move entry from matched to unmatched
        $scope.move = function(index) {
            $scope.unmatched.push($scope.confident[index]);
            $scope.confident.splice(index, 1);

        };


        //function to remove from unmatched completely
        $scope.remove = function(index) {
            $scope.unmatched.splice(index, 1);
        };

        //function to grab all the phrases and matched classes
        $scope.train = function() {
            $http({
                method: 'POST',
                url: 'createclass',
            }).then(
                function success(response) {
                    console.log("train success");
                    var newClass = response.data;
                    alert(newClass);

                },
                function fail(response) {
                    $scope.error = 'There seems to be an error with your request, please try again';
                }
            );
        };



    });
