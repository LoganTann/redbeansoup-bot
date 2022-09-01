export type unixTimestamp = number;

/**
 * https://webservice.meteofrance.com/forecast?token=<token>&lat=<lat>&lon=<lon>&lang=fr
 * @author LoganTann
 * @license MIT
 */
export interface ForecastResponse {
    /** Information about the meteo station and its location */
    position: Position;
    /** Last edit date */
    updated_on: unixTimestamp;
    /** Contains basic forecast data of each days of the week */
    daily_forecast: DailyForecast[];
    /** Contains complete forecast data of each hours of the week (frequency decreases over time)*/
    forecast: Forecast[];

    /** stores probabilities of some conditions (cloud, rain, freezing...)*/
    probability_forecast: ProbabilityForecast[];
}
/**
 * https://webservice.meteofrance.com/rain?token=<token>&lat=<lat>&lon=<lon>&lang=fr
 * @author LoganTann
 * @license MIT
 */
export interface RainResponse {
    position: Position;
    updatedOn: unixTimestamp;
    quality: number;
    forecast: {
        dt: unixTimestamp;
        rain: number;
        desc: string;
    }[];
}

/**
 * @see RainResponse
 * @see ForecastResponse
 */
export interface Position {
    /**
     * The latitude of the meteo station in degree
     */
    lat: number;
    /**
     * The longitude of the meteo station in degree
     */
    lon: number;
    /**
     * The altitude of the meteo station, if available (null if not)
     */
    alti: number | null;
    /**
     * The name of the meteo station
     */
    name: string;
    /**
     * The city of the meteo station
     */
    country: string;
    /**
     * The region of the meteo station
     */
    dept: string;
    /**
     * The local timezone of the meteo station
     */
    timezone: string;
    rain_product_available?: number;
    insee?: string;
    bulletin_cote?: number;
}

/**
 * Converts an icon identifier to the corresponding discord emoji
 * @see Weather.icon
 */
export const iconToEmoji: Record<string, string> = {
    p1j: ":sunny:",
    p2j: ":partly_sunny:",
    p3j: ":cloud:",
    p4j: ":white_sun_small_cloud:",
    p5j: ":white_sun_small_cloud:",
    p6j: ":fog:",
    p7j: ":fog:",
    p8j: ":fog:",
    p9j: ":cloud_rain:",
    p10j: ":cloud_rain:",
    p11j: ":cloud_rain:",
    p12j: ":white_sun_rain_cloud:",
    p13j: ":white_sun_rain_cloud:",
    p14j: ":white_sun_rain_cloud:",
    p15j: "<:p15j:938158210085437493>",
    p16j: ":thunder_cloud_rain:",
    p17j: ":cloud_snow:",
    p18j: ":cloud_snow:",
    p19j: "<:p19j:938158210223845416>",
    p20j: "<:p20j:938158210383249408>",
    p21j: "<:p21j:938158210412605480>",
    p22j: "<:p22j:938158210790080582>",
    p23j: "<:p23j:938158210978820106>",
    p24j: "<:p24j:938158210752331856>",
    p25j: "<:p25j:938158210815254578>",
    p26j: "<:p26j:938158210962063420>",
    p27j: "<:p27j:938158210903310346>",
    p28j: "<:p28j:938158210974613554>",
    p29j: "<:p29j:938158210932682842>",
    p30j: "<:p30j:938158210962055188>",
    p31j: "<:p31j:938158210869764226>",
    p32j: ":cloud_tornado:",
    p33j: ":cloud_tornado:",
    p34j: "<:p34j:938158210848792587>",
    error: "<:redbeansoup:938187535417495562>",
};

// ForecastResponse subtypes ---------------------------------------------------

export interface Forecast {
    /**
     * The date + time of the current weather of the field, represented as a unix timestamp (in seconds)
     */
    dt: unixTimestamp;
    /**
     * Holds the weather temperature (real + felt) of the field
     */
    T: {
        /**
         * The weather temperature in °C
         */
        value: number;
        /**
         * The temperature felt in °C
         */
        windchill: number;
    };
    /**
     * The humidity rate, between 0 and 100
     */
    humidity: number;
    /**
     * The sea level during that period
     */
    sea_level: number;
    /**
     * Stores wind informations
     */
    wind: Wind;
    /**
     * Stores more probabilities about the rain
     */
    rain: Record<string, number>;
    /**
     * Stores more probabilities about the snow
     */
    snow: Record<string, number>;
    /**
     * Freezing level (https://en.wikipedia.org/wiki/Freezing_level)
     */
    iso0: number;
    "rain snow limit": number | string;
    /**
     * The cloudiness rate, between 0 and 100
     */
    clouds: number;
    /**
     * Weather status (icon and label)
     */
    weather: Weather;
}
/**
 * Weather status (icon and label)
 */
export interface Weather {
    /**
     * The icon representing the current weather of the field.
     * You can get its icon as discord icon using the iconToEmoji object, or as SVG
     * at this URL : https://meteofrance.com/modules/custom/mf_tools_common_theme_public/svg/weather/
     * @see iconToEmoji
     */
    icon: string;
    /**
     * The natural language description of the weather
     */
    desc: string;
}

// UNDOCUMENTED ---------------------------------------------------------------
export interface DailyForecast {
    dt: unixTimestamp;
    T: {
        min: number;
        max: number;
        sea: number | null;
    };
    humidity: {
        min: number;
        max: number;
    };
    precipitation: {
        "24h": string;
    };
    uv?: number;
    weather12H: Weather;
    sun: {
        rise: unixTimestamp;
        set: unixTimestamp;
    };
}

export interface Wind {
    speed: number;
    gust: number;
    direction: number;
    icon: string;
}

export interface ProbabilityForecast {
    dt: unixTimestamp;
    rain: Record<string, number>;
    snow: Record<string, number>;
    freezing: number;
}
