import Phaser from 'phaser';
import LevelCreator from './level-creator';
import { PLAYERS } from 'client/game';

const SKY_BLUE = '#2be8cf';
const PLAYER_HEIGHT = 16;
const PLAYER_WIDTH = 8;
const PLAYER_SPEED = 60;
const PLAYER_JUMP_SPEED = -360;
const JUMPING_FRAME = 6;
const PLAYER_NAME_START = -100;
const FONT = 'carrier_command';
const FONT_SIZE = 6;
const PLAYER_NAME_X_OFFSET = 3;
const PLAYER_NAME_Y_OFFSET = 16;

class Main extends Phaser.Scene {
    constructor() {
        super({ key: 'Main' });
    }

    init() {
        this.levelCreator = new LevelCreator(this.physics);
        this.initializeCamera();
        this.initializeInput();
    }

    initializeCamera() {
        const { width } = this.game.config;
        this.cameras.main.setBackgroundColor(SKY_BLUE);
        this.cameras.main.setViewport(0, 0, width, width / this.getAspectRatio());
        window.addEventListener('resize', () => {
            this.cameras.main.setSize(width, width / this.getAspectRatio());
        });
    }

    getAspectRatio() {
        return window.innerWidth / window.innerHeight;
    }

    initializeInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        this.levelGroups = this.levelCreator.create();
        this.createPlayer();
        this.createOtherPlayers();
        this.createPlayerNames();
        this.addColliders();
        this.addTimers();
        this.focusCamera();
        this.createSounds();
    }

    createPlayer() {
        const { height, width } = this.game.config;
        const startX = Math.round(width * Math.random());
        this.player = this.physics.add.sprite(
            startX,
            height - PLAYER_HEIGHT,
            this.game.player.name
        );
        this.player.body.setSize(PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_WIDTH / 2, 0);
        this.player.body.setCollideWorldBounds(true);
    }

    createOtherPlayers() {
        this.otherPlayers = {};
        this.game.socket.on('playerJoined', playerName => {
            if (playerName != this.game.player.name) {
                this.otherPlayers[playerName] =
                    this.physics.add.staticSprite(-PLAYER_WIDTH, 0, playerName);
            }
        });

        this.game.socket.on('playerLeft', playerName => {
            this.otherPlayers[playerName].destroy();
            delete this.otherPlayers[playerName];
        });

        this.game.socket.on('update', update => {
            if (update.name != this.game.player.name) {
                if (!this.otherPlayers[update.name]) {
                    this.otherPlayers[update.name] =
                        this.physics.add.staticSprite(-PLAYER_WIDTH, 0, update.name);
                }

                Object.entries(update).forEach(([k, v]) => {
                    this.otherPlayers[update.name][k] = v;
                });
            }
        });
    }

    createPlayerNames() {
        this.playerNames = {};
        PLAYERS.forEach(p => {
            this.playerNames[p] =
                this.add.bitmapText(
                    PLAYER_NAME_START,
                    PLAYER_NAME_START,
                    FONT,
                    p,
                    FONT_SIZE,
                );
        });
    }

    addColliders() {
        Object.values(this.levelGroups)
            .forEach(g => this.physics.add.collider(this.player, g));

        this.physics.add.collider(
            this.levelGroups.monster,
            this.levelGroups.platform
        );
    }

    addTimers() {
        this.lastState = {
            walking: this.player.walking,
            jumping: this.player.jumping,
            x: this.player.x,
            y: this.player.y,
            flipX: this.player.flipX,
        };

        this.time.addEvent({
            delay: 5,
            callback: () => {
                const currentUpdate = this.getPlayerUpdate();

                if (Object.keys(currentUpdate).length) {
                    this.game.socket.emit('update', {
                        ...this.game.player,
                        ...currentUpdate
                    });
                }
            },
            loop: true
        });
    }

    getPlayerUpdate() {
        return Object.entries(this.lastState)
            .reduce((acc, [k, v]) => {
                if (this.player[k] != v) {
                    this.lastState[k] = this.player[k];
                    acc[k] = this.player[k];
                }

                return acc;
            }, {});
    }

    focusCamera() {
        this.cameras.main.startFollow(this.player, true, 1, 1);
    }

    createSounds() {
        this.music = this.sound.add('clouds', {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
    }

    update() {
        this.updatePlayer();
        this.updateOtherPlayers();
        this.writePlayerNames();
        this.updateCamera();
        this.playMusic();
    }

    updatePlayer() {
        this.playerJumping();
        this.playerWalking();
        this.playerAnimation();
    }

    playerJumping() {
        this.setPlayerOnGround();
        this.freezeJumpingFrame();

        const { onGround, jumping } = this.player;
        if (onGround && !jumping && this.cursors.space.isDown) {
            this.jump();
        }

        this.player.jumping = this.cursors.space.isDown;
    }

    setPlayerOnGround() {
        this.player.onGround = this.player.body.blocked.down;
    }

    freezeJumpingFrame() {
        !this.player.onGround && this.player.setFrame(JUMPING_FRAME);
    }

    jump() {
        this.player.body.setVelocityY(PLAYER_JUMP_SPEED);
    }

    playerWalking() {
        const [l, r] = [this.cursors.left.isDown, this.cursors.right.isDown];
        this.player.walking = l ? !r : r;
        l && !r && this.player.setVelocityX(PLAYER_SPEED * -1);
        r && !l && this.player.setVelocityX(PLAYER_SPEED);
        l == r && this.player.setVelocityX(0);
    }

    playerAnimation() {
        this.player.body.velocity.x
            ? this.cyclePlayerWalk()
            : this.haltPlayer();
    }

    cyclePlayerWalk() {
        this.setPlayerFacing();
        this.player.onGround && this.player.anims.play(`${this.game.player.name}-walking`, true);
    }

    setPlayerFacing() {
        this.player.flipX = this.player.body.velocity.x < 0;
    }

    haltPlayer() {
        this.player.anims.stop(`${this.game.player.name}-walking`);
        this.player.onGround && this.player.setFrame(0);
    }

    updateOtherPlayers() {
        Object.entries(this.otherPlayers).forEach(([k, v]) => {
            v.walking
                ? v.anims.play(`${k}-walking`, true)
                : v.anims.stop(`${k}-walking`) || v.setFrame(0);

            v.jumping && v.setFrame(JUMPING_FRAME);
        });
    }

    writePlayerNames() {
        Object.entries(this.otherPlayers)
            .concat([[this.game.player.name, this.player]])
            .forEach(([name, sprite]) => {
                this.playerNames[name].setPosition(
                    sprite.x - PLAYER_NAME_X_OFFSET * name.length,
                    sprite.y - PLAYER_NAME_Y_OFFSET
                );
            });
    }

    updateCamera() {
        this.updateFollowOffset();
    }

    updateFollowOffset() {
        const { width, height } = this.game.config;
        const xOffset = -(width / 2 - this.player.x);
        const inBottom = this.player.y > height / 2;
        const cameraHeight = width / this.getAspectRatio();

        let yOffset = inBottom
            ? Math.max(this.player.y - (height - .5 * cameraHeight), 0)
            : Math.min(this.player.y - .5 * cameraHeight, 0);

        this.cameras.main.setFollowOffset(xOffset, yOffset);
    }

    playMusic() {
        !this.music.isPlaying && this.music.play();
    }

}

export default Main;