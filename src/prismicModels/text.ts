import { PrismicTypeBase } from "./base.js";

export type PrismicTextType = string | null;

interface PrismicTextPrismicConfig {
    type: "Text";
    config: {
        label: string;
        placeholder?: string;
    };
}

export interface PrismicTextConfig {
    label: string;
    placeholder?: string;
}

export class PrismicText extends PrismicTypeBase<PrismicTextType, PrismicTextPrismicConfig> {
    private config: PrismicTextConfig;

    constructor(config: PrismicTextConfig) {
        super();

        if (!config.label) {
            throw new Error(`Label cannot be empty`);
        }

        this.config = config;
    }

    parse(value: unknown): PrismicTextType {
        if (typeof value === "string") return value;
        if (typeof value === "number") return value.toString();

        return null;
    }

    getPrismicConfig(): PrismicTextPrismicConfig {
        return {
            type: "Text",
            config: {
                label: this.config.label,
                placeholder: this.config.placeholder,
            },
        };
    }
}

export const prismicText = (config: PrismicTextConfig) => new PrismicText(config);
