export type Reducer<T, U> = (acc: U, curr: T) => U

export interface Reducible<T>
{
    reduce<U> (initial: U, reducer: Reducer<T, U>)
}

export function foreach<T> (reducible: Reducible<T>, action: (curr: T) => void)
{
    reducible.reduce (null, (_, curr) => { action (curr); return null })
}

export function filter<T, U> (predicate: (item: T) => boolean, reducer: Reducer<T, U>): Reducer<T, U>
{
    return (acc, curr) => predicate (curr) ? reducer (acc, curr) : acc
}

export function every<T> (reducible: Reducible<T>, predicate: (item: T) => boolean): boolean
{
    return reducible.reduce (false, (acc, curr) => predicate (curr) ? acc : false)
}

export function min<T> (selector: (curr: T) => number): Reducer<T, T>
{
    return (min, curr) => 
    {
        let minValue = selector (min)
        let currValue = selector (curr)
        return currValue < minValue ? curr : min
    }
}

export function max<T> (selector: (curr: T) => number): Reducer<T, T>
{
    return (max, curr) => 
    {
        let maxValue = selector (max)
        let currValue = selector (curr)
        return currValue > maxValue ? curr : max
    }
}