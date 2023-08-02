import { CustomType, GetCustomTypeType, CustomTypeItemType, CustomTypeConfigTabType } from "../customType.js";
import { CustomSlice, CustomSliceType } from "../customSlice.js";
import { sliceFragment, SliceFragmentType } from "./SliceFragment.js";

export type FragmentType = GetCustomTypeType<ReturnType<typeof getFragment>["fragment"]>;

export type FragmentMap = Record<string, FragmentType>;
export type FragmentSlice = CustomSliceType<any, any, any, any>;
export type FragmentSlicesMap = Record<string, FragmentSlice[]>;

export function getFragment<T extends CustomSlice<string, any, any>>(slices: T[]) {
    const fragment = new CustomType({
        id: "Fragment",
        label: "Fragment",
        repeateable: true,
        tabs: {
            Main: {
                fields: {},
                slices: [sliceFragment, ...slices],
            },
        },
    });

    function prepareFragmentMap(items: any[]): FragmentSlicesMap {
        const fragmentSlicesMap: FragmentSlicesMap = {};
        const fragmentsMap: FragmentMap = {};

        // generate fragments map
        for (const item of items) {
            if (fragment.isRaw(item)) {
                const fragmentParsed = fragment.parse(item);
                if (!fragmentParsed) continue;

                fragmentsMap[fragmentParsed.id] = fragmentParsed;
            }
        }

        for (const [fragmentId, fragment] of Object.entries(fragmentsMap)) {
            const slices = getSlicesForFragment([fragment.id], fragment, fragmentsMap);
            fragmentSlicesMap[fragmentId] = slices;
        }

        return fragmentSlicesMap;
    }

    function replaceFragments(item: CustomTypeItemType<any, any>, fragmentsMap: FragmentSlicesMap) {
        for (const tab of Object.values<CustomTypeConfigTabType<any, SliceFragmentType[]>>(item.tabs)) {
            for (let i = tab.slices.length - 1; i >= 0; i--) {
                const slice = tab.slices[i];

                if (!slice) continue;

                if (slice.type === "fragment") {
                    const fragmentId = slice.nonRepeat.fragment?.id;
                    if (!fragmentId) continue;
                    const fragmentSlices = fragmentsMap[fragmentId] ?? [];

                    tab.slices.splice(i, 1, ...fragmentSlices);
                }
            }
        }
    }

    function getSlicesForFragment(
        visitedFragments: string[],
        fragment: FragmentType,
        fragmentMap: FragmentMap
    ): FragmentSlice[] {
        const slices: FragmentSlice[] = [];

        for (const slice of fragment.tabs.Main.slices) {
            if (slice.type === "fragment") {
                const fragmentId = (!slice.nonRepeat.fragment as any)?.id;
                if (!fragmentId) continue;
                if (visitedFragments.includes(fragmentId)) continue;
                const refFragment = fragmentMap[fragmentId];
                if (!refFragment) continue;
                slices.push(...getSlicesForFragment([...visitedFragments, fragment.id], refFragment, fragmentMap));
            } else {
                slices.push(slice);
            }
        }

        return slices;
    }

    return { fragment, prepareFragmentMap, replaceFragments };
}
