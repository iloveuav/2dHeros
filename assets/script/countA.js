/**
 * A*寻路算法实现：游戏程序设计课程期末补交作业第三题，校友请慎重参考。
 * 创建一个二维数组代表地图，1代表障碍物。2代表起点
 * 可调参数:地图行列，障碍物密度，起点坐标。
 * 响应点击事件,根据A*寻路算法函数返回的坐标数组更新地图
 */
//排序用的回调函数
function sortF(a, b) {
    return b.F - a.F;
}
//获取当前坐标点周围点的坐标
function countAroundPoint(curPoint) {
    var x = curPoint.x, y = curPoint.y;
    return [
        { x: x - 1, y: y - 1 },
        { x: x, y: y - 1 },
        { x: x + 1, y: y - 1 },
        { x: x + 1, y: y },
        { x: x + 1, y: y + 1 },
        { x: x, y: y + 1 },
        { x: x - 1, y: y + 1 },
        { x: x - 1, y: y }
    ]
}
//返回列表中指定点的序号
function existList(point, list) {
    for (var i in list) {
        if (point.x == list[i].x && point.y == list[i].y) {
            return i;
        }
    }
    return false;
}


cc.Class({
    extends: cc.Component,

    properties: {
        brickPrefab: {
            default: null,
            type: cc.Prefab
        },
        Brows:0,

        BColumns:0,

        //障碍物密度,寻路困难等级
        hardLevel:0,

        startRow:0,

        startColumn:0,
        
    },

    //创建二维数组地图，创建用于格子节点存放二维数组
    makeMap: function() {

        this.map = new Array(this.Brows);

        for (let i = 0;i < this.Brows;i++) {

            this.map[i] = new Array(this.BColumns);

            for (let j = 0;j<this.BColumns;j++) {

                this.map[i][j] = this.makeWall();
            }
        }
        this.map[this.startRow][this.startColumn] = 2;

        this.bricks = new Array(this.Brows);

        for (let i = 0;i < this.Brows;i++) {

            this.bricks[i] = new Array(this.BColumns);

        }
    },

    //使用随机值进行障碍物密度控制
    makeWall: function() {

        return Math.floor(Math.random()*10+1) > this.hardLevel ? 0 : 1;

    },

    // onLoad() {
        
    //     this.makeMap();

    //     console.log(this.map);

    //     this.brickWidth = (this.node.width - this.BColumns) / this.BColumns;

    //     this.brickHeight = (this.node.height - this.Brows) / this.Brows;

    //     this.node.parent.on("mousedown", function (event) {

    //         console.log(event.getLocation().x,event.getLocation().y);

    //         var pointY = Math.floor(event.getLocation().x / (this.brickWidth + 1));

    //         var pointX = Math.floor((this.node.height - event.getLocation().y) / (this.brickHeight+1));

    //         console.log("row:" + pointX + "column:" + pointY);

    //         //循环遍历地图去除上一次点击产生的路径
    //         for (let i = 0; i < this.Brows; i++) {

    //             for (let j = 0; j < this.BColumns; j++) {

    //                 if(this.map[i][j] == 0) {

    //                     this.bricks[i][j].color = cc.Color.WHITE;

    //                 }

    //             }
    //         }

    //         var road = this.searchRoad(this.startRow, this.startColumn, pointX, pointY);

    //         if (road != null) {

    //             for (var num in road) {

    //                 // console.log(final[num].x + " " + final[num].y);

    //                 this.bricks[road[num].x][road[num].y].color = cc.Color.YELLOW;

    //             }
    //         }
           
    //         // console.log(pointX + " " + pointY);

    //     },this);

    // },

    //初始化地图并给相应的节点上色并且将每个节点存入bricks二维数组。以方便后边点击事件后的地图更新。
    start() {

        for (let i = 0; i < this.Brows; i++) {

            for (let j = 0; j < this.BColumns; j++) {

                var newBrick = cc.instantiate(this.brickPrefab);
                
                newBrick.width = this.brickWidth;
                newBrick.height = this.brickHeight;

                newBrick.x = j * (newBrick.width + 1);
                newBrick.y = this.node.height - (i + 1) * (newBrick.height + 1);

                if (this.map[i][j] == 1) {

                    newBrick.color = cc.Color.RED;

                } else if (this.map[i][j] == 2) {

                    newBrick.color = cc.Color.BLUE;

                }

                this.bricks[i][j] = newBrick;
                this.node.addChild(newBrick);

            }
        }

    },

    //寻路算法
    searchRoad: function(start_x, start_y, end_x, end_y) {

        var openList = [],    //开启列表
            closeList = [],   //关闭列表
            result = [],      //结果数组
            result_index,   //结果数组在开启列表中的序号
            mapRows = this.map.length, //地图行数与列数
            mapColumns = this.map[0].length;
    
        openList.push({ x: start_x, y: start_y, G: 0 });
    
        do {

            var currentPoint = openList.pop();

            closeList.push(currentPoint);

            var surroundPoint = countAroundPoint(currentPoint);

            for (var i in surroundPoint) {

                var item = surroundPoint[i];                
                if (

                    item.x >= 0 &&                            //判断是否在地图上
                    item.y >= 0 &&
                    item.x <  mapRows&&
                    item.y < mapColumns &&
                    this.map[item.x][item.y] != 1 &&         //判断是否是障碍物
                    !existList(item, closeList) &&          //判断是否在关闭列表中
                    this.map[item.x][currentPoint.y] != 1 &&   //判断之间是否有障碍物，如果有障碍物是过不去的(斜线相邻)
                    this.map[currentPoint.x][item.y] != 1) {

                    var g = currentPoint.G + ((currentPoint.x - item.x) * (currentPoint.y - item.y) == 0 ? 1 : 2);

                    if (!existList(item, openList)) {       //如果不在开启列表中
                        item['H'] = Math.abs(end_x - item.x)  + Math.abs(end_y - item.y) ;
                        item['G'] = g;
                        item['F'] = item.H + item.G;
                        item['parent'] = currentPoint;
                        openList.push(item);
                    }
                    else {                                  //存在在开启列表中，比较目前的g值和之前的g的大小
                        var index = existList(item, openList);
                        if (g < openList[index].G) {
                            openList[index].parent = currentPoint;
                            openList[index].G = g;
                            openList[index].F = g + openList[index].H;
                        }
    
                    }
                }
            }
            //如果开启列表空了，没有通路，结果为空
            if (openList.length == 0) {
                break;
            }

            openList.sort(sortF);

        } while (!(result_index = existList({ x: end_x, y: end_y }, openList)));
    
        //判断结果列表是否为空
        if (!result_index) {

            // result = [];
            
        } else {

            var currentObj = openList[result_index];
            
            do {
                //把路劲节点添加到result当中
                result.unshift({
                    x: currentObj.x,
                    y: currentObj.y
                });
                currentObj = currentObj.parent;
            } while (currentObj.x != start_x || currentObj.y != start_y);
    
        }
        
        return result;
    
    }

});
