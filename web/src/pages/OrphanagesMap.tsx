import React, { useEffect, useState } from 'react';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import '../styles/pages/orphanages-map.css';

import mapMarkerImg from '../images/map-marker.svg';
import MapIcon from '../utils/mapIcon';

import api from '../services/api';

interface Orphanage {
  id: number,
  latitude: number,
  longitude: number,
  name: string
}

function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [mapPosition, setMapPosition] = useState<[number, number]>([-15.7745457, -48.3575684]);

  useEffect(() => {
    api.get('orphanages').then(res => {
      setOrphanages(res.data);
    })
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
        setMapPosition([position.coords.latitude, position.coords.longitude]);
    })
  }, []);

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy" />
          <h2>Select an orphanage in map</h2>
          <p>So many children waiting for your visit :)</p>
        </header>

        <footer>
          <strong>be</strong>
          <br/>
          <span>happy!</span>
        </footer>
      </aside>
      
      <Map center={mapPosition} zoom={10} style={{ width: '100%', height: '100%' }}>
        {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
        <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />

        {orphanages.map(element => {
          return (
            <Marker position={[element.latitude, element.longitude]} icon={MapIcon} key={element.id}>
              <Popup closeButton={false} className="map-popup">
                {element.name}
                <Link to={`/orphanage/${element.id}`}>
                  <FiArrowRight size={20} color="#fff" />
                </Link>
              </Popup> 
            </Marker>
          )
        })}

      </Map>

      <Link to="/orphanages/create" className="create-orphanage" >
        <FiPlus size={32} color="#fff" />
      </Link>
    </div>
  );
}

export default OrphanagesMap;