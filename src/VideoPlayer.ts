class VideoPlayer extends egret.DisplayObjectContainer {

    private _video: egret.Video;

    constructor() {
        super();

        this.loadVideo();

        this.initCtr();
    }

    /** 加載 */
    private loadVideo(): void {
        this._video = new egret.Video();
        this._video.x = 0;                       //设置视频坐标x
        this._video.y = 0;                       //设置视频坐标y
        this._video.width = 1920;                 //设置视频宽
        this._video.height = 1080;                //设置视频高
        this._video.fullscreen = false;          //设置是否全屏（暂不支持移动设备）
        this._video.poster = "resource/assets/loading.png"; //设置loding图
        this._video.load("ws://192.168.30.41:8082/", true);
        this.addChild(this._video);              //将视频添加到舞台
        //监听视频加载完成
        this._video.once(egret.Event.COMPLETE, this.onLoad, this);
        //监听视频加载失败
        this._video.once(egret.IOErrorEvent.IO_ERROR, this.onLoadErr, this);
    }
    private onLoad(e: egret.Event) {
        var btnPlay: eui.Button = new eui.Button(); //新建播放按钮
        btnPlay.label = "播放";
        btnPlay.x = this._video.x + 20;
        btnPlay.y = this._video.y + this._video.height + 20;
        this.addChild(btnPlay);
        //监听按钮行为，当按下时调用播放函数。
        btnPlay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.play, this);
        //获取视频长度
        console.log(this._video.length);
    }
    private onLoadErr(e: egret.Event) {
        console.log("video load error happened", e);
    }
    //播放
    private play(): void {
        this.stop();

        this._video.play(this._pauseTime, false);
        this._video.addEventListener(egret.Event.ENDED, this.onComplete, this);
    }
    //停止
    private stop(): void {
        this._video.pause();
    }
    //播放完成
    private onComplete(e: egret.Event): void {
        console.log("播放结束");
        this._video.removeEventListener(egret.Event.ENDED, this.onComplete, this);

        this.setAllAbled(false);
    }

    private changeScreen(): void {
        if (!this._video.paused) {
            this._video.fullscreen = !this._video.fullscreen;
        }
    }
    /*** 本示例关键代码段结束 ***/

    /** 以下为 UI 代码 **/
    private _playTxt: egret.TextField;
    private _pauseTxt: egret.TextField;
    private _stopTxt: egret.TextField;
    private _fullTxt: egret.TextField;

    private _pauseTime: number = 0;
    /** 初始化控制 */
    private initCtr(): void {
        var _video: egret.Video = this._video;
        var rap: number = this._video.width / 4 + 5;
        var rapH: number = 100;

        //play
        var playTxt: egret.TextField = this._playTxt = new egret.TextField();
        playTxt.text = "播放";
        playTxt.size = 40;
        playTxt.x = this._video.x;
        playTxt.y = 400 + rapH;
        playTxt.touchEnabled = true;
        playTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.play(this._pauseTime, false);

            this.setAllAbled(true);
        }, this);
        this.addChild(playTxt);

        //stop
        var stopTxt: egret.TextField = this._stopTxt = new egret.TextField();
        stopTxt.text = "停止";
        stopTxt.size = 40;
        stopTxt.x = playTxt.x + rap * 1;
        stopTxt.y = 400 + rapH;
        stopTxt.touchEnabled = true;
        stopTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this._pauseTime = 0;
            _video.pause();

            this.setAllAbled(false);
        }, this);
        this.addChild(stopTxt);

        //pause 
        var pauseTxt: egret.TextField = this._pauseTxt = new egret.TextField();
        pauseTxt.text = "暂停";
        pauseTxt.size = 40;
        pauseTxt.x = playTxt.x + rap * 2;
        pauseTxt.y = 400 + rapH;
        pauseTxt.touchEnabled = true;
        pauseTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this._pauseTime = _video.position;
            _video.pause();

            this.setAllAbled(false);
        }, this);
        this.addChild(pauseTxt);

        //fullscreen 
        var fullTxt: egret.TextField = this._fullTxt = new egret.TextField();
        fullTxt.text = "全屏";
        fullTxt.size = 40;
        fullTxt.x = playTxt.x + rap * 3;
        fullTxt.y = 400 + rapH;
        fullTxt.touchEnabled = true;
        fullTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.changeScreen();
        }, this);
        this.addChild(fullTxt);

        this.setAllAbled(false);
    }

    private setAllAbled(isPlaying: boolean): void {
        this.setTextAbled(this._playTxt, !isPlaying);
        this.setTextAbled(this._stopTxt, isPlaying);
        this.setTextAbled(this._pauseTxt, isPlaying);
        this.setTextAbled(this._fullTxt, isPlaying);
    }

    private setTextAbled(text: egret.TextField, touchEnabled: boolean): void {
        text.touchEnabled = touchEnabled;
        if (touchEnabled) {
            text.textColor = 0xffffff;
        }
        else {
            text.textColor = 0x999999;
        }
    }
}