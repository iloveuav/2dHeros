// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const Input = {}
const State = {
    stand:1,
    attack:2
}
const controlRatio = 0.005//控制系数
const controlRotationAngle = 45//控制角度
const controlRotaDurTime = 0.5//旋转时间
cc.Class({
    extends: cc.Component,
    properties: {
    },

    onLoad() {
        this._speed = 1;
        this.sp = cc.v2(0, 0);
    
        this.heroState = State.stand;
        this.anima = 'idle'
    
        cc.systemEvent.on("keydown", this.onKeyDown, this);
        cc.systemEvent.on("keyup", this.onKeyUp, this);
      },
      onDestroy() {
        cc.systemEvent.off("keydown", this.onKeyDown, this);
        cc.systemEvent.off("keyup", this.onKeyUp, this);
      },
      onKeyDown(e) {
        Input[e.keyCode] = 1;
      },
      onKeyUp(e) {
        Input[e.keyCode] = 0;
      },

      rotateLeft(){
        setTimeout(() => {
          var rby = cc.rotateBy(controlRotaDurTime,controlRotationAngle);
          console.log('rby: ', rby);
          this.node.runAction(rby)
        }, 5);
      },
      rotateRight(){
        setTimeout(() => {
          var rby = cc.rotateBy(controlRotaDurTime,-controlRotationAngle);
          console.log('rby: ', rby);
          this.node.runAction(rby)
        }, 5);
      },
    
      update(dt) {
        this.lv = this.node.getComponent(cc.RigidBody).linearVelocity;
        
// console.log('this.lv: ', this.lv);
//处理复合方向
if(Input[cc.macro.KEY.a]&&Input[cc.macro.KEY.w]){
  this.sp.x +=-controlRatio;
  this.sp.y +=controlRatio;
  this.rotateLeft();

}else if(Input[cc.macro.KEY.d]&&Input[cc.macro.KEY.w]){
  this.sp.x +=controlRatio;
  this.sp.y +=controlRatio;
  this.rotateRight()
}
else if(Input[cc.macro.KEY.d]&&Input[cc.macro.KEY.s]){
  this.sp.x +=controlRatio;
  this.sp.y +=-controlRatio;
  this.rotateRight()
}
else if(Input[cc.macro.KEY.a]&&Input[cc.macro.KEY.s]){
  this.sp.x +=-controlRatio;
  this.sp.y +=-controlRatio;
  this.rotateLeft();
}
        else if(Input[cc.macro.KEY.a]||Input[cc.macro.KEY.left]){
            this.sp.x +=-controlRatio;
            this.rotateLeft();
        }else if(Input[cc.macro.KEY.d]||Input[cc.macro.KEY.right]){
            this.sp.x +=controlRatio;
            this.rotateRight()
        }
        else if(Input[cc.macro.KEY.w]||Input[cc.macro.KEY.up]){
          this.sp.y +=controlRatio;
      }
      else if(Input[cc.macro.KEY.s]||Input[cc.macro.KEY.down]){
        this.sp.y +=-controlRatio;
    }
   
else{
            this.sp.x=0
            this.sp.y=0
            rby = null
                    }




        if(this.sp.x){
            this.lv.x += this.sp.x *this._speed
        }else{
            // this.lv.x = 0
        }

        if(this.sp.y){
          this.lv.y += this.sp.y *this._speed
      }else{
          // this.lv.y = 0
      }
      // if(rby){
      //   this.node.runAction(rby)
      // }

  

    

        this.node.getComponent(cc.RigidBody).linearVelocity = this.lv
      },
    
      start() {}

    // update (dt) {},
});
