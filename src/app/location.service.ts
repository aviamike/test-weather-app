import {Injectable} from '@angular/core';

@Injectable()
export class LocationService {

  constructor() {
  }

  getLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
          resolve({
            lat: resp.coords.latitude,
            lon: resp.coords.longitude,
          });
        },
        err => {
          reject(err);
        });
    });

  }
}
