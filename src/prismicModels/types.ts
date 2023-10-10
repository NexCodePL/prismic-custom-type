export interface ImageData {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
    copyright?: string;
}

interface LinkBase<T extends string> {
    type: T;
}

export interface LinkDocument extends LinkBase<"document"> {
    id: string;
}

export interface LinkWeb extends LinkBase<"web"> {
    url: string;
}

export interface LinkMedia extends LinkBase<"media"> {
    url: string;
}

export type Link = LinkDocument | LinkWeb | LinkMedia;
