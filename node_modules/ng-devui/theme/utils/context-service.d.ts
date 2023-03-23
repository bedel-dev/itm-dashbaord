import { IContextService } from './interface';
export declare class ContextService implements IContextService {
    getDataFromNameSpace(nameSpace: string): any;
    setDataFromNameSpace(nameSpace: string, value: any): void;
}
