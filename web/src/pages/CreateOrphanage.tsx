import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Map, Marker, TileLayer } from 'react-leaflet';

import { LeafletMouseEvent } from 'leaflet';

import { FiPlus } from "react-icons/fi";

import '../styles/pages/create-orphanage.css';

import Sidebar from "../components/Sidebar";
import MapIcon from "../utils/mapIcon";

import api from "../services/api";

export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({latitude: 0, longitude: 0});
  const [mapPosition, setMapPosition] = useState<[number, number]>([-15.7745457, -48.3575684]);

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions,setInstructions] = useState('');
  const [opening_hours,setOpening_hours] = useState('');
  const [open_on_weekends, setOpen_on_weekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
        setMapPosition([position.coords.latitude, position.coords.longitude]);
        setPosition({latitude: position.coords.latitude, longitude: position.coords.longitude});
    })
  }, []);

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    setPosition({latitude: lat, longitude: lng});
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const {latitude, longitude} = position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));

    images.forEach(element => {
      data.append('images', element)
    });

    console.log(name, about, latitude, longitude, opening_hours, open_on_weekends);
    

    await api.post('orphanages', data);

    alert('Data saved!');

    history.push('/app');
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const selectedImages = Array.from(event.target.files);

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(element => {
      return URL.createObjectURL(element);
    });

    setPreviewImages(selectedImagesPreview);
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Data</legend>

            <div className="input-block">
              <label htmlFor="map">Pin your location</label>
              <Map 
                center={mapPosition} 
                style={{ width: '100%', height: 280 }}
                zoom={10}
                onclick={handleMapClick}
                id="map"
              >

                <TileLayer 
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />

                {position.latitude !== 0
                  && <Marker interactive={false} icon={MapIcon} position={[position.latitude,position.longitude]} />
                }

              </Map>
            </div>

            <div className="input-block">
              <label htmlFor="name">Name</label>
              <input id="name" value={name} onChange={event => setName(event.target.value)} required />
            </div>

            <div className="input-block">
              <label htmlFor="about">About <span>Max 300 characters</span></label>
              <textarea id="name" maxLength={300} value={about} onChange={event => setAbout(event.target.value)} required />
            </div>

            <div className="input-block">
              <label htmlFor="images">Photos</label>

              <div className="images-container">
                {previewImages.map(element => {
                  return (
                    <img src={element} alt={name} key={element}/>
                  )
                })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input type="file" id="image[]" multiple onChange={handleSelectImages} required />

            </div>
          </fieldset>

          <fieldset>
            <legend>Visitation</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instructions</label>
              <textarea id="instructions" value={instructions} onChange={event => setInstructions(event.target.value)} required/>
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Opening hours</label>
              <input id="opening_hours" value={opening_hours} onChange={event => setOpening_hours(event.target.value)} required/>
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Open on weekends?</label>

              <div className="button-select">
                <button type="button" className={open_on_weekends ? 'active' : ''}
                  onClick={() => setOpen_on_weekends(true)}>
                  Yes
                </button>
                <button type="button" className={!open_on_weekends ? 'active' : ''}
                  onClick={() => setOpen_on_weekends(false)}>
                  No
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirm
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
