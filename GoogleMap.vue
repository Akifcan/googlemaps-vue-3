<script>
import { onMounted, watch } from "vue";
import { inject } from "vue";
export default {
  props: {
    getUserLocation: {
      type: Boolean,
      default: false,
    },
    useStreetView: {
      type: Boolean,
      default: false,
    },
    polylines: Object,
    polygon: Object,
    layers: Array,
    useReverseGeocode: {
      type: Boolean,
      default: false,
    },
    heatMap: Array,
    addMarkerOnClick: {
      type: Boolean,
      default: false,
    },
    tile: {
      type: String,
    },
    customClickFunction: {
      type: Function,
    },
    customCenterChangePosition: {
      type: Function,
    },
    markers: {
      type: Array,
    },
    init: {
      required: true,
      type: Object,
    },
  },
  setup(props, { emit }) {
    let map, heatmap;
    const apiKey = inject("googleMapApiKey");
    console.log(apiKey);
    function addScripts() {
      const googleMapScript = document.createElement("script");
      googleMapScript.setAttribute("defer", "defer");
      googleMapScript.setAttribute(
        "src",
        `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization`
      );
      document.head.appendChild(googleMapScript);
    }

    function initMap() {
      if (!props.useStreetView) {
        map = new google.maps.Map(document.getElementById("map"), props.init);
        if (props.getUserLocation) {
          delete props.init["position"];
          fetch("https://geolocation-db.com/json/")
            .then((response) => response.json())
            .then((data) => {
              map = new google.maps.Map(document.getElementById("map"), {
                ...props.init,
                position: { lat: data.latitude, lng: data.longitude },
              });
              new google.maps.Marker({
                position: { lat: data.latitude, lng: data.longitude },
                map: map,
                icon: "https://i.hizliresim.com/8UefTs.png",
              });
            });
          if (props.tile) {
            var TILE_URL = props.tile;
            var layer = new google.maps.ImageMapType({
              name: "customtile",
              getTileUrl: function (coord, zoom) {
                var url = TILE_URL.replace("{x}", coord.x)
                  .replace("{y}", coord.y)
                  .replace("{z}", zoom);
                return url;
              },
              tileSize: new google.maps.Size(256, 256),
              minZoom: 1,
              maxZoom: 20,
            });
            map.mapTypes.set("customtile", layer);
            map.setMapTypeId("customtile");
          }
        }
        if (props.tile) {
          var TILE_URL = props.tile;
          var layer = new google.maps.ImageMapType({
            name: "customtile",
            getTileUrl: function (coord, zoom) {
              var url = TILE_URL.replace("{x}", coord.x)
                .replace("{y}", coord.y)
                .replace("{z}", zoom);
              return url;
            },
            tileSize: new google.maps.Size(256, 256),
            minZoom: 1,
            maxZoom: 20,
          });
          map.mapTypes.set("customtile", layer);
          map.setMapTypeId("customtile");
        }
      } else {
        new google.maps.StreetViewPanorama(document.getElementById("map"), {
          position: { lat: 37.86926, lng: -122.254811 },
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
        });
      }
    }

    function setLayers() {
      if (!props.useStreetView) {
        if (props.layers) {
          if (props.layers.includes("trafficLayer")) {
            const trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);
          }
          if (props.layers.includes("transitLayer")) {
            const transitLayer = new google.maps.TransitLayer();
            transitLayer.setMap(map);
          }
          if (props.layers.includes("bicycleLayer")) {
            const bikeLayer = new google.maps.BicyclingLayer();
            bikeLayer.setMap(map);
          }
        }
      }
    }

    function loadMarkers() {
      if (!props.useStreetView) {
        if (props.markers) {
          props.markers.forEach((marker) => {
            const { lat, lng, content, icon } = marker;
            const mark = new google.maps.Marker({
              position: { lat, lng },
              map: map,
              icon: icon ? icon : "https://i.hizliresim.com/dX9CHa.png",
            });
            if (content) {
              const infowindow = new google.maps.InfoWindow(content);
              mark.addListener("click", () => {
                infowindow.open(map, mark);
              });
            }
          });
        }
      }
    }

    function setPolylines() {
      if (!props.useStreetView) {
        if (props.polylines) {
          const polyline = new google.maps.Polyline(props.polylines);
          polyline.setMap(map);
        }
      }
    }

    function setPolygon() {
      if (!props.useStreetView) {
        if (props.polygon) {
          const polygon = new google.maps.Polygon(props.polygon);
          polygon.setMap(map);
        }
      }
    }

    function addEvents() {
      if (!props.useStreetView) {
        map.addListener("click", (e) => {
          if (props.addMarkerOnClick) {
            if (props.useReverseGeocode) {
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode(
                { location: { lat: e.latLng.lat(), lng: e.latLng.lng() } },
                (results, status) => {
                  if (status == "OK") {
                    emit("geocoding", results[0]);
                  }
                }
              );
            }
            new google.maps.Marker({
              position: e.latLng,
              map: map,
              icon: "https://i.hizliresim.com/dX9CHa.png",
            });
          }
          emit("clicked", {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          });
          if (props.customClickFunction) {
            props.customClickFunction();
          }
        });
        map.addListener("center_changed", (e) => {
          emit("center-changed");
          if (props.customCenterChangePosition) {
            props.customCenterChangePosition();
          }
        });
      }
    }

    function checkHeatData() {
      if (!props.useStreetView) {
        if (props.heatMap) {
          const gradient = [
            "rgba(0, 255, 255, 0)",
            "rgba(0, 255, 255, 1)",
            "rgba(0, 191, 255, 1)",
            "rgba(0, 127, 255, 1)",
            "rgba(0, 63, 255, 1)",
            "rgba(0, 0, 255, 1)",
            "rgba(0, 0, 223, 1)",
            "rgba(0, 0, 191, 1)",
            "rgba(0, 0, 159, 1)",
            "rgba(0, 0, 127, 1)",
            "rgba(63, 0, 91, 1)",
            "rgba(127, 0, 63, 1)",
            "rgba(191, 0, 31, 1)",
            "rgba(255, 0, 0, 1)",
          ];
          const data = props.heatMap.map(
            (heat) => new google.maps.LatLng(heat.lat, heat.lng)
          );
          heatmap = new google.maps.visualization.HeatmapLayer({
            data: data,
            map: map,
          });
          heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
          heatmap.set("radius", heatmap.get("radius") ? null : 20);
          heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
        }
      }
    }

    //created hook
    addScripts();
    window.addEventListener("load", (_) => {
      initMap();
      loadMarkers();
      addEvents();
      checkHeatData();
      setLayers();
      setPolylines();
      setPolygon();
      //new marker added
      watch(props.markers, (newData, oldData) => {
        loadMarkers();
      });
    });

    return {};
  },
};
</script>


<template>
  <div id="map"></div>
</template>


<style scoped>
#map {
  height: 25rem;
  width: 100%;
}
</style>