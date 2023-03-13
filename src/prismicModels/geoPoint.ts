import { PrismicTypeBase } from "./base.js";

export type PrismicGeoPointType = { lat: number; lon: number } | null;

interface PrismicGeoPointPrismicConfig {
    type: "GeoPoint";
    config: {
        label: string;
    };
}

export interface PrismicGeoPointConfig {
    label: string;
}

interface PrismicResponse {
    latitude?: number;
    longitude?: number;
}

export class PrismicGeoPoint extends PrismicTypeBase<PrismicGeoPointType, PrismicGeoPointPrismicConfig> {
    private config: PrismicGeoPointConfig;

    constructor(config: PrismicGeoPointConfig) {
        super();

        if (!config.label) {
            throw new Error(`Label cannot be empty`);
        }

        this.config = config;
    }

    parse(value: unknown): PrismicGeoPointType {
        if (typeof value !== "object") return null;

        const valueO = value as PrismicResponse;

        if (!valueO.latitude) return null;
        if (!valueO.longitude) return null;
        if (typeof valueO.latitude !== "number") return null;
        if (typeof valueO.longitude !== "number") return null;

        return { lat: valueO.latitude, lon: valueO.longitude };
    }

    getPrismicConfig(): PrismicGeoPointPrismicConfig {
        return {
            type: "GeoPoint",
            config: {
                label: this.config.label,
            },
        };
    }
}

export const prismicGeoPoint = (config: PrismicGeoPointConfig) => new PrismicGeoPoint(config);
