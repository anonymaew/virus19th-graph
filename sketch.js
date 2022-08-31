var graph,mapp,img,butg,butm,font;
var mxwh,mnwh,w,sw,sh,per1=0,per2=0;

function hitormiss(x,y,wi,h,mx,my){
	return((x<mx&&mx<x+wi)&&(y<my&&my<y+h));
}

function preload(){
	graph=loadImage("graph.png");
	mapp=loadImage("map.png");
	font=loadFont("Kanit.ttf");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	mxwh=(width>height) ? width : height;
	mnwh=(width<height) ? width : height;
	w=width>height;
	sw=mxwh*2/5; sh=mnwh-mxwh/10; if(!w){ var t=sw; sw=sh; sh=t; }

	butg=createA("graph/","").position(mxwh/20,mxwh/20).style("width",sw+"px").style("height",sh+"px");
	butm=createA("map/","").position(mxwh/20*((w)?11:1),mxwh/20*((w)?1:11)).style("width",sw+"px").style("height",sh+"px");

	textAlign(CENTER,CENTER); textSize(48); textFont(font);
	noStroke();
}

function draw() {
	background(48);

	//over y
	if(sw>sh){
		image(graph,mxwh/20,mxwh/20,sw,sh,0,270-sh/sw*270,540,sh/sw*540);
		image(mapp,mxwh/20*((w)?11:1),mxwh/20*((w)?1:11),sw,sh,0,270-sh/sw*270,540,sh/sw*540);
	}
	//over x
	else{
		image(graph,mxwh/20,mxwh/20,sw,sh,270-sw/sh*270,0,sw/sh*540,540);
		image(mapp,mxwh/20*((w)?11:1),mxwh/20*((w)?1:11),sw,sh,270-sw/sh*270,0,sw/sh*540,540);
	}
	fill(0,0,0,per1/100*128); rect(mxwh/20,mxwh/20,sw,sh); fill(255,255,255,per1/100*255); text("Graph",mxwh/20+sw/2,mxwh/20+sh/2);
	fill(0,0,0,per2/100*128); rect(mxwh/20*((w)?11:1),mxwh/20*((w)?1:11),sw,sh); fill(255,255,255,per2/100*255); text("Map",mxwh/20*((w)?11:1)+sw/2,mxwh/20*((w)?1:11)+sh/2);

	if(hitormiss(mxwh/20,mxwh/20,sw,sh,mouseX,mouseY) && per1<100) per1+=5;
	else if(per1>0) per1-=5;
	if(hitormiss(mxwh/20*((w)?11:1),mxwh/20*((w)?1:11),sw,sh,mouseX,mouseY) && per2<100) per2+=5;
	else if(per2>0) per2-=5;
}