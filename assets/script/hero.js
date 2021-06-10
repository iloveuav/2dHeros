
const Input = {}
const State = {
    stand:1,
    attack:2
}
const controlRatio = 0.005//控制系数
const controlRotationAngle = 45//控制角度
const controlRotaDurTime = 0.8//旋转时间

let angle = 0;
let heroRotate = false;
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
        // setTimeout(() => {
        //   var rby = cc.rotateBy(controlRotaDurTime,controlRotationAngle);
        //   console.log('rby: ', rby);
        //   this.node.runAction(rby)
        // }, 1);
        var rby = cc.rotateBy(controlRotaDurTime,controlRotationAngle);
        // setInterval(() => {
        //   // cc.tween(this.node)
        //   // .by(1,{scale:0,angle:85})
        //   // .repeatForever()
        //   // .start()
        //   var rby = cc.rotateBy(controlRotaDurTime,controlRotationAngle);
        //   //   console.log('rby: ', rby);
        //     this.node.runAction(rby)

        // }, 10);
      if(heroRotate===false){
        cc.tween(this.node)
        .by(controlRotaDurTime,{angle:controlRotationAngle})
.to(1,{scale:1,position:cc.v2(0,0)},{easing:"backOut"})
        .repeatForever()
        .start()
      }else{
        return
      }
       
     
        
     

// 一直重复执行下去

  
      },
      rotateRight(){
        // setTimeout(() => {
        //   var rby = cc.rotateBy(controlRotaDurTime,-controlRotationAngle);
        //   console.log('rby: ', rby);
        //   this.node.runAction(rby)
        // }, 1);

        if(heroRotate===false){
          cc.tween(this.node)
          .by(1,{angle:-controlRotationAngle})
          .repeatForever()
          .start()
        }else{
          return
        }
      },
      update(dt) {

       
        this.lv = this.node.getComponent(cc.RigidBody).linearVelocity;   
//处理复合方向
if(Input[cc.macro.KEY.a]&&Input[cc.macro.KEY.w]){
  this.sp.x +=-controlRatio;
  this.sp.y +=controlRatio;
  this.rotateLeft();
  heroRotate = true


}else if(Input[cc.macro.KEY.d]&&Input[cc.macro.KEY.w]){
  this.sp.x +=controlRatio;
  this.sp.y +=controlRatio;
  this.rotateRight()
  heroRotate = true
}
else if(Input[cc.macro.KEY.d]&&Input[cc.macro.KEY.s]){
  this.sp.x +=controlRatio;
  this.sp.y +=-controlRatio;
  this.rotateRight()
  heroRotate = true
}
else if(Input[cc.macro.KEY.a]&&Input[cc.macro.KEY.s]){
  this.sp.x +=-controlRatio;
  this.sp.y +=-controlRatio;
  this.rotateLeft();
  heroRotate = true
}
        else if(Input[cc.macro.KEY.a]||Input[cc.macro.KEY.left]){
            this.sp.x +=-controlRatio;
           
            this.rotateLeft();
            heroRotate = true
        }else if(Input[cc.macro.KEY.d]||Input[cc.macro.KEY.right]){
            this.sp.x +=controlRatio;
            this.rotateRight()
            heroRotate = true
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
            setTimeout(() => {
              if(!heroRotate){
                this.node.stopAllActions();
              } 
            }, 200);
            heroRotate = false
           
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
        this.node.getComponent(cc.RigidBody).linearVelocity = this.lv
      },
      start() {}
});




//收集
//人物变大变小
// cc.tween(this.node)
// // 0s 时，node 的 scale 还是 1
// .to(1, { scale: 2 })
// // 1s 时，执行完第一个 action，scale 为 2
// .to(1, { scale: 3 })
// // 2s 时，执行完第二个 action，scale 为 3
// .start()
// // 调用 start 开始执行 cc.tween
// -----------------------------------------------------------
// 奇怪的技能
// cc.tween(this.node)
// //to,在第一秒的时候放大为2倍，位置为(100,100),角度变化到120
// .to(1,{scale:2,position:cc.v2(100,100),rotation:120})
// //by,在第二秒时，缩放变化1.5倍，即最终放大为原始大小的3倍，位置变化了(100,100)，即现在位置为(200,200)
// .by(1,{scale:1.5,position:cc.v2(100,100)})
// //在第三秒时缩放为原来的大小，位置设置为(0,0)，然后加了一个缓动效果backOut
// .to(1,{scale:1,position:cc.v2(0,0)},{easing:"backOut"})
// .start();
