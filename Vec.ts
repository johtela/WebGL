namespace LinearAlgebra
{
    abstract class Vec<V extends Vec<V>> extends Float32Array
    {   
        protected dimension: number;

         constructor (dim: number)
         {
             super(dim);
             this.dimension = dim;
         }

         static fromArray (values: number[]): V
         {
             let res = V ();
         }

         add (other: V): void
         {
            for (var i = 0; i < this.dimension; i++) {
                this[i] = this[i] + other[i];                
            }
         }
    }

    class Vec2 extends Vec<Vec2> 
    {
    }

    let v = new Vec2 ([1, 2])
    v.add ()
}
