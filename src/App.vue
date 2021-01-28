<script>
import { ref, reactive } from "vue";
export default {
  setup() {
    const customCoordinates = ref(null);
    const geo = ref(null);
    function changed() {
      console.log("intihar etcem");
    }

    function customChange() {
      console.log("custom change work!");
    }

    function clicked() {
      console.log("clicked on map!");
    }

    const markers = reactive([
      {
        lat: -25.344,
        lng: 131.036,
        content: { content: `<h1>Here</h1> is in <b>Australia</b>` },
        icon:
          "https://developers.google.com/maps/documentation/javascript/examples/full/images/parking_lot_maps.png",
      },
      {
        lat: 38.4237,
        lng: 27.1428,
        content: { content: `<h1>Here</h1> is in <b>Turkey</b>` },
        icon:
          "https://developers.google.com/maps/documentation/javascript/examples/full/images/info-i_maps.png",
      },
      {
        lat: 48.8566,
        lng: 2.3522,
        content: { content: `<h1>Here is Paris, French</h1>` },
      },
    ]);

    const heatMapDatas = reactive([
      {
        lat: 37.782551,
        lng: -122.445368,
      },
      {
        lat: 37.782745,
        lng: -122.444586,
      },
      {
        lat: 37.782842,
        lng: 122.443688,
      },
      {
        lat: 37.782919,
        lng: -122.442815,
      },
      {
        lat: 37.7831,
        lng: 122.441461,
      },
      {
        lat: 37.783206,
        lng: -122.440829,
      },
      {
        lat: 37.783273,
        lng: -122.440324,
      },
      {
        lat: 37.783316,
        lng: -122.440023,
      },
      {
        lat: 37.783357,
        lng: -122.439794,
      },
      {
        lat: 37.783371,
        lng: -122.439687,
      },
      {
        lat: 37.783368,
        lng: -122.439666,
      },
    ]);

    const polyineData = {
      path: [
        { lat: 37.772, lng: -122.214 },
        { lat: 21.291, lng: -157.821 },
        { lat: -18.142, lng: 178.431 },
        { lat: -27.467, lng: 153.027 },
      ],
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    };

    const polygonData = {
      paths: [
        { lat: 25.774, lng: -80.19 },
        { lat: 18.466, lng: -66.118 },
        { lat: 32.321, lng: -64.757 },
        { lat: 25.774, lng: -80.19 },
      ],
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
    };

    function newMarker() {
      markers.push({
        lat: 40.677513627085034,
        lng: 34.99846361904805,
      });
      console.log(markers.length);
    }

    const initializeGoogleMap = {
      streetViewControl: true,
      scaleControl: true,
      center: { lat: 34.04924594193164, lng: 34.04924594193164 },
      zoom: 2,
      heading: 90,
      tilt: 75,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ],
    };

    const initializeStreetView = {
      position: { lat: 37.86926, lng: -122.254811 },
      pov: { heading: 165, pitch: 0 },
      zoom: 1,
    };

    return {
      initializeStreetView,
      polyineData,
      heatMapDatas,
      initializeGoogleMap,
      markers,
      customCoordinates,
      changed,
      customChange,
      clicked,
      newMarker,
      polygonData,
    };
  },
};
</script>


<template>
  <div>
    <GoogleMap
      :polygon="polygonData"
      :polylines="polyineData"
      :markers="markers"
      :heatMap="heatMapDatas"
      :init="initializeGoogleMap"
      :addMarkerOnClick="true"
      :getUserLocation="true"
      :tile="'http://mt1.google.com/vt/lyrs=y&x=1325&y=3143&z=13'"
      :layers="['trafficLayer', 'bicycleLayer']"
      @clicked="customCoordinates = $event"
      @geocoding="geo = $event"
    />
    <button @click="newMarker">Add new marker</button>
  </div>
</template>


<style lang="scss" scoped>
</style>