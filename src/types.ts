export interface PrismicItemRawAlternateLanguage {
    id: string;
    type: string;
    lang: string;
    uid?: string | null;
}

export interface PrismicItemRaw {
    id: string;
    uid?: string | null;
    type: string;
    alternate_languages: PrismicItemRawAlternateLanguage[];
    data: any;
}
