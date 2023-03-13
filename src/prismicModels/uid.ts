import { PrismicTypeBase } from "./base.js";

export type PrismicUIDType = string | null;

interface PrismicUIDPrismicConfig {
    type: "UID";
    config: {
        label: string;
        placeholder?: string;
    };
}

export interface PrismicUIDConfig {
    label: string;
    placeholder?: string;
}

export class PrismicUID extends PrismicTypeBase<PrismicUIDType, PrismicUIDPrismicConfig> {
    private config: PrismicUIDConfig;

    constructor(config: PrismicUIDConfig) {
        super();

        if (!config.label) {
            throw new Error(`Label cannot be empty`);
        }

        this.config = config;
    }

    parse(value: unknown): PrismicUIDType {
        if (typeof value === "string") return value;
        if (typeof value === "number") return value.toString();

        return null;
    }

    getPrismicConfig(): PrismicUIDPrismicConfig {
        return {
            type: "UID",
            config: {
                label: this.config.label,
                placeholder: this.config.placeholder,
            },
        };
    }
}

export const prismicUID = (config: PrismicUIDConfig) => new PrismicUID(config);
