//Constructor function for the pubs themselves that compartmentalises important data for each pub
var Pub = function(name, lat, lng, description, imgUrl, rating, ratingUrl, url) {
	var self=this;
	this.name=name;
	this.lat=lat;
  this.url = url;
	this.lng = lng;
	this.imgURL = imgUrl;
	this.rating = rating;
	this.ratingURL = ratingUrl;
	this.description = description;
	this.displayOnList=ko.observable(true);
  this.infoWindowContent = `<div id="content" style="max-width: 300px"><a href=${self.url} target="_blank"><div style="display: inline-block" id="titleContent"><img style="padding-bottom: 1px" src=${self.imgURL} alt="Picture of pub"><p><b>Yelp Rating:</b></p>
  <img src=${self.ratingURL} alt=${self.rating} align="right"><h1 id='name'> ${self.name} </h1></div></a><div id='bodyContent'>${self.description}</div></div>`;
};

//Method that allows a pub-associated marker to be animated. Avoided difficulties with scoping that I encountered with other
//implentations of this functionality

Pub.prototype.bounceMarker = function(){
	var self = this;
	self.marker.setAnimation(google.maps.Animation.BOUNCE);
	//Each bounce animation takes about 710 ms to complete, therefore passed in a multiple of 710 into setTimeout() that allows animation
  //to complete a whole animation cycle
	setTimeout(function(){
		self.marker.setAnimation(null);
		}, 4260);
};

//Method that encapsulates all the code needed to open info-window of pub, and animate its marker when needed

Pub.prototype.openPubOnMap = function(map){
  var self=this;
  self.infoWindow.setContent(self.infoWindowContent);
  self.infoWindow.open(map, self.marker);
  self.bounceMarker();
};

// knockout observable array that holds the actual pub objects
var pubModelArray = ko.observableArray([]);

var APIKey = "AIzaSyA_6Xe1Ai1_9bby8ApXpXuVKBQ0RZkdMWw",
	YELP_KEY = "kRWaoSJH9Mmuxa7ouHtuag",
	YELP_TOKEN = "4yGolfEESoeUvTP1o8gFGGLgIpDJtJLh",
	YELP_KEY_SECRET = "Y9Q8RBxvWj_mYmTtr3_tt-eozNw",
	YELP_TOKEN_SECRET = "5uZa4y9VqapNF_ursisl0DfHuG0";

//variables that will be accessed later on in code, often in 'for' loops
var map;
var myLatLng;
var marker;
var infoWindow;

//The rest of this files code is taken from the Udacity Coach MarkN who explicitly described how to make an AJAX request to the Yelp API on the Udcity forums

//generates a nonce for use in Yelp API OAuthentication
function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}

var yelp_url = "https://api.yelp.com/v2/search/";


var parameters = {
  oauth_consumer_key: YELP_KEY,
  oauth_token: YELP_TOKEN,
  oauth_nonce: nonce_generate(),
  oauth_timestamp: Math.floor(Date.now()/1000),
  oauth_signature_method: 'HMAC-SHA1',
  oauth_version : '1.0',
  callback: 'cb',
  location: "Galway+city",
  term : "pub",
  cll : "53.271060, -9.056056",
};

var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
parameters.oauth_signature = encodedSignature;

var request ="";
var settings = {
  type: "POST",
  url: yelp_url,
  data: parameters,
  cache: true,
  dataType: 'jsonp',
  //Function that runs if AJAX request is successful. It processes the returned JSON from the Yelp API, pushing pubs to the
  //model array if they meet certain geographical criteria.
  success: function(results) {
  	request = results;
    var newPub;
    console.log(results);
    //Creates a new instance of the Pub class from the JSON object returned from Yelp API
    results.businesses.forEach(function(pub){
    	newPub = new Pub (pub.name, pub.location.coordinate.latitude, pub.location.coordinate.longitude, pub.snippet_text, pub.image_url, pub.rating, pub.rating_img_url, pub.url);
      //I couldn't get the geographical filters in the Yelp API request to filter my search results to pubs within Galway city,
      //so I decided to work around this issue by filtering the returned JSON based on geographical data. The following 'if' statement
      //specifies geographic location by a southwest latitude/longitude and a northeast latitude/longitude geographic coordinate.
    	if(newPub.lat >= 53.269909 && newPub.lng >= -9.061034 && newPub.lat <= 53.275340 && newPub.lng <= -9.047087) {
    		pubModelArray.push(newPub);
    	}
    });

  },
  error: function() {
    // In the event of a failed AJAX request, the user is informed
    $("#yelp-element").html("<br><h2> Data could not be returned from Yelp. Please check your internet connection and reload the page.</h2>");
  }
};

// Send AJAX query via jQuery library.
$.ajax(settings);
