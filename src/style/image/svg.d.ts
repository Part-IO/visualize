// See: https://stackoverflow.com/a/68185305
declare module "*.svg" {
    import * as React from "react";

    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

    const src: string;
    export default src;
}
