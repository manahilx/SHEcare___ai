

let map;
let geocoder;
let userMarker;

function initHealthcareMap() {
  geocoder = new google.maps.Geocoder();

  map = new google.maps.Map(
    document.getElementById("healthcare-map"),
    {
      center: { lat: 33.6007, lng: 73.0679 },
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false
    }
  );
}

function setStatus(message) {
  document.getElementById("map-status").textContent = message;
}

function searchLocation() {
  const query = document
    .getElementById("place-search")
    .value.trim();

  if (!query) {
    setStatus("Please enter a city, area, or facility.");
    return;
  }

  geocoder.geocode(
    { address: query },
    (results, status) => {
      if (status === "OK" && results[0]) {
        const place = results[0].geometry.location;

        map.setCenter(place);
        map.setZoom(14);

        new google.maps.Marker({
          map,
          position: place,
          title: results[0].formatted_address
        });

        setStatus(
          "Map centered on " +
          results[0].formatted_address
        );
      } else {
        setStatus("Location not found. Try another search.");
      }
    }
  );
}

function useCurrentLocation() {
  if (!navigator.geolocation) {
    setStatus("Location services are not supported.");
    return;
  }

  setStatus("Waiting for location permission...");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(location);
      map.setZoom(15);

      if (userMarker) {
        userMarker.setMap(null);
      }

      userMarker = new google.maps.Marker({
        map,
        position: location,
        title: "Your current location"
      });

      setStatus(
        "Showing your location for this session."
      );
    },
    () => {
      setStatus(
        "Location unavailable. Search by city or area instead."
      );
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000
    }
  );
}

document
  .getElementById("search-map")
  .addEventListener("click", searchLocation);

document
  .getElementById("use-location")
  .addEventListener("click", useCurrentLocation);
