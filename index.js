/* -------------------------- */		
/*            state           */		
/* -------------------------- */	
var state = {}
state.replacer = function (key,value) {
    if (typeof(value) === 'object') return value
    else return Math.floor(value * 100) / 100
}		

state.width = 600
state.height = 400

state.x0 = 400
state.y0 = 200
state.rot0 = 0
state.segments = 360
state.size = 100000
state.side = Math.sqrt(state.size)
state.rad = state.side / 2
state.refdot = Math.round(state.segments * (1 / 4))

state.legend = {}							// info
state.legend.xloc = 5
state.legend.fontSize = 10
state.legend.yloc = state.height - state.legend.fontSize
state.legend.text = "superformula"

state.ref = {}
state.ref.rad = 10
state.ref.stroke = 'orange'
state.ref.fill = 'transparent'
state.ref.idx = Math.round(state.segments * (1 / 5))
state.ref.segments = 24

state.rect = {}
state.rect.stroke = 'red'

state.notice = {}
state.notice.xloc = 5					// params
state.notice.fontSize = 6
state.notice.yloc = state.height - state.notice.fontSize
state.notice.text = "{}"

state.controls = {}
state.controls.format = d3.format(".4n");
state.controls.scale = d3.scaleLinear()
    .domain([-10, 20, 1000])
    .range([0, 800, 1000])


var types = {
  asterisk: {m: 12, n1: .3, n2: 0, n3: 10, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  bean: {m: 2, n1: 1, n2: 4, n3: 8, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  butterfly: {m: 3, n1: 1, n2: 6, n3: 2, a: .6, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  circle: {m: 4, n1: 2, n2: 2, n3: 2, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  clover: {m: 6, n1: .3, n2: 0, n3: 10, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  cloverFour: {m: 8, n1: 10, n2: -1, n3: -8, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  cross: {m: 8, n1: 1.3, n2: .01, n3: 8, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  diamond: {m: 4, n1: 1, n2: 1, n3: 1, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  drop: {m: 1, n1: .5, n2: .5, n3: .5, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  ellipse: {m: 4, n1: 2, n2: 2, n3: 2, a: 9, b: 6, tx: state.x0, ty: state.y0, rot: state.rot0},
  gear: {m: 19, n1: 100, n2: 50, n3: 50, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  heart: {m: 1, n1: .8, n2: 1, n3: -8, a: 1, b: .18, tx: state.x0, ty: state.y0, rot: state.rot0},
  heptagon: {m: 7, n1: 1000, n2: 400, n3: 400, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  hexagon: {m: 6, n1: 1000, n2: 400, n3: 400, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  malteseCross: {m: 8, n1: .9, n2: .1, n3: 100, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  pentagon: {m: 5, n1: 1000, n2: 600, n3: 600, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  rectangle: {m: 4, n1: 100, n2: 100, n3: 100, a: 2, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  roundedStar: {m: 5, n1: 2, n2: 7, n3: 7, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  square: {m: 4, n1: 100, n2: 100, n3: 100, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  star: {m: 5, n1: 30, n2: 100, n3: 100, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
  triangle: {m: 3, n1: 100, n2: 200, n3: 200, a: 1, b: 1, tx: state.x0, ty: state.y0, rot: state.rot0},
}

var svg = d3.select("body")
  .append("svg")
    .attr("width", state.width)
    .attr("height", state.height)
		.style("border", "1px solid lightgray")

/* -------------------------- */		
/*            superform       */		
/* -------------------------- */			

var formShapeTransform = function (params) {
	return formShape.formParams(params)
}
		
var formShape = d3.superformula()	
    .types(types)
    .type("asterisk")
    .size(state.size)
    .segments(state.segments)

var formElem = svg.append("path")				
    .attr("class", "sample")
    .attr("d", formShape)
		.style("stroke-width", "1.5px")
		.style("stroke", "#666")
		.style("fill", "#ddd")
		
/* -------------------------- */		
/*            ref form        */		
/* -------------------------- */		
		
var points = 	formShape.points()
var refPt = Math.round(points.length * (1 / 5))
var pt = points[state.ref.idx]

var formRefTransform = function (shape) {				
		let params = shape.formParams()
		let pts = shape.points()
		let tx = pts[refPt][0]
		let ty = pts[refPt][1]
		let p = Object.assign({}, params, {}, {"tx":tx, "ty":ty, "rad": state.ref.rad})
	return formRef.formParams(p)
}
		
var formRef = d3.superformula()			
    .segments(state.ref.segments)
		.formParams({"m":12,"n1":0.3,"n2":0,"n3":17.48,"a":1,"b":1,"tx":pt[0],"ty":pt[1],"rot":0, "rad": state.ref.rad})
		
var refElem = svg.append("path")				
    .attr("class", "circlePath")
    .attr("d", formRef)
		.style("stroke-width", "1.5px")
		.style("stroke", state.ref.stroke)
		.style("fill", state.ref.fill)		
		
/* -------------------------- */		
/*            circle form     */		
/* -------------------------- */		
		
var formCircleTransform = function (params) {	
	var p = []
	for (let k in params) {
		if (k === 'tx' || k ===  'ty') p[k] = params[k]
	}
	return formCircle.formParams(p)
}
		
var  formCircle = d3.superformula()			
    .segments(state.segments)
		.formParams({"m":0.64,"n1":-1.57,"n2":0,"n3":10,"a":1,"b":1,"tx":state.x0,"ty":state.y0,"rot":0, "rad": state.rad})

var circleElem = svg.append("path")				
    .attr("class", "circlePath")
    .attr("d", formCircle)
		.style("stroke-width", "1.5px")
		.style("stroke", "green")
		.style("fill", "transparent")
		
var legendTransform = function (params) {		// legend
	let r = ''
	for (let k in params) {
		if (k === 'm') { r = r + 'm: Arity of rotational symmetry. ' } 
		if (k === 'n1') { r = r + 'n1: Large n1 and equals n2, n3 mark polygonal shapes' } 
		if (k === 'n2') { r = r + 'n2 and n3 provide axial freedom ' } 
		if (k === 'n3') { r = r + 'n2 = n3 represents axial symmetry ' } 
		if (k === 'a') { r = r + 'a excentricity but also perspective ' } 
		if (k === 'b') { r = r + 'b = a equal axis' } 
	}
	return r 
}
		
/* -------------------------- */		
/*            rect form     */		
/* -------------------------- */				

var formRectTransform = function (params) {	
	var p = []
	for (let k in params) {
		if (k === 'tx' || k ===  'ty') p[k] = params[k]
	}
	return formRect.formParams(p)
}		

var  formRect = d3.superformula()			
    .segments(state.segments)
		.formParams({"m":4,"n1":100,"n2":100,"n3":100,"a":1,"b":1,"tx":state.x0,"ty":state.y0,"rot":0, "rad": state.rad * Math.sqrt(2)})
		
var rectInElem = svg.append("path")				
    .attr("class", "circlePath")
    .attr("d", formRect)
		.style("stroke-width", "1.5px")
		.style("stroke", state.rect.stroke)
		.style("fill", "transparent")		
		
/* -------------------------- */		
/*            scales          */		
/* -------------------------- */				
function changedScale(d) {	
	let k = d.key
  let v = state.controls.scale.invert(this.value);
	let params = {}; params[k] = v;
	render(params) 
}

var control = d3.select("#controls")
  .selectAll("div")
    .data(d3.entries(types.asterisk))
		.enter().append("div")
			.attr("id", function(d) { return d.key; })
			.style("font", "8px sans-serif")	

control.append("label")															// input labels
    .text(function(d) { return d.key; });

control.append("input")															// input controls
    .attr("type", "range")
    .attr("max", 1000)
    .attr("min", 0)
    .property("value", function(d) { return state.controls.scale(d.value); })
    .on("change", changedScale)
    .on("input", changedScale);

control.append("span")
    .text(function(d) { return state.controls.format(d.value); });		// scale values

/* -------------------------- */		
/*            buttons         */		
/* -------------------------- */				
d3.select("#controls")
  .append("div")
  .selectAll("button")
    .data(d3.entries(types))
  .enter().append("button")
    .text(function(d) { return d.key; })
    .on("click", function(d) {
			let params = {}
      for (var param in d.value) {
				let k = param, v = d.value[param]
				params[k] = v;
        let control = d3.select("#" + k);
        control.select("input").property("value", state.controls.scale(v));
        control.select("span").text(state.controls.format(v));
      }
			render(params)
    });

/* -------------------------- */		
/*            notice          */		
/* -------------------------- */			
var noticeElem = d3.select("#controls")
  .append("div")
  .selectAll(".notice")
    .data([state.legend.text])
  .enter().append("input")
		.attr('type', "text")
		.attr('id', 'notice')
    .attr("class", "notice")
		.attr('style', 'width: 600px;')
		.style("font-family", 'sans-serif')
		.style("font-size", state.notice.fontSize)	
		.style("fill-opacity", 1)	
    .on("change", changedform)

	function changedform() {	
			let params = JSON.parse(this.value)
		
			for (let k in params) {
				let v = params[k]
        let control = d3.select("#" + k)
				if (!control.empty()) {
					control.select("input").property("value", state.controls.scale(v))
					control.select("span").text(state.controls.format(v))
				}
      }
		render(params)
	}

/* -------------------------- */		
/*            legend			     */		
/* -------------------------- */			
var legendElem = d3.select("#controls")
  .append("div")
  .selectAll(".legend")
    .data(['superformula'])
  .enter().append("text")
		.text(d => d)
		.style("font-family", 'sans-serif')
		.style("font-size", state.legend.fontSize)	
		.style("fill-opacity", 1)		
		.attr('style', 'width: 600px;')

/* -------------------------- */		
/*            render			     */		
/* -------------------------- */		

function render(params) {
	let shape =  formShape.formParams(params)
  formElem.attr("d", shape)		// form
	circleElem.attr("d", formCircleTransform(params))		// circle
	rectInElem.attr("d", formRectTransform(params))			// extent
	refElem.attr("d", formRefTransform(shape))	// ref
	

	noticeElem.property('value', 												// notice
			d => JSON.stringify(formShape.formParams(params).defparams(), state.replacer))
	// legendElem.text(legendTransform(params))						// legend
}















	
	
	
	
	