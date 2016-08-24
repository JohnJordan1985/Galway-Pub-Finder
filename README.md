# FEND-P5-Neighbourhood-Map

##Project Overview

This project contains code to display map markers identifying a number of pubs within the Galway City area. Google Maps API was used to display the locations and markers for the pubs, while the Yelp API was employed to generate the list of pubs and to supply some information about each business, e.g. picture, review etc.

The Knockout library was used to update the DOM on a continual basis using observables, rather than forcing updates manually. Knockout allows the pubs to be filtered based on user actions, such as searching and clicking on the list view. The jQuery lirbrary was used to make an AJAX request to the Yelp API and to manipulate sections of the DOM as needed.

##How to Run the App
Open the model.js file and enter appropriate values for the following variables:

APIKey, YELP_KEY, YELP_TOKEN, YELP_KEY_SECRET, YELP_TOKEN_SECRET

For security reasons, theses API keys must remain private and so were not supplied along with the rest of the code on GitHub.

After entering appropriate values for the above variables, open the index.html file to use the application.

##References

- jQuery API Documentation. "jQuery.ajax()".(http://api.jquery.com/jquery.ajax/)
- Keepers, Brandon. "Live Search with knockout.js" (http://opensoul.org/2011/06/23/live-search-with-knockoutjs/)
- Knockout.js Documentation (http://knockoutjs.com/documentation/introduction.html)
- GoogleDevelopers. "Google Maps JavaScript API".(https://developers.google.com/maps/documentation/javascript/tutorial?hl=en)
- StackOverflow. "Bounce a pin in google maps once"(http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once)
- StackOverflow. "How to float a div over Google Maps?" (http://stackoverflow.com/questions/6037712/how-to-float-a-div-over-google-maps)
- Udacity Forum. "How to make AJAX request to Yelp API" (https://discussions.udacity.com/t/how-to-make-ajax-request-to-yelp-api/13699/3)
- Yelp. "Search API" (https://www.yelp.ie/developers/documentation/v2/search_api)