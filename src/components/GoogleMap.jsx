import { useEffect, useRef } from 'react';

export default function GoogleMap({ center, markers = [], zoom = 14, height = '400px' }) {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center: center || { lat: 28.6139, lng: 77.2090 },
        zoom: zoom,
        mapTypeControl: false,
        streetViewControl: false,
      });

      updateMarkers();
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (googleMapRef.current && center) {
      googleMapRef.current.setCenter(center);
    }
  }, [center]);

  useEffect(() => {
    updateMarkers();
  }, [markers]);

  const updateMarkers = () => {
    if (!googleMapRef.current || !window.google) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    markers.forEach(markerData => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: googleMapRef.current,
        title: markerData.title,
        icon: markerData.icon || null,
      });

      if (markerData.info) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: markerData.info,
        });
        marker.addListener('click', () => {
          infoWindow.open(googleMapRef.current, marker);
        });
      }

      markersRef.current.push(marker);
    });
  };

  return <div ref={mapRef} style={{ width: '100%', height }} />;
}
