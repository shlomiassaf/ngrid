/**
 * Pick Partial No Partial
 * Like Pick but some are partial some are not partial
 */
export type PickPNP<T, P extends keyof T, NP extends keyof T> = Partial<Pick<T, P>> & Pick<T, NP>
