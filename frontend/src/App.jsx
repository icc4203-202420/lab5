import { useEffect, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useLoadGMapsLibraries } from './hooks/useLoadGMapsLibraries';
import { MAPS_LIBRARY, MARKER_LIBRARY } from './constants';
import { randomCoordinates } from './utils';

const MAP_CENTER = { lat: -31.56391, lng: 147.154312 };

const App = () => {
  const libraries = useLoadGMapsLibraries();
  const markerCluster = useRef();
  const mapNodeRef = useRef();
  const mapRef = useRef();

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

    const { AdvancedMarkerElement: Marker } = libraries[MARKER_LIBRARY];
    const positions = Array.from({ length: 10 }, randomCoordinates(MAP_CENTER));
    const markers = positions.map((position) => new Marker({ position }));

    markerCluster.current = new MarkerClusterer({
      map: mapRef.current,
      markers,
    });
  }, [libraries]);

  if (!libraries) {
    return <h1>Cargando. . .</h1>;
  }

  return <div ref={mapNodeRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default App;
