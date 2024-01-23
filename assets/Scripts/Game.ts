import { _decorator, CCInteger, Component, Node, Sprite, Animation, NodePool, PhysicsSystem2D, Color, tween, Label, Vec3, Vec2 } from 'cc';
import { AudioCode, AudioController } from './AudioController';
import { PipeManager } from './PipeManager';
import { Bird } from './Bird';
import { UIControl } from './UIControl';

const { ccclass, property } = _decorator;

export const enum GameState {
    //开始中
    Playing,
    //结束
    GameOver,
}

@ccclass('Game')
export default class Game extends Component {

    private static instance = null
    static single(): Game {
        return Game.instance;
    }

    @property({
        type: Label,
        tooltip: '显示游戏得分'
    })
    scoreLabel: Label;

    private _score: number = 0;

    get score(): number {
        return this._score;
    }

    set score(v: number) {
        this._score = v;
    }

    /**
     * 最好的分数
     */
    private bestScore: number = 0;

    state: GameState = GameState.GameOver;

    @property({
        type: CCInteger,
        tooltip: '游戏显示分辨率宽'
    })
    width: number = 1280;
    @property({
        type: CCInteger,
        tooltip: '游戏显示分辨率高'
    })
    height: number = 720;

    @property({
        type: Node,
        tooltip: '世界'
    })
    world: Node;

    @property({
        type: UIControl,
        tooltip: '界面组件'
    })
    uiControl: UIControl

    @property({
        type: AudioController,
        tooltip: '音效'
    })
    audio: AudioController;

    @property({
        type: Vec3,
        tooltip: '鸟的复活点'
    })
    birdBindPos: Vec3;

    @property({
        type: Bird,
        tooltip: '鸟'
    })
    bird: Bird;

    @property({
        type: PipeManager,
        tooltip: '管道管理器'
    })
    pipeManager: PipeManager;

    onLoad() {
        if (!Game.instance) {
            Game.instance = this
        } else {
            this.node.destroy()
        }
    }

    start() {
        if (PhysicsSystem2D.instance.enable) {
            console.log('Physics Manager is enabled.');
        } else {
            console.error('Physics Manager is not enabled.');
        }
        this.bird.init(this);
    }

    update(deltaTime: number) {

    }

    gameStart() {
        this.state = GameState.Playing;
        this.score = 0;
        PipeManager.single().startSpawn();
        this.bird.startFly();
    }

    gameOver() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
        }
        this.state = GameState.GameOver;
        this.uiControl.showOvertUI(this.score, this.bestScore);
    }

    reset() {
        this.score = 0;
        this.scoreLabel.string = this.score.toString();
        this.pipeManager.reset();
    }

    // 得分
    gainScore() {
        this.score++;
        this.scoreLabel.string = this.score.toString();
        this.audio.playAudio(AudioCode.GainScore);
    }

    shake() {
        this.world.getComponent(Animation).play("Shake");
    }
    // 屏幕闪烁一下
    blinkOnce() {
        this.world.getComponent(Sprite).color = Color.WHITE;
        tween(this.world.getComponent(Sprite)).to(.1, { color: new Color(255, 255, 255, 0) }).start();
    }
}


