import {Injectable} from '@angular/core';
import {CoordinatesInterface} from './interfaces/coordinates.interface';
import {HttpClient} from '@angular/common/http';
import {RegionFormValuesInterface} from './interfaces/region-form-values.interface';

@Injectable()
export class WeatherService {

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  async getCurrent(location: RegionFormValuesInterface) {
    const locationUrl = [location.city, location.country, location.region].join(',');
    const baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationUrl}`;
    const urlOpts = '&APPID=a132d986c05e9ee193e35b2e470a5d19&lang=ru&units=metric';

    const url = baseUrl + urlOpts;
    return await this.httpClient.get(url).toPromise().catch();
  }

  async getCurrentByCoordinates(coordinates: CoordinatesInterface) {
    const locationUrl = `?lat=${coordinates.lat}&lon=${coordinates.lon}`;
    const baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationUrl}`;
    const urlOpts = '&APPID=a132d986c05e9ee193e35b2e470a5d19&lang=ru&units=metric';

    const url = baseUrl + urlOpts;
    return await this.httpClient.get(url).toPromise().catch();
  }

  async getCurrentWithForecast(coordinates: CoordinatesInterface) {
    const baseUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}`;
    const urlOpts = '&APPID=a132d986c05e9ee193e35b2e470a5d19&exclude=minutely,daily&lang=ru&units=metric';

    const url = baseUrl + urlOpts;
    return await this.httpClient.get(url).toPromise().catch();
  }

  getIconUrl(iconCode: string): string {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}
