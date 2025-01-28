import {apiConstants} from '../constants';
import {logFunction} from "../helpers/FunctionHelper";

import { axiosInstance } from "../config";


const getCountries = async () => {

  try {
    const countriesResponse = await axiosInstance.get(apiConstants.BACKEND_API.COUNTRIES);
    if (countriesResponse?.status === 200) {
      logFunction('countriesResponse', countriesResponse.data.data.length)
      return {
        status: true,
        message: `countries data fetched`,
        data: countriesResponse?.data?.data,
      };
    } else {
      return {
        status: false,
        message: `countries data not found`,
      };
    }
  } catch (error) {
    logFunction('cache error', error)
    return {
      status: false,
      message: `countries data not found`,
    };
  }
};

const getSettings = async () => {
logFunction('apiConstants.BACKEND_API', apiConstants.BACKEND_API.BASE_API_URL)
  try {
    const settingsRes = await axiosInstance.get(apiConstants.BACKEND_API.SETTINGS);
      // logFunction('settingsRes', settingsRes?.data?.data)
      return {
        status: true,
        message: `setting data fetched`,
        data: settingsRes?.data?.data,
      };

  } catch (error) {
    logFunction('error', error?.response?.data)
    return {
      status: false,
      message: `setting data not found`,
    };
  }
};

const getRegions = async () => {
  let key = 'regions';
  try {
    const { data : settingsRes } = await axiosInstance.get(apiConstants.BACKEND_API.REGIONS);
      // logFunction('settingsRes', settingsRes?.data?.data)
      return {
        status: true,
        message: `${key} data fetched`,
        data: settingsRes?.data,
      };

  } catch (error) {
    logFunction('error', error?.response?.data)
    return {
      status: false,
      message: `${key}  data not found`,
    };
  }
};

const getVehicleMakes = async () => {

  try {
    const { data } = await axiosInstance.get(apiConstants.BACKEND_API.VEHICLE_MAKES);
      // logFunction('vehicleMakesResponse',data?.data?.length)
      return {
        status: true,
        message: `vehicle makes data fetched`,
        data: data?.data,
      };
  } catch (error) {
    logFunction('error', error?.response?.data)
    return {
      status: false,
      message: `vehicle makes data not found`,
    };
  }
};

const getVehicleModels = async (make_id) => {

  try {
    const { data : response } = await axiosInstance.get(apiConstants.BACKEND_API.VEHICLE_MODELS+'/'+make_id);
      // logFunction('vehicleModelsResponse',response?.data?.length)
      return {
        status: true,
        message: `vehicle models data fetched`,
        data: response?.data,
      };
  } catch (error) {
    logFunction('error', error)
    return {
      status: false,
      message: `vehicle models data not found`,
    };
  }
};

const getVehicleTypes = async () => {
  try {
    const { data } = await axiosInstance.get(apiConstants.BACKEND_API.VEHICLE_TYPES);
      // logFunction('vehicleTypesResponse',data?.data?.length)
      return {
        status: true,
        message: `vehicle types data fetched`,
        data: data?.data,
      };
  } catch (error) {
    logFunction('error', error?.response?.data)
    return {
      status: false,
      message: `vehicle types data not found`,
    };
  }
};

const getDriversCancellationReasons = async () => {
  try {
    const driverCancellationReasons = await axiosInstance.get(apiConstants.BACKEND_API.VEHICLE_TYPES);
    if (driverCancellationReasons?.status === 200) {
      logFunction('driversCancellationReasons',driverCancellationReasons?.data?.length)
      return {
        status: true,
        message: `drivers cancellation reasons data fetched`,
        data: driverCancellationReasons?.data,
      };
    } else {
      return {
        status: false,
        message: `drivers cancellation reasons data not found`,
      };
    }
  } catch (error) {
    logFunction('error', error?.response?.data)
    return {
      status: false,
      message: `drivers cancellation reasons data not found`,
    };
  }
};

const getRidersCancellationReasons = async () => {
  try {
    const riderCancellationReasons = await axiosInstance.get(apiConstants.BACKEND_API.VEHICLE_TYPES);
    if (riderCancellationReasons?.status === 200) {
      logFunction('riderCancellationReasons',riderCancellationReasons?.data?.length)
      return {
        status: true,
        message: `riders cancellation reasons data fetched`,
        data: riderCancellationReasons?.data,
      };
    } else {
      return {
        status: false,
        message: `riders cancellation reasons data not found`,
      };
    }
  } catch (error) {
    logFunction('error', error?.response?.data)
    return {
      status: false,
      message: `riders cancellation reasons data not found`,
    };
  }
};

export default {
  getCountries, getVehicleMakes, getVehicleModels,
  getSettings,
  getRegions,
  getVehicleTypes, getDriversCancellationReasons,
  getRidersCancellationReasons,
};
