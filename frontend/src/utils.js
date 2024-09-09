export const randomCoordinates =
  ({ lat, lng }) =>
  () => ({
    lat: lat + (Math.random() * 2 - 1) * 0.9,
    lng: lng + (Math.random() * 2 - 1) * 0.9,
  });
