import { _decorator, CCInteger, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, Tween, tween, UITransform, Vec3 } from 'cc';
import { Ground } from './Ground';
import Game from './Game';
import { AudioCode } from './AudioController';
import { PipeGroup } from './PipeGroup';
const { ccclass, property } = _decorator;

export const enum State {
    //游戏开始前的准备状态
    Ready,
    //小鸟上升中
    Rise,
    //小鸟自由落体中
    FreeFall,
    //小鸟碰撞到管道坠落中
    Drop,
    //小鸟已坠落到地面静止
    Dead,
}

export const enum Identity {
    //本地玩家
    Player,
    //网络玩家
    NetworkPlayer,
}

@ccclass('Bird')
export class Bird extends Component {
    @property({
        type: CCInteger,
        tooltip: '上抛初速度，单位：像素/秒'
    })
    initRiseSpeed: number = 800;
    @property({
        type: CCInteger,
        tooltip: '重力加速度，单位：像素/秒的平方'
    })
    gravity: number = 1000;
    // 状态
    state: State = State.Ready;
    // 当前速度
    private currentSpeed: number = 0;
    // 玩家身份类型
    identity: Identity = Identity.Player;
    // 缓动控制器
    private tweenAction: Tween<Node>;
    private nextPipe: PipeGroup;

    game: Game = null;

    update(deltaTime: number) {
        if (this.state === State.Ready || this.state === State.Dead) return;
        // 每帧更新bird位置
        this.updatePosition(deltaTime);
        // 每帧更新状态
        this.updateState();
        // 碰撞检测 处理
        this.detectCollision();
    }

    init(game: Game) {
        this.game = game;
        this.state = State.Ready;
        this.currentSpeed = 0;

        let collider2D = this.node.getComponent(Collider2D);//获取碰撞组件
        collider2D.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);//注册碰撞事件
        collider2D.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    //碰撞开始
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // console.log("撞击");
        // console.log('Collision Enter:', otherCollider.node.name);
        // 碰到柱子
        if (otherCollider.node.name.indexOf('pipe') > 0) {
            this.runDropAction();
        }

    }

    //碰撞结束
    private onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        return;
    }

    private updatePosition(deltaTime: number) {
        let flying = this.state === State.Rise || this.state === State.FreeFall || this.state === State.Drop;
        if (flying) {
            this.currentSpeed -= deltaTime * this.gravity;
            let position: Vec3 = this.node.getPosition();
            position.y += deltaTime * this.currentSpeed;
            // 限制飞行高度不能超出屏幕
            if (position.y >= this.game.height / 2) {
                position.y = this.game.height / 2;
                this.currentSpeed = 0;
            }
            this.node.setPosition(position);
        }
    }

    updateState() {
        switch (this.state) {
            case State.Rise:
                if (this.currentSpeed < 0) {
                    this.state = State.FreeFall;
                    this.runFallAction(.6);
                }
                break;  
        }
    }

    // 碰撞检查
    private detectCollision() {
        if (!this.nextPipe) return;
        if (this.state === State.Ready || this.state === State.Dead) return;
        let position: Vec3 = this.node.getPosition();
        //是否碰撞地面
        if (Ground.single().detectCollision(position)) {
            this.runGroundAction();
        } else if (this.state == State.Drop) {
            return;
        } else {
            // 处理没有发生碰撞的情况
            let birdLeft = this.node.getPosition().x;
            let pipeRight = this.nextPipe.node.getPosition().x + this.nextPipe.topPipe.getComponent(UITransform).width;
            let crossPipe = birdLeft > pipeRight;
            if (crossPipe) {
                this.game.gainScore();
                this.getNextPipe();
            }
            
        }
    }
    // 死亡
    private die() {
        this.game.audio.playAudio(AudioCode.Die);

        this.state = State.Dead
        //  触发游戏结束
        if (this.identity == Identity.Player) {
            console.log('游戏结束');
            this.game.gameOver();
        }
    }

    //生成管道
    getNextPipe() {
        this.nextPipe = this.game.pipeManager.getNext();
    }

    // 开始飞
    startFly() {
        this.state = State.Ready;
        this.getNextPipe();
        if (this.node.getPosition().y <= 0) {
            this.node.angle = 0;
            this.node.setPosition(this.game.birdBindPos);
        }
        console.log("开始飞");
        this.rise();
    }
    // 上升
    rise() {
        if (this.state == State.Dead || this.state == State.Drop) return;
        //播放音效
        this.game.audio.playAudio(AudioCode.Fly);
        this.state = State.Rise;
        this.currentSpeed = this.initRiseSpeed;
        this.runRiseAction();
    }
    // 上升动作
    private runRiseAction() {
        if (this.tweenAction) {
            this.tweenAction.stop();
            this.tweenAction = null;
        };
        this.tweenAction = tween(this.node).to(.3, { angle: 30 }, { easing: 'cubicOut' }).start()
    }
    // 下落动作
    private runFallAction(duration: number) {
        if (this.tweenAction) {
            this.tweenAction.stop();
            this.tweenAction = null;
        };
        this.tweenAction = tween(this.node).to(duration, { angle: -90 }, { easing: 'cubicIn' }).start()
    }
    // 碰撞管道
    private runDropAction() {
        this.game.audio.playAudio(AudioCode.Hit);
        // this.game.blinkOnce();
        this.game.shake();
        if (this.state == State.Dead) return;
        this.state = State.Drop;
        if (this.currentSpeed > 0) this.currentSpeed = 0;
        this.runFallAction(0.2);
    }
    // 碰撞地面
    private runGroundAction() {
        this.game.shake();
        this.runFallAction(0.2);

        // 修正最后落地位置
        let position: Vec3 = this.node.getPosition();
        position.y = Ground.single().y;
        this.node.setPosition(position);

        if (this.state != State.Dead) {
            this.die();
        }
        
    }
}


