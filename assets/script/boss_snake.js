const Input = {}
const State = {
	stand: 1,
	attack: 2,
}
const controlRatio = 0.005 //控制系数
const controlRotationAngle = 45 //控制角度
const controlRotaDurTime = 0.8 //旋转时间

let angle = 0
let heroMove = false
let isBighero = false
cc.Class({
	extends: cc.Component,
	properties: {
		Hero: cc.Node,
	},

	onLoad() {
		this._speed = 1
		this.sp = cc.v2(0, 0)

		this.heroState = State.stand
		this.anima = 'idle'

		cc.systemEvent.on('keydown', this.onKeyDown, this)
		cc.systemEvent.on('keyup', this.onKeyUp, this)
		cc.director.getCollisionManager().enabled = true

		this.hp = 1
		this.isHit = false
		this.ani = this.node.getComponent(cc.Animation)

		this.ani.on('finished', (e, data) => {
			this.hp--
			this.isHit = false
			if (this.hp === 0) {
				this.node.destroy()
			}
		})
		// //开启碰撞监听
		// cc.director.getCollisionManager().enabled = true
		// //开启绘制碰撞组件的形状
		// cc.director.getCollisionManager().enabledDebugDraw = true

		// let check_node_collider = this.node.getComponent(cc.PolygonCollider)//拿到points多边形顶点数组
		// console.log('check_node_collider: ', check_node_collider)

		this.game = this.node.parent.getComponent('game')
	},
	onDestroy() {
		cc.systemEvent.off('keydown', this.onKeyDown, this)
		cc.systemEvent.off('keyup', this.onKeyUp, this)
	},

	//受到攻击时
	// uatt(att){
	//     //执行game里面的showHit涵数
	//     //txt的初始坐示，是敌人的坐标一样，高度是敌人的y坐标加上高度
	//     if(this.node.isDie) return; //如果已经死了，就不往下执行了
	//     this.node.stopAllActions();
	//     this.ROLE.hp-=att; //敌人的HP减去等于
	//     if(this.ROLE.hp<=0){
	//         //如果敌人已经死亡
	//         this.removeOn();
	//         this.node.isDie = true;
	//         this.dbDisplay.playAnimation("die"); //播放死亡动
	//         this.scheduleOnce(()=>{
	//             this.node.destroy();
	//         },2);
	//         return;//不再往下执行了
	//     }
	//     this.game.showHit(att,cc.v2(this.node.x, this.node.y + this.node.height));
	//     if(this.State != COM.State.ATTACK) this.dbArmature.animation.fadeIn("hit",-1,-1,0, ANI_GROUP);
	// },

	//碰撞控制类
	// 当碰撞产生时调用
	onCollisionEnter(other, self) {
        //0:尾巴 1:头或身体
		if (self.tag === 0||self.tag === 1) {
			if (other.node.group === 'weapon') {
				this.isHit = true
				this.ani.play('hurt')
				// this.game.showHit(att,cc.v2(this.node.x, this.node.y + this.node.height));
				// this.uatt(10)
			}
		}
	},
	// // 碰撞状态中调用
	// onCollisionStay(other, self) {},
	// // 碰撞结束时调用
	// onCollisionExit(other, self) {},

	//动作控制类
	onKeyDown(e) {
		Input[e.keyCode] = 1
	},
	onKeyUp(e) {
		Input[e.keyCode] = 0
	},

	rotateLeft() {
		if (heroMove === false) {
			cc.tween(this.node)
				.by(controlRotaDurTime, { angle: controlRotationAngle })
				.repeatForever()
				.start()
		} else {
			return
		}
		// 一直重复执行下去
	},
	rotateRight() {
		if (heroMove === false) {
			cc.tween(this.node)
				.by(1, { angle: -controlRotationAngle })
				.repeatForever()
				.start()
		} else {
			return
		}
	},
	toSmallHero() {
		cc.tween(this.node)
			.to(1, { scale: 0.8, position: cc.v2(10, 100) })
			.start()
		isBighero = false
	},
	toBigHero() {
		cc.tween(this.node)
			.to(1, { scale: 3, position: cc.v2(10, 100) })
			.start()
		isBighero = true
	},
	update(dt) {
        // 	let lv2 = this.node.getComponent(cc.RigidBody).linearVelocity
		// lv2.x -= 5 * this.speed
		// lv2.y -= 5 * this.speed
		// this.node.getComponent(cc.RigidBody).linearVelocity = lv2

		// this.sp.x += -controlRatio
		// this.sp.y += controlRatio
		
        // if (this.sp.x) {
		// 	this.lv.x += this.sp.x * this._speed
		// } else {
		// 	this.lv.x = 0
		// }

		// if (this.sp.y) {
		// 	this.lv.y += this.sp.y * this._speed
		// } else {
		// 	this.lv.y = 0
		// }
        // if (this.node.getComponent(cc.RigidBody)) {
		// 	this.node.getComponent(cc.RigidBody).linearVelocity = this.lv
		// }


		// let followAction = cc.follow(this.Hero, cc.rect(60, 60, 60, 60));

		// console.log('followAction: ',this.node );
		// this.node.runAction(followAction);
	},
	start() {},
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
