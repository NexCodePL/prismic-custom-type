import { CustomSlice, GetCustomSliceType } from "../customSlice.js";
import { P } from "../prismicModels/index.js";

export type SliceFragmentType = GetCustomSliceType<typeof sliceFragment>;

export const sliceFragment = new CustomSlice({
    name: "Fragment",
    type: "fragment",
    nonRepeat: {
        fragment: P.contentRelationship({ label: "Fragment", customTypes: ["fragment"] }),
    },
});
