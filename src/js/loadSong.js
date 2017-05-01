


define(function(){

    var player = {
        start: function(){
               // ajax部分
                var opt = {
                        url: 'https://jirenguapi.applinzi.com/fm/getSong.php?callback=play',
                        type: 'get',
                        data: {},
                        success: function(ret){
                            var first = ret.indexOf('('),
                                last = ret.indexOf(')');
                            var retObj = ret.slice(first+1,last)
                            var obj = JSON.parse(retObj)
                            var lrcID = obj.song[0].sid
                            loadMusic(obj)
                            render(obj)
                            getLrc(lrcID)
                        },
                        error: function(){
                            console.log("error")
                        }
                    }
                    
                    
                   
                /*ajax 获取歌曲信息 start*/
                
                function ajax(opts){
                    
                    var xhr = new XMLHttpRequest();
                    if(opts.type === 'get'){
                        xhr.open('get',opts.url+'&'+'timg='+new Date().getTime());// 无用参数，为了兼容ie，IE有个缓存机制，对请求的url进行判断，发现短时间内请求的url相同，则使用缓存的数据，而不是去重新向服务器获取一次数据。
                        xhr.send();
                    }else if(opts.type === 'post'){
                        xhr.open('post',opts.url);
                        xhr.send(null)
                    }
                    xhr.onreadystatechange = function(){
                        if(xhr.readyState === 4 && xhr.status === 200){
                            opts.success(xhr.responseText)
                        }else if(xhr.status === 404){
                            console.log('404')
                        }
                    }
                        
                }
                /*ajax 获取歌曲信息 end*/

                function getLrc(id){
                 
                    var xhrLrc = new XMLHttpRequest()
                    xhrLrc.open('get','https://jirenguapi.applinzi.com/fm/getLyric.php'+'?'+'sid='+id);
                    xhrLrc.send();
                    xhrLrc.onreadystatechange = function(){
                        if(xhrLrc.readyState === 4 && xhrLrc.status === 200){
                           var obj = JSON.parse(xhrLrc.responseText)
                            appendLrc(obj)
                        }else if(xhrLrc.status === 404){
                            console.log('404')
                        }
                    }
                }
//ajax部分 end
                // 处理歌词
                function appendLrc(obj){
                   var lrc = obj.lyric
                   var arr = lrc.split('[')
                   
                   var arr1 = [];
                   for(var i=0;i<arr.length;i++){
                       if(arr[i] !== ""){
                            a = arr[i].split(']')
                            arr1[i] = a[1]
                       }
                   }

   
                   var lrcNode = document.querySelector('.lrc')
                   
                   for(var i=1;i<arr1.length;i++){
                       var node = document.createElement('p')
                        node.innerHTML = arr1[i];
                        lrcNode.appendChild(node)
                   }
                   justice(arr1)
                           
                }
                // 判断歌词是否超出边界，超出则出现滚动条

                function justice(arr){
                    if(arr.length>11){
                        lrcPannel.style.cssText = 'overflow-y: scroll'
                    }else{
                        lrcPannel.style.cssText = 'overflow-y: none'
                    }
                    
                }

                


                    
                // 选择dom
                var pannel = $('#pannel'),
                    playPre = $('#play-pre'),
                    playNext = $('#play-next'),
                    songTitle = $('#song-title'),
                    songAuthor = $('#author'),
                    songStop = $('#play'),
                    titleUl = $('#information-ct'),
                    songCt = $('#song'),
                    timeNode = $('#current-time'),
                    playDotNode = $('#play-dot'),
                    progressNode = $('#play-progress'),
                    progressNodeCt = $('.ct'),
                    lrcNode = $('#songLrc'),
                    lrcPannel = $('#lrc-ct');
                var lock = true;
                var flag = false; 

                function $(node){
                    return document.querySelector(node)
                }
                

                // 实例化Audio对象
                var music = new Audio()
                music.autoplay = true
                music.shouldUpdate = true;
                var musicTime,num,percent;

                // 获取歌曲时间
                music.addEventListener('timeupdate',function(){
                    if(music.duration !== 'NAN' && music.shouldUpdate === true){
                        musicTime = music.duration
                        music.shouldUpdate=false;
                    }
                    updateProgress()
                })

                //绑定事件开始
                // 点击显示歌词
                lrcNode.onclick = function(e){
                    e.stopPropagation();
                    var spanNode = lrcNode.querySelector('span')
         
                    if(lrcPannel.classList[0] === 'showLrc'){
                        lrcPannel.setAttribute('class',' ');
                        $('#line-left').setAttribute('class','line')
                        $('#line-right').setAttribute('class','line')
                        spanNode.style.cssText = "border-left: 5px solid transparent;border-right: 5px solid transparent;border-top: 5px solid #000;position:relative;top:3px;"
                    }else{
                        lrcPannel.setAttribute('class','showLrc');
                         $('#line-left').setAttribute('class','line showLrc')
                         $('#line-right').setAttribute('class','line showLrc')
                         spanNode.style.cssText = "border-left: 5px solid #000;border-right: 5px solid transparent;border-top: 5px solid transparent;position:relative;top:0px;"
                    }
                  
                }



                $('#songLrc').addEventListener('click',function(e){
                    e.stopPropagation()
                }) 

                // 点击进度条，白条覆盖
                progressNode.onclick = function(e){
                    var evt = e,
                    _this = this;
                   clickMove(evt,_this)
                }
                playDotNode.onclick = function(e){
                   var evt = e;
                   clickMove(evt,progressNode)
                }

                function clickMove(e,node){
                    percent = e.offsetX/parseInt(getComputedStyle(node).width);
                    music.currentTime = percent * music.duration;
                    playDotNode.style.width = percent*100+'%';
                    updateProgress()
                }

                /*防重复点击*/
                lockClick()

                function lockClick(){

                    songStop.className = '';
                    var lrcNode = document.querySelector('.lrc');
                    var titleCtNode = $('#information-ct');
                    
                    if(lrcNode.innerHTML!==''){
                        lrcNode.innerHTML = '';

                    }
                    if(!flag){
                        flag = true;
                        ajax(opt)
                        titleCtNode.style.left = '0'
                    }
                    
                    
                }

                 /*防重复点击 end*/

                //前一首
                playPre.onclick = function(){
                    lockClick()
                }
                // 下一首
                playNext.onclick = function(){     
                    lockClick()
                }

                // 点击上一曲和下一曲按钮样式改变
                playNext.onmousedown = function(){
                    this.style.borderLeftColor = 'red'
                    this.onmouseup = function(){
                        this.style.borderLeftColor = '#000'
                    }
                }
                playPre.onmousedown = function(){
                    this.style.borderRightColor = 'red'
                    this.onmouseup = function(){
                        this.style.borderRightColor = '#000'
                    }
                }

                // 暂停
                songStop.addEventListener('click',function(){
                    if(lock === true){
                        this.className = 'active'
                        music.pause()
                        lock = false;
                    }else{
                        this.className = '';
                        music.play()
                        lock = true;
                    }
                })

                // 自动下一曲
                music.onended = function(){
                    ajax(opt)
                }

                // 获取歌曲
                function loadMusic(objs){
                    music.src = objs.song[0].url
                    
                }

                // 把拿到歌曲的相关信息赋值到Audio对象里
                function render(objs){
                    songTitle.innerHTML = objs.song[0].title;
                    songAuthor.innerHTML = objs.song[0].artist;
                    noTitle() 
                     
                }
                function noTitle(){
                    flag = false; 
                    titleMove()
                    if(songTitle.innerText === ''){
                        songTitle.innerText = '音乐-学习的伙伴'
                    }
                }




                // 更新时间和进度条
                function updateProgress(){
                var progressNodeWidth =  window.getComputedStyle(progressNode,null).width;
                var minutes = parseInt(music.currentTime/60);
                var seconds = parseInt(music.currentTime%60)+'';
                percent = music.currentTime/music.duration;
                playDotNode.style.width = parseInt(percent*parseInt(progressNodeWidth))+'px';
                seconds = seconds.length == 2 ? seconds : '0'+seconds
                timeNode.innerText = minutes + ':' + seconds


                }
                

                // 判断歌名和作者名所占的长度，如果超出了外框的长度，则就让它往左不停滚动
                var index =0;
                setInterval(titleMove,30)
                function titleMove(){
                        index -= 1;
                    var titleWidth = titleUl.scrollWidth,
                        titleCtWidth = songCt.clientWidth;
                        authorMarginLeft = window.getComputedStyle(songAuthor,null).marginLeft;
                        authorWidth = songAuthor.scrollWidth;
                    // authorWidth+authorMarginLeft margi-left的距离加上作者名字的长度
                    if( titleWidth > titleCtWidth ||  authorWidth+authorMarginLeft > titleCtWidth  ){
                        titleUl.style.left = index+'px';
                    // 当全部内容移出框之后，整体往右移回来
                        if(Math.abs(index) > titleWidth){
                            index = titleCtWidth;
                        }
                    }
                }
        }
    }
    return player
})





