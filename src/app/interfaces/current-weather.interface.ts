import {CoordinatesInterface} from './coordinates.interface';

export interface CurrentWeatherInterface {
  name: string;
  coord: CoordinatesInterface;

  [key: string]: any;
}
