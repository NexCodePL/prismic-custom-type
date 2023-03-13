import { PrismicTypeBase } from "./base.js";

interface PrismicRichTextSpan {
  start: number;
  end: number;
  type: string;
  text: string;
}

interface PrismicRichTextBlock {
  type: string;
  text: string;
  spans: PrismicRichTextSpan[];
}

export type PrismicRichTextType = PrismicRichTextBlock[] | unknown[] | string;

type PrismicRichTextConfigFormattingOption =
  | "paragraph"
  | "preformatted"
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "heading6"
  | "strong"
  | "em"
  | "hyperlink"
  | "image"
  | "embed"
  | "list-item"
  | "o-list-item"
  | "rtl";

export const prismicRichTextFormattingDefaultText: PrismicRichTextConfigFormattingOption[] =
  ["em", "embed", "paragraph", "hyperlink", "list-item", "o-list-item"];

export const prismicRichTextFormattingDefaultTextWithHeadings: PrismicRichTextConfigFormattingOption[] =
  [
    ...prismicRichTextFormattingDefaultText,
    "heading2",
    "heading3",
    "heading4",
    "heading5",
    "heading6",
  ];

export const prismicRichTextFormattingDefaultTextWithTitle: PrismicRichTextConfigFormattingOption[] =
  [...prismicRichTextFormattingDefaultTextWithHeadings, "heading1"];

interface PrismicRichTextPrismicConfig {
  type: "StructuredText";
  config: {
    placeholder?: string;
    label: string;
    labels?: string[];
    single?: string;
    multi?: string;
    imageConstraint?: {
      width?: number;
      height?: number;
    };
  };
}

export interface PrismicRichTextConfig {
  label: string;
  placeholder?: string;
  formattingOptions: PrismicRichTextConfigFormattingOption[];
  imageConstraint?: {
    width?: number;
    height?: number;
  };
  singleParagraph?: boolean;
}

export class PrismicRichText extends PrismicTypeBase<
  PrismicRichTextType,
  PrismicRichTextPrismicConfig
> {
  private config: PrismicRichTextConfig;

  constructor(config: PrismicRichTextConfig) {
    super();

    if (!config.label) {
      throw new Error(`Label cannot be empty`);
    }

    this.config = config;
  }

  parse(value: unknown): PrismicRichTextType {
    if (typeof value === "string") return value;
    if (typeof value === "object" && Array.isArray(value)) return value;

    return [];
  }

  getPrismicConfig(): PrismicRichTextPrismicConfig {
    return {
      type: "StructuredText",
      config: {
        label: this.config.label,
        placeholder: this.config.placeholder,
        ...(this.config.singleParagraph
          ? { single: this.config.formattingOptions.join(", ") }
          : { multi: this.config.formattingOptions.join(", ") }),
        imageConstraint: this.config.imageConstraint,
      },
    };
  }
}

export const prismicRichText = (config: PrismicRichTextConfig) =>
  new PrismicRichText(config);
