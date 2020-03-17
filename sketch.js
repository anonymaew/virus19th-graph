var data,g;
var selected="-1",moveable=false;

function drawVector(x1,y1,x2,y2){
	
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
	show(){
		fill(255);
		strokeWeight(2);
		for(let k of Object.keys(this.people)){
			var now=this.people[k];
			for(let kk of now.infect){
				var child=this.people[kk];
				stroke(255);
				if(child!=null){
					line(now.pos.x*width,now.pos.y*height,child.pos.x*width,child.pos.y*height);
					
				}
				noStroke();
			}
			if(now.from.length==0) fill(255,200,200);
			else fill(255);
			ellipse(now.pos.x*width,now.pos.y*height,20);
			text(k,now.pos.x*width,now.pos.y*height-20);
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

	g.show();
}

function mousePressed(){
	selected="-1";
	for(let pp of Object.keys(g.people)){
		var p=g.people[pp];
		if((p.pos.x*width-mouseX)*(p.pos.x*width-mouseX)+(p.pos.y*height-mouseY)*(p.pos.y*height-mouseY)<400){ selected=pp; break; }
	}
}

function mouseDragged(){
	if(selected!="-1" && moveable){
		g.people[selected].pos.x=mouseX/width; g.people[selected].pos.y=mouseY/height; 
	}
}