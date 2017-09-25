angular
    .module('RoboticMortgageAdvisor.Services', [])
    .service('Authentication', function($http, $location, $cookies, $q) {
        this.id = '';
        this.result = '';

        // Set the id passed over into a variable held in the services and call create session
        this.setId = function(id) {
            this.id = id;
            this.createSession();
        };

        // Return the id
        this.getId = function() {
            return this.id;
        };

        // Create a session key and value to be held within the browser cookies
        this.createSession = function() {
            var expireDate = new Date();
            expireDate.setHours(24, 0, 0, 0);
            $cookies.put('id', this.id, {
                expires: expireDate
            });
        };

        // Get the session value by querying the key
        this.getSession = function() {
            return $cookies.get('id');
        };

        // Check that the id held within the cookie is a viable field within the db, otherwise no access
        this.checkSession = function() {
            var deferred = $q.defer();
            if ($cookies.get('id') === this.id) {
                return true;
            } else {
                return false;
            }
        }
    })
    .service('PersonalDetails', function() {
        this.personalDetails = {
            age: 35,
            budget: 2000,
            deposit: 25000,
            maxTerm: 29,
            minTerm: 16,
            name: "Laetitia",
            propertyLocation: "London",
            propertyValue: 250000,
            retirementAge: 65,
            ltv: 90,
            referenceNumber: 01562422
        };
        // adding logic to break down full term into ranges :) AFW
        this.personalDetails.termRange = this.personalDetails.maxTerm - this.personalDetails.minTerm;
        this.personalDetails.minShortTerm = this.personalDetails.minTerm;
        this.personalDetails.maxShortTerm = Math.floor(this.personalDetails.minTerm + this.personalDetails.termRange / 3);
        this.personalDetails.minMedTerm = this.personalDetails.maxShortTerm + 1;
        this.personalDetails.maxMedTerm = Math.floor(this.personalDetails.minMedTerm + this.personalDetails.termRange / 3);
        this.personalDetails.minLongTerm = this.personalDetails.maxMedTerm + 1;
        this.personalDetails.maxLongTerm = this.personalDetails.maxTerm;
        //	console.log("short - " + this.personalDetails.minShortTerm + "-" + this.personalDetails.maxShortTerm +  " - med - " + this.personalDetails.minMedTerm + "-" + this.personalDetails.maxMedTerm + " - long - " + this.personalDetails.minLongTerm + "-" + this.personalDetails.maxLongTerm );

        // Returns all demos
        this.getPersonalDetails = function() {
            return this.personalDetails;
        };

        this.setPersonalDetails = function(personalDetails) {
            this.personalDetails = personalDetails;
        };

        this.digisitingMortgagesPersonalDetails = {
            age: 35,
            budget: 2500,
            deposit: 175000,
            maxTerm: 29,
            minTerm: 16,
            name: "Mike Jones",
            propertyLocation: "London",
            propertyValue: 725000,
            retirementAge: 65,
            ltv: 70
        };

        this.getDigitalMortgageDetails = function() {
            return this.digisitingMortgagesPersonalDetails;
        };

    })
    .service('ProductDetails', function() {
        var productDetails;

        this.setProduct = function(product) {
            productDetails = product;
        };

        this.getProduct = function() {
            return productDetails;
        }

    })
    .service('Utility', function() {
        this.getDate = function() {
            var currentDate = new Date();
            // Make sure the expiry date of the AIP is always more than 3 months
            return currentDate.setMonth(currentDate.getMonth() + 3);
        };
    })
    .service('ML', function() {
        var conf = [];
        return {
            setConf: function(confident, unmatched) {
                conf = [confident, unmatched];
            },

            getConf: function() {
                return conf;
            }
        }
    })



    .service('Analytics', function() {
        var conversations = []

        this.setConversations = function(messages) {
            conversations = messages;

        };

        this.getConversations = function() {
            return conversations;
        };

        this.getConversation = function(conversationId) {
            var matchedConversation;

            conversations.forEach(function(c) {
                if (c.conversationId == conversationId) matchedConversation = c;
            });

            return matchedConversation;
        };

    });
