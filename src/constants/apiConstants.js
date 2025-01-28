
const BACKEND_BASE_URL = "https://app.igbodefence.com";

const BACKEND_API = {
  BASE_API_URL: `${BACKEND_BASE_URL}/api/v1`,
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',


  GET_VIDEOS: '/feeds/videos',
  GET_SHORTS: '/feeds/shorts',
  GET_USER_SHORTS: '/user/shorts',
  INCREASE_VIEW: '/increase/view',
  TOGGLE_LIKE: '/toggle/like',




  COUNTRIES: '/config/countries',
  VEHICLE_MAKES: '/config/vehicle/makes',
  VEHICLE_MODELS: '/config/vehicle/models',
  VEHICLE_TYPES: '/config/vehicle/types',
  SETTINGS: '/config/settings',
  REGIONS: '/config/regions',

  UPDATE_USER : '/auth/user/update',
  GET_USER : '/auth/user',
  UPDATE_USER_CAR : '/driver/car/update',
  UPDATE_USER_LATLNG : '/user/update/lat_lng',
  UPDATE_DRIVER_DOCUMENT : '/driver/update/document',
  UPDATE_ONLINE_STATUS : '/auth/update/online',
  REQUEST_OTP_CODE : '/auth/request/code',
  LOGIN_USER : '/auth/login',
  SET_PIN : '/auth/set/pin',

  FOLLOW_USER : 'auth/user/follow',


  TRANSFER_MONEY : '/transaction/make/transfer',
  SEARCH_ACCOUNT : '/transaction/search/account',

  GET_PAYMENT_LINK : '/payment/init/pay',

  TRANSACTIONS : '/user/transactions',
  NOTIFICATIONS : '/user/notifications',
  LIVES : '/lives',
  EARNINGS : '/user/earnings',

  ACCEPT_RIDE : '/trip_request/accept',
  UPDATE_TRIP_STATUS : '/trip_request/update/status',
  SHARE_FEEDBACK : '/trip_request/share/feedback',
  TRIP_HISTORY : '/trip_request/history',

  GET_CARS : '/booking/cars',
  BOOK_CAR : '/booking/book',
  BOOKING_HISTORY : '/booking/history',




  SERVICE_TYPES : '/trip_request/services',
  BOOK_TRIP : '/trip_request/book',


  DRIVERS_CANCELLATION_REASONS: '/config/driver/cancellation/reasons',
  RIDERS_CANCELLATION_REASONS: '/config/rider/cancellation/reasons',

  SERVICES_CATEGORIES : '/utility/services',

  VALIDATE_CUSTOMER_ID : '/utility/validate/customer_id',
  PURCHASE_SERVICE : '/utility/purchase/service'


};

export default { BACKEND_API };
