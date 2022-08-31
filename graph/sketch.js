var data,g;
var date=0,font;
var mx=0,my=0,mxx,myy,mz=1,mwh;
var frame=1;
var ref,sta,rev,pause,play,fin,zi,zo,hudselect=false,dtbk="-1",dtb,infect=0;
var dt=0,tn,cur=3;

function drawVector(x1,y1,x2,y2){
	push();
	translate(x1,y1);
	rotate(atan2(y2-y1,x2-x1));
	length=sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
	stroke(255,255,255,64);
	line(0,0,length,0);
	fill(255,255,255,64);
	triangle(length/2+5,0,length/2-5,3,length/2-5,-3);
	pop();
}

function hitormiss(x,y,w,h,cx,cy){
	return((cx>x && cx<x+w)&&(cy>y && cy<y+h));
}

class node{
	constructor(ob){
		this.pos=createVector(0,0);
		this.v=createVector(0,0);
		this.a=createVector(0,0);
		this.m=1; this.r;
		this.data=ob;
		if(this.data.icon!=null) this.icon=createElement("i").class(this.data.icon).attribute("align","center").style("margin","0").style("text-align","center");
		this.id=createElement("p",this.data.id).style("margin","0").style("color","#fff").style("white-space","nowrap");
	}
	show(){
		if(this.icon!=null) fill(0,0,128);
		else fill(240,144-this.m*8,0);
		noStroke();
		ellipse(this.pos.x,this.pos.y,14*this.r);
		if(this.icon!=null){
			if((this.pos.y+my)*mz<85) this.icon.hide();
			else this.icon.show();
			if((this.pos.y-10*this.r-10+my)*mz<85) this.id.hide();
			else this.id.show();
			this.icon.position((this.pos.x+mx-12)*mz,(this.pos.y+my-12)*mz).style("font-size",(16*mz).toString()+"px");
		}
		if((this.pos.y-10*this.r-10+my)*mz<85) this.id.hide();
		else this.id.show();
	}
	update(){
		textSize(10);
		this.v.add(this.a);
		this.pos.add(this.v);
		this.id.position((this.pos.x+mx-textWidth(this.data.id)/2)*mz,(this.pos.y-10*this.r-10+my)*mz).style("font-size",10*mz+"px");
		this.a=createVector(0,0);
	}
}

class vertx{
	constructor(from,to,length,k){
		this.from=from; this.to=to;
		this.length=length; this.k=k;
	}
	force(length){
		return (this.length-length)*(this.length-length)*this.k/4;
	}
}

class envi{
	constructor(){
		this.node={}; this.ver=[];
		this.repel=50; this.gc=10000000; this.dragc=3; this.tenc=0.0001;
		this.nodeselect="-1",this.prevpos;
	}
	addNode(ob){
		var inode=new node(ob);
		if(inode.data.from!=""){
			if(this.node[inode.data.from].data.from=="") inode.pos=this.node[inode.data.from].pos.copy().add(createVector(0,20).rotate(random(TWO_PI)));
			else inode.pos=this.node[inode.data.from].pos.copy().sub(this.node[this.node[inode.data.from].data.from].pos).setMag(20).rotate(random(-HALF_PI/2,HALF_PI/2)).add(this.node[inode.data.from].pos);
		}
		else inode.pos=createVector(0,date*5).rotate(random(TWO_PI));
		var a=ob.id.split("-");
		if(isNaN(a[0])) inode.m=5;
		else if(a.length==1){
			inode.m=1;
			infect=a[0];
		}
		else{
			inode.m=a[1]-a[0];
			infect=a[1];
		}
		inode.r=log(inode.m*3);
		this.node[ob.id]=inode;
	}
	addVer(ob){
		var iv=new vertx(ob.source,ob.target,80,this.tenc);
		this.ver.push(iv);
	}
	delNode(id){
		if(this.node[id].icon!=null) delete this.node[id].icon.remove();
		delete this.node[id].id.remove();
		var a=id.split(" ");
		if(!isNaN(a[0])){
			if(a.length==1) infect=a[0]-1;
			else infect=a[0]-1;
		}
		delete this.node[id];
	}
	delVer(){
		this.ver.pop();
	}
	addForce(){
		//apply forces
		for(let k of Object.keys(this.node)){
			var n1=this.node[k];
			//repel each node
			for(let kk of Object.keys(this.node)) if(this.node[k].pos.dist(this.node[kk].pos)<500) {
				if(k==kk) break;
				var n2=this.node[kk];
				var r=n1.pos.copy().sub(n2.pos);
				n1.a.add(r.copy().setMag(this.repel/(r.magSq()+10)));
			}
			//gravity
			n1.a.sub(n1.pos.copy().setMag(n1.pos.magSq()/this.gc));
			//friction
			n1.a.sub(n1.v.copy().setMag(n1.v.magSq()/this.dragc));
		}
		//tension
		for(let v of this.ver){
			var n1=this.node[v.from],n2=this.node[v.to];
			var r=n1.pos.copy().sub(n2.pos);
			if(r.mag()<v.length){
				n1.a.add(r.copy().setMag(v.force(r.mag())));
				n2.a.add(r.copy().setMag(-v.force(r.mag())));
			}
			else{
				n1.a.add(r.copy().setMag(-v.force(r.mag())));
				n2.a.add(r.copy().setMag(v.force(r.mag())));
			}
		}
		//update
		for(let k of Object.keys(this.node)) this.node[k].update();
	}
	show(){
		textSize(10);
		for(let v of this.ver) drawVector(this.node[v.from].pos.x,this.node[v.from].pos.y,this.node[v.to].pos.x,this.node[v.to].pos.y);
		for(let k of Object.keys(this.node)) this.node[k].show();
	}
	mouseGrab(x,y){
		for(let k of Object.keys(this.node)) if(this.node[k].pos.dist(createVector(x,y))<7*this.node[k].r){
			this.nodeselect=k;
			break;
		}
		this.prevpos=createVector((x+mx)*mz,(y+my)*mz);
	}
	mouseDrag(x,y){
		if(this.nodeselect!="-1") this.node[this.nodeselect].pos=createVector(x,y);	
	}
	mouseRelease(x,y){
		if(this.prevpos.dist(createVector((x+mx)*mz,(y+my)*mz))<20){
			for(let k of Object.keys(this.node)) if(this.node[k].pos.dist(createVector(x,y))<7*this.node[k].r){
				if(dtbk!=k){ dtbk=k; dtb.html("พบเชื้อครั้งแรกเมื่อ "+betterDate(this.node[dtbk].data.confirmat)+" "+this.node[dtbk].data.detailth); }
				else{
					if(dtbk=="-1"){ dtbk=k; dtb.html("พบเชื้อครั้งแรกเมื่อ "+betterDate(this.node[dtbk].data.confirmat)+" "+this.node[dtbk].data.detailth); }
					else{ dtbk="-1"; cur=3; }
				}
				break;
			}
			else{ dtbk="-1"; cur=3; }
		}
		this.nodeselect="-1";
	}
}

function prevday(){
	if(date==0) return false;
	for(let k of data.date[date].node) g.delNode(k.id);
	for(var i=0;i<data.date[date].link.length;i++) g.delVer();
	date--;
	return true;
}

function nextday(){
	if(date==data.date.length-1) return false;
	date++;
	for(let n of data.date[date].node) g.addNode(n);
	for(let v of data.date[date].link) g.addVer(v);
	return true;
}

function preload(){
	data=loadJSON("data.json");
	font=loadFont("Kanit.ttf");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	textFont(font);
	textAlign(CENTER,CENTER);
	textLeading(8);
	mx=width/2,my=height/2;
	mwh=max(width,height);
	
	var linkref=createA("http://covid19.th-stat.com","ข้อมูลอ้างอิงจาก covid19.th-stat.com อัพเดทล่าสุดเมื่อ 22.10 น. 30 มีนาคม 2563").style("color","inherit").style("text-decoration","none").position(width-350,height-20).style("font-size","10px").style("color","#fff");

	sta=createElement("i").class("em em-black_left_pointing_double_triangle_with_vertical_bar").position(width/2-84,36);
	rev=createElement("i").class("em em-rewind").position(width/2-48,36);
	pause=createElement("i").class("em em-double_vertical_bar").position(width/2-12,36)
	play=createElement("i").class("em em-fast_forward").position(width/2+24,36);
	fin=createElement("i").class("em em-black_right_pointing_double_triangle_with_vertical_bar").position(width/2+60,36);
	zi=createElement("i").class("em em-heavy_plus_sign").position(width-120,9);
	zo=createElement("i").class("em em-heavy_minus_sign").position(width-120,39);

	dtb=createP("").style("margin","0").style("color","#000").style("white-space","nowrap").style("font-size","10px");

	g=new envi();
	g.addNode(data.date[0].node[0]);
}

function draw() {
		background(32);

		push();
		scale(mz);
		translate(mx,my);

		fill(255);
		//ellipse(mouseX/mz-mx,mouseY/mz-my,5/mz);

		g.show();
		g.addForce();
/*
		if(frame%20==0 && date<79){
			date++;
			for(let n of data.date[date].node) g.addNode(n);
			for(let v of data.date[date].link) g.addVer(v);
		}
		*/
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
			dtb.show();
			dtb.position(cur,72);
			if(textWidth(dtb.html())>width) cur--;
			if(cur<-textWidth(dtb.html())) cur=width;
		}
		else dtb.hide();
		textAlign(LEFT);
		fill(255);
		textSize(12); text("COVID-19 Timeline",12,20);
		textSize(8); text("กราฟแสดงผู้ติดเชื้อ",12,38,width/4);
		textSize(8); text("ในประเทศไทยเรียงตามเวลา",12,48,width/4);
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
			for(;nextday();) for(var i=0;i<10;i++) g.addForce();
		}
		else if(hitormiss(width-120,9,24,24,mouseX,mouseY)) zoomcanvas(-1);
		else if(hitormiss(width-120,39,24,24,mouseX,mouseY)) zoomcanvas(1);
	}
	else{
		hudselect=false;
		g.mouseGrab(mouseX/mz-mx,mouseY/mz-my);
		if(g.nodeselect=="-1"){ mxx=mouseX; myy=mouseY; }
	}
}

function mouseDragged(){
	if(!hudselect){
		if(g.nodeselect=="-1"){
			mx+=(mouseX-mxx)/mz; my+=(mouseY-myy)/mz;
			mxx=mouseX; myy=mouseY;
			if(mx-width/mz<-mwh*2) mx=width/mz-mwh*2; if(mx>mwh*2) mx=mwh*2;
			if(my-height/mz<-mwh*2) my=height/mz-mwh*2; if(my>mwh*2) my=mwh*2;
		}
		else g.mouseDrag(mouseX/mz-mx,mouseY/mz-my);
	}
}

function mouseReleased(){
	if(!hudselect) g.mouseRelease(mouseX/mz-mx,mouseY/mz-my);
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
	if(mz<0.5) mz=0.5;
	if(mz>10) mz=10;
	mx+=(width/mz-a[0])/2; my+=(height/mz-a[1])/2;
	if(mx-width/mz<-mwh*2) mx=width/mz-mwh*2; if(mx>mwh*2) mx=mwh*2;
	if(my-height/mz<-mwh*2) my=height/mz-mwh*2; if(my>mwh*2) my=mwh*2;
}

function keyPressed(){
	if(key=="a") g.delVer();
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