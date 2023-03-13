import { PrismicTypeBase } from "./base.js";

export type PrismicNumberType = number | null;

interface PrismicNumberPrismicConfig {
    type: "Number";
    config: {
        placeholder?: string;
        label: string;
        min?: number;
        max?: number;
    };
}

export interface PrismicNumberConfig {
    label: string;
    placeholder?: string;
    min?: number;
    max?: number;
}

export class PrismicNumber extends PrismicTypeBase<PrismicNumberType, PrismicNumberPrismicConfig> {
    private config: PrismicNumberConfig;

    constructor(config: PrismicNumberConfig) {
        super();

        if (!config.label) {
            throw new Error("Label cannto be empty");
        }

        this.config = config;
    }

    parse(value: unknown): PrismicNumberType {
        if (typeof value === "number") return value;

        return null;
    }

    getPrismicConfig(): PrismicNumberPrismicConfig {
        return {
            type: "Number",
            config: {
                label: this.config.label,
                placeholder: this.config.placeholder,
                max: this.config.max,
                min: this.config.min,
            },
        };
    }
}

export const prismicNumber = (config: PrismicNumberConfig) => new PrismicNumber(config);
