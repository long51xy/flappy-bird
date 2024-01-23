import { _decorator, CCInteger, Component, find, Node, UITransform } from 'cc';
import { PipeManager } from './PipeManager';
import Game from './Game';
const { ccclass, property } = _decorator;

@ccclass('PipeGroup')
export class PipeGroup extends Component {

    @property({
        type: CCInteger,
        tooltip: '管道移动速度，单位px/s'
    })
    pipeMoveSpeed: number = -100;
    @property({
        type: CCInteger,
        tooltip: '上方管子最小高度',
    })
    topPipeMinHeight: number = 100;
    @property({
        type: CCInteger,
        tooltip: '上方管子最大高度'
    })
    topPipeMaxHeight: number = 250;
    @property({
        type: CCInteger,
        tooltip: '上、下管子垂直间距最小值'
    })
    spacingMinValue: number = 150;
    @property({
        type: CCInteger,
        tooltip: '上、下管子垂直间距最大值'
    })
    spacingMaxValue: number = 200;
    @property({
        type: Node,
        tooltip: '上方管子节点'
    })
    topPipe: Node;
    @property({
        type: Node,
        tooltip: '下方管子节点'
    })
    bottomPipe: Node;

    init(index: number) {
        this.initPositionX(index);
        this.initPositionY();
    }
    // 设置节点在x轴的初始位置
    private initPositionX(index: number) {
        let sceneRight = Game.single().width / 2;
        let pos = this.node.getPosition();
        pos.x = sceneRight + index * PipeManager.single().pipeSpacing;
        console.log(index, pos.x);
        this.node.setPosition(pos);
    }
    // 设置上、下管道y轴位置以及之间的距离 
    private initPositionY() {
        let topPipeMaxY = Game.single().height / 2 - this.topPipeMinHeight;
        let topPipeRandomY = Math.floor(Math.random() * (this.topPipeMaxHeight - this.topPipeMinHeight + 1)) + this.topPipeMinHeight;
        let spacing = this.spacingMinValue + Math.random() * (this.spacingMaxValue - this.spacingMinValue);

        let topPipePos = this.topPipe.getPosition();
        topPipePos.y = topPipeMaxY - topPipeRandomY;
        this.topPipe.setPosition(topPipePos);
        let bottomPipePos = this.bottomPipe.getPosition();
        bottomPipePos.y = topPipePos.y - spacing;
        this.bottomPipe.setPosition(bottomPipePos);
        console.log("topPipeRandomY", topPipeRandomY, "spacing", spacing, "topPipePos.y", topPipePos.y, "bottomPipePos.y", bottomPipePos.y);
    }
    update(deltaTime: number) {
        if (!PipeManager.single().pipeIsRunning) return;
        // 实时更新管道位置
        let pos = this.node.getPosition();
        pos.x += this.pipeMoveSpeed * deltaTime;
        this.node.setPosition(pos);
        // 超出屏幕显示范围了，就可以回收本对象了
        if (pos.x < -(Game.single().width / 2 + 100)) PipeManager.single().recyclePipe(this);
    }
}


