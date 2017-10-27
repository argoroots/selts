$(function() {
    if ($('body').css('background-image') === 'none') {
        $('body').css('background-image', "url('/assets/images/bg/" + Math.ceil(Math.random() * 8) + ".jpg')")
    }

    $('#fullpage').fullpage({
        continuousVertical: true,
        navigation: true,
        navigationPosition: 'right',
        scrollOverflow: true
    })

    if ($('.map-item').length > 0) {
        var multiplePointers = $('.map-item').length > 1
        var bounds = new google.maps.LatLngBounds()
        var infowindow = new google.maps.InfoWindow()
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: parseFloat($('.map-item').data('geo').split(',')[0]),
                lng: parseFloat($('.map-item').data('geo').split(',')[1])
            },
            zoom: 11,
            scrollwheel: false,
            mapTypeControl: false,
            streetViewControl: false,
            rotateControl: false,
            styles: [
                {
                    'featureType': 'poi.business',
                    'stylers': [
                        {
                            'visibility': 'off'
                        }
                    ]
                },
                {
                    'featureType': 'road',
                    'elementType': 'labels.icon',
                    'stylers': [
                        {
                            'visibility': 'off'
                        }
                    ]
                },
                {
                    'featureType': 'transit',
                    'stylers': [
                        {
                            'visibility': 'off'
                        }
                    ]
                }
            ]
        })

        $('.map-item').each(function () {
            var position = $(this).data('geo')
            if (position) {
                var info = '<p><a href="' + $(this).attr('href') + '"><strong>' + $(this).text() + '</strong></a></p><p>' + $(this).data('info') + '</p>'

                var marker = new google.maps.Marker({
                    position: {
                        lat: parseFloat(position.split(',')[0]),
                        lng: parseFloat(position.split(',')[1]),
                    },
                    title: $(this).text(),
                    url: $(this).data('url'),
                    clickable: multiplePointers,
                    map: map
                })

                if (multiplePointers) {
                    marker.addListener('click', function() {
                        infowindow.setContent(info)
                        infowindow.open(map, this)
                    })
                    bounds.extend(marker.getPosition())
                    map.fitBounds(bounds)
                }

                if ($(this).data('url')) {
                    google.maps.event.addListener(marker, 'click', function() {
                        window.location.href = this.url;
                    })
                }
            }
        })
    }
})
