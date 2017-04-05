
var startpageMap;
var map;
  function initMap() {

    // Startpage map
    startpageMap = new google.maps.Map(document.getElementById('startpage-map'), {
      center: {lat: 59.3181643, lng: 18.0388207},
      zoom: 14,
      minZoom: 10,
      backgroundColor: "#6E1B2A",
      disableDefaultUI: !0,
      gestureHandling: "greedy",
      mapTypeId: "hybrid",
      opacity: .1,
      styles: [{
          stylers: [{
              visibility: "off"
          }]
      }, {
          featureType: "water",
          elementType: "geometry.stroke",
          stylers: [{
              color: "#ffffff"
          }, {
              visibility: "on"
          }, {
              weight: 1.5
          }]
      }]
    });

    // Standard map
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 63.576677, lng: 15.996094},
      zoom: 5,
      backgroundColor: "#6E1B2A",
      disableDefaultUI: !0,
      gestureHandling: "greedy",
      mapTypeId: "hybrid",
      opacity: .1,
      styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":70}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
    });

    var image = new google.maps.MarkerImage(
          'images/red_marker.png',
          null, // size
          null, // origin
          new google.maps.Point( 15, 15 ), // anchor (move to center of marker)
          new google.maps.Size( 30, 30 ) // scaled size (required for Retina display icon)
        );

    // Startpage markers
    var marker_1 = new google.maps.Marker({
      position: {lat: 59.3281654, lng: 18.0488307},
      map: startpageMap,
      icon: image,
      optimized: false,
      title: "pulsate",
      flat: true
    });


    var marker_2 = new google.maps.Marker({
      position: {lat: 59.3210959, lng: 18.0599307},
      map: startpageMap,
      icon: image,
      optimized: false,
      title: "pulsate",
      flat: true
    });

    var marker_3 = new google.maps.Marker({
      position: {lat: 59.3110959, lng: 18.0799307},
      map: startpageMap,
      icon: image,
      optimized: false,
      title: "pulsate",
      flat: true
    });

    var marker_4 = new google.maps.Marker({
      position: {lat: 59.3110959, lng: 18.0499307},
      map: startpageMap,
      icon: image,
      optimized: false,
      title: "pulsate",
      flat: true
    });

    marker_1.addListener('click', function() {
      addOverlay("tooltip-1", this, this.position);
    });

    marker_2.addListener('click', function() {
      addOverlay("tooltip-2", this, this.position);
    });

    marker_3.addListener('click', function() {
      addOverlay("tooltip-3", this, this.position);
    });

    marker_4.addListener('click', function() {
      addOverlay("tooltip-4", this, this.position);
    });


    var addOverlay = function(a, b, pos){

      
      var $div = $('<div />').prependTo('body').delay(1000).addClass('show');
          $div.attr('class', 'overlay');

      var $tooltip = $('<div />').prependTo('body');
          $tooltip.attr('class', a);

      var $fakeMarker = $('<div />').prependTo('body');
          $fakeMarker.attr('class', 'gmnoprint fake-marker');
          $fakeMarker.attr('title', 'pulsate');

          var scale = Math.pow(2, startpageMap.getZoom());
          var nw = new google.maps.LatLng(
              startpageMap.getBounds().getNorthEast().lat(),
              startpageMap.getBounds().getSouthWest().lng()
          );
          var worldCoordinateNW = startpageMap.getProjection().fromLatLngToPoint(nw);
          var worldCoordinate = startpageMap.getProjection().fromLatLngToPoint(b.getPosition());
          var pixelOffset = new google.maps.Point(
              Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
              Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
          );

          $tooltip.css('left', pixelOffset.x - 450 );
          $tooltip.css('top', pixelOffset.y - 160);

          $fakeMarker.css('left', pixelOffset.x);
          $fakeMarker.css('top', pixelOffset.y);

          

          $div.on("click", function(){
            $tooltip.remove();
            $fakeMarker.remove();
            $div.remove();
          });
    }


    function addRandomMarkers() {
        // Add 10 markers to the map at random locations
        var bounds = map.getBounds();
        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();
        var lngSpan = northEast.lng() - southWest.lng();
        var latSpan = northEast.lat() - southWest.lat();

        var red_marker_icon = new google.maps.MarkerImage(
          '../images/red_marker_2.png',
          null, // size
          null, // origin
          new google.maps.Point( 15, 15 ), // anchor (move to center of marker)
          new google.maps.Size( 30, 30 ) // scaled size (required for Retina display icon)
        );

        for (var i = 0; i < 10; i++) {
          var point = new GLatLng(southWest.lat() + latSpan * Math.random(),
                                  southWest.lng() + lngSpan * Math.random());
          map.addOverlay(new google.maps.Marker({
              position: point,
              map: map,
              icon: red_marker_icon,
              optimized: false,
              flat: true
            })
          );
        }

    }


  }