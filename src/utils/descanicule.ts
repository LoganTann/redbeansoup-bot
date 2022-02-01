import { EmbedField } from "../../deps.ts";
import {
    ForecastResponse,
    RainResponse,
    unixTimestamp,
    iconToEmoji,
    Forecast,
} from "../types/descanicule.ts";
import { fetchWithType } from "../types/fetchWithType.ts";

/**
 * Partial Typescript port of hacf-fr's meteofrance-api python client.
 * https://github.com/hacf-fr/meteofrance-api/blob/master/src/meteofrance_api/client.py
 * Under MIT License.
 * Copyright (c) 2020 HACF Home Assistant Communauté Francophone
 * Copyright (c) 2022 LoganTann
 * @author hacf-fr
 * @author LoganTann
 */
export class MeteoFranceClient {
    static meteoFranceApiToken =
        "__Wj7dVSTjV9YGu1guveLyDq0g7S7TfTjaHBTPTpO0kj8__";
    static meteoFranceApiEndpoint = "https://webservice.meteofrance.com";
    static defaultCoord = {
        // iut.paris
        lat: 48.842987,
        lon: 2.269209,
    };

    /**
     * Retrieve the next 1 hour rain forecast for a given GPS the location.
     * @param latitude Latitude in degree of the GPS point corresponding to the rain forecast.
     * @param longitude Longitude  in degree of the GPS point corresponding to the rain forecast.
     * @param lang Optional; If language is equal "fr" (default value) results will be in French.
     *             All other value will give results in English.
     * @return A RainResponse instance representing the next hour rain forecast.
     */
    static async getRain(
        latitude?: number,
        longitude?: number,
        lang = "fr"
    ): Promise<RainResponse> {
        const endpoint = MeteoFranceClient.buildEndpoint(
            "rain",
            latitude,
            longitude,
            lang
        );
        return await fetchWithType<RainResponse>(endpoint);
    }

    /**
     * Retrieve the weather forecast for a given GPS location.
     * @param latitude Latitude in degree of the GPS point corresponding to the weather forecast.
     * @param longitude Longitude  in degree of the GPS point corresponding to the weather forecast.
     * @param lang Optional; If language is equal "fr" (default value) results will be in French.
     *             All other value will give results in English.
     * @return A {@link ForecastResponse} instance representing the hourly and daily weather forecast.
     */
    static async getForecast(
        latitude?: number,
        longitude?: number,
        lang = "fr"
    ): Promise<ForecastResponse> {
        const endpoint = MeteoFranceClient.buildEndpoint(
            "forecast",
            latitude,
            longitude,
            lang
        );
        return await fetchWithType<ForecastResponse>(endpoint);
    }

    private static buildEndpoint(
        requestType: "forecast" | "rain",
        latitude?: number,
        longitude?: number,
        lang?: string
    ) {
        return `${MeteoFranceClient.meteoFranceApiEndpoint}/${requestType}
                ?token=${MeteoFranceClient.meteoFranceApiToken}
                &lat=${latitude || MeteoFranceClient.defaultCoord.lat}
                &lon=${longitude || MeteoFranceClient.defaultCoord.lon}
                &lang=${lang || "fr"}`.replace(/\s+/g, "");
    }
}

export class MeteoHelpers {
    public static unixToDate(time: unixTimestamp): Date {
        return new Date(time * 1000);
    }
    public static getTodayAt(hour: number): Date {
        const outDate = new Date();
        outDate.setHours(hour, 0, 0, 0);
        return outDate;
    }
    public static getTomorrowAt(hour: number): Date {
        const outDate = MeteoHelpers.getTodayAt(hour);
        outDate.setDate(outDate.getDate() + 1);
        return outDate;
    }
    public static DateToUnixSecs(date: Date): number {
        return Math.floor(date.getTime() * 0.001);
    }
    public static getWeatherEmoji(forecastItem: Forecast): string {
        const icon = forecastItem.weather.icon?.replace("n", "j") || "error";
        return iconToEmoji[icon] || icon;
    }
    public static detectSlice() {
        const currentHour = new Date().getHours();
        type sliceList = Record<
            string,
            {
                start: number;
                end: number;
                name: string;
                value: string;
                inline: boolean;
            }
        >;
        const slices: sliceList = {
            morning: {
                name: "Ce matin",
                start: this.DateToUnixSecs(this.getTodayAt(8)),
                end: this.DateToUnixSecs(this.getTodayAt(13)),
                value: "",
                inline: true,
            },
            afternoon: {
                name: "Cet après-midi",
                start: this.DateToUnixSecs(this.getTodayAt(14)),
                end: this.DateToUnixSecs(this.getTodayAt(19)),
                value: "",
                inline: true,
            },
            tomorrowMorning: {
                name: "Demain matin",
                start: this.DateToUnixSecs(this.getTomorrowAt(8)),
                end: this.DateToUnixSecs(this.getTomorrowAt(13)),
                value: "",
                inline: true,
            },
            tomorrowAfternoon: {
                name: "Demain après-midi",
                start: this.DateToUnixSecs(this.getTomorrowAt(14)),
                end: this.DateToUnixSecs(this.getTomorrowAt(19)),
                value: "",
                inline: true,
            },
        };
        if (currentHour > 19) {
            return [slices.tomorrowMorning, slices.tomorrowAfternoon];
        }
        if (currentHour > 13) {
            return [
                slices.afternoon,
                slices.tomorrowMorning,
                slices.tomorrowAfternoon,
            ];
        }
        return [slices.morning, slices.afternoon];
    }

    public static getForecastEmbedFields(
        meteo: ForecastResponse
    ): EmbedField[] {
        const slices = MeteoHelpers.detectSlice();
        let currentSlice = 0;
        for (const forecastItem of meteo.forecast) {
            if (forecastItem.dt < slices[currentSlice].start) continue;
            if (forecastItem.dt > slices[currentSlice].end) {
                currentSlice++;
                if (currentSlice >= slices.length) {
                    break;
                }
                if (forecastItem.dt < slices[currentSlice].start) {
                    continue;
                }
            }
            let toAdd = `<t:${forecastItem.dt}:t> `;
            toAdd += forecastItem.T.value + "°C ";
            try {
                toAdd +=
                    iconToEmoji[forecastItem.weather.icon.replace("n", "j")];
            } catch (_e) {
                // catch if the weather icon is wrong. Should never happen.
            }
            toAdd += ` ${forecastItem.weather.desc}\n`;
            slices[currentSlice].value += toAdd;
        }
        if (currentSlice % 2 === 1) {
            slices[0].inline = false;
        }
        return <EmbedField[]>slices;
    }
}
