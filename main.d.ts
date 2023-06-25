export declare function exportAPI(apiHandlers: Record<string, Function>, originVertify?: (origin: string) => boolean): void;
export declare function excute<T>(frameID: string, actionName: string, ...params: any): Promise<T>;
