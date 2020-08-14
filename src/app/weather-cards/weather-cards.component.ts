import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LocationService} from '../location.service';
import {CoordinatesInterface} from '../interfaces/coordinates.interface';
import {WeatherService} from '../weather.service';
import {CurrentWithForecastInterface} from '../interfaces/current-with-forecast.interface';
import {CurrentWeatherInterface} from '../interfaces/current-weather.interface';
import {DisplayCardValuesInterface} from '../interfaces/display-card-values.interface';

@Component({
  selector: 'app-weather-cards',
  templateUrl: './weather-cards.component.html',
  styleUrls: ['./weather-cards.component.scss']
})
export class WeatherCardsComponent implements OnInit {
  clientRegionForm: FormGroup;
  regionRegex = new RegExp(/(^[а-яёА-ЯЁ]+(?:[\s-][а-яёА-ЯЁ]+)*$)|(^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$)/);
  coords: CoordinatesInterface;
  displayCard: DisplayCardValuesInterface;
  locationName: string;

  constructor(
    private locationService: LocationService,
    private weatherService: WeatherService,
  ) {
  }

  ngOnInit(): void {
    this.clientRegionForm = new FormGroup(
      {
        city: new FormControl('', [
          Validators.required,
          Validators.pattern(this.regionRegex),
        ]),
        region: new FormControl('', [Validators.pattern(this.regionRegex)]),
        country: new FormControl('', [Validators.pattern(this.regionRegex)]),
      });

    this.checkBrowserGeo();

  }

  getLocationName(): string {
    return Object.values(this.clientRegionForm.value).filter(location => !!location).join(', ');
  }

  checkBrowserGeo() {
    this.locationService.getLocation().then(async pos => {
      const {lat, lon} = pos;
      this.coords = {lat, lon};
      // console.log(`Position: ${pos.lat} ${pos.lon}`);

      const weatherWithForecast: CurrentWithForecastInterface | any = await this.weatherService.getCurrentWithForecast({lat, lon});
      const currWeather: CurrentWeatherInterface | any = await this.weatherService
        .getCurrentByCoordinates({lat: weatherWithForecast.lat, lon: weatherWithForecast.lon});
      this.locationName = currWeather.name;

      this.displayCard = this.displayCardDataPrepare(weatherWithForecast);

    }).catch(() => {
      console.warn('Geolocation is not supported by this browser.');
    });
  }

  displayCardDataPrepare(weatherWithForecast: CurrentWithForecastInterface) {
    const tenHoursForecast = weatherWithForecast.hourly?.slice(1, 10);
    const avgTempNextTenHours = tenHoursForecast?.reduce((acc, curr, i, {length}) => (acc + curr.temp / length), 0);

    const isRaining = !!weatherWithForecast.current.rain;
    let rainWillStopIn;
    let rainWillBeIn;
    if (isRaining) {
      rainWillStopIn = tenHoursForecast.findIndex(forecast => !forecast.rain) !== -1
        ? tenHoursForecast.findIndex(forecast => !forecast.rain)
        : null;
    } else {
      rainWillBeIn = tenHoursForecast.findIndex(forecast => forecast.rain) !== -1
        ? tenHoursForecast.findIndex(forecast => forecast.rain)
        : null;
    }
    const conclusion = isRaining
      ? rainWillStopIn
        ? `Дождь прекратится примерно через ${rainWillStopIn} часов`
        : 'В ближайшие 10 часов дождь не прекратится. Лучше посидите дома =)'
      : rainWillBeIn
        ? `Дождь может начаться примерно через ${rainWillBeIn} часов. Захватите зонт`
        : 'Дождя в ближайшие 10 часов не будет - гуляйте смело!';
    const tempSuggestions = this.weatherService.getTempSuggestion(avgTempNextTenHours);

    const rainForecast = {
      isRaining,
      ...(isRaining && {
        rainWillStopIn
      }),
      ...(!isRaining && {
        rainWillBeIn
      }),
      conclusion,
    };

    return {
      curr: {
        temp: weatherWithForecast.current.temp,
        description: weatherWithForecast.current.weather[0].description,
        icon: weatherWithForecast.current.weather[0].icon,
      },
      avgTempNextTenHours,
      rainForecast,
      tempSuggestions,
    };
  }

  async submitForm() {
    const currWeather: CurrentWeatherInterface | any = await this.weatherService.getCurrent(this.clientRegionForm.value);
    if (!currWeather) {
      return;
    }
    // console.warn(currWeather);
    this.locationName = this.getLocationName();

    const weatherWithForecast: CurrentWithForecastInterface | any = await this.weatherService
      .getCurrentWithForecast({lat: currWeather.coord.lat, lon: currWeather.coord.lon});

    this.displayCard = this.displayCardDataPrepare(weatherWithForecast);
  }

  getIconUrl(iconCode: string): string {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

}
