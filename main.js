const box = new Polygon([
	new Point(.2, .2),
	new Point(.15, .1),
	new Point(.05, .1),
	new Point(.0, .2),
	new Point(.05, .3),
	new Point(.15, .3),
])
const coord1 = new Coord([
	new Point(.3, .2),
	new Point(.4, .2),
	new Point(.5, .2, true)
])
const coord2 = new Coord([
	new Point(.05, .4),
	new Point(.05, .45),
	new Point(.05, .5),
	new Point(.05, .55)
])
const tri1 = new Polygon([
	new Point(.05, .6),
	new Point(.1, .65),
	new Point(.0, .65)
])
const coord3 = new Coord([
	new Point(.05, .2),
	new Point(.05, .25),
	new Point(.05, .3),
	new Point(.05, .35)
])
const tri2 = new Polygon([
	new Point(.05, .4),
	new Point(.1, .45),
	new Point(.0, .45)
])
const coord4 = new Coord([
	new Point(.0, .25),
	new Point(.0, .3),
	new Point(.0, .35),
	new Point(.0, .4)
])
const tri3 = new Polygon([
	new Point(.05, .45),
	new Point(.1, .5),
	new Point(.0, .5)
])

const points = [
	...coord1.points,
	...box.points,
	...coord2.points,
	...coord3.points,
	...coord4.points,
	...tri1.points,
	...tri2.points,
	...tri3.points
]

const sticks = [
	new Stick(coord4.points[0],box.points[3]),
	new Stick(coord2.points[0],box.points[4]),
	new Stick(coord3.points[0],box.points[2]),
	new Stick(coord1.points[0],box.points[0]),
	new Stick(tri1.points[0],coord2.points[coord2.points.length-1]),
	new Stick(tri2.points[0],coord3.points[coord3.points.length-1]),
	new Stick(tri3.points[0],coord4.points[coord4.points.length-1]),
	...coord1.sticks,
	...coord2.sticks,
	...coord3.sticks,
	...coord4.sticks,
	...box.sticks,
	...tri1.sticks,
	...tri2.sticks,
	...tri3.sticks
]

loop(t => {
	coord1.points[2].x = .5 * width + Math.cos(t * .01) * 10
	coord1.points[2].y = .2 * height + Math.sin(t * .01) * 10

	ctx.fillStyle = 'black'
	ctx.fillRect(0,0,width,height)

	points.forEach(p => {
		p.update()
		p.ApplyGravity(-.3)
		p.ApplyFriction(1)
		p.Bounce(1)
	});

	[...tri1.points, ...tri2.points, ...tri3.points].forEach(p => p.ApplyGravity(.5))

	for(let i = 0; i < 6; i++) {
		sticks.forEach(st => {
			st.constrain()
		})
	}

	sticks.forEach(st => st.draw())
	//points.forEach(p => p.draw())
})