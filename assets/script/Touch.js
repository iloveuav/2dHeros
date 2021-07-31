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
        nodeLine: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    /**
     * @description: 设置开始位置
     * @param {cc.v2} 开始位置
     * @return: 
     */
    setStartPos(pos){
        this.node.position = pos;
        this.nodeLine.width = 0;
    },

    /**
     * @description: 设置结束位置
     * @param {cc.v2} pos 结束位置 
     * @return: 
     */
    setEndPos(pos){
        let offset = pos.sub(this.node.position);
        this.nodeLine.width = offset.mag();
        let degress = cc.misc.radiansToDegrees(offset.signAngle(cc.v2(-1, 0)));
        cc.log(`degress:${degress}`);
        
        // 限定视野
        // if(degress > 90){
        //     this.node.rotation = 90;
        // }
        // else if(degress < -90){
        //     this.node.rotation = -90;
        // }
        // else{
            this.node.rotation = degress;
        // }
        
    },

    /**
     * @description: 获取力量大小
     * @param {type} 
     * @return: 
     */
    getForce(){
        if(this.nodeLine.width > 200){
            return 1;
        }
        else{
            return this.nodeLine.width / 200;
        }
    },
});
