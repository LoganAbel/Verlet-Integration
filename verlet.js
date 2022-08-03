const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')
const [width, height] = [canvas.width, canvas.height]

class Point {
	constructor(x, y, fixed = false) {
		x *= width
		y *= height

		this.x = x
		this.y = y

		this.oldx = x
		this.oldy = y

		this.fixed = fixed
	}
	update() {
		if(this.fixed) return
		[this.oldx, this.x] = [this.x, lerp(this.oldx, this.x, 2)];
		[this.oldy, this.y] = [this.y, lerp(this.oldy, this.y, 2)];
	}
	draw() {
		ctx.fillStyle = 'white'
		ctx.beginPath()
		ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, true)
		ctx.fill()
	}

	ApplyFriction(f) {
		if(this.fixed) return
		this.x = lerp(this.oldx, this.x, f)
		this.y = lerp(this.oldy, this.y, f)
	}
	ApplyGravity(g) {
		if(this.fixed) return
		this.y -= g
	}
	Bounce(b) {
		if(this.fixed) return
		if(!in_range(this.x, 0, width)) {
			const vx = this.x - this.oldx
			this.x = clamp(this.x, 0, width)
			this.oldx = this.x + b * vx
		}
		if(!in_range(this.y, 0, height)) {
			const vy = this.y - this.oldy
			this.y = clamp(this.y, 0, height)
			this.oldy = this.y + b * vy
		}
	}
}
class Stick {
	constructor(p1, p2) {
		this.p1 = p1
		this.p2 = p2
		this.len = length(p1.x - p2.x, p1.y - p2.y)
	}
	constrain() {
		const error = this.len / length(this.p1.x - this.p2.x, this.p1.y - this.p2.y) - 1
		let offset = - error / 2

		if (this.p1.fixed || this.p2.fixed)
			offset *= 2

		const x1 = lerp(this.p1.x, this.p2.x, offset)
		const y1 = lerp(this.p1.y, this.p2.y, offset)

		const x2 = lerp(this.p2.x, this.p1.x, offset)
		const y2 = lerp(this.p2.y, this.p1.y, offset)

		if (!this.p1.fixed) {
			this.p1.x = x1
			this.p1.y = y1
		}
		if (!this.p2.fixed) {
			this.p2.x = x2
			this.p2.y = y2
		}
	}
	draw() {
		ctx.strokeStyle = 'white';
		ctx.beginPath()
		ctx.moveTo(this.p1.x, this.p1.y);
		ctx.lineTo(this.p2.x, this.p2.y);
		ctx.stroke();
	}
}

class Box {
	constructor(x, y, dx1, dy1, dx2, dy2) {
		this.points = [
			new Point(x, y),
			new Point(x + dx1, y + dy1),
			new Point(x + dx1 + dx2, y + dy1 + dy2),
			new Point(x + dx2, y + dy2)
		]
		this.sticks = [
			new Stick(this.points[0], this.points[1]),
			new Stick(this.points[1], this.points[2]),
			new Stick(this.points[2], this.points[3]),
			new Stick(this.points[3], this.points[0]),
			new Stick(this.points[0], this.points[2])
		]
	}
}

class Polygon {
	constructor(ps) {
		this.points = ps
		this.sticks = [
			...ps.map((p,i)=> new Stick(p, this.points[(i+1)%ps.length])),
			...ps.slice(1).map(p=> new Stick(p, ps[0]))
		]
	}
}

class Coord {
	constructor(ps) {
		this.points = ps
		this.sticks = ps.slice(0,-1).map((p,i)=> new Stick(p, this.points[i+1]))
	}
}

const loop = f => {
	const looped_f = t => {
		f(t);
		requestAnimationFrame(looped_f)
	}
	requestAnimationFrame(looped_f)
}