import Geocode from "react-geocode";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey('AIzaSyBoH_8YqHpi4YWnkECVf7Fw16HF9xKbLt4');

Geocode.enableDebug();

export const getAddressFromLatLng = async (lat, lng) => {
  const formattedAddress = await Geocode.fromLatLng(lat, lng).then(
    response => {
      const address = response.results[0].formatted_address;

      return address;
    },
    error => {
      console.log(error);
    }
  );
  return formattedAddress;
};

export const getLatLngFromAddress = async address => {
  const location = await Geocode.fromAddress(address).then(
    response => {
      const { lat, lng } = response.results[0].geometry.location;
      console.log(lat, lng);
      return { lat, lng };
    },
    error => {
      console.log(error);
      return null;
    }
  );
  return location;
};