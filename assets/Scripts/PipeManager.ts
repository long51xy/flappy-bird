import { _decorator, CCInteger, Component, instantiate, Node, NodePool, Prefab, Vec3 } from 'cc';
import { PipeGroup } from './PipeGroup';
const { ccclass, property } = _decorator;

@ccclass('Pipe')
export class PipeManager extends Component {

    private static instance = null
    static single(): PipeManager {
        return PipeManager.instance;
    }

    @property({
        type: Prefab,
        tooltip: '预制的管道组'
    })
    pipeGroupPrefab: Prefab;
    @property({
        type: CCInteger,
        tooltip: '每批次创建管道的数量'
    })
    batchCount: number = 4;
    @property({
        type: CCInteger,
        tooltip: '每对管道之间的间距，单位px'
    })
    pipeSpacing: number = 200;
    @property({
        type: CCInteger,
        tooltip: '管道生成间隔时，单位秒'
    })
    spawnInterval: number = 1;

    pipeIsRunning: boolean = false;
    pipeList: Array<PipeGroup> = [];
    // 管道对象池
    private pipePool: NodePool = null;

    onLoad() {
        if (!PipeManager.instance) {
            PipeManager.instance = this
        } else {
            this.node.destroy()
        }

        this.pipeList = [];
        this.pipeIsRunning = false;
        // 创建pipe对象池
        this.pipePool = new NodePool();
        for (let i = 0; i < this.batchCount; ++i) {
            let pipe = instantiate(this.pipeGroupPrefab); // 创建节点
            this.pipePool.put(pipe); // 通过 putInPool 接口放入对象池
        };
    }

    // 定时生成管道
    startSpawn() {
        this.reset();
        this.pipeIsRunning = true;
        this.spawnPipe();
        this.schedule(this.spawnPipe, this.spawnInterval);
    }

    private spawnPipe() {
        let pipeGroup: PipeGroup = null;
        if (this.pipePool.size() > 0) {
            pipeGroup = this.pipePool.get().getComponent(PipeGroup);
        } else {
            pipeGroup = instantiate(this.pipeGroupPrefab).getComponent(PipeGroup);
        };
        pipeGroup.init(this.pipeList.length + 1);
        this.node.addChild(pipeGroup.node);
        pipeGroup.node.active = true;
        this.pipeList.push(pipeGroup);
    }

    // 回收管道
    recyclePipe(pipeGroup: PipeGroup) {
        this.node.removeChild(pipeGroup.node);
        pipeGroup.node.active = false;
        this.pipePool.put(pipeGroup.node);
        console.log("管道组长度", this.pipeList.length + 1);
    }
    // 获取下个未通过的水管
    getNext() {
        return this.pipeList.shift();
    }
    // 重置
    reset() {
        this.unschedule(this.spawnPipe);
        this.node.removeAllChildren();
        this.pipeList = [];
        this.pipeIsRunning = false;
    }
}


