export function* map<T, U> (iter: Iterable<T>, mapper: (item: T) => U): Iterable<U>
{
    for (let item of iter)
        yield mapper (item)
}

export function* filter<T> (iter: Iterable<T>, predicate: (item: T) => boolean): Iterable<T>
{
    for (let item of iter)
        if (predicate (item))
            yield item
}

export function* reduce<T, U> (iter: Iterable<T>, reducer: (acc: U, curr: T) => U, initial: U): 
    Iterable<T>
{
    let result = initial
    for (let item of iter)
        result = reducer (result, item)
    return result        
}

export function first<T> (iter: Iterable<T>): T | undefined
{
    for (let item of iter)
        return item
    return undefined
}

export function* skip<T> (iter: Iterable<T>, skipCount: number): Iterable<T>
{
    for (let item of iter)
        if (skipCount > 0)
            skipCount--
        else
            yield item
}

export function* take<T> (iter: Iterable<T>, takeCount: number): Iterable<T>
{
    for (let item of iter)
        if (takeCount-- > 0)
            yield item
        else
            break
}

export function isEmpty<T> (iter: Iterable<T>): boolean
{
    return first (iter) !== undefined
}

export function min<T> (iter: Iterable<T>, selector: (item: T) => number): T | undefined
{
    let result: T | undefined = undefined
    let minValue = Number.MAX_VALUE
    for (let item of iter)
    {
        let value = selector (item)
        if (value < minValue)
        {
            minValue = value
            result = item
        }
    }
    return result
}

export function max<T> (iter: Iterable<T>, selector: (item: T) => number): T | undefined
{
    let result: T | undefined = undefined
    let maxValue = Number.MAX_VALUE
    for (let item of iter)
    {
        let value = selector (item)
        if (value > maxValue)
        {
            maxValue = value
            result = item
        }
    }
    return result
}

export function every<T> (iter: Iterable<T>, predicate: (item: T) => boolean): boolean
{
    for (let item of iter)
        if (!predicate (item))
            return false;
    return true;
}

export function any<T> (iter: Iterable<T>, predicate: (item: T) => boolean): boolean
{
    for (let item of iter)
        if (predicate (item))
            return true;
    return false;
}
