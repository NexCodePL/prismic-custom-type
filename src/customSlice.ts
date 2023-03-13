import {
    PrismicFieldsObject,
    prismicFieldsObjectParse,
    prismicFieldsObjectToConfig,
    PrismicFieldsObjectToType,
} from "./prismicModels/index.js";

export interface CustomSliceConfig<
    TType extends string,
    TNonRepeat extends PrismicFieldsObject,
    TRepeat extends PrismicFieldsObject
> {
    type: TType;
    name: string;
    description?: string;
    icon?: string;
    nonRepeat?: TNonRepeat;
    repeat?: TRepeat;
}

export interface CustomSliceRaw {
    slice_type: string;
    primary: unknown;
    items: unknown[];
}

export class CustomSlice<
    TType extends string,
    TNonRepeat extends PrismicFieldsObject,
    TRepeat extends PrismicFieldsObject
> {
    private config: CustomSliceConfig<TType, TNonRepeat, TRepeat>;

    constructor(config: CustomSliceConfig<TType, TNonRepeat, TRepeat>) {
        if (!config.nonRepeat) config.nonRepeat = {} as any;
        if (!config.repeat) config.repeat = {} as any;

        this.config = config;
    }

    getType() {
        return this.config.type;
    }

    getConfig() {
        return {
            type: "Slice",
            fieldset: this.config.name,
            description: this.config.description ?? this.config.name,
            icon: this.config.icon ?? "add",
            display: "list",
            "non-repeat": prismicFieldsObjectToConfig(this.config.nonRepeat ?? {}),
            repeat: prismicFieldsObjectToConfig(this.config.repeat ?? {}),
        };
    }

    parse(sliceRaw: CustomSliceRaw): CustomSliceType<TType, TNonRepeat, TRepeat> | null {
        if (sliceRaw.slice_type !== this.getType()) return null;

        return {
            type: this.config.type,
            nonRepeat: prismicFieldsObjectParse<TNonRepeat>(this.config.nonRepeat as TNonRepeat, sliceRaw.primary),
            repeat: sliceRaw.items.map(i => prismicFieldsObjectParse<TRepeat>(this.config.repeat as TRepeat, i)),
        };
    }

    is(value: unknown): value is CustomSliceType<TType, TNonRepeat, TRepeat> {
        if (!value) return false;
        if (typeof value !== "object") return false;
        return (value as any)?.type === this.config.type;
    }
}

export interface CustomSliceType<TType, TNonRepeat, TRepeat> {
    type: TType;
    nonRepeat: PrismicFieldsObjectToType<TNonRepeat>;
    repeat: PrismicFieldsObjectToType<TRepeat>[];
}

export type GetCustomSliceType<T extends CustomSlice<any, any, any>> = T extends CustomSlice<
    infer TType,
    infer TNonRepeat,
    infer TRepeat
>
    ? CustomSliceType<TType, TNonRepeat, TRepeat>
    : never;
