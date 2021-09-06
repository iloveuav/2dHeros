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
        nodeStart: cc.Node,
        nodeWeapon: cc.Node, // 武器
        nodeTouch: cc.Node, // 触摸
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, event => {
            // 方向
            this.nodeTouch.active = true;
            let pos = this.nodeTouch.parent.convertToNodeSpaceAR(event.getLocation());
            this.nodeTouch.getComponent('Touch').setStartPos(pos);            

            // 武器
            this.nodeWeapon.getComponent('WeaponManage').prepare();
        });

        this.node.on(cc.Node.EventType.TOUCH_MOVE, event => {
            // 方向
            let pos = this.nodeTouch.parent.convertToNodeSpaceAR(event.getLocation());
            let jsTouch = this.nodeTouch.getComponent('Touch');
            jsTouch.setEndPos(pos);

            // 武器
            cc.log(jsTouch.getForce());
            this.nodeWeapon.getComponent('WeaponManage').setForce(jsTouch.getForce());
            this.nodeWeapon.rotation = this.nodeTouch.rotation;
        });

        this.node.on(cc.Node.EventType.TOUCH_END, event => {
            // 方向           
            this.nodeTouch.active = false;
            // 武器
            this.nodeWeapon.getComponent('WeaponManage').fire();
        });
    },

    start () {
        let v = cc.v2(1,1); // 45
        cc.log(v.signAngle(cc.v2(1, 0)));

        v.x = 0;
        v.y = 1;
        cc.log(v.signAngle(cc.v2(1, 0))); //90

        v.x = -1;
        v.y = 0;
        cc.log(v.signAngle(cc.v2(1, 0))); // 180

        v.x = 0;
        v.y = -1;
        cc.log(v.signAngle(cc.v2(1, 0))); // 270

        v.x = 1;
        v.y = 0;
        cc.log(v.signAngle(cc.v2(1, 0))); // 360
    },

    // update (dt) {},

    onClick(event, data){
        switch(data){
            case 'test':{
                this.nodeWeapon.getComponent('WeaponManage').fire();
                break;
            }
        }
    },
});
