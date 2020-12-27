import { GoogleApiWrapper, InfoWindow, Map, Marker } from "google-maps-react";
import React from "react";
import AddressBar from "./AddressBar";
import {getAddressFromLatLng} from './geocode'
import {getLatLngFromAddress} from './geocode'

class FindAddressPresenter extends React.Component {
  state = {
    address: "",
    initialLat: 0,
    initialLng: 0,
    lat: 0,
    lng: 0,
    loading: true
  };

  constructor(props) {
    super(props);
    this.centerMoved = this.centerMoved.bind(this);
  }

  componentDidMount() {
    if (navigator.geolocation) {
      if(this.props.match.params.address==='main'){
        console.log('this is main')
      }
      else{
        this.setState({
          ...this.state,
          address:this.props.match.params.address
        })
      }
      navigator.geolocation.getCurrentPosition(this.successGetCurrentPosition);
    } else {
      console.log("Geolocation is not supported by this browser");
    }
  }

  render() {
    const { address, initialLat, initialLng, lat, lng, loading } = this.state;
    console.log(lat, lng);
    if (loading) {
      return "loading...";
    }
    return (
      <div className={"FindAddressPresenter"}>
        <div className={"FindAddressPresenter__input"}>
          <AddressBar
            onAddressChange={this.handleAddressBar}
            address={address}
            onBlur={this.onBlur}
            onClick={this.onClick}
          />
        </div>

        <Map
          google={this.props.google}
          zoom={14}
          center={
            lat === 0 && lng === 0
              ? { lat: initialLat, lng: initialLng }
              : { lat, lng }
          }
          initialCenter={{ lat: initialLat, lng: initialLng }}
          onDragend={this.centerMoved}
        >
          <Marker
            name={"Current Location"}
            title={"Current Location"}
            position={
              lat !== 0 && lng !== 0
                ? { lat, lng }
                : {
                    lat: initialLat,
                    lng: initialLng
                  }
            }
          />
          <InfoWindow>
            <div>
              <h1>test</h1>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }

  centerMoved = async (mapProps, map) => {
    const lat = map.center.lat();
    const lng = map.center.lng();
    const address = await getAddressFromLatLng(lat, lng);
    this.setState({
      ...this.state,
      address,
      lat,
      lng
    });
  };

  successGetCurrentPosition = position => {
    this.setState({
      ...this.state,
      initialLat: position.coords.latitude,
      initialLng: position.coords.longitude,
      loading: false
    });
  };

  handleAddressBar = event => {
    const value = event.target.value;
    this.setState({
      ...this.state,
      address: value
    });
  };

  onClick = async () => {
    const { address } = this.state;
    const location = await getLatLngFromAddress(address);
    if(!location) {
      console.log('error!')
    }else {
      const {lat, lng} = location;
      this.setState({
        ...this.state,
        lat,
        lng
      })
    }
  };
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBoH_8YqHpi4YWnkECVf7Fw16HF9xKbLt4"
})(FindAddressPresenter);