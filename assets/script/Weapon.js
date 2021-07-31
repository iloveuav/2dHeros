/*
 * @Copyright: Copyright (c) 2019
 * @Author: caizhijun
 * @Version: 1.0
 * @Date: 2019-05-24 14:01:54
 */
// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        nodeArrow: cc.Node,
        nodeTopLine: cc.Node,
        nodeBotLine: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.MIN_ARROW = -3;//50; // 最小张度
        this.MAX_ARROW = 28; // 最大张度
    },

    start () {
        this.prepare();
    },

    // update (dt) {},

    /**
     * @description: 准备
     * @return: 
     */
    prepare(){
        this.setForce(0);
        this.nodeArrow.active = true;
        this.node.rotation = 0;
    },

    /**
     * @description: 设置力量大小
     * @param {number} force 力度 [0,1]
     * @return: 
     */
    setForce(force){
        if(force < 0  || force > 1){
            return;
        }

        // 反向力
        force = 1 - force;

        // 箭
        this.nodeArrow.x = this.MIN_ARROW + (this.MAX_ARROW - this.MIN_ARROW) * force;

        // 弦
        let offset = cc.v2(this.nodeArrow.x - this.nodeTopLine.x, this.nodeArrow.y - this.nodeTopLine.y);
        this.nodeTopLine.height = offset.mag();
        this.nodeTopLine.rotation = cc.misc.radiansToDegrees(offset.signAngle(cc.v2(0, -1)));
        
        offset = cc.v2(this.nodeArrow.x - this.nodeBotLine.x, this.nodeArrow.y - this.nodeBotLine.y);
        this.nodeBotLine.height = offset.mag();
        this.nodeBotLine.rotation = cc.misc.radiansToDegrees(offset.signAngle(cc.v2(0, 1)));
    },

    /**
     * @description: 开火
     * @param {type} 
     * @return: 
     */
    fire(){
        let node = cc.instantiate(this.nodeArrow);
        node.parent = this.nodeArrow.parent;
        this.nodeArrow.active  = false;
        // node.runAction(cc.moveTo(0.5, cc.winSize.width, 0));
        node.runAction(cc.sequence(
            cc.moveTo(1, cc.winSize.width * 1 , 0),
            cc.removeSelf()
        ));

        this.nodeTopLine.runAction(cc.rotateTo(0.1, 0));
        this.nodeBotLine.runAction(cc.rotateTo(0.1, 0));
    },
});
