import { PrismicTypeBase } from "./base.js";
import { Link } from "./types.js";

export type PrismicLinkType = Link | null;

interface PrismicLinkPrismicConfig {
    type: "Link";
    config: {
        label: string;
        placeholder?: string;
        select: "web";
        allowTargetBlank: boolean;
    };
}

export interface PrismicLinkConfig {
    label: string;
    placeholder?: string;
    disableTargetBlank?: boolean;
}

interface PrismicResponseDocument {
    id: string;
    type: string;
    tags: string[];
    lang: string;
    uid: string;
    link_type: "Document";
    isBroken?: boolean;
}

interface PrismicResponseWeb {
    link_type: "Web";
    url: string;
}

interface PrismicResponseMedia {
    link_type: "Media";
    url: string;
}

type PrismicResponse = PrismicResponseDocument | PrismicResponseWeb | PrismicResponseMedia;

export class PrismicLink extends PrismicTypeBase<PrismicLinkType, PrismicLinkPrismicConfig> {
    private config: PrismicLinkConfig;

    constructor(config: PrismicLinkConfig) {
        super();

        if (!config.label) {
            throw new Error(`Label cannot be empty`);
        }

        this.config = config;
    }

    parse(value: unknown): PrismicLinkType {
        if (typeof value !== "object") return null;

        const valueO = value as PrismicResponse;

        if (!valueO.link_type) return null;

        switch (valueO.link_type) {
            case "Document":
                if (valueO.isBroken) return null;
                if (valueO.link_type !== "Document") return null;
                if (!valueO.id) return null;

                return { type: "document", id: valueO.id };

            case "Web":
                if (!valueO.url) return null;
                return { type: "web", url: valueO.url };

            case "Media":
                if (!valueO.url) return null;
                return { type: "media", url: valueO.url };

            default:
                return null;
        }
    }

    getPrismicConfig(): PrismicLinkPrismicConfig {
        return {
            type: "Link",
            config: {
                label: this.config.label,
                placeholder: this.config.placeholder,
                select: "web",
                allowTargetBlank: !this.config.disableTargetBlank,
            },
        };
    }
}

export const prismicLink = (config: PrismicLinkConfig) => new PrismicLink(config);
