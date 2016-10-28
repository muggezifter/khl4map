var createMap = function () {

    var getPath = function (points) {
        var counter = 9;
        var path = [];
        while (counter--) {
            path.push(convertPoint(points[counter]));
            path.push(convertPoint(points[counter + 3]));
        }
        return path;
    };

    var convertPoint = function (point) {
        return { lat: point.lat, lng: point.lon };
    };


    var m2n = function (m) {
        return  ['c', 'c \u266F', 'd', 'd \u266F', 'e', 'f', 'f \u266F', 'g', 'g \u266F', 'a', 'a \u266F', 'b'][m % 12];
    };


    var khl4map = {
        map: null,
        mark: null,

        initializeMaps: function (currentGrid) {
            var myOptions = {
                mapTypeId: google.maps.MapTypeId.SATELLITE,
                mapTypeControl: true
            };
            this.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
            var infowindow = new google.maps.InfoWindow();
            var marker, i;
            var bounds = new google.maps.LatLngBounds();

            for (i = 0; i < currentGrid.points.length; i++) {
                var pos = new google.maps.LatLng(
                    currentGrid.points[i].lat,
                    currentGrid.points[i].lon
                );

                bounds.extend(pos);

                marker = new google.maps.Marker({
                    position: pos,
                    map: this.map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 6,
                        strokeColor: '#999',
                        strokeOpacity: 1,
                        fillColor: '#fff',
                        fillOpacity: 1,
                        strokeWeight: 3,
                    },
                });

                google.maps.event.addListener(marker, 'click', (
                    function (marker, i) {
                        return function () {
                            infowindow.setContent(m2n(currentGrid.points[i].note));
                            infowindow.open(this.map, marker);
                        }.bind(this)
                    }.bind(this))(marker, i));
            }

            var grid = new google.maps.Polyline({
                path: getPath(currentGrid.points),
                geodesic: false,
                strokeColor: '#999',
                strokeOpacity: 1,
                strokeWeight: 3
            });

            grid.setMap(this.map);

            this.map.fitBounds(bounds);


        },
        addMark: function (lat, lon) {
            var previousMark = (this.mark) ? this.mark : null;

            var pos = new google.maps.LatLng(lat, lon);
            this.mark = new google.maps.Marker({
                position: pos,
                map: this.map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: '#F00',
                    fillOpacity: 1,
                    strokeWeight: 0
                }
            });
            if (previousMark) {
                previousMark.setIcon({
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 5,
                    fillColor: '#EE9A4D',
                    fillOpacity: 0.3,
                    strokeWeight: 0
                });
            }
        }
    };

    return khl4map;
};


