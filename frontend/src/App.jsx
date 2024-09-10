import { useEffect, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useLoadGMapsLibraries } from './hooks/useLoadGMapsLibraries';
import { MAPS_LIBRARY, MARKER_LIBRARY, ControlPosition } from './constants';

const MAP_CENTER = { lat: -31.56391, lng: 147.154312 };
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const libraries = useLoadGMapsLibraries();
  const markerCluster = useRef();
  const mapNodeRef = useRef();
  const mapRef = useRef();
  const infoWindowRef = useRef();
  const inputNodeRef = useRef();
  
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const handleSearch = (e) => {
    if (e.key !== 'Enter') {
      return;
    }
    const search = inputNodeRef.current.value;
    const city = filteredCities.find((city) => city.name.toLowerCase() === search.toLowerCase());
    if (city) {
      mapRef.current.panTo(city.position);
    }
  };

  const generateMarkers = (cities, Marker, PinElement, InfoWindow) => {
    return cities.map(({ name, position }) => {
      const pin = new PinElement();
      pin.glyph = `${name} ${position.lat.toFixed(2)}, ${position.lng.toFixed(2)}`;
      pin.glyphColor = '#ffffff';
      pin.background = '#000000';
      pin.borderColor = '#000000';

      const marker = new Marker({ position, content: pin.element });

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        const infoWindow = new InfoWindow({
          content: `<div><h4>Marker at ${position.lat.toFixed(2)}, ${position.lng.toFixed(2)}</h4></div>`,
          position,
        });
        infoWindow.open(mapRef.current, marker);
        infoWindowRef.current = infoWindow;
      });

      return marker;
    });
  };

  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(searchTerm)
    );
    setFilteredCities(filtered);
  };

  // Obtener y centrar el mapa en la geolocalización del usuario
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPos = { lat: latitude, lng: longitude };
          mapRef.current.panTo(userPos);

          const { AdvancedMarkerElement: Marker, PinElement } = libraries[MARKER_LIBRARY];
          const userPin = new PinElement();
          userPin.glyph = 'Yo';
          userPin.glyphColor = '#ffffff';
          userPin.background = '#0000ff';
          userPin.borderColor = '#0000ff';

          new Marker({ position: userPos, content: userPin.element }).setMap(mapRef.current);
        },
        () => {
          console.error('Error al obtener la geolocalización.');
        }
      );
    } else {
      console.error('El navegador no soporta geolocalización.');
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      const url = `${BASE_URL}/markers`;
      const response = await fetch(url);
      const data = await response.json();
      const dataParsed = data.map((city) => ({
        name: city.name,
        position: { lat: city.lat, lng: city.lng },
      }));

      setCities(dataParsed);
      setFilteredCities(dataParsed); // Inicialmente, todos los marcadores se muestran.
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (!libraries) {
      return;
    }

    const { Map } = libraries[MAPS_LIBRARY];

    mapRef.current = new Map(mapNodeRef.current, {
      mapId: 'DEMO_MAP_ID',
      center: MAP_CENTER,
      zoom: 7,
    });

    if (mapRef.current && inputNodeRef.current) {
      mapRef.current.controls[ControlPosition.TOP_RIGHT].push(inputNodeRef.current);
    }

    getUserLocation();
  }, [libraries]);

  // Este useEffect se ejecuta cuando `filteredCities` cambia.
  useEffect(() => {
    if (!libraries || !mapRef.current) {
      return;
    }

    const { AdvancedMarkerElement: Marker, PinElement } = libraries[MARKER_LIBRARY];
    const { InfoWindow } = libraries[MAPS_LIBRARY];

    // Eliminar los marcadores existentes del clúster antes de crear nuevos.
    if (markerCluster.current) {
      markerCluster.current.clearMarkers();
    }

    // Crear y añadir los nuevos marcadores filtrados.
    const markers = generateMarkers(filteredCities, Marker, PinElement, InfoWindow);
    markerCluster.current = new MarkerClusterer({
      map: mapRef.current,
      markers,
    });
  }, [filteredCities, libraries]);

  if (!libraries) {
    return <h1>Cargando. . .</h1>;
  }

  return (
    <>
      <input
        ref={inputNodeRef}
        type="text"
        placeholder="Buscar ciudad"
        onKeyDown={handleSearch}
        onChange={handleFilter} // Filtra mientras escribe el usuario
      />
      <div ref={mapNodeRef} style={{ width: '100vw', height: '100vh' }} />
    </>
  );
};

export default App;
