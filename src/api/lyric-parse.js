const timeExp = /\[(\d{2,}):(\d{2})(?:[\.\:](\d{2,3}))?]/g
const STATE_PAUSE = 0
const STATE_PLAYING = 1
export default class Lyric {
    constructor(lrc, hanlder = () => { }, speed = 1) {
        this.lrc = lrc
        this.lines = []
        this.state = STATE_PAUSE
        this.offset = 0
        this.speed = speed
        this.handler = hanlder
        this.dealData()
    }

    // init() {
    //     this.dealData();
    // }

    dealData() {
        const lineList = this.lrc.split("\n");
        lineList.forEach(item => {
            const result = timeExp.exec(item);
            if (!result) return;
            const txt = item.replace(timeExp, "").trim();
            if (!txt) return;
            this.lines.push({
                time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0),
                txt
            })
        });
        this.lines.map(e => {
            e.time = parseInt(e.time);
            return e;
        })
        // 根据时间排序
        this.lines.sort((a, b) => {
            return a.time - b.time;
        });
    }

    _findcurLineIndex(time) {
        for (let i = 0; i < this.lines.length; i++) {
            if (time <= this.lines[i].time) {
                return i
            }
        }
        return this.lines.length - 1
    }

    /**
     * 开始播放
     * @param {number} offset: 时间进度;
     * @param {boolean} isSeek: 是否拖动进度条 
     */
    play(offset = 0, isSeek = false) {
        if (!this.lines.length) return;
        this.state = STATE_PLAYING
        this.curLineIndex = this._findcurLineIndex(offset)
        this.offset = offset
        this.startStamp = +new Date() - offset
        this._callHandler(this.curLineIndex - 1)
        if (this.curLineIndex < this.lines.length) {
            clearTimeout(this.timer);
            // 继续播放
            this._playRest(isSeek);
        }
    }

    _playRest(isSeek = false) {
        let line = this.lines[this.curLineIndex]
        let delay;
        if (isSeek) {
            delay = line.time - (+new Date() - this.startStamp);
        } else {
            //拿到上一行的歌词开始时间，算间隔
            let preTime = this.lines[this.curLineIndex - 1] ? this.lines[this.curLineIndex - 1].time : 0;
            delay = line.time - preTime;
        }
        this.timer = setTimeout(() => {
            this._callHandler(this.curLineIndex++)
            if (this.curLineIndex < this.lines.length && this.state === STATE_PLAYING) {
                this._playRest()
            }
        }, (delay / this.speed))
    }

    _callHandler(i) {
        if (i < 0) {
            return
        }
        this.handler({
            txt: this.lines[i].txt,
            lineNum: i
        })
    }
}
