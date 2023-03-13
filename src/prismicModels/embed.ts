import { PrismicTypeBase } from "./base.js";
import { ImageData } from "./types.js";

export type PrismicEmbedType = PrismicEmbedData | null;

interface PrismicEmbedData {
    embedUrl: string;
    thumbnail?: ImageData;
}

interface PrismicEmbedPrismicConfig {
    type: "Embed";
    config: {
        label: string;
        placeholder?: string;
    };
}

export interface PrismicEmbedConfig {
    label: string;
    placeholder?: string;
}

interface PrismicResponse {
    provider_name: string;
    provider_url: string;
    title: string;
    author_name: string;
    author_url: string;
    type: string;
    height: number;
    width: number;
    version: string;
    thumbnail_height: number;
    thumbnail_width: number;
    thumbnail_url: string;
    html: string;
    embed_url: string;
}

export class PrismicEmbed extends PrismicTypeBase<PrismicEmbedType, PrismicEmbedPrismicConfig> {
    private config: PrismicEmbedConfig;

    constructor(config: PrismicEmbedConfig) {
        super();

        if (!config.label) {
            throw new Error("Label cannot be empty");
        }

        this.config = config;
    }

    parse(value: unknown): PrismicEmbedType {
        if (typeof value !== "object") return null;

        const valueO = value as PrismicResponse;

        if (!valueO.embed_url) return null;
        if (typeof valueO.embed_url !== "string") return null;

        const thumbnail: ImageData | undefined =
            !!valueO.thumbnail_url && typeof valueO.thumbnail_url === "string"
                ? { url: valueO.thumbnail_url, height: valueO.thumbnail_height, width: valueO.thumbnail_width }
                : undefined;

        return { embedUrl: valueO.embed_url, thumbnail };
    }

    getPrismicConfig(): PrismicEmbedPrismicConfig {
        return {
            type: "Embed",
            config: {
                label: this.config.label,
                placeholder: this.config.placeholder,
            },
        };
    }
}

export const prismicEmbed = (config: PrismicEmbedConfig) => new PrismicEmbed(config);
