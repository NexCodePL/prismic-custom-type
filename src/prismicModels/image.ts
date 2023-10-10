import { PrismicTypeBase } from "./base.js";
import { ImageData } from "./types.js";

export type PrismicImageType = ImageData | null;

interface PrismicImagePrismicConfig {
    type: "Image";
    config: {
        constraint?: {
            width: number;
            height: number;
        };

        thumbnails?: {
            name: string;
            width: number;
            heigth: number;
        }[];
        label: string;
        placeholder?: string;
    };
}

export interface PrismicImageConfig {
    label: string;
    placeholder?: string;

    constraint?: {
        width: number;
        height: number;
    };

    thumbnails?: {
        name: string;
        width: number;
        heigth: number;
    }[];
}

interface PrismicResponse {
    dimensions?: {
        width?: number;
        height?: number;
    };
    alt?: string | null;
    copyright?: string | null;
    url?: string | null;
}

export class PrismicImage extends PrismicTypeBase<PrismicImageType, PrismicImagePrismicConfig> {
    private config: PrismicImageConfig;

    constructor(config: PrismicImageConfig) {
        super();

        if (!config.label) {
            throw new Error("Label cannot be empty");
        }

        this.config = config;
    }

    parse(value: unknown): PrismicImageType {
        if (typeof value !== "object") return null;

        const valueO = value as PrismicResponse;

        if (!valueO.url) return null;
        if (typeof valueO.url !== "string") return null;

        return {
            url: valueO.url,
            alt: valueO.alt ?? undefined,
            width: valueO.dimensions?.width ?? undefined,
            height: valueO.dimensions?.height ?? undefined,
            copyright: valueO.copyright ?? undefined,
        };
    }

    getPrismicConfig(): PrismicImagePrismicConfig {
        return {
            type: "Image",
            config: {
                label: this.config.label,
                placeholder: this.config.placeholder,
                constraint: this.config.constraint,
                thumbnails: this.config.thumbnails,
            },
        };
    }
}

export const prismicImage = (config: PrismicImageConfig) => new PrismicImage(config);
