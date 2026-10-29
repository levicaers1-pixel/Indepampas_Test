/** Dark green map style that matches the site (classic JSON styling, no Map ID needed). */
export const DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#12261a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0c1a12" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8fa297" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#2f5a41" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ visibility: "on" }, { color: "#163020" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1b3324" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2f5a41" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#081209" }] },
];
