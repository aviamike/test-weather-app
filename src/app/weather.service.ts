import {Injectable} from '@angular/core';
import {CoordinatesInterface} from './interfaces/coordinates.interface';
import {HttpClient} from '@angular/common/http';
import {RegionFormValuesInterface} from './interfaces/region-form-values.interface';
import {environment} from '../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class WeatherService {

  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
  ) {
  }

  showError({error}) {
    const message = error.message === 'city not found'
      ? 'Город не найден!'
      : error.message;

    this.snackBar.open(`${message}`, null, {
      panelClass: 'warnMessage',
      duration: 6000,
      verticalPosition: 'bottom',
      horizontalPosition: 'end'
    });
  }

  async getCurrent(location: RegionFormValuesInterface) {
    const locationUrl = [location.city, location.country, location.region].join(',');
    const baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationUrl}`;
    const urlOpts = `&APPID=${environment.WEATHER_API_KEY}&lang=ru&units=metric`;

    const url = baseUrl + urlOpts;
    return await this.httpClient.get(url).toPromise().catch(e => {
      this.showError(e);
    });
  }

  async getCurrentByCoordinates(coordinates: CoordinatesInterface) {
    const locationUrl = `?lat=${coordinates.lat}&lon=${coordinates.lon}`;
    const baseUrl = `https://api.openweathermap.org/data/2.5/weather${locationUrl}`;
    const urlOpts = `&APPID=${environment.WEATHER_API_KEY}&lang=ru&units=metric`;

    const url = baseUrl + urlOpts;
    return await this.httpClient.get(url).toPromise().catch(e => {
      this.showError(e);
    });
  }

  async getCurrentWithForecast(coordinates: CoordinatesInterface) {
    const baseUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}`;
    const urlOpts = `&APPID=${environment.WEATHER_API_KEY}&exclude=minutely,daily&lang=ru&units=metric`;

    const url = baseUrl + urlOpts;
    return await this.httpClient.get(url).toPromise().catch(e => {
      this.showError(e);
    });
  }

  getTempSuggestion(temp: number) {
    switch (true) {
      case temp > 27:
        return 'Без купальника и крема для загара не обойтись!';
      case temp > 20:
        return 'Шорты, майка и вперёд!';
      case temp > 12:
        return 'Накиньте свитер или толстовку';
      case temp > 5:
        return 'Прохладно, наденьте куртку на прогулку';
      case temp < -10:
        return 'Бррр! Без пуховика на улицу ни ногой!';
      case temp < -30:
        return 'Привет пингвинам!';
    }
    return;
  }
}
