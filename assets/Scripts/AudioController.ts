import { _decorator, AudioClip, AudioSource, CCBoolean, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export const enum AudioCode {
    //飞行
    Fly,
    Die,
    Hit,
    GainScore,
}

@ccclass('AudioController')
export class AudioController extends Component {

    @property({ type: AudioSource })
    audioSource: AudioSource = null;
    @property(CCBoolean)
    enableAudio: boolean = true;
    @property({ type: AudioClip, tooltip: "飞行的音效" })
    fly: AudioClip = null;
    @property({ type: AudioClip, tooltip: "死亡的音效" })
    die: AudioClip = null;
    @property({ type: AudioClip, tooltip: "碰撞的音效" })
    hit: AudioClip = null;
    @property({ type: AudioClip, tooltip: "得分的音效" })
    gainScore: AudioClip = null;

    start() {

    }

    update(deltaTime: number) {

    }

    playAudio(name: AudioCode, loop = false) {
        if (!this.enableAudio) return;
        switch (name) {
            case AudioCode.Fly:
                this.audioSource.playOneShot(this.fly);
                break;
            case AudioCode.Die:
                this.audioSource.playOneShot(this.die);
                break;  
            case AudioCode.Hit:
                this.audioSource.playOneShot(this.hit);
                break;
            case AudioCode.GainScore:
                this.audioSource.playOneShot(this.gainScore);
                break;        
        }

    }

    stopAudio(name: AudioCode) {
        if (!this.enableAudio) return;

        if (name == AudioCode.Fly) {
            this.audioSource.stop()
        }
    }
}


