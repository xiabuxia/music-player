define("Drag",[],function(){return function(){function t(t,e){this.dragNode=e,this.parentNode=t,this.init(this.parentNode,this.dragNode),this.bind()}return t.prototype={init:function(t,e){this.div=document.querySelector(e),this.willMoveNode=document.querySelector(t),this.div&&(this.div.style.cursor="move",this.willMoveNode.style.position="absolute"),this.distanceX=0,this.distanceY=0},bind:function(){var t=this;this.lock=!0,!0===t.lock&&(this.div.onmousedown=function(e){t.getDistance(e),document.onmousemove=function(e){t.setPosition(e)},t.willMoveNode.onmouseup=function(){t.clearEvent()}},this.willMoveNode.onDragEnd=function(){console.log(1)})},getDistance:function(t){this.lock=!1,this.distanceX=t.clientX-this.willMoveNode.offsetLeft,this.distanceY=t.clientY-this.willMoveNode.offsetTop},setPosition:function(t){var e=t.clientX-this.distanceX,n=t.clientY-this.distanceY;(t.clientX<0||t.clientY<0||t.clientX>=window.innerWidth||t.clientY>=window.innerHeight)&&this.clearEvent(),e<=-this.willMoveNode.offsetWidth?e=-this.willMoveNode.offsetWidth/2:e>=document.documentElement.clientWidth-this.willMoveNode.offsetWidth&&(e=document.documentElement.clientWidth-this.willMoveNode.offsetWidth),n<=0?n=0:n>=window.innerHeight-this.willMoveNode.offsetHeight&&(n=document.documentElement.cilentHeight-this.willMoveNode.offsetHeight),this.willMoveNode.style.left=e+"px",this.willMoveNode.style.top=n+"px"},clearEvent:function(){this.willMoveNode.onmouseup=null,document.onmousemove=null,this.lock=!0}},{start:function(){new t("#pannel","#drag")}}}()}),define("loadSong",[],function(){return{start:function(){function t(t){var e=new XMLHttpRequest;"get"===t.type?(e.open("get",t.url+"&timg="+(new Date).getTime()),e.send()):"post"===t.type&&(e.open("post",t.url),e.send(null)),e.onreadystatechange=function(){4===e.readyState&&200===e.status?t.success(e.responseText):404===e.status&&console.log("404")}}function e(t){return document.querySelector(t)}function n(t){w.src=t.song[0].url}function o(t){d.innerText=t.song[0].title,u.innerText=t.song[0].artist}function i(){var t=window.getComputedStyle(g,null).width,e=parseInt(w.currentTime/60),n=parseInt(w.currentTime%60)+"";N=w.currentTime/w.duration,m.style.width=parseInt(N*parseInt(t))+"px",n=2==n.length?n:"0"+n,p.innerText=e+":"+n}function s(){M-=1;var t=h.scrollWidth,e=f.clientWidth;authorMarginLeft=window.getComputedStyle(u,null).marginLeft,authorWidth=u.scrollWidth,(t>e||authorWidth+authorMarginLeft>e)&&(h.style.left=M+"px",Math.abs(M)>t&&(M=e))}var l={url:"http://api.jirengu.com/fm/getSong.php?callback=play",type:"get",data:{},success:function(t){var e=t.indexOf("("),i=t.indexOf(")"),s=t.slice(e+1,i);obj=JSON.parse(s),n(obj),o(obj)},error:function(){console.log("error")}};t(l);var r=(e("#pannel"),e("#play-pre")),c=e("#play-next"),d=e("#song-title"),u=e("#author"),a=e("#play"),h=e("#information-ct"),f=e("#song"),p=e("#current-time"),m=e("#play-dot"),g=e("#play-progress"),v=(e(".ct"),!0),w=new Audio;w.autoplay=!0,w.shouldUpdate=!0;var y,N;w.addEventListener("timeupdate",function(){"NAN"!==w.duration&&!0===w.shouldUpdate&&(y=w.duration,w.shouldUpdate=!1),i()}),g.onclick=function(t){N=t.offsetX/parseInt(getComputedStyle(this).width),w.currentTime=N*w.duration,m.style.width=100*N+"px",i()},r.onclick=function(){a.className="",t(l)},c.onclick=function(){a.className="",t(l)},c.onmousedown=function(){this.style.borderLeftColor="red",this.onmouseup=function(){this.style.borderLeftColor="#000"}},r.onmousedown=function(){this.style.borderRightColor="red",this.onmouseup=function(){this.style.borderRightColor="#000"}},a.addEventListener("click",function(){!0===v?(this.className="active",w.pause(),v=!1):(this.className="",w.play(),v=!0)}),w.onended=function(){t(l)};var M=0;setInterval(s,30)}}}),requirejs.config({baseUrl:"./src/js",paths:{}}),requirejs(["Drag","loadSong"],function(t,e){t.start(),e.start()}),define("main",function(){});