interface Current {
  temp: number;
  description: string;
  icon: string;
}

interface RainForecast {
  isRaining: boolean;
  rainWillStopIn?: number;
  rainWillBeIn?: number | null;
  conclusion: string;
}

export interface DisplayCardValuesInterface {
  curr: Current;
  avgTempNextTenHours: number;
  rainForecast: RainForecast;
  tempSuggestions: string;
}
