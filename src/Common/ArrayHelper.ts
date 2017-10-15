import { approxEquals } from "../Math/FMath";

export function clone<T> (array: T[][]): T[][]
{
    let rows = array.length
    let res = Array<T[]>(rows)
    for (let r = 0; r < rows; r++)
        res[r] = array[r].slice ()
    return res
}

export function fill<T> (array: T[], value: T): T[]
{
    for (var i = 0; i < array.length; i++)
        array[i] = value
    return array
}

export function repeat<T> (value: T, count: number): T[]
{
    var res = Array<T> (count)
    for (var i = 0; i < count; i++)
        res[i] = value
    return res;
}

export function maxItems<T> (array: T[], selector: (T) => number): T[]
{
    let res: T[] = []
    let max = Number.MAX_VALUE
    for (let item of array)
    {
        var value = selector (item);
        if (value > max)
        {
            max = value;
            res = [ item ]
        }
        else if (approxEquals (value, max))
            res.push (item)
    }
    return res;
}

export function sum (array: number[]): number
{
    let res = 0
    for (var item of array)
        res += item
    return res
}