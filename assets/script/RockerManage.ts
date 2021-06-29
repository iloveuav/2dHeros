const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;//摇杆背景

    @property(cc.Node)
    joystick: cc.Node = null;//摇杆 也就是中心点

    @property(cc.Node)
    player: cc.Node = null;//角色
    @property(cc.Node)
    Boos: cc.Node = null;//Boss

    @property(cc.Node)
    parent: cc.Node = null;//摇杆和背景的父节点

    @property
    max_R: number = 135;//摇杆移动的最大半径

    @property
    speed: number = 10;//角色移动速度
    //不建议太大，1-10最好

    @property
    rotation: number = 0;//角色的旋转角度 不要轻易改

    @property
    vector: cc.Vec2 = cc.v2(0,0);//移动向量

    @property
    is_rotation: boolean = true;//角色是否根据摇杆的方向旋转

    @property
    is_forbidden: boolean = false;//是否禁用摇杆

    onLoad(){
        //绑定事件
        //因为摇杆很小，如果给摇杆绑定事件玩家将很难控制，摇杆的背景比较大，所以把事件都绑定在背景上是不错的选择
        this.bg.on(cc.Node.EventType.TOUCH_MOVE,this.move,this);//当手指在背景上移动时触发move事件
        this.bg.on(cc.Node.EventType.TOUCH_MOVE,this.move_palyer,this);//当手指在背景上移动时触发move_player事件
        this.bg.on(cc.Node.EventType.TOUCH_END,this.finish,this);//当手指在目标节点区域内离开屏幕时触发finish事件
        this.bg.on(cc.Node.EventType.TOUCH_CANCEL,this.finish,this);//当手指在目标节点区域外离开屏幕时触发finish事件
    }

    update(){
        let lv = this.player.getComponent(cc.RigidBody).linearVelocity
        lv.x += this.vector.x * this.speed
        lv.y += this.vector.y * this.speed
        this.player.getComponent(cc.RigidBody).linearVelocity = lv

        let lv2 = this.Boos.getComponent(cc.RigidBody).linearVelocity
        lv2.x -= this.vector.x * this.speed
        lv2.y -= this.vector.y * this.speed
    	this.Boos.getComponent(cc.RigidBody).linearVelocity = lv2
        // // -----------------
        // let x = this.player.x + this.vector.x;
        // let y = this.player.y + this.vector.y;//每帧获取角色的坐标加上移动向量

        // this.player.position = cc.v3(x, y);//让角色的坐标每帧为自身的坐标加上移动的向量
        
        // //求出角色的旋转角度
        // if(this.vector.y < 0){//当摇杆在原点下方时
        //     //角度是负的
        //     this.rotation = (-this.vector.angle(cc.v2(1, 0))) / Math.PI * 180;//根据向量先求出弧度，再求出角度
        // }else{//如果摇杆在原点上方时
        //     //角度是正的
        //     this.rotation = (this.vector.angle(cc.v2(1, 0))) / Math.PI * 180;//根据向量先求出弧度，再求出角度
        // }
    }

    move(event: cc.Event.EventTouch){//负责移动摇杆 手指移动时调用
        if(this.is_forbidden == false){//如果没有禁用摇杆
            let pos = new cc.Vec2(event.getLocationX(), event.getLocationY());//获取触点的坐标
            let pos_0 = this.parent.convertToNodeSpaceAR(pos);//将一个点转换到节点 (局部) 空间坐标系，这个坐标系以锚点为原点。

            //pos_0.mag()是这个触点的长度

            if(pos_0.mag() < this.max_R){//如果触点长度小于我们规定好的最大半径
                this.joystick.x = pos_0.x;//摇杆的坐标为触点坐标
                this.joystick.y = pos_0.y;
            }else{//如果不
                let pos = pos_0.normalizeSelf();//将触点归一化
                let x = pos.x * this.max_R;//归一化的触点坐标 × 最大半径
                let y = pos.y * this.max_R;

                this.joystick.x = x;//给摇杆坐标赋值
                this.joystick.y = y;
            }    
        }
    }

    move_palyer(){//负责移动角色 手指移动时调用
        if(this.is_forbidden == false){//如果没有禁用摇杆
            let dir = this.joystick.position.normalizeSelf();//dir为摇杆坐标的归一化

            this.vector.x = dir.x * this.speed;//给移动向量赋值
            this.vector.y = dir.y * this.speed;//移动向量为方向 × 速度
            // if(this.is_rotation == true){//如果角色可以旋转
            //     this.player.angle = this.rotation;//根据摇杆的方向旋转角色
            // }
        }
    }

    finish(){//摇杆弹回原位置
        //摇杆坐标和移动向量都为（0,0）
        this.joystick.position = cc.v3(0, 0);
        this.vector = cc.v2(0, 0);
    }

}
// ————————————————
// 版权声明：本文为CSDN博主「property-Cocos」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
// 原文链接：https://blog.csdn.net/bcswkl_/article/details/109085756