var counter = 0;
//Delay Google Map loading so that Yelp API has time to return data for the population of the pub array. Since the project specifications state that
//the map should only be rendered once, I decided to delay map render until the model array had been populated with Yelp API data
function mapDelay(){
	if(request === "" && counter <= 20){
		setTimeout(mapDelay, 100);
		counter += 1;
	} else if(request !== "") {
		initMap();
	} else if(request === "" && counter > 20){
		$("#yelp-element").html("<br><h2> Yelp took too long to load data. Please check your internet connection and reload the page.</h2>");
		initMap();
	}
}

//In the event of a failed request to the Google Maps API, the user is informed
function googleError() {
	$("#map").html("<br><h2>Google Maps could not be loaded. Please check your internet connection and reload the page.</h2>");
}

//Creates map with markers for each of the Pubs in the model array

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 53.272780, lng: -9.053138},
    zoom: 16
  });

  infoWindow = new google.maps.InfoWindow();

  //create markers and info-windows for each of the pubs
  pubModelArray().forEach(function(pub){
		myLatLng = new google.maps.LatLng(pub.lat, pub.lng);
		marker = new google.maps.Marker({
			position: myLatLng,
			title: pub.name,
			animation: null
		});
		//creates pointer to global infoWindow object on each Pub instance
		pub.infoWindow = infoWindow;
		//Adds essential functionality when user clicks a marker. Calls method 'openPubOnMap' and avoids need for IIFE.
		marker.addListener("click", function(){
				pub.openPubOnMap(map);
		});
		//Assoicates each marker to a unique pub and sets marker on map
		pub.marker = marker;
		pub.marker.setMap(map);
	});
}

var ViewModel = function(){
	var self=this;
	//Observable that tracks changes in what the user has submitted by clicking the 'submit' button of the form element of the View
	this.submittedPub = ko.observable();
	//Observable that tracks what the user has currently entered into, but not submitted, the form element. Essential for 'live search'
	//functionality
	this.userSearchInput = ko.observable();
	//Boolean that determines whether the user should be shown a message that no match for the search term
	//could be found
	this.noPubFoundBoolean = ko.observable(false);
	//Displays the user search term along with a message indicating that no such pub exists in the API
	this.noPubFoundMessage = ko.computed(function(){
		return "No search results for " + "'" + self.submittedPub() + "'. Please clear the search box to refresh the list.";
	}, this);
	//Manually subscribes to the 'userSearchInput' observable and calls the 'displayLiveSearch' function on any change.
	//This code is crucial to the 'live search' functionality
	self.userSearchInput.subscribe(function(){
		self.displaySearchLive();
	});

	//Displays pub on map when a pub is selected by the user from the list view. Calls method of Pub class
	this.displayClickedPubOnMap = function(){
		this.openPubOnMap(map);
	};

	//Checks submitted pub name against Model, and displays the pub if search is successful; advises the user if no such
	//found also

	this.checkSubmittedPub = function(){
		//closes any currently open infowindow from previously successful pub searches
		infoWindow.close();
		self.noPubFoundBoolean(true);
		self.submittedPub(self.userSearchInput());
		pubModelArray().forEach(function(pub){
			if(self.submittedPub().trim().toUpperCase() === pub.name.trim().toUpperCase()){
				pub.openPubOnMap(map);
				//Cancels default "No such pub found" message that would appear to user if no such pub found.
				self.noPubFoundBoolean(false);
			}
		});
	};

	//Function that uses observables to continually refresh the list view based on user input

	this.displaySearchLive = function(){
		//closes any currently open infowindow from previously successful pub searches when user clears search box
		if(self.userSearchInput() === ""){
			infoWindow.close();
		}
		//For loop that displays pubs on the list, as well as their respective markers, for as long as they match
		//what the user has currently entered, but not submitted, into the input box
		pubModelArray().forEach(function(pub){
			if(pub.name.trim().toUpperCase().indexOf(self.userSearchInput().trim().toUpperCase()) >= 0){
				pub.displayOnList(true);
				pub.marker.setVisible(pub.displayOnList());

			} else {
				pub.displayOnList(false);
				pub.marker.setVisible(pub.displayOnList());
			}
		});
	};

};

ko.applyBindings(new ViewModel());