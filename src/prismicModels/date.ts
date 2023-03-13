import { PrismicTypeBase } from "./base.js";

export type PrismicDateType = string | null;

interface PrismicDatePrismicConfig {
    type: "Date";
    config: {
        label: string;
        default?: string;
    };
}

export interface PrismicDateConfig {
    label: string;
    default?: string;
}

export class PrismicDate extends PrismicTypeBase<PrismicDateType, PrismicDatePrismicConfig> {
    private config: PrismicDateConfig;

    constructor(config: PrismicDateConfig) {
        super();

        if (!config.label) {
            throw new Error("Label cannot be empty");
        }

        this.config = config;
    }

    parse(value: unknown): PrismicDateType {
        if (typeof value === "string") return value;
        if (typeof value === "number") return value.toString();

        return null;
    }

    getPrismicConfig(): PrismicDatePrismicConfig {
        return {
            type: "Date",
            config: {
                label: this.config.label,
                default: this.config.default,
            },
        };
    }
}

export const prismicDate = (config: PrismicDateConfig) => new PrismicDate(config);
