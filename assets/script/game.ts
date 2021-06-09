// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Label)
  label: cc.Label = null;

  @property
  text: string = "hello";

  @property(cc.Node)
  mapNode: cc.Node = null;

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {}

  onLoad() {
    cc.director.getPhysicsManager().enabled = true; //启用物理组件
    // cc.director.getPhysicsManager().gravity = cc.v2(0，0);//无重力
    cc.director.getPhysicsManager().gravity = cc.v2(0, -20); //每秒降落20个世界单位
    // cc.director.getPhysicsManager().debugDrawFlags = 6;
    // this.initMapNode(this.mapNode);
  }

  initMapNode(mapNode: cc.Node) {
    let tiledMap = mapNode.getComponent(cc.TiledMap);
    let tiledSize = tiledMap.getTileSize();
    let layer = tiledMap.getLayer("wall");
    console.log("layer: ", layer);
    let layerSize = layer.getLayerSize();
    for (let i = 0; i < layerSize.width; i++) {
      for (let j = 0; j < layerSize.height; j++) {
        let tiled = layer.getTiledTileAt(i, j, true);
        console.log("tiled: ", tiled);
        if (tiled.gid != 0) {
          tiled.node.group = "wall";

          let body = tiled.node.addComponent(cc.RigidBody);
          body.type = cc.RigidBodyType.Static;
          let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
          collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2);
          collider.apply();
        }
      }
    }
  }

  // update (dt) {}
}
