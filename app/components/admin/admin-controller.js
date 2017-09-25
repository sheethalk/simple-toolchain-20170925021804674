angular
    .module('RoboticMortgageAdvisor.AdminController', ['ngRoute'])
    .controller('AdminController', function ($http, $scope) {


        //Helper function to update "Current" option labels after updating components.
        function updateOptions(options) {
            $("#currentTTS").html(options.textToSpeech);
            $("#currentSTT").html(options.speechToText);
            $("#currentNLP").html(options.dialog);
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }


        //Set new component-service values.
        function setValues(choiceObject) {
            $.post(
                "/updateComponents", choiceObject).done(function (data, error) {
                if (data) {
                    $("#confirm").html("Components on server successfully updated. <br>Text-To-Speech: " + capitalizeFirstLetter(data.textToSpeech) + " <br>Speech-To-Text: " + capitalizeFirstLetter(data.speechToText) + " <br>NLP: " + capitalizeFirstLetter(data.dialog))
                    $("#confirm").css({"color": "#003b64", "font-weight": "bold"})
                    updateOptions(data)
                } else {
                    console.log("Error: " + error);
                    $("#confirm").html("Error when updating components.")
                    $("#confirm").css({"color": "red", "font-weight": "bold"})
                }
            });
        }

        //Set "Current" option labels on load.
        $scope.setOption = function () {
            $.get(
                "/readComponents").done(function (data, error) {
                if (data) {
                    $("#currentTTS").html(capitalizeFirstLetter(data.comp_tts));
                    $("#currentSTT").html(capitalizeFirstLetter(data.comp_stt));
                    $("#currentNLP").html(capitalizeFirstLetter(data.comp_dialog));

                } else {
                    console.log("Error when setting options: " + error)
                }
            });
        }

        //Called when user presses Confirm button to update services.
        $scope.choice = function () {
            var element_tts = document.getElementById("tts_choice");
            var choice_tts = element_tts.options[element_tts.selectedIndex].value;
            var element_stt = document.getElementById("stt_choice");
            var choice_stt = element_stt.options[element_stt.selectedIndex].value;
            var element_nlp = document.getElementById("nlp_choice");
            var choice_nlp = element_nlp.options[element_nlp.selectedIndex].value;

            if ((choice_tts == "") || (choice_stt == "") || (choice_nlp == "")) {
                $("#confirm").html("Please select an option for each component.")
                $("#confirm").css({"color": "red", "font-weight": "bold"})
            } else {
                setValues({
                    textToSpeech: choice_tts,
                    speechToText: choice_stt,
                    dialog: choice_nlp
                })
            }
        }

        $scope.setOption();
    });
