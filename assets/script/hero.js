const Input = {}
const State = {
	stand: 1,
	attack: 2,
}
const controlRatio = 0.005 //控制系数
const controlRotationAngle = 45 //控制角度
const controlRotaDurTime = 0.8 //旋转时间

const skinList = ['hurt', 'testshot']
let heroIndex = 0

let angle = 0
let heroMove = false
let isBighero = false
let ROLE = {
    att: 30,
    wepId: 0,
    //当前武器ID
    hp: 200,
    totalHp: 200,
    //总体力
    dodgeLen: 200,
    //回避距离
    dodgeSpeed: 20 //

  };
cc.Class({
	extends: cc.Component,
	properties: {
		Sword: cc.Node,
		Arrow: cc.Node,
		Bow: cc.Node,
		hero: cc.Node,
	},


    //初始化角色
  init: function init() {
    //主角的属性
   
    // this.idleAni();
    // this.updateWep(); //接下来，我们要绑定按钮的事件
    //接下来，开始角色的移动
  },

	onLoad() {
		ROLE.hp = 3
		this._speed = 1

        this.dt = 0

        // this.init(); //初始化角色
		this.sp = cc.v2(0, 0)

		this.canShoot = true

		this.heroState = State.stand
		this.anima = 'idle'
		this.heroAni = this.node.getComponent(cc.Animation)

		//默认为剑仙
		this.defSkinId = 1

        this.node.isDie = false;

		// this.heroAni.on('finished', (e, data) => {
		// 	ROLE.hp--
		// 	this.isHit = false
		// 	if (ROLE.hp === 0) {
		// 		this.node.destroy()
		// 	}
		//     this.Arrow.active = false
		// 	this.Arrow._active = false   
		// })

		cc.systemEvent.on('keydown', this.onKeyDown, this)
		cc.systemEvent.on('keyup', this.onKeyUp, this)

		// //开启碰撞监听
		cc.director.getCollisionManager().enabled = true
		// //开启绘制碰撞组件的形状
		// cc.director.getCollisionManager().enabledDebugDraw = true

		// let check_node_collider = this.node.getComponent(cc.PolygonCollider)//拿到points多边形顶点数组
		// console.log('check_node_collider: ', check_node_collider)
	},

	onDestroy() {
		cc.systemEvent.off('keydown', this.onKeyDown, this)
		cc.systemEvent.off('keyup', this.onKeyUp, this)
	},

	// 当碰撞产生时调用
	onCollisionEnter(other, self) {
		this.isHit = true
		if (other.node.group === 'Boss'||other.node.group === 'dogface') {
			this.isHit = true
            ROLE.hp--;
            this.heroAni.play('hurt')
            if(ROLE.hp<=0){
                this.node.isDie = true;
                this.node.destroy()
            }
            
			// this.heroAni.play('hurt')
            // this.uatt('30')
            // enemy.getComponent("enemy").uatt(this.ROLE.att);
		}
	},

	//碰撞控制类
	// 当碰撞产生时调用
	// onCollisionEnter: function (other, self) {},
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
        this.dt = dt
		// console.log('this.hero.getComponent(cc.RigidBody): ', this.node.getComponent(cc.RigidBody));
		// if (this.node.getComponent(cc.RigidBody)) {
		// 	this.lv = this.node.getComponent(cc.RigidBody).linearVelocity
		// }
		// //处理复合方向
		// if (Input[cc.macro.KEY.a] && Input[cc.macro.KEY.w]) {
		// 	this.sp.x += -controlRatio
		// 	this.sp.y += controlRatio
		// 	this.rotateLeft()
		// 	heroMove = true
		// } else if (Input[cc.macro.KEY.d] && Input[cc.macro.KEY.w]) {
		// 	this.sp.x += controlRatio
		// 	this.sp.y += controlRatio
		// 	this.rotateRight()
		// 	heroMove = true
		// } else if (Input[cc.macro.KEY.d] && Input[cc.macro.KEY.s]) {
		// 	this.sp.x += controlRatio
		// 	this.sp.y += -controlRatio
		// 	this.rotateRight()
		// 	heroMove = true
		// } else if (Input[cc.macro.KEY.a] && Input[cc.macro.KEY.s]) {
		// 	this.sp.x += -controlRatio
		// 	this.sp.y += -controlRatio
		// 	this.rotateLeft()
		// 	heroMove = true
		// } else if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
		// 	this.sp.x += -controlRatio

		// 	this.rotateLeft()
		// 	heroMove = true
		// } else if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
		// 	this.sp.x += controlRatio
		// 	this.rotateRight()
		// 	heroMove = true
		// } else if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up]) {
		// 	this.sp.y += controlRatio
		// } else if (Input[cc.macro.KEY.s] || Input[cc.macro.KEY.down]) {
		// 	this.sp.y += -controlRatio
		// } else {
		// 	this.sp.x = 0
		// 	this.sp.y = 0
		// 	setTimeout(() => {
		// 		if (!heroMove) {
		// 			this.node.stopAllActions()
		// 		}
		// 	}, 300)
		// 	heroMove = false
		// }

		// if (this.sp.x) {
		// 	this.lv.x += this.sp.x * this._speed
		// } else {
		// 	// this.lv.x = 0
		// }

		// if (this.sp.y) {
		// 	this.lv.y += this.sp.y * this._speed
		// } else {
		// 	// this.lv.y = 0
		// }

		// //控制技能等
		// if (Input[cc.macro.KEY.k]) {
		// 	if (isBighero) {
		// 		heroMove = true
		// 		this.toSmallHero()
		// 	}
		// }

		// if (Input[cc.macro.KEY.l]) {
		// 	if (!isBighero) {
		// 		heroMove = true
		// 		this.toBigHero()
		// 	}
		// }
		// if (this.node.getComponent(cc.RigidBody)) {
		// 	this.node.getComponent(cc.RigidBody).linearVelocity = this.lv
		// }
	},
	start() {},
	//飞刀
	heroShoot() {
		if (this.canShoot) {
			// console.log('shoot: ', this.Sword)
			// this.heroAni.play('testshot')
			this.Sword.active = true
			this.Sword._active = true
			// this.Arrow.active = true
			// this.Arrow._active = true
			// 奇怪的技能 魔性飞剑
			cc.tween(this.Sword)
				// //to,在第一秒的时候放大为2倍，位置为(100,100),角度变化到120
				.to(1, { scale: 2, position: cc.v2(100, 100), rotation: 120 })
				// //by,在第二秒时，缩放变化1.5倍，即最终放大为原始大小的3倍，位置变化了(100,100)，即现在位置为(200,200)
				.by(1, { scale: 1.5, position: cc.v2(100, 100) })
			//在第三秒时缩放为原来的大小，位置设置为(0,0)，然后加了一个缓动效果backOut
			.to(//
				1,
				{ scale: 1, position: cc.v2(100, 0) },
				{ easing: 'backOut' }
			)
			.start()
            // const w = 90 //设置角速度为120度/秒
            // this.Sword.angle+=w*this.dt

console.log('this.hero: ', this.hero.position);

            // setTimeout(() => {
            //     this.Arrow.runAction(cc.sequence(
            //         cc.moveTo(0.15,cc.v2(this.hero.x+500,this.hero.y+500)),
            //         cc.callFunc(()=>{
            //             // let ArrowNode = cc.instantiate(this.Arrow)
            //             // ArrowNode.setPosition(this.hero.position)
            //             // this.node.addChild(ArrowNode)
            //             // this.lastArrow = this.Arrow
                       
            //             // this.Arrow = ArrowNode
            //             // this.Arrow.active = true
            //         })
            //     ))
            //     let scale = cc.tween().to(1, { scale: 1.5 })
            //     let rotate = cc.tween().to(1, { rotation: 90 })
            //     let move = cc.tween().to(1, { position: cc.v2(this.hero.position.x+500, this.hero.position.y+500) })
            //     // // 先缩放再旋转
            //     // cc.tween(this.Arrow).then(scale).then(rotate)
            //     // 先缩放再移动
            //     cc.tween(this.Arrow).then(scale).then(move)
			// }, 500)

           

			// setTimeout(() => {
            //     this.lastArrow.active = false
			// 	// this.Arrow.active = false
			// 	// this.Arrow._active = false
			// }, 2000)
		}
	},
	changeSkin() {
        const curHero = skinList[(heroIndex++)%skinList.length];
        this.heroAni.play(curHero)
		console.log('changeSkin: ',curHero)
		// 	this.defSkinId =
		// 		this.defSkinId < skinList.length - 1 ? this.defSkinId + 1 : 0
		// let skinName = skinList[this.defSkinId]
		// this.dbDisplay.armatureName = skinName
		// this.dbArmature = this.dbDisplay.armature();
	},
	changeWeapon() {
		console.log('changeWeapon: ')
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
