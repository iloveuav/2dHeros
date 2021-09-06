

let angle = 0


cc.Class({
	extends: cc.Component,
    //初始化角色
  init: function init() {
  },

	onLoad() {
	
		this.weaponAni = this.node.getComponent(cc.Animation)
		// this.weaponAni.on('finished', (e, data) => {
		// 	ROLE.hp--
		// 	this.isHit = false
		// 	if (ROLE.hp === 0) {
		// 		this.node.destroy()
		// 	}
		//     this.Arrow.active = false
		// 	this.Arrow._active = false   
		// })
	},

	onDestroy() {

	},

	// 当碰撞产生时调用
	// onCollisionEnter(other, self) {
	// 	this.isHit = true
	// 	if (other.node.group === 'Boss'||other.node.group === 'dogface') {
	// 		this.isHit = true
    //         ROLE.hp--;
    //         this.weaponAni.play('hurt')
    //         if(ROLE.hp<=0){
    //             this.node.isDie = true;
    //             this.node.destroy()
    //         }
            
	// 		// this.heroAni.play('hurt')
    //         // this.uatt('30')
    //         // enemy.getComponent("enemy").uatt(this.ROLE.att);
	// 	}
	// },

	//碰撞控制类
	// 当碰撞产生时调用
	// onCollisionEnter: function (other, self) {},
	// // 碰撞状态中调用
	// onCollisionStay(other, self) {},
	// // 碰撞结束时调用
	// onCollisionExit(other, self) {},


	update(dt) {

	},
	start() {},
	//飞刀

	changeWeapon(curWeapon) {
        this.weaponAni.play(curWeapon)
	},
})

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
