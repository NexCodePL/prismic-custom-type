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
    lang: string;
    alternate_languages: PrismicItemRawAlternateLanguage[];
    data: any;
}
