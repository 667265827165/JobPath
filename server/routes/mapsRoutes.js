import express from 'express';
import {
  geocodeAddress,
  reverseGeocodeCoordinates,
  getPlacesAutocomplete,
  getDistanceAndRoute,
} from '../controllers/mapsController.js';

const router = express.Router();

router.get('/geocode', geocodeAddress);
router.get('/reverse-geocode', reverseGeocodeCoordinates);
router.get('/places', getPlacesAutocomplete);
router.get('/distance', getDistanceAndRoute);
router.get('/route', getDistanceAndRoute);

export default router;
