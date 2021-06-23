cc.Class({
    extends: cc.Component,

    properties: {
        audioMng: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.audioMng.playMusic();
        cc.director.preloadScene('trainingGround', function () {
            cc.log('Next scene preloaded');
        });
    },

    playGame: function () {
        cc.director.loadScene('trainingGround');
    },

    // called every frame
    update: function (dt) {

    },
});
