$(function(){var a,o,i;"none"===$("body").css("background-image")&&$("body").css("background-image","url('./assets/images/bg/"+Math.ceil(8*Math.random())+".jpg')"),$("#fullpage").fullpage({continuousVertical:!0,navigation:!0,navigationPosition:"right",scrollOverflow:!0}),0<$(".map-item").length&&(a=1<$(".map-item").length,o=new google.maps.LatLngBounds,new google.maps.InfoWindow,i=new google.maps.Map(document.getElementById("map"),{center:{lat:parseFloat($(".map-item").data("geo").split(",")[0]),lng:parseFloat($(".map-item").data("geo").split(",")[1])},zoom:17,scrollwheel:!1,mapTypeControl:!1,streetViewControl:!1,rotateControl:!1,styles:[{featureType:"poi.business",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"transit",stylers:[{visibility:"off"}]}]}),$(".map-item").each(function(){var e=$(this).data("geo"),t=$(this).data("url");e&&(e=new google.maps.Marker({position:{lat:parseFloat(e.split(",")[0]),lng:parseFloat(e.split(",")[1])},title:$(this).text(),clickable:a,map:i}),t&&(e.addListener("click",function(){window.location.href=t}),o.extend(e.getPosition()),i.fitBounds(o)))}))});
//# sourceMappingURL=script.js.map