export abstract class PrismicTypeBase<TReturnType, TPrismicConfig> {
    abstract parse(value: unknown): TReturnType;
    abstract getPrismicConfig(): TPrismicConfig;
}

export type GetPrismicTypeBaseType<T extends PrismicTypeBase<any, any>> = T extends PrismicTypeBase<
    infer TReturnType,
    any
>
    ? TReturnType
    : never;
