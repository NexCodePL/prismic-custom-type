import { PrismicTypeBase } from "./base.js";

export type PrismicBooleanType = boolean;

interface PrismicBooleanPrismicConfig {
    type: "Boolean";
    config: {
        placeholder_false?: string;
        placeholder_true?: string;
        default_value?: boolean;
        label: string;
    };
}

export interface PrismicBooleanConfig {
    placeholderTrue?: string;
    placeholderFalse?: string;
    defaultValue?: boolean;
    label: string;
}

export class PrismicBoolean extends PrismicTypeBase<PrismicBooleanType, PrismicBooleanPrismicConfig> {
    private config: PrismicBooleanConfig;

    constructor(config: PrismicBooleanConfig) {
        super();

        if (!config.label) {
            throw new Error(`Label cannot be empty`);
        }

        this.config = config;
    }

    parse(value: unknown): PrismicBooleanType {
        if (typeof value === "boolean") return !!value;

        return false;
    }

    getPrismicConfig(): PrismicBooleanPrismicConfig {
        return {
            type: "Boolean",
            config: {
                label: this.config.label,
                default_value: this.config.defaultValue,
                placeholder_false: this.config.placeholderFalse,
                placeholder_true: this.config.placeholderTrue,
            },
        };
    }
}

export const prismicBoolean = (config: PrismicBooleanConfig) => new PrismicBoolean(config);
