import Phaser from 'phaser';

class Login extends Phaser.Scene {
    constructor() {
        super({ key: 'Login' })
    }

    create() {
        const emailAddress = prompt(`Enter your Midway email address. 
If you fatfinger it, refresh and try again.`);

        //this.game.music.play();

        this.game.socket.emit('login', emailAddress);
    }

    update(){
        this.game.player && this.scene.start('Main');
    }
}

export default Login;