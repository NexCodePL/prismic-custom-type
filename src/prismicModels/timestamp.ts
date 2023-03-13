import { PrismicTypeBase } from "./base.js";

export type PrismicTimestampType = string | null;

interface PrismicTimestampPrismicConfig {
    type: "Timestamp";
    config: {
        label: string;
        placeholder?: string;
        default?: string;
    };
}

export interface PrismicTimestampConfig {
    label: string;
    placeholder?: string;
    default?: string;
}

export class PrismicTimestamp extends PrismicTypeBase<PrismicTimestampType, PrismicTimestampPrismicConfig> {
    private config: PrismicTimestampConfig;

    constructor(config: PrismicTimestampConfig) {
        super();

        if (!config.label) {
            throw new Error(`Label cannot be empty`);
        }

        this.config = config;
    }

    parse(value: unknown): PrismicTimestampType {
        if (typeof value === "string") return value;
        if (typeof value === "number") return value.toString();

        return null;
    }

    getPrismicConfig(): PrismicTimestampPrismicConfig {
        return {
            type: "Timestamp",
            config: {
                label: this.config.label,
                placeholder: this.config.placeholder,
                default: this.config.default,
            },
        };
    }
}

export const prismicTimestamp = (config: PrismicTimestampConfig) => new PrismicTimestamp(config);
