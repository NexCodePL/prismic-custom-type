import { PrismicTypeBase } from "./base.js";
import { CustomType } from "../customType.js";
import { LinkDocument } from "./types.js";

export type PrismicContentRealtionshipType = LinkDocument | null;

interface PrismicContentRelationshipPrismicConfig {
    type: "Link";
    config: {
        label: string;
        placeholder?: string;
        select: "document";
        customtypes: string[];
        tags: string[];
    };
}

export interface PrismicContentRelationshipConfig {
    label: string;
    placeholder?: string;
    customTypes: (CustomType<any, any> | string )[];
    tags?: string[];
}

interface PrismicResponse {
    id: string;
    type: string;
    tags: string[];
    lang: string;
    uid: string;
    link_type: "Document";
    isBroken?: boolean;
}

export class PrismicContentRelationship extends PrismicTypeBase<
    PrismicContentRealtionshipType,
    PrismicContentRelationshipPrismicConfig
> {
    private config: PrismicContentRelationshipConfig;

    constructor(config: PrismicContentRelationshipConfig) {
        super();

        if (!config.label) {
            throw new Error(`Label cannot be empty`);
        }

        this.config = config;
    }

    parse(value: unknown): PrismicContentRealtionshipType {
        if (typeof value !== "object") return null;

        const valueO = value as PrismicResponse;

        if (valueO.isBroken) return null;
        if (valueO.link_type !== "Document") return null;
        if (!valueO.id) return null;

        return { type: "document", id: valueO.id };
    }

    getPrismicConfig(): PrismicContentRelationshipPrismicConfig {
        return {
            type: "Link",
            config: {
                label: this.config.label,
                placeholder: this.config.placeholder,
                select: "document",
                customtypes: this.config.customTypes.map(ct => typeof ct === "string" ? ct : ct.getId()),
                tags: this.config.tags ?? [],
            },
        };
    }
}

export const prismicContentRelationship = (config: PrismicContentRelationshipConfig) =>
    new PrismicContentRelationship(config);
