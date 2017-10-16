
export function isEmpty<T> (iterable: Iterable<T>): boolean
{
    let iter = iterable[Symbol.iterator]()
    return !(iter.return ? iter.return ().done : iter.next ().done)
}

export function first<T> (iterable: Iterable<T>): T | undefined
{
    let iter = iterable[Symbol.iterator]()
    let res = iter.return ? iter.return () : iter.next ()
    return res.done ? undefined : res.value
}

export function* take<T> (iterable: Iterable<T>, count: number): Iterable<T>
{
    for (let item of iterable)
        if (count-- > 0)
            yield item
        else 
            break
}

export function* skip<T> (iterable: Iterable<T>, count: number): Iterable<T>
{
    for (let item of iterable)
        if (count-- > 0)
            continue
        else
            yield item
}