
export abstract class IterableExt<T> implements Iterable<T>
{
    * map<U> (mapper: (item: T) => U): Iterable<U>
    {
        for (let item of this)
            yield mapper (item)
    }
    
    * filter (predicate: (item: T) => boolean): Iterable<T>
    {
        for (let item of this)
            if (predicate (item))
                yield item
    }
    
    abstract [Symbol.iterator] (): Iterator<T>
}