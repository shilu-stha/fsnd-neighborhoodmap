// Declaring global variables now to satisfy strict mode
var fsClientId = "S1RFREBRBACTOVGLYJLUUYUNCSROT4XIQNE03OQJUKGJL1PB";
var fsClientSecret = "N4GCWVI5YCZDGHTQMRQJH0HJ2WIXKGFWGLPACHLN0QICMIQJ";

categories = [
        { name: "Temple", type: "Religious" },
        { name: "Durbar Square", type: "Cultural" },
        { name: "Trekking Area", type: "Outdoors Recreation" },
        { name: "Bakery", type: "Food" },
        { name: "Park", type: "Outdoors" },
        { name: "Hotel", type: "Food" }];   

touristAttractions = ko.observableArray([
	new Sites("Swayambhunath", 27.7147615, 85.2203393, "Swayambhu, Kathmandu", self.categories[0], "4d7b5313da568cfa9d744eff"),
	new Sites("Basantapur", 27.7043516, 85.3048307, "Basantapur, Kathmandu", self.categories[1], "4cca619f4703ef3bf703705c"),
	new Sites("Old Freak Street", 27.7032671,85.3077214, "Basantapur, Kathmandu", self.categories[1], "4d8013584a984eb9678822e8"),
	new Sites("Garden of Dreams", 27.7141393,85.2444936, "Thamel, Kathmandu", self.categories[4], "4c7481b044d395216464f5be"),
	new Sites("Boudhanath", 27.721486, 85.361956, "Boudha, Kathmandu", self.categories[0], "4eaeab4d754a69d6776ed3a2"),
	new Sites("Patan Dhoka", 27.6794795, 85.3143896, "Patan Dhoka, Lalitpur", self.categories[0], "4e512e6daeb70f1284b8628e"),
	new Sites("Patan Durbar Square", 27.6828278, 85.3170897, "Mangalbazar, Lalitpur", self.categories[1], "4ec3df856c25599b2ec9337d"),
	new Sites("Kritipur", 27.6678959,85.2564629, "Kritipur", self.categories[1], "4ec3e0eb02d5ad633a7214c3"),
	new Sites("Dwarika Hotel", 27.7051299, 85.3400729, "Battisputali, Kathmandu", self.categories[5], "4bd1006a20cd9960229f2e9e"),
	new Sites("Sam's One Tree Cafe", 27.7106478, 85.3174659, "Durbar Marg, Kathmandu", self.categories[3], "585668b95d6ec60f232f0dc9")]);

var map;
var clientID;
var clientSecret;

var markersArray = [];
var marker;
var currentList = [];
var infowindow;
var bounds;
var filteredList = [];
var isMapLoad = false;
var markerData = ko.observableArray();
    

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];

function Sites(name, lat, lng, location, categories, venueId) {
	var self = this;
    self.name = name;
    self.location = location;
    self.lat = lat;
    self.lng = lng;
	self.venueId = venueId;
	self.likes;
	self.rating;
	self.categories = ko.observable(categories);
}

function AppViewModel() {
	// initialize Map
    initMap();

    loadData();

	//Trigger click event when location is clicked from list view.
	this.selectItem = function(selectItem) {
		clearOverlays();
		
		bounds = new google.maps.LatLngBounds();
		marker = new google.maps.Marker({
				position: new google.maps.LatLng(selectItem.lat, selectItem.lng),
				map: map,
				title: selectItem.name
		});

		markersArray.push(marker);

		//Bounce marker for 2 seconds, when clicked.
		marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function () {
					marker.setAnimation(null);
			},2000);

		var contentString = '<div id="content">'+
			'<h1 id="firstHeading" class="firstHeading">'+selectItem.name+'</h1>'+
			'<div id="bodyContent"><p>'+selectItem.location+
			'</br>'+selectItem.likes +'</br>Ratings:'+selectItem.rating+'</p>'+
			'</div>'+
			'</div>';
			
		google.maps.event.addListener(marker, 'click', (function (marker) {
			return function () {
			infowindow.setContent(contentString);
			}
		})(marker));

		infowindow.open(map, marker);
			
		toggleBounce(marker);
		bounds.extend(marker.getPosition());
	
		map.fitBounds(bounds);	
	};

	loadMarkers(self.touristAttractions());
}

function loadData(){
	for (index = 0; index < self.touristAttractions().length; index++) {
	    value = self.touristAttractions()[index];
		$.ajax({
            method: 'GET',
            dataType: 'json',
            url: 'https://api.foursquare.com/v2/venues/' + value.venueId + '?client_id='+fsClientId+'&client_secret='+fsClientSecret+'&v=20180624',
            success: function(data) {
                var request = data.response.venue;
                if (request.hasOwnProperty('rating') != '') {
					value.rating = request.rating;
				} else {
                    value.rating= 'Rating is not Found';
                }
                if (request.hasOwnProperty('likes') !='') {
                    value.likes = request.likes.summary;

                } else {
                    value.likes = 'Likes Not Found';
				}
				
				console.log(value.likes);
				console.log(value.rating);
            },
            error: function(e) {
                console.log("Error loading: "+e);
            }
		});
	}
}

function loadMarkers(list){   
	console.log(isMapLoad)  
	console.log(list.length)  
	if(isMapLoad){
		clearOverlays();
		bounds = new google.maps.LatLngBounds();
		infowindow =  new google.maps.InfoWindow({});
	
		// preload markers
		for (index = 0; index < list.length; index++) {
			value = list[index];
			var latitude = value.lat;
			var longitude = value.lng;
	
			marker = new google.maps.Marker({
			  position: new google.maps.LatLng(latitude, longitude),
			  map: map,
			  title: value.title
			 });
			
			google.maps.event.addListener(marker, 'click', (function (marker, index) {
				return function () {
					var selectItem = list[index];
					var contentString = '<div id="content">'+
						'<h1 id="firstHeading" class="firstHeading">'+selectItem.name+'</h1>'+
						'<div id="bodyContent"><p>'+selectItem.location+
						'</br>'+value.likes +'</br>Ratings:'+value.rating+'</p>'+
						'</div>'+
						'</div>';
					infowindow.setContent(contentString);
						  infowindow.open(map, marker);
						  toggleBounce(marker);
				}
			  })(marker, index));	
			  bounds.extend(marker.getPosition());
			  value.marker = marker;

			markersArray.push(marker);
	
		}
		map.fitBounds(bounds);	
	}  
}

this.query = ko.observable('');

self.filteredList = ko.computed(function () {
	var filter = self.query().toLowerCase();
	if (!filter) {
		//return self.touristAttractions();
		//this.setAllShow(true);
		markerData = self.touristAttractions();
		console.log(markerData.length);
		loadMarkers(markerData);
		return markerData;
	} else {
        markerData = ko.utils.arrayFilter(self.touristAttractions(), function (item) {
            return item.name.toLowerCase().indexOf(filter) !== -1;
		});
		console.log(markerData.length);
		loadMarkers(markerData);
		return markerData;
		// for (var i = 0; i < self.touristAttractions().length; i++) {
		// 	// to check whether the searchText is there in the mapArray
		// 	if (self.touristAttractions()[i].name.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
		// 		self.touristAttractions()[i].marker.show(true);
		// 		self.touristAttractions()[i].marker.setVisible(true);
		// 	} else {
		// 		self.touristAttractions()[i].marker.show(false);
		// 		self.touristAttractions()[i].marker.setVisible(false);
		// 	}
		// }
	}
});

this.setAllShow = function(marker) {
	for (var i = 0; i < self.touristAttractions().length; i++) {
		self.touristAttractions()[i].marker.show(marker);
		self.touristAttractions()[i].marker.setVisible(marker);
	}
};

// This function populates the infowindow when the marker is clicked. 
function populateInfoWindow(marker, infowindow, content) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
	  // Clear the infowindow content to give the streetview time to load.
	  infowindow.setContent(content);
	  infowindow.marker = marker;
	  // Make sure the marker property is cleared if the infowindow is closed.
	  infowindow.addListener('closeclick', function() {
	    infowindow.marker = null;
	  });
	  // Open the infowindow on the correct marker.
	  infowindow.open(map, marker);
	}
}

function initMap() {
	isMapLoad = true;
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 27.7172, lng: 85.3240},
		zoom: 12
	});
	this.mapElem = document.getElementById('map');
	this.mapElem.style.height = window.innerHeight - 50;
}

// Bounce effect on marker
function toggleBounce(marker) {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			marker.setAnimation(null);
		}, 700);
	}
};
	   
// This function will loop through the listings and remove them all.
function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
}

function onMapLoad() {
	ko.applyBindings(new AppViewModel());
}

function onFailure() {
	alert("Google Map has failed to load. Please check your internet connection and try again later.");
}