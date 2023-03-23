import { PrefersColorSchemeMediaQuery } from './media-query';
import { Theme } from './theme';
import { IContextService, IEventBus, IStorageService } from './utils/index';
/**
 * 负责CSS变量主题的装卸，主题元数据转换成主题数据
 */
export declare class ThemeService {
    eventBus: IEventBus;
    storage: IStorageService;
    context: IContextService;
    currentTheme: Theme;
    contentElement: HTMLStyleElement;
    colorTransitionElement: HTMLStyleElement;
    extraData: {
        [themeId: string]: {
            cssVariables?: {
                [varname: string]: string;
            };
            appendClasses?: Array<string>;
        };
    };
    private _appendedClasses;
    set appendClasses(classes: Array<string>);
    get appendClasses(): Array<string>;
    mediaQuery: PrefersColorSchemeMediaQuery;
    constructor(eventBus?: IEventBus, storage?: IStorageService, context?: IContextService);
    initializeTheme(specificThemeId?: string, allowDynamicTheme?: boolean): void;
    formatCSSVariables(themeData: Theme['data']): string;
    applyTheme(theme: Theme): void;
    saveCustomTheme(customTheme: Theme): void;
    private notify;
    setEventBus(eb: IEventBus): void;
    private addAppendClass;
    private removeAppendedClass;
    setExtraData(data: any, apply?: boolean): void;
    private applyExtraData;
    unloadTheme(): void;
    registerMediaQuery(): void;
    unregisterMediaQuery(): void;
    private createColorTransition;
    private addColorTransition;
    private removeColorTransition;
}
