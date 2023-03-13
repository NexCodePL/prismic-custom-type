import { GetPrismicTypeBaseType } from "./base.js";
import { PrismicBoolean, prismicBoolean } from "./boolean.js";
import { PrismicColor, prismicColor } from "./color.js";
import { PrismicDate, prismicDate } from "./date.js";
import { PrismicEmbed, prismicEmbed } from "./embed.js";
import { PrismicGeoPoint, prismicGeoPoint } from "./geoPoint.js";
import { prismicGroup, PrismicGroup } from "./group.js";
import { PrismicImage, prismicImage } from "./image.js";
import { PrismicNumber, prismicNumber } from "./number.js";
import {
    PrismicRichText,
    prismicRichText,
    prismicRichTextFormattingDefaultText,
    prismicRichTextFormattingDefaultTextWithHeadings,
    prismicRichTextFormattingDefaultTextWithTitle,
} from "./richText.js";
import { PrismicText, prismicText } from "./text.js";
import { PrismicTimestamp, prismicTimestamp } from "./timestamp.js";
import { PrismicUID, prismicUID } from "./uid.js";

export type PrismicBaseField =
    | PrismicRichText
    | PrismicText
    | PrismicBoolean
    | PrismicColor
    | PrismicDate
    | PrismicEmbed
    | PrismicNumber
    | PrismicGeoPoint
    | PrismicTimestamp
    | PrismicImage;

export type PrismicBaseFieldExtended = PrismicBaseField | PrismicGroup<any> | PrismicUID;

export const P = {
    text: prismicText,
    richText: prismicRichText,
    boolean: prismicBoolean,
    color: prismicColor,
    date: prismicDate,
    embed: prismicEmbed,
    number: prismicNumber,
    geoPoint: prismicGeoPoint,
    timestamp: prismicTimestamp,
    image: prismicImage,
    uid: prismicUID,
    group: prismicGroup,
    richTextFormattingDefaultText: prismicRichTextFormattingDefaultText,
    richTextFormattingDefaultTextWithHeadings: prismicRichTextFormattingDefaultTextWithHeadings,
    richTextFormattingDefaultTextWithTitle: prismicRichTextFormattingDefaultTextWithTitle,
};

export interface PrismicFieldsObject {
    [key: string]: PrismicBaseField;
}

export interface PrismicFieldsObjectExtended {
    [key: string]: PrismicBaseFieldExtended;
}

export interface PrismicFieldsObjectConfig {
    [key: string]: unknown;
}

export function prismicFieldsObjectToConfig(obj: PrismicFieldsObject) {
    const configObject: PrismicFieldsObjectConfig = {};

    for (const [key, prismicField] of Object.entries(obj)) {
        configObject[key] = prismicField.getPrismicConfig();
    }

    return configObject;
}

export function prismicFieldsObjectParse<T extends PrismicFieldsObject>(
    obj: T,
    values: unknown
): PrismicFieldsObjectToType<T> {
    const parsedObject: PrismicFieldsObjectToType<T> = {} as PrismicFieldsObjectToType<T>;

    for (const [key, prismicField] of Object.entries(obj)) {
        if(prismicField)
        parsedObject[key as keyof PrismicFieldsObjectToType<T>] = prismicField.parse((values as any)[key]) as any;
    }

    return parsedObject;
}

export type PrismicFieldsObjectToType<T> = {
    [K in keyof T]: T[K] extends PrismicBaseFieldExtended ? GetPrismicTypeBaseType<T[K]> : never;
};
