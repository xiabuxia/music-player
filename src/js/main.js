requirejs.config({
    baseUrl: './src/js',
    paths: {

    }
})

requirejs(['Drag','loadSong'],function(drag,loadSong){
    drag.start()
    loadSong.start()
})