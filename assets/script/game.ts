// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator
let hitPool:cc.NodePool;
let canvas:cc.Node;
@ccclass
export default class NewClass extends cc.Component {


	@property
	text: string = 'hello'

	@property(cc.Node)
	mapNode: cc.Node = null

	@property(cc.Node)
	tiledMap: cc.TiledMap = null

    @property(cc.Node)
	hitLabel:cc.Prefab = null;

	// LIFE-CYCLE CALLBACKS:
  
	onLoad() {
		let p = cc.director.getPhysicsManager()
		p.enabled = true //启用物理组件
		// cc.director.getPhysicsManager().gravity = cc.v2(0，0);//无重力
		p.gravity = cc.v2(0, -20) //每秒降落20个世界单位
		// cc.director.getPhysicsManager().debugDrawFlags = 3
		// this.initMapNode(this.mapNode);
        hitPool = new cc.NodePool("hit");
        canvas = cc.find("Canvas");

	}

	initMapNode(mapNode: cc.Node) {
		let tiledMap = mapNode.getComponent(cc.TiledMap)
		let tiledSize = tiledMap.getTileSize()
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
				let tiled = layer.getTiledTileAt(i, j, true);
                if(tiled.gid!=0){
                    tiled.node.group = 'wall';
                    let body = tiled.node.addComponent(cc.RigidBody);
                    body.type = cc.RigidBodyType.Static;
                    let collider = tiled.node.addComponent(cc.PhysicsBoxCollider)
                    collider.offset = cc.v2(tiledSize.width/2,tiledSize.height/2);//中心点
                    collider.size = tiledSize;
                    collider.apply();//没有不会生效
                }
			}
		}
	}

    /**
 * 
 * @param {number} att 攻击的数值
 * @param {cc.Vec2} pos 座标
 */
     showHit(att,pos){
        let hit = hitPool.get();
        //如果获取不到空闲的对象
        if(!hit){
            hit = cc.instantiate(this.hitLabel);
        }
        hit.parent = canvas; //设定父节点
        hit.getComponent(cc.Label).string = att;
        hit.setPosition(cc.v2(pos.x, pos.y + this.node.y)); //设定坐标
        hit.zIndex = 3; //这个排序比主角要高
        //加上动画
        //cc.spawn是同时执行
        //往y轴上移动100个像素，并且放大到1.5倍
        cc.tween(hit)
        .then(cc.spawn(
            cc.moveBy(0.3, cc.v2(0,100)),
            cc.scaleTo(0.3, 1.5)
        ))
        .then(cc.spawn(
            cc.moveBy(0.5, cc.v2(0,100)),
            cc.scaleTo(0.5, 1)
        ))
        .call(()=>{
            //回调涵数,上面两个件事执行完之后，执行这个回调涵数
            hitPool.put(hit);//把这个节点回收   
        })
        .start();
    }



	// update (dt) {}
}
