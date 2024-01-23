import { _decorator, absMax, Canvas, CCInteger, Component, director, Node, UITransform, Vec3 } from 'cc';
import Game from './Game';
const { ccclass, property } = _decorator;

@ccclass('Ground')
export class Ground extends Component {

    private static instance = null
    static single(): Ground {
        return Ground.instance;
    }

    @property({
        type: CCInteger,
        tooltip: '滚动速度'
    })
    speed: number = 1;

    @property({
        type: CCInteger,
        tooltip: '地面高度'
    })
    height: number = 112;
    // 地面高度的y
    y: number = 0;

    onLoad() {
        if(!Ground.instance){
            Ground.instance = this
        }else{
            this.node.destroy()
        }
    }

    start() {
        let groundPos = this.node.getPosition();
        this.y = -(Math.abs(groundPos.y) - this.height);
    }

    update(deltaTime: number) {
        //背景循环滚动
        for (let ground of this.node.children) {
            let position: Vec3 = ground.getPosition();
            position.x -= this.speed * deltaTime;
            if (position.x < -(ground.getComponent(UITransform).width - 20)) {
                position.x += (ground.getComponent(UITransform).width - 20) * this.node.children.length;
            }
            ground.setPosition(position);
        }
    }

    //碰到地面
    detectCollision(position: Vec3): boolean {
        
        if (position.y <= this.y) {
            return true;
        } else {
            return false;
        }
        
    }
}


