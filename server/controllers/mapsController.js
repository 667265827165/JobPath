import { googleMapsService } from '../services/googleMapsService.js';

export const geocodeAddress = async (req, res, next) => {
  try {
    const { address } = req.query;
    const result = await googleMapsService.geocode(address);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const reverseGeocodeCoordinates = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    const result = await googleMapsService.reverseGeocode(lat, lng);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlacesAutocomplete = async (req, res, next) => {
  try {
    const { input } = req.query;
    const suggestions = await googleMapsService.getPlaceSuggestions(input);
    res.status(200).json({
      success: true,
      data: { suggestions },
    });
  } catch (error) {
    next(error);
  }
};

export const getDistanceAndRoute = async (req, res, next) => {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both origin and destination addresses.',
      });
    }

    const route = await googleMapsService.calculateDistance(origin, destination);
    res.status(200).json({
      success: true,
      data: route,
    });
  } catch (error) {
    next(error);
  }
};
