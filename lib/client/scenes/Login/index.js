import Phaser from 'phaser';

class Login extends Phaser.Scene {
    constructor() {
        super({ key: 'Login' })
    }

    create() {
        this.music = this.sound.add('clouds', {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });

        const emailAddress = prompt(`Enter your Midway email address. 
If you fatfinger it, refresh and try again.`);
        //this.music.play();

        this.game.socket.emit('login', emailAddress);
    }

    update(){
        if(this.game.player) {

            this.scene.start('Main');
        }
    }
}

export default Login;