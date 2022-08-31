var data,font,map;
var date=0;
var mx=0,my=0,mxx,myy,mz=1,mwh;
var frame=1;
var ref,sta,rev,pause,play,fin,zi,zo,hudselect=false,dtbk="-1",dtb,infect=1;
var dt=0,tn,cur=3;


function hitormiss(x,y,w,h,cx,cy){
	return((cx>x && cx<x+w)&&(cy>y && cy<y+h));
}

function prevday(){
	if(date==0) return false;
	for(let n of data.date[date].list) m.delete(n);
	date--;
	return true;
}

function nextday(){
	if(date==data.date.length-1) return false;
	date++;
	for(let n of data.date[date].list) m.insert(n);
	return true;
}

class dot{
	constructor(x,y){
		this.pos=createVector(x,y);
		this.r=0; this.num=0;
	}
	show(){
		if(this.num==0) return;
		stroke(255,0,0); strokeWeight(2/mz);
		fill(255,0,0,128); ellipse(this.pos.x,this.pos.y,this.r*2/mz);
	}
	update(num){
		this.num=num; this.r=6+log(this.num)*3;
	}
}

class mapdot{
	constructor(dt){
		this.dot={};
		for(let k of Object.keys(dt.position)) this.dot[k]=new dot(mapx(data.position[k].lon),mapy(data.position[k].lat));
		this.dotselect="-1";
		this.dot["กรุงเทพมหานคร"].update(1);
	}
	show(){
		for(let k of Object.keys(this.dot)) this.dot[k].show();
	}
	insert(name){
		console.log(name);
		this.dot[name].update(this.dot[name].num=this.dot[name].num+1);
		infect++;
	}
	delete(name){
		this.dot[name].update(this.dot[name].num=this.dot[name].num-1);
		infect--;
	}
	mouseGrab(x,y){
		for(let k of Object.keys(this.dot)) if(this.dot[k].pos.dist(createVector(x,y))<this.dot[k].r){
			this.dotselect=k;
			break;
		}
		this.prevpos=createVector((x+mx)*mz,(y+my)*mz);
	}
	mouseRelease(x,y){
		if(this.prevpos.dist(createVector((x+mx)*mz,(y+my)*mz))<20){
			for(let k of Object.keys(this.dot)) if(this.dot[k].pos.dist(createVector(x,y))<this.dot[k].r/mz){
				if(dtbk!=k){ dtbk=k; dtb.html(k+" มีผู้ติดเชื้อทั้งหมด "+this.dot[dtbk].num+" ราย"); }
				break;
			}
			else dtbk="-1";
		}
		this.dotselect="-1";
	}
}

function preload(){
	data=loadJSON("data.json");
	font=loadFont("Kanit.ttf");
	map=loadImage("map.png");
	//https://api.mapbox.com/styles/v1/napats/ck82p0cjn0o161jqkj5dfhk52/static/101,13,5.8,0/1280x1280?access_token=pk.eyJ1IjoibmFwYXRzIiwiYSI6ImNrODJpem9zdDEwODEzZnJ5eDd2bmN6d2wifQ.oQLZRhGBi7hdHPpMw1dwcA
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	textFont(font);
	textAlign(CENTER,CENTER);
	textLeading(8);
	mwh=max(width,height);
	if(width>height){ mx=0; my=-(width-height)/2; }
	else { mx=-(height-width)/2; my=0; }
	
	var linkref=createA("http://covid19.th-stat.com","ข้อมูลอ้างอิงจาก covid19.th-stat.com อัพเดทล่าสุดเมื่อ 22.10 น. 30 มีนาคม 2563").style("color","inherit").style("text-decoration","none").position(width-350,height-20).style("font-size","10px").style("color","#fff");

	sta=createElement("i").class("em em-black_left_pointing_double_triangle_with_vertical_bar").position(width/2-84,36);
	rev=createElement("i").class("em em-rewind").position(width/2-48,36);
	pause=createElement("i").class("em em-double_vertical_bar").position(width/2-12,36)
	play=createElement("i").class("em em-fast_forward").position(width/2+24,36);
	fin=createElement("i").class("em em-black_right_pointing_double_triangle_with_vertical_bar").position(width/2+60,36)
	zi=createElement("i").class("em em-heavy_plus_sign").position(width-120,9);
	zo=createElement("i").class("em em-heavy_minus_sign").position(width-120,39);

	dtb=createP("").style("margin","0").style("color","#000").style("white-space","nowrap").style("font-size","10px");

	m=new mapdot(data);
}

function draw() {
		background(32);

		push();
		scale(mz);
		translate(mx,my);

		fill(255);
		image(map,0,0,mwh,mwh);
		
		m.show();
		//ellipse(mapx(99.8325),mapy(19.90858),5/mz);
		//for(let p of Object.keys(data.position)) ellipse(mapx(data.position[p].lon),mapy(data.position[p].lat),5/mz);
		//ellipse(mouseX/mz-mx,mouseY/mz-my,5/mz);

		pop();

		//hud
		noStroke();
		fill(64);
		rect(0,0,width,72);
		fill(240,144,0);
		rect(width-84,12,72,48,8);
		fill(255);
		rect(width-120,9,24,24,12);
		rect(width-120,39,24,24,12);
		textSize(16); text(betterDate(data.date[date].date),width/2,16)
		textSize(10); text("ยอดผู้ติดเชื้อ",width-48,20);
		textSize(20); text(infect,width-48,36);
		if(dtbk!="-1"){
			fill(255,255,255,160);
			rect(0,72,width,15);
			textSize(10);
			dtb.html(dtbk+" มีผู้ติดเชื้อทั้งหมด "+m.dot[dtbk].num+" ราย");
			dtb.show();
			dtb.position(width/2-textWidth(dtb.html())/2,72);
		}
		else dtb.hide();
		textAlign(LEFT);
		fill(255);
		textSize(12); text("COVID-19 Timeline",12,20);
		textSize(8); text("แผนที่แสดงผู้ติดเชื้อในแต่ละ",12,38,width/4);
		textSize(8); text("จังหวัดเรียงตามเวลา",12,48,width/4);
		textAlign(CENTER,CENTER);

		if(frame%20==0){
			if(dt==-1) prevday();
			if(dt==1) nextday();
		}
		frame++;
}

function mousePressed(){
	if(mouseY<72){
		hudselect=true;
		if(hitormiss(width/2-84,36,24,24,mouseX,mouseY)){
			dt=0;
			for(;prevday(););
		}
		else if(hitormiss(width/2-48,36,24,24,mouseX,mouseY)) dt=-1;
		else if(hitormiss(width/2-12,36,24,24,mouseX,mouseY)) dt=0;
		else if(hitormiss(width/2+24,36,24,24,mouseX,mouseY)) dt=1;
		else if(hitormiss(width/2+60,36,24,24,mouseX,mouseY)){
			dt=0;
			for(;nextday(););
		}
		else if(hitormiss(width-120,9,24,24,mouseX,mouseY)) zoomcanvas(-1);
		else if(hitormiss(width-120,39,24,24,mouseX,mouseY)) zoomcanvas(1);
	}
	else{
		hudselect=false;
		m.mouseGrab(mouseX/mz-mx,mouseY/mz-my);
		 mxx=mouseX; myy=mouseY;
	}
}

function mouseDragged(){
	if(!hudselect){
		if(true){
			mx+=(mouseX-mxx)/mz; my+=(mouseY-myy)/mz;
			mxx=mouseX; myy=mouseY;
			if(mx-width/mz<-mwh) mx=width/mz-mwh; if(mx>0) mx=0;
			if(my-height/mz<-mwh) my=height/mz-mwh; if(my>72/mz) my=72/mz;
		}
	}
}

function mouseReleased(){
	if(!hudselect) m.mouseRelease(mouseX/mz-mx,mouseY/mz-my);
}

function mouseWheel(d){
	if(mouseY>72){
		zoomcanvas(d.delta);
	}
}

function zoomcanvas(delta){
	var a=[width/mz,height/mz];
	if(delta<0) mz*=6/5;
	else mz*=5/6;
	if(mz<1) mz=1;
	if(mz>5) mz=5;
	mx+=(width/mz-a[0])/2; my+=(height/mz-a[1])/2;
	if(mx-width/mz<-mwh) mx=width/mz-mwh; if(mx>0) mx=0;
	if(my-height/mz<-mwh) my=height/mz-mwh; if(my>72/mz) my=72/mz;
}

function betterDate(s){
	var arr=s.split("/");
	var res="";
	res+=parseInt(arr[0])+" ";
	if(arr[1]=="01") res+="มกราคม ";
	else if(arr[1]=="02") res+="กุมภาพันธ์ ";
	else if(arr[1]=="03") res+="มีนาคม ";
	else if(arr[1]=="04") res+="เมษายน ";
	else if(arr[1]=="05") res+="พฤษภาคม ";
	else if(arr[1]=="06") res+="มิถุนายน ";
	else if(arr[1]=="07") res+="กรกฎาคม" ;
	else if(arr[1]=="08") res+="สิงหาคม ";
	else if(arr[1]=="09") res+="กันยายน ";
	else if(arr[1]=="10") res+="ตุลาคม ";
	else if(arr[1]=="11") res+="พฤศจิกายน ";
	else if(arr[1]=="12") res+="ธันวาคม ";
	res+=parseInt(arr[2])+543;
	return res;
}

function mapx(lon){
	return (mwh/2/PI*pow(2,5.8)*(radians(lon)+PI)-mwh/2/PI*pow(2,5.8)*(radians(101)+PI))/2.5+mwh/2;
}
function mapy(lat){
	return (mwh/2/PI*pow(2,5.8)*(PI-log(tan(PI/4+radians(lat)/2)))-mwh/2/PI*pow(2,5.8)*(PI-log(tan(PI/4+radians(13)/2))))/2.5+mwh/2;
}