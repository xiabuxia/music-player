


    // <div id="div1"></div>
define(function(){


    var drag = (function(){


        function Drag(pannel,dragNode){
            this.dragNode = dragNode;
            this.parentNode = pannel;
            this.init(this.parentNode,this.dragNode);
            this.bind();

        } 

        Drag.prototype = {
                init: function(parentNode,id){
                    var _this = this;
                    this.div = document.querySelector(id);
                    this.willMoveNode = document.querySelector(parentNode);
                    if(this.div){
                        this.div.style.cursor = "move";
                        this.willMoveNode.style.position = "absolute";
                    }
                    this.distanceX = 0;
                    this.distanceY = 0;
                },
                bind:function(){
                    var _this = this;
                    this.lock = true;
                    if(_this.lock === true){
                        this.div.onmousedown = function(evt){
                            _this.getDistance(evt)
                            document.onmousemove = function(e){
                                    _this.setPosition(e)
                            }  
                            _this.willMoveNode.onmouseup = function(){
                                _this.clearEvent();
                            }
                        }
                        this.willMoveNode.onDragEnd = function(){
                            console.log(1)
                        }
                    }
            

                },
                getDistance: function(evt){
                    this.lock = false;
                    this.distanceX = evt.clientX - this.willMoveNode.offsetLeft;
                    this.distanceY = evt.clientY - this.willMoveNode.offsetTop;
                },
                setPosition: function(evt){
                    var left = evt.clientX - this.distanceX,
                        top = evt.clientY - this.distanceY;
                    if(evt.clientX < 0 || evt.clientY < 0 || evt.clientX >= window.innerWidth || evt.clientY >= window.innerHeight){
                        this.clearEvent();
                    }//当鼠标移出窗口的时候执行
                
                    if(left <= -this.willMoveNode.offsetWidth){
                        left = -this.willMoveNode.offsetWidth/2;
                    }else if(left >= document.documentElement.clientWidth - this.willMoveNode.offsetWidth){
                        left = document.documentElement.clientWidth - this.willMoveNode.offsetWidth;
                    }
                    if (top <=0){
                        top = 0;
                    }else if(top >= window.innerHeight- this.willMoveNode.offsetHeight){
                        top = document.documentElement.cilentHeight- this.willMoveNode.offsetHeight;
                    }
                    this.willMoveNode.style.left = left +'px';
                    this.willMoveNode.style.top = top + 'px';
                },
                clearEvent: function(){
                    this.willMoveNode.onmouseup = null;
                    document.onmousemove = null;
                    this.lock = true;
                }
        }
            return {
                start: function(){
                    new Drag('#pannel','#drag')
                }
            }
     })()
     return drag
})

     



