export interface CurrentWeatherDescription {
  description: string;
  icon: string;
  id: number;
  main: string;
}

export interface Current {
  rain?: any;
  clouds: number;
  dew_point: number;
  dt: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  sunrise: number;
  sunset: number;
  temp: number;
  uvi: number;
  visibility: number;
  weather: CurrentWeatherDescription[];
  wind_deg: number;
  wind_speed: number;
}

export interface CurrentWithForecastInterface {
  current: Current;
  hourly: Current[];
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
}
