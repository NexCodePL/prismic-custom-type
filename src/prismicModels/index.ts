import { GetPrismicTypeBaseType } from "./base.js";
import { PrismicBoolean, prismicBoolean } from "./boolean.js";
import { PrismicColor, prismicColor } from "./color.js";
import { PrismicContentRelationship, prismicContentRelationship } from "./contentRelationship.js";
import { PrismicDate, prismicDate } from "./date.js";
import { PrismicEmbed, prismicEmbed } from "./embed.js";
import { PrismicGeoPoint, prismicGeoPoint } from "./geoPoint.js";
import { prismicGroup, PrismicGroup } from "./group.js";
import { PrismicImage, prismicImage } from "./image.js";
import { PrismicLink, prismicLink } from "./link.js";
import { PrismicLinkMedia, prismicLinkMedia } from "./linkMedia.js";
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

export * from "./base.js";
export * from "./boolean.js";
export * from "./color.js";
export * from "./contentRelationship.js";
export * from "./date.js";
export * from "./embed.js";
export * from "./geoPoint.js";
export * from "./group.js";
export * from "./image.js";
export * from "./link.js";
export * from "./linkMedia.js";
export * from "./number.js";
export * from "./richText.js";
export * from "./select.js";
export * from "./text.js";
export * from "./timestamp.js";
export * from "./types.js";
export * from "./uid.js";

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
    | PrismicImage
    | PrismicContentRelationship
    | PrismicLink
    | PrismicLinkMedia;

export type PrismicBaseFieldExtended = PrismicBaseField | PrismicGroup<any> | PrismicUID;

export const P = {
    boolean: prismicBoolean,
    color: prismicColor,
    contentRelationship: prismicContentRelationship,
    date: prismicDate,
    embed: prismicEmbed,
    geoPoint: prismicGeoPoint,
    group: prismicGroup,
    image: prismicImage,
    link: prismicLink,
    linkMedia: prismicLinkMedia,
    number: prismicNumber,
    richText: prismicRichText,
    uid: prismicUID,
    timestamp: prismicTimestamp,
    text: prismicText,
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
        if (prismicField)
            parsedObject[key as keyof PrismicFieldsObjectToType<T>] = prismicField.parse((values as any)[key]) as any;
    }

    return parsedObject;
}

export type PrismicFieldsObjectToType<T> = {
    [K in keyof T]: T[K] extends PrismicBaseFieldExtended ? GetPrismicTypeBaseType<T[K]> : never;
};
