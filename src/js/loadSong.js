


define(function(){

    var player = {
        start: function(){

                                // ajax请求部分
                var opt = {
                        url: 'http://api.jirengu.com/fm/getSong.php?callback=play',
                        type: 'get',
                        data: {},
                        success: function(ret){
                            var first = ret.indexOf('('),
                                last = ret.indexOf(')');
                            var retObj = ret.slice(first+1,last)
                            //console.log(retObj)
                             obj = JSON.parse(retObj)
                             //console.log(obj.song[0].title)
                            //var obj = JSON.parse(retObj)
                            loadMusic(obj)
                            render(obj)
                        },
                        error: function(){
                            console.log("error")
                        }
                    }

                    ajax(opt)

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
                    progressNodeCt = $('.ct');
                var lock = true;

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

                // 点击进度条，小黑点跟着动
                progressNode.onclick = function(e){
                    percent = e.offsetX/parseInt(getComputedStyle(this).width)
                    music.currentTime = percent * music.duration;
                    playDotNode.style.width = percent*100+"px";
                    updateProgress()
                }


                playPre.onclick = function(){
                    songStop.className = '';
                    ajax(opt)
                }
                playNext.onclick = function(){
                    songStop.className = '';
                    ajax(opt)
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
                    songTitle.innerText = objs.song[0].title;
                    songAuthor.innerText = objs.song[0].artist;   
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





