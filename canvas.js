class GameCanvas2D {
	constructor(id, w=false, h=false) {
		this.cvs = document.getElementById(id);
		this.ctx = this.cvs.getContext("2d");
		this.mousePos = [0, 0];
		this.mouseX = 0;
		this.mouseY = 0;
		this.shapes = [];
		var getMousePos = function (e) {
			var rect = ctx.cvs.getBoundingClientRect();
			ctx.mousePos = [e.clientX - rect.left, e.clientY - rect.top];
			ctx.mouseX = e.clientX - rect.left;
			ctx.mouseY = e.clientY - rect.top;
		};
		if (w) {
			this.w = w;
		} else {
			this.w = this.cvs.width;
		}
		if (h) {
			this.h = h;
		} else {
			this.h = this.cvs.height;
		}
		this.cvs.addEventListener("mousemove", function(e) {
			getMousePos(e);
		}, false);
	}
	getMousePos (e) {
		var rect = this.cvs.getBoundingClientRect();
		this.mousePos = [e.clientX - rect.left, e.clientY - rect.top];
		this.mouseX = e.clientX - rect.left;
		this.mouseY = e.clientY - rect.top;
		return mousePos;
	}
	fillStyle (clr) {
		this.ctx.fillStyle = clr;
	}
	strokeStyle (clr) {
		this.ctx.strokeStyle = clr;
	}
	style (clr) {
		this.fillStyle(clr);
		this.strokeStyle(clr);
	}
	drawRect (x, y, w, h) {
		this.shapes.push({x:x, y:y, w:w, h:h, type:"rect", f:this.ctx.fillStyle, s:this.ctx.strokeStyle});
	}
	drawCircle (x, y, r) {
		this.shapes.push({x:x, y:y, r:r, type:"circle", f:this.ctx.fillStyle, s:this.ctx.strokeStyle});
	}
	drawLine (x1, y1, x2, y2) {
		this.shapes.push({x1:x1, y1:y1, x2:x2, y2:y2, type:"line", f:this.ctx.fillStyle, s:this.ctx.strokeStyle});
	}
	drawImage (x, y, w, h, img) {
		this.shapes.push({x:x, y:y, w:w, h:h, img:img, type:"image", f:this.ctx.fillStyle, s:this.ctx.strokeStyle});
	}
	drawText (x, y, size, text) {
		this.shapes.push({x:x, y:y, size:size, text:text, type:"text", f:this.ctx.fillStyle, s:this.ctx.strokeStyle});
	}
	drawPath2D (p2d) {
		this.shapes.push({p2d:p2d, type:"path2d", f:this.ctx.fillStyle, s:this.ctx.strokeStyle});
	}
	drawProgressBar (x, y, w, h, maxval, value, barc, bgc) {
		this.shapes.push({x:x, y:y, w:w, h:h, m:maxval, v:value, type:"progress", barc:barc, bgc:bgc});
	}
	addEventListener (event, callback) {
		this.cvs.addEventListener(event, callback);
	}
	clearView () {
		this.ctx.clearRect(0, 0, this.w, this.h);
	}
	clearShapes () {
		this.shapes = [];
	}
	clear () {
		this.clearShapes();
		this.clearView();
	}
	reload (cshapes=true) {
		var i = 0;
		var rct;
		var crc;
		var ln;
		var img;
		var shp = this.shapes;
		this.clearView();
		while (i < this.shapes.length) {
			if (shp[i].type === "rect") {
				rct = new Path2D();
				rct.moveTo(shp[i].x, shp[i].y);
				rct.lineTo(shp[i].x, shp[i].h+shp[i].y);
				rct.lineTo(shp[i].w+shp[i].x, shp[i].h+shp[i].y);
				rct.lineTo(shp[i].w+shp[i].x, shp[i].y);
				rct.lineTo(shp[i].x, shp[i].y);
				this.strokeStyle(shp[i].s);
				this.fillStyle(shp[i].f);
				this.ctx.stroke(rct);
				this.ctx.fill(rct);
			} else if (shp[i].type === "circle") {
				crc = new Path2D();
				crc.arc(shp[i].x, shp[i].y, shp[i].r, 0, 2 * Math.PI);
				this.strokeStyle(shp[i].s);
				this.fillStyle(shp[i].f);
				this.ctx.stroke(crc);
				this.ctx.fill(crc);
			} else if (shp[i].type === "line") {
				ln = new Path2D();
				ln.moveTo(shp[i].x1, shp[i].y1);
				ln.lineTo(shp[i].x2, shp[i].y2);
				this.strokeStyle(shp[i].s);
				this.fillStyle(shp[i].f);
				this.ctx.stroke(ln);
			} else if (shp[i].type === "image") {
				if (shp[i].img.src) {
					img = shp[i].img;
					img.width = shp[i].w;
					img.height = shp[i].h;
					img.maxWidth = shp[i].w;
					img.maxHeight = shp[i].h;
					img.minWidth = shp[i].w;
					img.minHeight = shp[i].h;
				} else {
					img = new Image(shp[i].w, shp[i].h);
					img.src = shp[i].img;
					img.maxWidth = shp[i].w;
					img.maxHeight = shp[i].h;
					img.minWidth = shp[i].w;
					img.minHeight = shp[i].h;
				}
				this.strokeStyle(shp[i].s);
				this.fillStyle(shp[i].f);
				this.ctx.drawImage(img, shp[i].x, shp[i].y, img.width, img.height);
			} else if (shp[i].type === "text") {
				this.ctx.font = shp[i].size.toString() + "px Arial";
				this.strokeStyle(shp[i].s);
				this.fillStyle(shp[i].f);
				this.ctx.fillText(shp[i].text, shp[i].x, shp[i].y);
				this.ctx.strokeText(shp[i].text, shp[i].x, shp[i].y);
			} else if (shp[i].type === "path2d") {
				this.strokeStyle(shp[i].s);
				this.fillStyle(shp[i].f);
				this.ctx.stroke(shp[i].p2d);
				this.ctx.fill(shp[i].p2d);
			} else if (shp[i].type === "progress") {
				if (shp[i].v > shp[i].m) {
					shp[i].v = shp[i].m;
				}
				this.strokeStyle(shp[i].bgc);
				this.fillStyle(shp[i].bgc);
				this.ctx.fillRect(shp[i].x, shp[i].y, shp[i].w, shp[i].h);
				this.ctx.strokeRect(shp[i].x, shp[i].y, shp[i].w, shp[i].h);
				this.strokeStyle(shp[i].barc);
				this.fillStyle(shp[i].barc);
				this.ctx.fillRect(shp[i].x, shp[i].y, ((shp[i].v / 100) * shp[i].v) * (shp[i].w / shp[i].v), shp[i].h);
			}
			i++;
		}
		if (cshapes) {
			this.clearShapes();
		}
	}
}

