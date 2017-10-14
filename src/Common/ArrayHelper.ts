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
