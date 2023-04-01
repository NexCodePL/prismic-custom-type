import {
    prismicFieldsObjectParse,
    PrismicFieldsObjectToType,
    PrismicFieldsObjectExtended,
    prismicFieldsObjectToConfig,
} from "./prismicModels/index.js";
import { CustomSlice, GetCustomSliceType } from "./customSlice.js";

// Prismic output types
interface CustomTypePrismicConfigTab {
    [key: string]:
        | unknown
        | {
              type: "Slices";
              fieldset: "Slice zone";
              config: {
                  labels: null;
                  choices: CustomTypePrismicConfigTabBodySlices;
              };
          };
}

interface CustomTypePrismicConfigTabBodySlices {
    [key: string]: unknown;
}

interface CustomTypePrismicJsonConfig {
    [key: string]: CustomTypePrismicConfigTab;
}

interface CustomTypePrismicConfig {
    id: string;
    label: string;
    repeatable: boolean;
    json: CustomTypePrismicJsonConfig;
    status: boolean;
}

// Our internal types

export interface CustomTypeConfigTab<
    TFields extends PrismicFieldsObjectExtended,
    TSlices extends CustomSlice<any, any, any>[]
> {
    fields: TFields;
    slices: TSlices;
}
export interface CustomTypeConfigTabObject {
    [key: string]: CustomTypeConfigTab<any, any>;
}

export interface CustomTypeConfig<TId extends string, TTabs extends CustomTypeConfigTabObject> {
    id: TId;
    label: string;
    repeateable: boolean;
    tabs: TTabs;
}

interface CustomTypeConfigTabType<TFields, TSlices> {
    fields: TFields;
    slices: TSlices;
}

interface CustomTypeItemAlternateLocale {
    id: string;
    locale: string;
}

interface CustomTypeItemType<TId, TTabs> {
    id: string;
    uid: string | null;
    customType: TId;
    tabs: TTabs;
    alternateLocales: CustomTypeItemAlternateLocale[];
}

type MapArray<T> = T extends Array<infer TItem> ? TItem : never;

type GetCustomTypeTTab<TTab> = {
    [K in keyof TTab]: TTab[K] extends CustomTypeConfigTab<infer TFields, infer TSlices>
        ? CustomTypeConfigTabType<PrismicFieldsObjectToType<TFields>, Array<GetCustomSliceType<MapArray<TSlices>>>>
        : never;
};

type GetTabType<TTab> = TTab extends CustomTypeConfigTab<infer TFields, infer TSlices>
    ? CustomTypeConfigTabType<PrismicFieldsObjectToType<TFields>, Array<GetCustomSliceType<MapArray<TSlices>>>>
    : never;

interface PrismicCustomTypeRawAlternateLanguage {
    id: string;
    type: string;
    lang: string;
    uid?: string | null;
}

interface PrismicCustomTypeRaw {
    id: string;
    uid?: string | null;
    type: string;
    alternate_languages: PrismicCustomTypeRawAlternateLanguage[];
    data: any;
}

export type GetCustomTypeType<T> = T extends CustomType<infer TId, infer TTabs>
    ? CustomTypeItemType<TId, GetCustomTypeTTab<TTabs>>
    : never;

export class CustomType<TId extends string, TTabs extends CustomTypeConfigTabObject> {
    private config: CustomTypeConfig<TId, TTabs>;

    constructor(config: CustomTypeConfig<TId, TTabs>) {
        this.config = config;

        checkTabsForSliceDuplicates(this.config.tabs);
    }

    getId() {
        return this.config.id;
    }

    getConfig(): CustomTypePrismicConfig {
        return {
            id: this.config.id,
            label: this.config.label,
            repeatable: this.config.repeateable,
            status: true,
            json: prepareJson(this.config.tabs),
        };
    }

    parse(typeRaw: PrismicCustomTypeRaw): CustomTypeItemType<TId, GetCustomTypeTTab<TTabs>> | null {
        if (typeRaw.type !== this.getId()) return null;

        const tabs: GetCustomTypeTTab<TTabs> = {} as GetCustomTypeTTab<TTabs>;

        for (const [key, tab] of Object.entries(this.config.tabs)) {
            const slices = (typeRaw?.data?.[`body_${key}`] ?? [])
                .map((sliceRaw: { slice_type: string }) => {
                    for (const customSlice of tab.slices as CustomSlice<any, any, any>[]) {
                        if (sliceRaw.slice_type === customSlice.getType()) {
                            return customSlice.parse(sliceRaw as any);
                        }
                    }

                    return null;
                })
                .filter((e: any) => e !== null);

            const parsedTab: GetTabType<typeof tab> = {
                fields: prismicFieldsObjectParse(tab.fields, typeRaw.data),
                slices: slices,
            };
            (tabs as any)[key] = parsedTab;
        }

        const alternateLocales = typeRaw.alternate_languages.map<CustomTypeItemAlternateLocale>(al => ({
            id: al.id,
            locale: al.lang,
        }));

        const item: CustomTypeItemType<TId, GetCustomTypeTTab<TTabs>> = {
            id: typeRaw.id,
            uid: typeRaw.uid ?? null,
            alternateLocales: alternateLocales,
            customType: this.getId(),
            tabs: tabs,
        };

        return item;
    }

    is(item: unknown): item is CustomType<TId, TTabs> {
        if (!item) return false;
        if (typeof item !== "object") return false;

        return (item as any)?.type === this.config.id;
    }

    isRaw(item: PrismicCustomTypeRaw): boolean {
        return item?.type === this.getId();
    }
}

function prepareJson(config: CustomTypeConfigTabObject): CustomTypePrismicJsonConfig {
    const json: CustomTypePrismicJsonConfig = {};

    const fieldsNames: string[] = [];

    for (const [key, tab] of Object.entries(config)) {
        const { prismicTab, tabFieldNames } = parseTab(tab, key);

        for (const tabFieldName of tabFieldNames) {
            if (fieldsNames.includes(tabFieldName)) {
                throw new Error(`Tab ${key} has duplicated field: ${tabFieldName}`);
            }
            fieldsNames.push(tabFieldName);
        }

        json[key] = prismicTab;
    }

    return json;
}

function parseTab(tab: CustomTypeConfigTab<any, any>, key: string) {
    const tabFieldNames: string[] = [];

    tabFieldNames.push(...Object.keys(tab.fields));

    const body =
        tab.slices.length > 0
            ? {
                  [`body_${key}`]: {
                      type: "Slices",
                      fieldset: "Slice zone",
                      config: {
                          labels: null,
                          choices: parseSlices(tab),
                      },
                  },
              }
            : {};

    const prismicTab: CustomTypePrismicConfigTab = {
        ...prismicFieldsObjectToConfig(tab.fields),
        ...body,
    };

    return { prismicTab, tabFieldNames };
}

function parseSlices(tab: CustomTypeConfigTab<any, any>): CustomTypePrismicConfigTabBodySlices | undefined {
    if (tab.slices.length === 0) return undefined;

    const slices: CustomTypePrismicConfigTabBodySlices = {};

    for (const slice of tab.slices) {
        const sliceType = slice.getType();

        slices[sliceType] = slice.getConfig();
    }

    return slices;
}

function checkTabsForSliceDuplicates(tabs: CustomTypeConfigTabObject) {
    for (const [key, tab] of Object.entries(tabs)) {
        const duplicatedSlices = checkForSliceDuplicates(tab.slices);

        if (duplicatedSlices.length > 0) {
            throw new Error(`Tab '${key}' contains duplicated slices: [${duplicatedSlices.join(", ")}]`);
        }
    }
}

function checkForSliceDuplicates(slices: CustomSlice<any, any, any>[]) {
    const existingSlicesTypes: string[] = [];
    const duplicatedSlicesTypes: string[] = [];

    for (const slice of slices) {
        const sliceType = slice.getType();

        if (existingSlicesTypes.includes(sliceType)) {
            duplicatedSlicesTypes.push(sliceType);
        } else {
            existingSlicesTypes.push(sliceType);
        }
    }

    return duplicatedSlicesTypes;
}
