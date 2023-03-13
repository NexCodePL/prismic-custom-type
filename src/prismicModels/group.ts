import { PrismicTypeBase } from "./base.js";
import {
    PrismicFieldsObject,
    PrismicFieldsObjectConfig,
    prismicFieldsObjectParse,
    prismicFieldsObjectToConfig,
    PrismicFieldsObjectToType,
} from "./index.js";

export type PrismicGroupType<T extends PrismicFieldsObject> = PrismicFieldsObjectToType<T>[];

interface PrismicGroupPrismicConfig {
    type: "Group";
    config: {
        label: string;
        fields: PrismicFieldsObjectConfig;
        repeat: boolean;
    };
}

export interface PrismicGroupConfig<T> {
    label: string;
    fields: T;
    nonRepeat?: boolean;
}

export class PrismicGroup<T extends PrismicFieldsObject> extends PrismicTypeBase<
    PrismicGroupType<T>,
    PrismicGroupPrismicConfig
> {
    private config: PrismicGroupConfig<T>;

    constructor(config: PrismicGroupConfig<T>) {
        super();

        if (!config.label) {
            throw new Error(`Label cannot be empty`);
        }

        this.config = config;
    }

    parse(value: unknown): PrismicGroupType<T> {
        if (typeof value !== "object") return [];
        if (!Array.isArray(value)) return [];

        try {
            const groupItems: PrismicGroupType<T> = [];
            for (const item of value) {
                try {
                    const parsedObject = prismicFieldsObjectParse<T>(this.config.fields, item);
                    groupItems.push(parsedObject);
                } catch (e) {
                    console.log(item, e);
                }
            }

            return groupItems;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    getPrismicConfig(): PrismicGroupPrismicConfig {
        return {
            type: "Group",
            config: {
                label: this.config.label,
                fields: prismicFieldsObjectToConfig(this.config.fields),
                repeat: !this.config.nonRepeat,
            },
        };
    }
}

export const prismicGroup = <T extends PrismicFieldsObject>(config: PrismicGroupConfig<T>) => new PrismicGroup(config);
