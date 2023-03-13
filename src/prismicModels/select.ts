import { PrismicTypeBase } from "./base.js";

export type PrismicSelectType = string | null;

interface PrismicSelectPrismicConfig {
    type: "Select";
    config: {
        options?: string[];
        default_value?: string;
        label: string;
    };
}

export interface PrismicSelectConfig {
    label: string;
    defaultValue: string;
    options: string[];
}

export class PrismicSelect extends PrismicTypeBase<PrismicSelectType, PrismicSelectPrismicConfig> {
    private config: PrismicSelectConfig;

    constructor(config: PrismicSelectConfig) {
        super();

        if (!config.label) {
            throw new Error("Label cannot be empty");
        }

        this.config = config;
    }

    parse(value: unknown): PrismicSelectType {
        if (typeof value === "string") return value;

        return null;
    }

    getPrismicConfig(): PrismicSelectPrismicConfig {
        return {
            type: "Select",
            config: {
                label: this.config.label,
                default_value: this.config.defaultValue,
                options: this.config.options,
            },
        };
    }
}
