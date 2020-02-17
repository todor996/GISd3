import React, { Component } from 'react';

import { Map, TileLayer, WMSTileLayer, LayersControl, Popup } from 'react-leaflet';
const { BaseLayer, Overlay } = LayersControl;

import 'leaflet/dist/leaflet.css';
import { CoordinatesControl } from 'react-leaflet-box-zoom'
import {getData} from '../thunks/wmsObject';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const mapUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
const mapCenter = [43.3231171460394, 21.886276544398882];
const zoomLevel = 15;
let numMapClicks = 0;

class Leaflet extends Component {
  constructor(props) {
    super(props);
    this.state = { currentZoomLevel: zoomLevel, popup: null}
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.on('zoomend', () => {
      const updatedZoomLevel = leafletMap.getZoom();
      this.handleZoomLevelChange(updatedZoomLevel);
    });
  }

  handleZoomLevelChange(newZoomLevel) {
    this.setState({ currentZoomLevel: newZoomLevel });
  }

  onClick(e) {
    const { fetchAction } = this.props;
    const {_southWest, _northEast } = this.leafletMap.leafletElement.getBounds();
    const BBOX = `${_southWest.lng},${_southWest.lat},${_northEast.lng},${_northEast.lat}`;
    const width = this.leafletMap.leafletElement.getSize().x;
    const height = this.leafletMap.leafletElement.getSize().y;
    const latLong = e.latlng;
    const x = Math.trunc(this.leafletMap.leafletElement.layerPointToContainerPoint(e.layerPoint).x);
    const y = Math.trunc(this.leafletMap.leafletElement.layerPointToContainerPoint(e.layerPoint).y);
    const params = `SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&LAYERS=gis_proj:planet_osm_point_d3&QUERY_LAYERS=gis_proj:planet_osm_point_d3&BBOX=${BBOX}&FEATURE_COUNT=1&HEIGHT=${height}&WIDTH=${width}&INFO_FORMAT=application/json&TILED=false&I=${x}&J=${y}`;
    console.log(this.props);
    fetchAction(params)
      .then(() => {
        console.log(this.props);
        const data = this.props;
        if(data.length > 0) {
          const properties = data[0].properties;
          let content = '';
          for (let prop in properties) {
            if(properties[prop])
            content += '<b>' + prop + ':' + data.properties[prop]+'</b></br>';
          }

          this.setState({
            popup: {
              key: numMapClicks++,
              position: latLong,
              content: content
            }
          })
        }
      })
  }

  render() {
    window.console.log('this.state.currentZoomLevel ->',
      this.state.currentZoomLevel);
    const mapUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    const mapCenter = [43.3231171460394, 21.886276544398882];
    const { popup } = this.state
    const zoomLevel = 15;
    return (
      <div>
        <Map
          ref={m => { this.leafletMap = m; }}
          center={mapCenter}
          onClick={this.onClick}
          zoom={zoomLevel}
        >
            <TileLayer
              url={mapUrl}
            />
          <LayersControl position='topright'>
            <BaseLayer name="Point layer">
              <WMSTileLayer
                format="image/png"
                url="http://localhost:8080/geoserver/wms"
                layers='gis_proj:planet_osm_point_d3'
                transparent
              />
            </BaseLayer>
            <BaseLayer name="Line layer">
              <WMSTileLayer
                  url="http://localhost:8080/geoserver/wms"
                  layers='gis_proj:planet_osm_line_d3'
                  format='image/png'
                  transparent
              />
            </BaseLayer>
            <BaseLayer name="Polygon layer">
              <WMSTileLayer
                url="http://localhost:8080/geoserver/wms"
                layers='gis_proj:planet_osm_polygon_d3'
                format='image/png'
                transparent
              />
            </BaseLayer>
            <BaseLayer name="Roads layer">
              <WMSTileLayer
                url="http://localhost:8080/geoserver/wms"
                format='image/png'
                transparent
                layers='gis_proj:planet_osm_roads_d3'
              />
            </BaseLayer>
          </LayersControl>
          {popup &&
          <Popup
            key={`popup-${popup.key}`}
            position={popup.position}
          >
            {popup.content}
          </Popup>
          }
        </Map>
      </div>
    );
  }
}

const mapStateToProps = state =>  ({
  data: state.data.get('data'),
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    fetchAction: getData,
  },
  dispatch,
);



export default connect(mapStateToProps, mapDispatchToProps)(Leaflet);
