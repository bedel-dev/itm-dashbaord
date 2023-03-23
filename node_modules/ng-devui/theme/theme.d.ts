export declare type ThemeId = string;
export declare class Theme {
    id: ThemeId;
    name: string;
    cnName?: string;
    data: {
        [cssVarName: string]: string;
    };
    extends?: ThemeId;
    isDark?: boolean;
    isPreview?: boolean;
    isExtendable?: boolean;
    extra?: {
        appendClass?: Array<string>;
        cssVariables?: {
            [cssVarName: string]: string;
        };
        [prop: string]: any;
    } | any;
    constructor(theme: {
        id: ThemeId;
        name: string;
        cnName?: string;
        data: {
            [cssVarName: string]: string;
        };
        extends?: ThemeId;
        isDark?: boolean;
        isPreview?: boolean;
        isExtendable?: boolean;
    });
}
