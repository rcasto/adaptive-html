export function toArray<T>(x: T): T[] {
    if (Array.isArray(x)) {
        return x;
    }
    return x ? [x] : [];
}