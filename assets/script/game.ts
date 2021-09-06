// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator
let hitPool: cc.NodePool
let canvas: cc.Node
@ccclass
export default class NewClass extends cc.Component {
	@property
	text: string = 'hello'

	@property(cc.Node)
	mapNode: cc.Node = null

	@property(cc.Node)
	hero: cc.Node = null

	@property(cc.Node)
	tiledMap: cc.TiledMap = null

	@property(cc.Node)
	hitLabel: cc.Prefab = null

	@property(cc.Node)
	snake: cc.Node

	@property(cc.Node)
	blackNode: cc.Node
	@property(cc.Node)
	leftBoss: cc.Node

	@property(cc.Node)
	rightBoss: cc.Node

	@property(cc.Prefab)
	enemyFab: cc.Prefab

	@property(cc.Label)
	enemyCountLabel: cc.Label

	allEnemy = [[], []]
	updateTime = 0
	addEnemyList = []
	onAddEnemy = false
	enemyCount = 0
	enemyTotal = 5
	addEnemyCurTime = 0
	addEnemyTime = 10
	// LIFE-CYCLE CALLBACKS:
	tiledSize
    enemySpeed = 3
	
	onLoad() {
		let p = cc.director.getPhysicsManager()
		p.enabled = true //启用物理组件
		// cc.director.getPhysicsManager().gravity = cc.v2(0，0);//无重力
		p.gravity = cc.v2(0, -20) //每秒降落20个世界单位
		// cc.director.getPhysicsManager().debugDrawFlags = 3
		// this.initMapNode(this.mapNode);
		hitPool = new cc.NodePool('hit')
		canvas = cc.find('Canvas')

		this.allEnemy = [[], []]
		this.updateTime = 0 //每两帧刷新一次
		this.addEnemyList = []
		this.onAddEnemy = false
		this.enemyCount = 0 //敌人数量
		this.enemyTotal = 5 //最多敌人数量
		this.addEnemyCurTime = 0 //计算添加敌人时间
		this.addEnemyTime = 10 //5秒添加一个敌人

		this.hero = this.node.getChildByName('火柴人1')
        
console.log('this.hero: ', );
	}

	initMapNode(mapNode: cc.Node) {
		let tiledMap = mapNode.getComponent(cc.TiledMap)
		let tiledSize = tiledMap.getTileSize()
		this.tiledSize = tiledSize
		let layer = tiledMap.getLayer('wall')
		console.log('layer: ', layer)
		let layerSize = layer.getLayerSize()
		for (let i = 0; i < layerSize.width; i++) {
			for (let j = 0; j < layerSize.height; j++) {
				let tiled = layer.getTiledTileAt(i, j, true)
				console.log('tiled: ', tiled)
				if (tiled.gid != 0) {
					tiled.node.group = 'wall'
					let body = tiled.node.addComponent(cc.RigidBody)
					body.type = cc.RigidBodyType.Static
					let collider = tiled.node.addComponent(
						cc.PhysicsBoxCollider
					)
					collider.offset = cc.v2(
						tiledSize.width / 2,
						tiledSize.height / 2
					)
					collider.apply()
				}
			}
		}
	}

	start() {
		let tiledMap = this.mapNode.getComponent(cc.TiledMap)
		let tiledSize = tiledMap.getTileSize()

		// let tiledSize = this.tileMap.getTileSize();//拿到一个小块的尺寸
		// let layer = this.tileMap.getLayer('wall')
		let layer = tiledMap.getLayer('wall')
		let layerSize = layer.getLayerSize() //不是拿像素 是拿块尺寸
		for (let i = 0; i < layerSize.width; i++) {
			for (let j = 0; j < layerSize.height; j++) {
				let tiled = layer.getTiledTileAt(i, j, true)
				if (tiled.gid != 0) {
					tiled.node.group = 'wall'
					let body = tiled.node.addComponent(cc.RigidBody)
					body.type = cc.RigidBodyType.Static
					let collider = tiled.node.addComponent(
						cc.PhysicsBoxCollider
					)
					collider.offset = cc.v2(
						tiledSize.width / 2,
						tiledSize.height / 2
					) //中心点
					collider.size = tiledSize
					collider.apply() //没有不会生效
				}
			}
		}
	}

	/**
	 *
	 * @param {number} att 攻击的数值
	 * @param {cc.Vec2} pos 座标
	 */
	showHit(att, pos) {
		let hit = hitPool.get()
		//如果获取不到空闲的对象
		if (!hit) {
			hit = cc.instantiate(this.hitLabel)
		}
		hit.parent = canvas //设定父节点
		hit.getComponent(cc.Label).string = att
		hit.setPosition(cc.v2(pos.x, pos.y + this.node.y)) //设定坐标
		hit.zIndex = 3 //这个排序比主角要高
		//加上动画
		//cc.spawn是同时执行
		//往y轴上移动100个像素，并且放大到1.5倍
		cc.tween(hit)
			.then(cc.spawn(cc.moveBy(0.3, cc.v2(0, 100)), cc.scaleTo(0.3, 1.5)))
			.then(cc.spawn(cc.moveBy(0.5, cc.v2(0, 100)), cc.scaleTo(0.5, 1)))
			.call(() => {
				//回调涵数,上面两个件事执行完之后，执行这个回调涵数
				hitPool.put(hit) //把这个节点回收
			})
			.start()
	}

	update(dt) {
		if (!this.hero) return
		this.updateTime++
		this.addEnemyCurTime += dt
		if (this.updateTime >= 2) {
			this.updateTime = 0
			this.updateEnenyList()
		}
		if (this.addEnemyCurTime >= this.addEnemyTime) {
			this.addEnemyCurTime = 0
			this.addEnemy()
		}
	}

	//随机取的一个范围内的值
	randomN(n) {
		return Math.floor(Math.random() * n)
	}

	//添加敌人
	addEnemy() {
		if (this.enemyCount >= this.enemyTotal) return //如果敌人数量大于设定数量，即退出
		//随机获取边界范围内任意坐标
		let n = this.randomN(800) * (Math.random() < 0.5 ? 1 : 1)

		this.addEnemyList.push(n) //插入列队
		this.addEnemySet() //开始添加敌人
	}

	//添加敌人时动画
	addEnemySet() {
        console.log('this.addEnemyList: ',this.addEnemyList );
		//判断是否正在添加敌人
		if (this.addEnemyList.length < 1 || this.onAddEnemy) return
		this.onAddEnemy = true
		let pos = this.addEnemyList[0] //取的当前敌人的坐标
		this.addEnemyList.shift() //删除当前任务
        let rondomX = this.randomN(800) * (Math.random() < 0.5 ? 1 : 1)
		let rondomY = this.randomN(800) * (Math.random() < 0.5 ? 1 : 1)

		//设定黑洞坐标
		this.blackNode.setPosition(cc.v2(this.node.x +rondomX, this.node.y+rondomY))
		//显示黑洞
		this.blackNode.active = true
		this.blackNode.zIndex = 99
		//实例化预制体
		// let node = cc.instantiate(this.enemyFab)
		let node = cc.instantiate(this.snake)
        node.active = true
		//创建动画
		cc.tween(this.blackNode)
			.parallel(cc.rotateBy(1, 360), cc.scaleTo(0.5, 1))
			.call(() => {
				node.parent = this.node
				node.setPosition(cc.v2(this.node.x +rondomX, this.node.y+rondomY))
				// node.getComponent('snake1').init()
			})
			.by(0.5, { angle: -180 })
			.parallel(cc.rotateBy(1, 360), cc.scaleTo(0.5, 0))
			.call(() => {
				this.blackNode.active = false
				this.onAddEnemy = false
				this.addEnemySet()
			})
			.start()
	}

	//刷新敌人位置
	updateEnenyList() {
		let arr = this.node.children
        
// console.log('arr ', arr);
		let node = null
		// this.leftBoss.active = false;
		// this.rightBoss.active = false;
        let count = -1
		//过滤已经死亡和主角
		let arrList = [[], []]
		for (let i = 0, c = arr.length; i < c; i++) {
			node = arr[i]
			if (node.name === 'snake1') {
                count++
			// if (!node.isDie && node.name != 'hero') {
				if (node.x < this.hero.x) {
                    node.x+=this.enemySpeed;
					if (node.x < this.hero.x - 360) {
						// this.leftBoss.active = true;
						arrList[0].push(node)
					}
				} else {
                    node.x-=this.enemySpeed;
					if (node.x > this.hero.x + 360) {
						arrList[1].push(node)
						// this.rightBoss.active = true;
					}
				}

                if (node.y < this.hero.y) {
                    node.y+=this.enemySpeed	
				} else {
					node.y-=this.enemySpeed;
				}
			}
		}
		this.allEnemy[0] = arrList[0]
		this.allEnemy[1] = arrList[1]
		this.allEnemy[0].sort(this.enemyOrder(true))
		this.allEnemy[1].sort(this.enemyOrder(false))
		this.enemyCount = arrList[0].length + arrList[1].length
		this.enemyCountLabel.string = String(count)
	}

	enemyOrder(order) {
		return function (a, b) {
			return order ? b.x - a.x : a.x - b.x
		}
	}
}
