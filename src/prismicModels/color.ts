import { PrismicTypeBase } from "./base.js";

export type PrismicColorType = string | null;

interface PrismicColorPrismicConfig {
    type: "Color";
    config: {
        label: string;
    };
}

export interface PrismicColorConfig {
    label: string;
}

export class PrismicColor extends PrismicTypeBase<PrismicColorType, PrismicColorPrismicConfig> {
    private config: PrismicColorConfig;

    constructor(config: PrismicColorConfig) {
        super();

        if (!config.label) {
            throw new Error("Label cannot be empty");
        }
        this.config = config;
    }

    parse(value: unknown): PrismicColorType {
        if (typeof value === "string") return value;
        if (typeof value === "number") return value.toString();

        return null;
    }

    getPrismicConfig(): PrismicColorPrismicConfig {
        return {
            type: "Color",
            config: {
                label: this.config.label,
            },
        };
    }
}

export const prismicColor = (config: PrismicColorConfig) => new PrismicColor(config);
