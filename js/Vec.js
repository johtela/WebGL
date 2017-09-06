var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LinearAlgebra;
(function (LinearAlgebra) {
    var Vec = (function (_super) {
        __extends(Vec, _super);
        function Vec(dim) {
            var _this = _super.call(this, dim) || this;
            _this.dimension = dim;
            return _this;
        }
        Vec.prototype.add = function (other) {
            for (var i = 0; i < this.dimension; i++) {
                this[i] = this[i] + other[i];
            }
        };
        return Vec;
    }(Float32Array));
    var Vec2 = (function (_super) {
        __extends(Vec2, _super);
        function Vec2(values) {
            var _this = _super.call(this, 2) || this;
            for (var i = 0; i < _this.dimension; i++) {
                _this[i] = values[i];
            }
            return _this;
        }
        return Vec2;
    }(Vec));
    var v = new Vec2([1, 2, 3]);
})(LinearAlgebra || (LinearAlgebra = {}));
//# sourceMappingURL=Vec.js.map