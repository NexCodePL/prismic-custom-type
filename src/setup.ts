import axios, { AxiosResponse } from "axios";
import fetch from "node-fetch";
import { createClient, getRepositoryEndpoint } from "@prismicio/client";
import { writeFile } from "@nexcodepl/fs";
import { CustomType } from "./customType.js";
import { PrismicItemRaw } from "./types.js";

export interface SetupConfig {
    repository: string;
    token: string;
    customTypesToken: string;
}

type PrismicCustomTypeResponse = { id: string }[];

export class Setup<T extends CustomType<any, any>[]> {
    private customTypes: T;
    private config: SetupConfig;

    constructor(config: SetupConfig, customTypes: T) {
        this.checkForCustomTypesDuplicates(customTypes);

        this.customTypes = customTypes;
        this.config = config;
    }

    async deploy() {
        await this.deployCustomTypes();
    }

    async load() {
        const results: PrismicItemRaw[] = [];
        const endpoint = getRepositoryEndpoint(this.config.repository);
        const client = createClient(endpoint, { accessToken: this.config.token, fetch });

        let pageIndex = 1;

        while (pageIndex !== -1) {
            const response = await client.get({ pageSize: 100, lang: "*", page: pageIndex });

            results.push(...response.results);

            if (response.total_pages > pageIndex) {
                pageIndex++;
            } else {
                pageIndex = -1;
            }
        }

        return results as PrismicItemRaw[];
    }

    private async getExistingCustomTypes() {
        try {
            const response: AxiosResponse<PrismicCustomTypeResponse> = await axios({
                url: `https://customtypes.prismic.io/customtypes`,
                headers: {
                    ...this.getPrismicCustomTypesAPIHeaders(),
                },
            });

            const customTypes = response.data;

            await writeFile(
                `./custom-types-snapshots/${this.config.repository}-custom-types-snapshot-${Date.now()}.json`,
                JSON.stringify(response.data)
            );

            return customTypes;
        } catch (e) {
            console.log(e);
            throw new Error(`Cannot get all CustomTypes from Prismic`);
        }
    }

    private async insertCustomType(customType: CustomType<any, any>) {
        try {
            await axios({
                url: `https://customtypes.prismic.io/customtypes/insert`,
                method: "POST",
                headers: {
                    ...this.getPrismicCustomTypesAPIHeaders(),
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(customType.getConfig()),
            });
        } catch (e) {
            console.log(e);
            throw new Error(`Cannot insert CustomType with ID: ${customType.getId()}`);
        }
    }

    private async updateCustomType(customType: CustomType<any, any>) {
        try {
            await axios({
                url: `https://customtypes.prismic.io/customtypes/update`,
                method: "POST",
                headers: {
                    ...this.getPrismicCustomTypesAPIHeaders(),
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(customType.getConfig()),
            });
        } catch (e) {
            console.log(e);
            throw new Error(`Cannot update CustomType with ID: ${customType.getId()}`);
        }
    }

    private async deployCustomTypes() {
        const existingCustomTypes = await this.getExistingCustomTypes();

        for (const customType of this.customTypes) {
            const matchingExistingCustomType = existingCustomTypes.find(e => e.id === customType.getId());

            if (!matchingExistingCustomType) {
                console.log(`Creating CustomType: ${customType.getId()}`);
                await this.insertCustomType(customType);
                continue;
            }

            const matchingConfigStringified = JSON.stringify(matchingExistingCustomType);
            const currentConfigStringified = JSON.stringify(customType.getConfig());

            if (matchingConfigStringified !== currentConfigStringified) {
                console.log(`Updating CustomType: ${customType.getId()}`);
                await this.updateCustomType(customType);
                continue;
            }

            console.log(`CustomType ${customType.getId()} is up to date`);
        }
    }

    private getPrismicCustomTypesAPIHeaders() {
        return {
            repository: this.config.repository,
            Authorization: `Bearer ${this.config.customTypesToken}`,
        };
    }

    private checkForCustomTypesDuplicates(customTypes: T) {
        const existingIds: string[] = [];
        const duplicatedIds: string[] = [];

        for (const customType of customTypes) {
            const customTypeId = customType.getId();
            if (existingIds.includes(customTypeId)) {
                duplicatedIds.push(customTypeId);
            } else {
                existingIds.push(customTypeId);
            }
        }

        if (duplicatedIds.length > 0) {
            throw new Error(`Duplicated CustomTypes: [${duplicatedIds.join(", ")}]`);
        }
    }
}
