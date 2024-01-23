import { _decorator, Component, EventKeyboard, EventTouch, find, Input, input, KeyCode, Node, Sprite, UITransform, v2, v3 } from 'cc';
import Game from './Game';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    _node: Node = null;

    onLoad() {
        this._node = find("/Canvas/World");
        console.log('加载操作');
    }

    start() {

    }

    update(deltaTime: number) {

    }

    onEnable() {
        this._node.on(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this._node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDisable() {
        this._node.off(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this._node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    private onTouchStart(event: EventTouch) {
        console.log('触摸了屏幕');
        Game.single().bird.rise();
    }

    private onTouchEnd(event: EventTouch) {
        console.log('触摸完屏幕');
    }

    private onKeyDown(event: EventKeyboard ) {
        switch (event. keyCode) {
            case KeyCode.SPACE:
                console.log('按下了回车');
                Game.single().bird.rise();
                break;
            default:
                break;
        }
       
    }

    private onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.SPACE:
                console.log('释放了回车');
                break;
            default:
                break;
        }
        
    }
}


