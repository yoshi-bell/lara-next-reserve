/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TestRunnerConfig } from "@storybook/test-runner";
import { toMatchImageSnapshot } from "jest-image-snapshot";

const snapshotOptions = {
    customSnapshotsDir: "__image_snapshots__",
    failureThreshold: 0.01,
    failureThresholdType: "percent",
};

const config: TestRunnerConfig = {
    setup() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Storybook test-runner provides 'expect' globally
        expect.extend({ toMatchImageSnapshot });
    },

    async postVisit(page, context) {
        const image = await page.screenshot();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Storybook test-runner provides 'expect' globally
        expect(image).toMatchImageSnapshot({
            ...snapshotOptions,
            customSnapshotIdentifier: context.id,
        });
    },
};

export default config;
