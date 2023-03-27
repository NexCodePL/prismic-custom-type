import { PrismicTypeBase } from "./base.js";
import { LinkMedia } from "./types.js";

export type PrismicLinkMediaType = LinkMedia | null;

interface PrismicLinkMediaPrismicConfig {
    type: "Link";
    config: {
        label: string;
        placeholder?: string;
        select: "media";
        allowTargetBlank: boolean;
    };
}

export interface PrismicLinkMediaConfig {
    label: string;
    placeholder?: string;
    disableTargetBlank?: boolean;
}

interface PrismicResponse {
    link_type: "Media";
    url: string;
}

export class PrismicLinkMedia extends PrismicTypeBase<PrismicLinkMediaType, PrismicLinkMediaPrismicConfig> {
    private config: PrismicLinkMediaConfig;

    constructor(config: PrismicLinkMediaConfig) {
        super();

        if (!config.label) {
            throw new Error(`Label cannot be empty`);
        }

        this.config = config;
    }

    parse(value: unknown): PrismicLinkMediaType {
        if (typeof value !== "object") return null;

        const valueO = value as PrismicResponse;

        if (valueO.link_type !== "Media") return null;
        if (!valueO.url) return null;

        return { type: "media", url: valueO.url };
    }

    getPrismicConfig(): PrismicLinkMediaPrismicConfig {
        return {
            type: "Link",
            config: {
                label: this.config.label,
                placeholder: this.config.placeholder,
                select: "media",
                allowTargetBlank: !this.config.disableTargetBlank,
            },
        };
    }
}

export const prismicLinkMedia = (config: PrismicLinkMediaConfig) => new PrismicLinkMedia(config);
