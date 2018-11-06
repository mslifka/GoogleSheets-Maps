define([], function(){
	
	// a public sheet
	var URL = "https://spreadsheets.google.com/feeds/list/1oMyoA43NfAMbvP-uqQ-QfdzUotrcx7BPwKAfGjJySPk/od6/public/values?alt=json";
	
	// icon style for city markers
	var ICON = {
		path: google.maps.SymbolPath.CIRCLE,
		scale: 6,
		strokeWeight: 1,
		fillOpacity: 0.45,
		fillColor: "#333333",
		strokeColor: "#333333"
	};
		
	return {
		markers: [],
		
		/**
		 * Main init() function
		 */
		init: function(){
            // create a google map
            var mapOptions = {
                disableDefaultUI: true,
                mapTypeControl: true,
                center: new google.maps.LatLng(33.851294, -87.273494),
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.TOP_LEFT
                },
				mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoom: 8,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.TOP_LEFT
                },
                scaleControl: true,
                streetViewControl: true,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT
                },
                styles: this.getMapStyles()
            };

            // set the map and resize to container
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);
            var iw = new google.maps.InfoWindow();
            google.maps.event.trigger(map, "resize");
            
            // go get the stuff from the Google sheet
            var xhr = $.getJSON(URL);
            xhr.done(function(json){           	
            	$.each(json.feed.entry, function(i, entry){
            		var marker = new google.maps.Marker({
            			position: new google.maps.LatLng(parseFloat(entry.gsx$lat.$t), parseFloat(entry.gsx$lng.$t)),
            			map: map,
            			icon: ICON
            		});
            		// add to the internal array of Markers
            		this.markers.push(marker);	
            		google.maps.event.addListener(marker, "click", function(){
            			iw.close();
            			var content = $("<div>");
            			for (var key in entry) {
            				if (entry.hasOwnProperty(key) && key.match(/^gsx\$/)) {
            					$("<div>").html(key.split("$")[1] + ": " + entry[key].$t).appendTo(content);
            				}
            			}
            			iw.setContent(content[0]);            			
            			iw.open(map, marker);
            		});
            	}.bind(this));
            }.bind(this));
            xhr.fail(function(err){
            	console.log(err);
            }.bind(this));           
       },
       
       /**
        * Provide a style for the map
        */
       getMapStyles: function() {
    	   return [{"featureType":"poi","stylers":[{"visibility":"off"}]},{"stylers":[{"saturation":-70},{"lightness":37},{"gamma":1.15}]},{"featureType":"poi","elementType":"labels","stylers":[{"gamma":0.26},{"visibility":"off"}]},{"featureType":"road","stylers":[{"lightness":0},{"saturation":0},{"hue":"#ffffff"},{"gamma":0}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"lightness":50},{"saturation":0},{"hue":"#ffffff"}]},{"featureType":"administrative.province","stylers":[{"visibility":"on"},{"lightness":-50}]},{"featureType":"administrative.province","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"labels.text","stylers":[{"lightness":20}]}];	
       }
	};
});
        