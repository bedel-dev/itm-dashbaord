export declare class PrefersColorSchemeMediaQuery {
    static enquire: any;
    private prefersColorSchemeSubject;
    prefersColorSchemeChange: import("rxjs").Observable<PrefersColorSchemeMediaQuery.Value>;
    register(): void;
    unregister(): void;
    handleColorSchemeChange: (value: PrefersColorSchemeMediaQuery.Value) => void;
    getInitValue(): PrefersColorSchemeMediaQuery.Value;
}
export declare namespace PrefersColorSchemeMediaQuery {
    type Value = 'light' | 'dark' | 'no-preference';
    enum Query {
        'light' = "screen and (prefers-color-scheme: light)",
        'dark' = "screen and (prefers-color-scheme: dark)",
        'noPreferences' = "screen and (prefers-color-scheme: light)"
    }
}
