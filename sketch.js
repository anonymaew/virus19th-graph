var data,g;
var selected="-1",moveable=false,circlesize=20,fontsize=12;

function drawVector(x1,y1,x2,y2){
	push();
	translate(x1,y1);
	rotate(atan2(y2-y1,x2-x1));
	length=sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
	line(0,0,length,0);
	fill(255);
	triangle(length/2+5,0,length/2-5,5,length/2-5,-5);
	pop();
}

class graph{
	constructor(){
		this.day=0;
		this.people={};
		this.parent=[];
	}
	import(data){
		this.people=data;
		for(let k of Object.keys(this.people)){
			if(this.people[k].from==null) this.people[k].from=[];
			if(this.people[k].infect==null) this.people[k].infect=[];
			else if(this.people[k].from.length==0) this.parent.push(k);
			if(this.people[k].pos==null) this.people[k].pos={"x":random(1),"y":random(1)};
		}
	}
	show(x,y){
		fill(255);
		var hovering="-1";
		for(let k of Object.keys(this.people)){
			var now=this.people[k];
			strokeWeight(2); stroke(255);
			for(let kk of now.infect){
				var child=this.people[kk];
				if(child!=null) drawVector(now.pos.x*width,now.pos.y*height,child.pos.x*width,child.pos.y*height);
			}
			if(hovering=="-1") if((now.pos.x*width-x)*(now.pos.x*width-x)+(now.pos.y*height-y)*(now.pos.y*height-y)<circlesize*circlesize) hovering=k;
		}
		noStroke();
		fill(255,128,128);
		for(let k of Object.keys(this.people)){
			var now=this.people[k];
			ellipse(now.pos.x*width,now.pos.y*height,circlesize);
		}
		for(let k of Object.keys(this.people)){
			var now=this.people[k];
			text(k,now.pos.x*width,now.pos.y*height-circlesize);
		}
		if(hovering!="-1"){
			var tw=textWidth(this.people[hovering].name),th=fontsize;
			fill(255,255,255,196);
			rect(this.people[hovering].pos.x*width-tw/2-3,this.people[hovering].pos.y*height-th/2+circlesize-3,tw+6,th+6,3);
			fill(0);
			text(this.people[hovering].name,this.people[hovering].pos.x*width,this.people[hovering].pos.y*height+circlesize);
		}
	}
	save(){
		saveJSON(this.people,"data.json");
	}
}

function preload(){
	data=loadJSON("data.json");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	textAlign(CENTER,CENTER);

	g=new graph(); g.import(data);
}

function draw() {
	background(32);

	g.show(mouseX,mouseY);
}

function mousePressed(){
	selected="-1";
	for(let pp of Object.keys(g.people)){
		var p=g.people[pp];
		if((p.pos.x*width-mouseX)*(p.pos.x*width-mouseX)+(p.pos.y*height-mouseY)*(p.pos.y*height-mouseY)<circlesize*circlesize){ selected=pp; break; }
	}
}

function mouseDragged(){
	if(selected!="-1" && moveable){
		g.people[selected].pos.x=mouseX/width; g.people[selected].pos.y=mouseY/height; 
	}
}