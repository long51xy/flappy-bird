import { _decorator, Color, Component, find, Label, Node, Sprite, tween } from 'cc';
import Game, { GameState } from "./Game";
const { ccclass, property } = _decorator;

@ccclass('UIControl')
export class UIControl extends Component {

    private startUI: Node;
    private playingUI: Node;
    private overUI: Node;

    protected onLoad(): void {
        this.startUI = find("/Canvas/World/UI/StartUI");
        this.playingUI = find("/Canvas/World/UI/PlayingUI");
        this.overUI = find("/Canvas/World/UI/OverUI");
    }

    start() {

    }

    update(deltaTime: number) {

    }
    showStartUI() {
        this.startUI.active = true;
        let ui = this.startUI.getComponent(Sprite);
        tween(ui).to(1.0, { color: new Color(255, 255, 255, 255) }, {
            easing: "fade",
            onComplete: (target?: object) => {
                
            },
        })
            .start();
    }
    showOvertUI(score: number, bestScore: number) {
        this.overUI.active = true;
        const result = this.overUI.getChildByName("result");
        result.getChildByName("score").getComponent(Label).string = score.toString();
        result.getChildByName("best").getComponent(Label).string = bestScore.toString();
        let ui = this.overUI.getComponent(Sprite);
        tween(ui).to(1.0, { color: new Color(255, 255, 255, 255) }, {
            easing: "fade",
            onComplete: (target?: object) => {
                
            },
        })
            .start();
    }
    onBtnStart() {
        if (Game.single().state == GameState.Playing) {
            return;
        }
        console.log('开始游戏');
        Game.single().gameStart();
        let ui = this.startUI.getComponent(Sprite);
        tween(ui).to(1.0, { color: new Color(255, 255, 255, 0) }, {
            easing: "fade",
            onComplete: (target?: object) => {
                this.startUI.active = false;
            },
        })
            .start();

    }
    onBtnReset() {
        if (Game.single().state == GameState.Playing) {
            return;
        }
        console.log('重新开始游戏');
        Game.single().reset();
        let ui = this.overUI.getComponent(Sprite);
        tween(ui).to(1.0, { color: new Color(255, 255, 255, 0) }, {
            easing: "fade",
            onComplete: (target?: object) => {
                this.overUI.active = false;
                this.showStartUI();
            },
        })
            .start();
    }
}


