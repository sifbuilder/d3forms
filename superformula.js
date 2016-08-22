// Mike Bostock’s Block http://bl.ocks.org/mbostock/1021103
// Christophe Viau implemented a new shape type as a D3 plugin based on superformulas.

(function() {

  d3.superformula = function superformula() {
				var _symbol = d3.symbol(),
						_line = d3.line();

				function d3_functor(v) {
					return typeof v === "function" ? v : function() {
						return v;
					};
				}	
			
				function transform(_) {
					if (!_) return noop;
					var x0 = 0,
							y0 = 0,
							kx = 1,
							ky = 1,
							dx = _.tx,
							dy = _.ty,
							rot  = _.rot		// rads

						var transform = function(p = [1, 1]) {
								var point = []
								x0 = (x0 === undefined) ? x0 : 0
								y0 = (y0 === undefined) ? y0 : 0
								
								var pointx = p[0] * Math.cos(rot) - p[1] * Math.sin(rot)
								var pointy = p[0] * Math.sin(rot) + p[1] * Math.cos(rot)

								point[0] = (x0 += pointx) * kx + dx
								point[1] = (y0 += pointy) * ky + dy
					 
								return point
						}
					
					return transform
				}
	
				function transformPath(params, path) {
						var _transform = transform(params)
						let tpath = []
						for (let i = 0; i < path.length; i++) {
							tpath.push(_transform(path[i]))
						}
						return tpath
				}	
	
				var formTpl = {m: 12, n1: .3, n2: 0, n3: 10, a: 1, b: 1, tx: 0, ty: 0, rot: 0}	// formParams
				var type = null
				var types = {
						asterisk: {m: 12, n1: .3, n2: 0, n3: 10, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						bean: {m: 2, n1: 1, n2: 4, n3: 8, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						butterfly: {m: 3, n1: 1, n2: 6, n3: 2, a: .6, b: 1, tx: 0, ty: 0, rot: 0},
						circle: {m: 4, n1: 2, n2: 2, n3: 2, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						cloverot: {m: 6, n1: .3, n2: 0, n3: 10, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						cloverFourot: {m: 8, n1: 10, n2: -1, n3: -8, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						cross: {m: 8, n1: 1.3, n2: .01, n3: 8, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						diamond: {m: 4, n1: 1, n2: 1, n3: 1, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						drop: {m: 1, n1: .5, n2: .5, n3: .5, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						ellipse: {m: 4, n1: 2, n2: 2, n3: 2, a: 9, b: 6, tx: 0, ty: 0, rot: 0},
						gearot: {m: 19, n1: 100, n2: 50, n3: 50, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						heart: {m: 1, n1: .8, n2: 1, n3: -8, a: 1, b: .18, tx: 0, ty: 0, rot: 0},
						heptagon: {m: 7, n1: 1000, n2: 400, n3: 400, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						hexagon: {m: 6, n1: 1000, n2: 400, n3: 400, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						malteseCross: {m: 8, n1: .9, n2: .1, n3: 100, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						pentagon: {m: 5, n1: 1000, n2: 600, n3: 600, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						rectangle: {m: 4, n1: 100, n2: 100, n3: 100, a: 2, b: 1, tx: 0, ty: 0, rot: 0},
						roundedStarot: {m: 5, n1: 2, n2: 7, n3: 7, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						square: {m: 4, n1: 100, n2: 100, n3: 100, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						starot: {m: 5, n1: 30, n2: 100, n3: 100, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
						triangle: {m: 3, n1: 100, n2: 200, n3: 200, a: 1, b: 1, tx: 0, ty: 0, rot: 0},
				}
				var superformulaTypes = Object.keys(types)
				var size = _symbol.size()	// size of the extent
				var segments = segments	// number of segments of resulting path
				var formParams = {}			// passed superformula and transform formParams
				var points = []			// transformed path points
				var extent = []			// transformed suprescribing square 
				var tcenter = []		// transformed center transform[0, 0]
				var defparams = {}		// form definition params
			
			
				function _superformulaPath(points) {
						return _line(points) + "Z";												// return path
				}

				function _superformulaPoints(params, n, diameter) {
						var i = -1,
						dt = 2 * Math.PI / n,		// sector per symmetry dimension
						t,
						r = 0,									// initialize
						x,
						y,
						pts = [];								// points in path
						
						while (++i < n) {
							t = params.m * (i * dt - Math.PI) / 4;
							t = Math.pow(Math.abs(Math.pow(Math.abs(Math.cos(t) / params.a), params.n2)
								+ Math.pow(Math.abs(Math.sin(t) / params.b), params.n3)), -1 / params.n1);
							if (t > r) r = t;
							pts.push(t);
						}

						// superseed diameter with params.rad if defined	_e_ tbc
						if (params.rad !== undefined && params.rad !== 0) diameter = 2 * params.rad
						
						r = diameter / 2 / r // * Math.SQRT1_2 / r 	// normalize _e_ tbc
						i = -1; while (++i < n) {
							let pt = [(t = pts[i] * r) * Math.cos(i * dt), t * Math.sin(i * dt)]
							pts[i] = [Math.abs(pt[0]) < 1e-6 ? 0 : pt[0], Math.abs(pt[1]) < 1e-6 ? 0 : pt[1]]
						}

						return pts;
			}
			

    function superformula(d, i) {
						var n
						var _segments = segments.call(this, d, i)
						var _side = Math.sqrt(size.call(this, d, i))	// 
						
						var p = formTpl						// initialize form params
						
						if (typeof(type) === 'function') {
							var _type = type.call(this, d, i)
							p = types[_type]	
						}

						for (n in formParams) p[n] = formParams[n].call(this, d, i)
						
						if (d && d.shapeParams !== 'undefined') {
							for (n in d.shapeParams) p[n] = d3_functor(d.shapeParams[n]).call(this, d, i)
						}

						defparams = p		// assign for defparams getter _e_tbc
						var rpoints = _superformulaPoints(p, _segments, _side)
						points = transformPath(p, rpoints)		// assign for points getter
						return _superformulaPath(points)
    }
		
		

    superformula.type = function(x) {
      if (!arguments.length) return type;
      type = d3_functor(x);
      return superformula;
    };

    superformula.formParam = function(name, value) {
      if (arguments.length < 2) return formParams[name];
      formParams[name] = d3_functor(value);
      return superformula;
    };

			
		superformula.formParams = function(p) {
		 if (arguments.length < 1) {
				let n, p = formTpl
				for (n in formParams) p[n] = formParams[n]()
				return p
			}
			for (let n in p) {
				formParams[n] = (typeof (p[n]) === "function") ? p[n] : d3_functor(p[n])
			}
			return superformula;
		}

		// defparams
		superformula.defparams = function() {
			if (!arguments.length) return defparams;
		}	
		
    superformula.types = function(x) {
      if (!arguments.length) return types
      types = x
      return superformula
    };

    // size of superformula in square pixels
    superformula.size = function(x) {
      if (!arguments.length) return size()
      size = d3_functor(x);
      return superformula;
    };

    // number of discrete line segments
    superformula.segments = function(x) {
      if (!arguments.length) return segments()
      segments = d3_functor(x);
      return superformula;
    };

		// line segments
		superformula.points = function() {
			if (!arguments.length) return points
		}		
		
    return superformula;
  }


})();