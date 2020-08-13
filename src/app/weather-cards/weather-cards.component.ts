import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LocationService} from '../location.service';
import {CoordinatesInterface} from '../interfaces/coordinates.interface';
import {WeatherService} from '../weather.service';

@Component({
  selector: 'app-weather-cards',
  templateUrl: './weather-cards.component.html',
  styleUrls: ['./weather-cards.component.scss']
})
export class WeatherCardsComponent implements OnInit {
  clientRegionForm: FormGroup;
  regionRegex = new RegExp(/(^[а-яёА-ЯЁ]+(?:[\s-][а-яёА-ЯЁ]+)*$)|(^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$)/);
  coords: CoordinatesInterface;

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

  checkBrowserGeo() {
    this.locationService.getLocation().then(async pos => {
      const {lat, lon} = pos;
      this.coords = {lat, lon};
      console.log(`Position: ${pos.lat} ${pos.lon}`);

      const weatherWithForecast = await this.weatherService.getCurrentWithForecast({lat, lon});
      console.warn(weatherWithForecast);

    }).catch(() => {
      console.warn('Geolocation is not supported by this browser.');
    });
  }

  async submitForm() {
    console.warn(this.clientRegionForm.value);
    const weatherData = await this.weatherService.getCurrent(this.clientRegionForm.value);
    console.warn(weatherData);
  }

}
