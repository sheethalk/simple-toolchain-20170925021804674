angular

    .module('RoboticMortgageAdvisor.ChatController', ['ngAnimate', 'ngRoute', 'ui.bootstrap', 'rzModule'])
    .controller('ChatController', function ($anchorScroll, $http, $location, $rootScope, $scope, $sce, $timeout, Authentication, PersonalDetails, ProductDetails, $compile) {

        // Declare variables for delegation
        var chatInput;
        var chatState;
        var chat;

        var delegationStatus = false;
        var setVars = false;
        var init = false;

        var chatVariables = [];
        var chatString = [];

        var clientId = '';
        var conversationId = '';
        var dialogId = '';
        var context = {};
        var personalDetails;
        var profileVariables;
        var started = false;
        var timesAnswered = {
            "1A": 0,
            "1AR": 0,
            "1B": 0,
            "1BR": 0,
            "2": 0,
            "2R": 0,
            "3A": 0,
            "3AR": 0,
            "3B": 0,
            "3BR": 0,
            "4": 0,
            "4R": 0,
            "5": 0,
            "5R": 0
        }


        $scope.priceSlider = false;

        $scope.sendButtonClick = function () {
            if (delegationStatus == true) {
                sendDelegation();
            } else {
                converse();
            }
        }

        $(function () {
            newConversation();
        });


        $.get(
            "/readComponents").done(function (data, error) {
            if (data) {
                if (data.comp_dialog == "watson") {
                    questionOperator = "thisQuestion";
                } else {
                    questionOperator = "lastQuestion";
                }
                ;
            } else {
                console.log("Error when setting options: " + error)

            }
        })
        var currentQuestion = "";
        var questionOperator;
        var percentage = 0;
        //Vars for Microsoft Text-To-Speech
        var mode = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase;
        var lang = "en-gb";
        var msBotAPIKey = "d077009b1bb74ab5b8f20fdf7ff46adc";

        var product = [];
        $scope.TTS = 0;
        var stream;

        //master toggle variable goes in global vars
        var MToggle = false;


        //Variable for tracking the users progress through the application.
        var currentStep = 0;

        var productRecommendationStatus = false;
        var urlBase = '';

        var colletteImage = "agentblue.svg";


        $scope.chatConversation = {
            message: [{
                from: "agent",
                messages: []
            }]
        }

        $scope.myInterval=0;
        $scope.noWrapSlides = false;
        $scope.active = 0;

        $scope.images = [];
        $scope.typing = false;


        $scope.numberLoaded = true;

        $scope.active = 0;


        // Declare object with 'text'
        $scope.input = {
            text: ''
        };

        $scope.slider = {
            value: 300,
            options: {
                floor: 150,
                ceil: 8000,
                step: 50,
                translate: function (value) {
                    return "$" + value;
                }
            }
        };

        function setSize(size) {
            context.tvSize = size;
            converse(size);
        }


        $(document).on('click', '#small', function () {
            $(this).css({"background-color": "#003b64", "color": "white"});
            setSize("Small");

        }).on('click', '#med', function () {
            $(this).css({"background-color": "#003b64", "color": "white"});

            setSize("Medium");

        }).on('click', '#large', function () {
            $(this).css({"background-color": "#003b64", "color": "white"});
            setSize("Large");

        }).on('click', '#slider-btn', function () {
            $(this).css({"background-color": "#003b64", "color": "white"});
            context.budget = $scope.slider.value.toString();
            converse('$' + context.budget);
        }).on('click', '#see-more', function () {
            window.open("http://www.bestbuy.com/site/tv-home-theater/tvs/abcat0101000.c?id=abcat0101000", "_blank", "width=700, height=700");
        }).on('click', '#more-info', function () {
            window.open("http://www.bestbuy.com/site/geek-squad/tv-home-theater-services/pcmcat138100050024.c?id=pcmcat138100050024", "_blank", "width=700, height=700");
        });


        // Declare empty chatConversation array - to be used for all responses from watson and inputs of the user
        $scope.chatConversation = {
            messages: []
        };


        $scope.selectPlan = function (plan) {
            context.selectedPlan = plan;
            console.log(plan);
            converse(plan);
        }


        //Click listener stack. Using jQuery method as Angular does not work.
        $(document).on('click', 'button[ng-click="getHelp();"]', function () {
            $scope.getHelp();


        });

        $(document).on('click', 'button[ng-click="contineProd()"]', function () {
            $scope.contineProd();
        });

        //progress bar clickable :)
        $("#fullTerm").click(function () {
            // $scope.input.text = "I want to change the answer I gave for the full term of the Mortgage"
            updateThisQuestion()
            converse("I want to change the answer I gave for the full term of the Mortgage");
        });
        $("#rateType").click(function () {
            // $scope.input.text = "I want to change the answer I gave for the rate type question"
            updateThisQuestion()
            converse("I want to change the answer I gave for the rate type question");
        });
        $("#initTerm").click(function () {
            // $scope.input.text = "I want to change the answer I gave for the introductory term question"
            updateThisQuestion()
            converse("I want to change the answer I gave for the introductory term question");
        })
        $("#payFee").click(function () {
            // $scope.input.text = "I want to change the answer I gave for the question about paying fees"
            updateThisQuestion()
            converse("I want to change the answer I gave for the question about paying fees");
        })
        $("#overpayment").click(function () {
            // $scope.input.text = "I want to change the answer I gave for the overpayment question"
            updateThisQuestion()
            converse("I want to change the answer I gave for the overpayment question");
        })

        //function to update the context of this question when the user wants to go back.
        function updateThisQuestion() {
            if (context.thisQuestion.includes('Rat')) {
                context.thisQuestion = context.thisQuestion.replace('Rat', '');
            }

        }

        /* function to play latest audiofile and listen for response */
        function Mconvo() {
            try {
                var obj = document.getElementById("videoTag" + $scope.TTS);
                var audio = obj.getElementsByTagName('audio');
                audio[0].play();
                audio[0].onended = function () {
                    $("#micBtn").click();
                };
            } catch (err) {
                window.setTimeout(Mconvo, 800);


            }

        }


        $scope.keyUp = function (keyCode) {
            // Check if the enter key (keyCode 13) and the input is not empty.
            if (keyCode == 13 && $scope.input.text !== '') {
                if (delegationStatus == true) {
                    sendDelegation();
                } else {
                    converse();
                }
            }
        };

        $(function () {
            newConversation();
        });


        $scope.itemSelected = function (name) {
            $scope.input.text = name;
            converse();
        }


        function setFocus() {
            var objDiv = document.getElementById("chat-container");
            objDiv.scrollTop = objDiv.scrollHeight;
            var objDiv = document.getElementById("chat-container");
            // objDiv.scrollTop = objDiv.scrollHeight;
            $(objDiv).animate({
                scrollTop: objDiv.scrollHeight,
                scrollLeft: 0
            }, 1500);
            setTimeout(objDiv)
            $scope.typing = false;

        }


        /**
         * Helper function for timeout. Called from converse()
         */
        var timeoutHelper = function (text) {
            // random generation of time delay
            var time = Math.floor((Math.random() * 1000) + 1000);

            // trustAsHtml(text);
            //timeout func to push after delay.
            $timeout(function () {


                var objDiv = document.getElementById("chat-container");
                objDiv.scrollTop = objDiv.scrollHeight;

                $http({
                    method: 'POST',
                    url: urlBase + 'conversation/save',
                    data: {
                        conversation: $scope.chatConversation,
                        profile: context,
                        id: {
                            conversationId: conversationId
                        }
                    }
                }).then();
                $scope.chatConversation.messages.push({
                    "from": "agent",
                    "messages": [text]
                });
                if (context.orderCarousel) {
                    $scope.chatConversation.messages.push({
                        "from": "agent",
                        "messages": [""],
                        "imageCards": [{
                            src: "/assets/img/carousel-assets/tv_order.jpg",
                            name: "LG 49UH620V",
                            orderNo: "Order #7462436",
                            price: "699.99"
                        },
                            {
                                src: "assets/img/carousel-assets/chromecast_order.jpg",
                                name: "Google Chromecast",
                                orderNo: "Order #7462835",
                                price: "$59.99"

                            },
                            {

                                src: "assets/img/carousel-assets/macbook_order.jpg",
                                name: "MacBook Pro",
                                orderNo: "Order #7462735",
                                price: "$2000.99"


                            }


                        ]
                    });
                    context.orderCarousel = false;
                } else if (context.tvCarousel) {

                    $scope.chatConversation.messages.push({
                        "from": "agent",
                        "messages": [""],
                        "imageCards": [{
                            src: "assets/img/carousel-assets/tv1_cropped.jpg",
                            name: "LG 49UH620V",

                        },
                            {
                                src: "assets/img/carousel-assets/tv2_cropped.jpg",
                                name: "Samsung UE40K5600",

                            },
                            {
                                src: "assets/img/carousel-assets/tv3_cropped.jpg",
                                name: "Sony XBR49X700D",
                            },
                        ]
                    });
                    $scope.chatConversation.messages.push({
                        "from": "agent",
                        "messages": ["If you want to see more TVs <button id=\'see-more\' ng-click=\'seeMore()\'>click here</button> to open our full catalog of TVs."]
                    });
                    context.tvCarousel = false;

                    setFocus();

                }
                if (context.priceSlider) {
                    $scope.chatConversation.messages.push({
                        "from": "agent",
                        "messages": [""],
                        "prices": [1]
                    });
                    context.priceSlider = false;
                } else if (context.tvButton) {
                    $scope.chatConversation.messages.push({
                        "from": "agent",
                        "messages": [""],
                        "tvButtons": [1]
                    });
                    context.tvButton = false;
                } else if (context.protectionPlan) {
                    $scope.chatConversation.messages.push({
                        "from": "agent",
                        "messages": [""],
                        "protectionPlanButtons": [1]
                    });
                    context.protectionPlan = false;
                }


                setFocus();

                $scope.TTS += 1;
                getSpeech(text);


            });


        }


        $scope.hasCarouselItems = function (items) {
            var itemCode = 0;
            if (items) {
                if (items.length > 0) {
                    itemCode = 1;
                } else {
                    itemCode = 0;
                }
            }

            return itemCode;
        }

        function getFirstUrlParameter() {
            var sPageURL = decodeURIComponent(window.location),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');
                return (sParameterName[1]);
            }
        }


        /**
         * maintain conversation using converse
         */
        var converse = function (hiddenInput) {

            //stop any playing audio
            var sounds = document.getElementsByTagName('audio');
            for (i = 0; i < sounds.length; i++) {
                sounds[i].pause();
            }

            $scope.typing = true;

            if (typeof hiddenInput === 'undefined') {
                var userText = $scope.input.text;
                $scope.input.text = '';
            } else {
                userText = hiddenInput;
            }

            var params = {
                conversation_id: conversationId,
                context: context,
                input: userText
            };

            $http({
                method: 'POST',
                url: urlBase + 'converse',
                'Content-Type': 'application/json',
                data: params
            }).then(
                function success(response) {

                    context = response.data.context;

                    if (context.closeWindow) {
                        window.close();
                    }

                    $scope.priceSlider = context.priceSlider || false;
                    conversationId = response.data.context.conversation_id;
                    // if (response.data.is)
                    if (userText && userText == 'I don\'t know') {

                        $scope.chatConversation.messages.push({
                            from: "customer",
                            messages: ["I need more information"],

                        });
                    } else if (userText) {
                        if (context.thisQuestion == "selectOrderAfterLogin") {
                            userText = userText.replace(/./g, "*");
                        }
                        $scope.chatConversation.messages.push({
                            from: "customer",
                            messages: [userText]
                        });

                    }


                    if (response.data) {

                        var text = "";
                        for (var i = 0; i < response.data.output.text.length; i++) {
                            text += response.data.output.text[i];
                        }


                        if (!init) {

                            timeoutHelper(text);

                        } else {
                            init = false;
                            $scope.typing = false;

                        }

                    }

                    $scope.TTS += 1;

                    if (MToggle == true) {
                        Mconvo();
                    }

                    if (context.thisQuestion == "loginPassword") {
                        $("#chatInput").prop('type', 'password');
                    } else {
                        $("#chatInput").prop('type', 'text');
                    }
                    // updateProgressBar(response.data.context);
                    if (response.data.context.Recommend === "Yes" && productRecommendationStatus === false) {
                        console.log("recs");
                        productRecommendationStatus = true;
                        productRecommendation(response.data.context);
                    } else if (response.data.context.LiveChat === "Yes") {
                        chatVariables.push(response.data.context);
                        console.log("START DELEGATION!!")
                        startDelegation();
                    }

                }
            );
        }


        /**
         * New Conversation
         * Initialise a new conversation, retrieving the first response
         * and the variables needed to maintain the conversation
         */
        function newConversation() {
            setVars = true;

            var originPage = getFirstUrlParameter();
            var params = {
                dialog_id: dialogId,
                client_id: clientId,
                personalDetails: personalDetails,
                originPage: originPage
            };
            $http({
                method: 'POST',
                url: urlBase + 'conversation',
                data: params
            }).then(
                function success(response) {
                    getSpeech(response.data.output.text[0]);
                    var text = response.data.output.text[0];
                    context = response.data.context;
                    var elem = document.getElementById("chat-container");
                    elem.scrollTop = elem.scrollHeight;

                    // $("#chat-container").append("<div id='chatShot'><div class='AiChat'><img id='img-content' src='assets/img/" + colletteImage + "' class='img-circle col-md-2'><p class='watson col-md-8'>" + text + "<div id='videoTag" + TTS + "'> </div></p></div></div>");
                    $scope.chatConversation.messages.push({
                        messages: [text],
                        from: "agent",

                    });

                    $("#sendChat").click(function () {
                        converse();
                    });
                }
            );
        };


        var getSpeech = function (text) {
            console.log("get speech")
            var textToSynthise = text;

            //Escape special chars and remove any HTML tags before sending text to be synthesised.
            textToSynthise = textToSynthise.replace("&pound;", "\£")
            textToSynthise = textToSynthise.replace(/(<([^>]+)>)/ig, " ");

            $http({
                method: 'POST',
                url: urlBase + 'synthesise',
                data: {
                    text: textToSynthise
                }
            }).then(
                function success(response) {
                    console.log("succ")
                    $scope.audio = $sce.trustAsResourceUrl(response.data);
                    if ($scope.audio && (document.getElementById("videoTag" + $scope.TTS) != null)) {
                        document.getElementById("videoTag" + $scope.TTS).innerHTML = "<audio preload='none' src=assets/text-to-speech/" + $scope.audio + "></audio>";
                    }
                }
            );
        };


        //On clicking the button
        document.getElementById("MToggleClick").onclick = function () {

            if (MToggle == false) {
                //Play the audio.
                Mconvo();
                $('#MToggleClick').attr('src', 'assets/img/voice-on.svg');
                MToggle = true;
            } else if (MToggle == true) {
                var sounds = document.getElementsByTagName('audio');
                angular.element(document.querySelector('#micBtn')).removeClass('active');
                for (i = 0; i < sounds.length; i++) sounds[i].pause();
                MToggle = false;
                $('#MToggleClick').attr('src', 'assets/img/voice-off.svg');
            }
        }


        /**
         * Speech to Text
         * When the button is clicked, retrieve the Speech to Text auth token and live stream the microphone input.
         * Requires the getUserMedia API, so limited browser compatibility (see http://caniuse.com/#search=getusermedia)
         */
        $scope.micBtnClick = function () {

            //First find out which service we should be using for STT, then execute the logic for that service.
            $http({
                method: 'POST',
                url: urlBase + 'getSTTComponent',
                'Content-Type': 'application/json'
            }).then(
                function success(response) {
                    switch (response.data) {
                        case "watson":
                            var sounds = document.getElementsByTagName('audio');
                            for (i = 0; i < sounds.length; i++) {
                                sounds[i].pause();
                            }

                            $http({
                                method: 'GET',
                                url: urlBase + 'watsonToken'
                            }).then(
                                function success(response) {
                                    // Create a new instance of the WatsonSpeech SpeechToText function
                                    // recognizeMicrophone for live microphone audio input
                                    var stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
                                        token: response.data, // authorisation token
                                        continuous: false, // false = automatically stop transcription the first time a pause is detected
                                        outputElement: '#chatInput', // CSS selector or DOM Element
                                        inactivity_timeout: 3,
                                        customization_id: "ca84c450-c089-11e6-9657-e53f14d32a55",
                                        keepMicrophone: navigator.userAgent.indexOf('Firefox') > 0 // true, preserves the MicrophoneStream for subsequent calls, preventing additional permissions requests in Firefox
                                    });

                                    // Adds styling to the micButton
                                    var micButton = angular.element(document.querySelector('#micBtn'));
                                    micButton.addClass('active');

                                    // Streaming end: Append the text convered to the chatInput div
                                    stream.on('end', function () {
                                        micButton.removeClass('active');
                                        var chatInput = angular.element(document.querySelector('#chatInput'));
                                        chatInput.triggerHandler('input');

                                        // Send the speech transcription to Collette automatically, so the user does not have to press enter to chat.
                                        // Check if the input contains a non-empty value.
                                        if ($scope.input.text !== '') {
                                            setTimeout(function () {
                                                converse();
                                            }, 750);
                                        }
                                    });

                                    stream.on('error', function (err) {
                                    });
                                }
                            )
                            break;

                        case "bing":
                            var micButton = angular.element(document.querySelector('#micBtn'));
                            var mode = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase;
                            var client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(
                                mode,
                                lang,
                                msBotAPIKey);
                            client.startMicAndRecognition();
                            micButton.addClass('active');
                            setTimeout(function () {
                                client.endMicAndRecognition();
                            }, 2500)

                            client.onFinalResponseReceived = function (response) {
                                micButton.removeClass('active');
                                $scope.input.text = response[0].display;
                                try {
                                    client.endMicAndRecognition();
                                } catch (err) {
                                    console.log("ms-speech.js line 513 : Can't stop microphone stream")
                                }

                                //next might be set in a function
                                var chatInput = angular.element(document.querySelector('#chatInput'));
                                chatInput.triggerHandler('input')

                                // Send the speech transcription to Collette automatically, so the user does not have to press enter to chat.
                                // Check if the input contains a non-empty value.
                                if ($scope.input.text !== '') {
                                    var chatInput = angular.element(document.querySelector('#chatInput'));
                                    chatInput.triggerHandler('input')
                                    setTimeout(function () {
                                        converse();
                                    }, 750);
                                }
                                ;

                            }
                            break;
                    }
                    ;

                })

        };


        /**
         * Trust HTML from IBM Watson - solves issue with Angular treating external HTML
         * as dirty and won't render
         */
        $scope.trustAsHtml = function (html) {
            return $sce.trustAsHtml(html);
            $compile();
        };

        /**
         * Function is used to invoke the help section of the chat - this function is used within
         * the chat. Do not change unless IBM Watson dialog has been updated.
         */
        $scope.getHelp = function () {
            $scope.input.text = 'I don\'t know';
            converse();
        };

        $scope.contineProd = function () {
            $scope.input.text = 'Let\'s continue';
            converse();
            window.open('#/chat/product/' + product._id, '_blank');
        };


        window.addEventListener('beforeunload', function (event) {
            $http({
                method: 'POST',
                url: urlBase + 'conversation/save',
                data: {
                    conversation: $scope.chatConversation,
                    profile: context,
                    id: {
                        conversationId: conversationId
                    }
                }
            }).then();
        }, false);

        /**
         * Delegation
         * Start delegation creates an instance to acccess live person passing over
         * the appKey, LPNumber and Skill
         * Skill is important to ensure we do not interrupt other services.
         */
        var myChatObj;
        var engagementData;
        var startDelegation = function () {

            // Create instance fo ChatOverRestAPI
            myChatObj = new lpTag.taglets.ChatOverRestAPI({
                appKey: "721c180b09eb463d9f3191c41762bb68",
                lpNumber: "66612687",

                onInit: function (data) {
                    console.log("onInit", data);
                },
                onInfo: function (data) {
                    console.log("onInfo", data)
                },
                onLine: [addLines, function (data) {
                    console.log("onLine", data);
                }],
                onState: [updateChatState, function (data) {
                    if (data.state === 'initialised') getEngagement()
                }],
                onStart: [updateChatState, function (data) {
                    console.log("onStart", data);
                }],
                onStop: [updateChatState],
                onAgentTyping: function (data) {
                    console.log("onAgentTyping", data);
                },
                onRequestChat: function (data) {
                    console.log("onRequestChat", data);
                },
                onEngagement: function (data) {

                    /**
                     * Error handling as initially the instance is warming up, once Available create a call to startChat()
                     * else keep trying getEngagement
                     */
                    if (data.status == 'Available') {
                        engagementData = data;
                        delegationStatus = true;
                        startChat();
                    } else {
                        getEngagement()
                    }
                }
            });
        };

        function addLines(data) {

            scrollScreen();
            var linesAdded = false;

            var text = "";
            for (var i = 0; i < data.lines.length; i++) {
                var line = data.lines[i];
                if (line.source !== 'visitor' || chatState != chat.chatStates.CHATTING) {
                    text += line.text;
                    linesAdded = true;
                }
            }

            timeoutHelper(text);
            $scope.TTS += 1;

            if (MToggle == true) {
                Mconvo();
            }

            if (linesAdded) {
                scrollScreen();
            }
        }

        function getEngagement() {
            myChatObj.getEngagement();
        }


        //Sets the local chat state
        function updateChatState(data) {
            chatState = data.state;
        }

        function startChat() {
            console.log("inStartChat")
            engagementData = engagementData || {};
            engagementData.engagementDetails = engagementData.engagementDetails || {};
            var chatRequest = {
                LETagVisitorId: engagementData.visitorId || engagementData.svid,
                LETagSessionId: engagementData.sessionId || engagementData.ssid,
                LETagContextId: engagementData.engagementDetails.contextId || engagementData.scid,
                skill: engagementData.engagementDetails.skillId,
                engagementId: engagementData.engagementDetails.engagementId || engagementData.eid,
                campaignId: engagementData.engagementDetails.campaignId || engagementData.cid,
                language: engagementData.engagementDetails.language || engagementData.lang
            };
            myChatObj.requestChat(chatRequest);
        }

        var scrollScreen = function () {
            var objDiv = document.getElementById("chat-container");
            objDiv.scrollTop = objDiv.scrollHeight;
        }

        var sendDelegation = function () {
            var text = $scope.input.text;
            $scope.input.text = '';


            $scope.chatConversation.messages.push({
                from: "customer",
                messages: [text]
            });

            if (text) {

                scrollScreen();
                myChatObj.addLine({
                    text: text,
                    error: function () {
                        line.className = "error";
                    }
                });
            }
        };


    });
