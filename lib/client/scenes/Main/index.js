import Phaser from 'phaser';
import LevelBuilder from './level-builder';
import { playerNames, teamDictionary } from '../../../shared/accounts';
import { PLAYER_SPEED, PLAYER_JUMP_SPEED, POISON_SPEED, HYPER_SPEED, BUFF_DURATION } from './stats';
import { SKY_BLUE, CLOUD_SPEED, PLAYER_HEIGHT, PLAYER_WIDTH, JUMPING_FRAME, POISONED, HYPER } from './graphics';
import {
    FONT, FONT_SIZE, PLAYER_NAME_START, PLAYER_NAME_X_OFFSET, PLAYER_NAME_Y_OFFSET,
    SCORE_SIZE, WEST_X, EAST_X, XTREME_X, WEST_TEXT_COLOR, EAST_TEXT_COLOR, XTREME_TEXT_COLOR, WINNER_TEXT_COLOR
} from './text';

class Main extends Phaser.Scene {
    constructor() {
        super({ key: 'Main' });
    }

    init() {
        this.initializeCamera();
        this.initializeInput();
        this.getObjectives();

        this.playerSpeed = PLAYER_SPEED;

        this.game.socket.on('gameStart', objectives => {
            this.game.initialObjectives = objectives;
            this.scene.restart();
        });

        this.game.socket.on('gameOver', nextGameAt => {
            const winner = Object.entries(this.scores).reduce((acc, [k, v]) => {
                return v > acc.max
                    ? { max: v, team: k}
                    : acc 
            }, {max: 0, team: null}).team;

            this.winnerText.setText(`     ${winner} TEAM WINS!

     NEXT GAME AT 

     ${new Date(nextGameAt).toLocaleTimeString()}`);
        });
    }

    getObjectives() {
        const { collectibles, east, west, xtreme } = this.game.initialObjectives;
        this.levelBuilder = new LevelBuilder(this.physics, collectibles);
        this.levelGroups = this.levelBuilder.buildGroups();
        this.scores = { east, xtreme, west };
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
        this.createClouds();
        this.createCarafe();
        this.createPlayer();
        this.createOtherPlayers();
        this.createPlayerNames();
        this.addColliders();
        this.addTimers();
        this.focusCamera();
        this.addScoresText();
        this.addWinnerText();
        this.addAbsorbUpdates();
    }

    createClouds() {
        this.levelGroups.cloud.getChildren().forEach(c => {
            c.setDepth(-5);
            c.setVelocityX(CLOUD_SPEED);
        });
    }

    createCarafe() {
        this.levelGroups.carafe.getChildren().forEach(c => {
            c.anims.play('sloosh');

            this.tweens.add({
                targets: c,
                x: c.x + 16 * 3,
                ease: 'Linear',
                duraton: 3000,
                repeat: -1,
                yoyo: true
            })
        });
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
        this.player.name = this.game.player.name;
    }

    createOtherPlayers() {
        this.otherPlayers = this.physics.add.group({allowGravity: false, immovable: true});
        
        playerNames.filter(pName => pName != this.game.player.name).forEach(pName => {
            const sprite = this.physics.add.sprite(-100, 1800, pName);
            sprite.name = pName;
            sprite.team = teamDictionary[pName];
            sprite.body.setSize(PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_WIDTH / 2, 0);
            this.otherPlayers.add(sprite);
        });

        this.quickAccess = this.otherPlayers.getChildren().reduce((acc, child) => {
            acc[child.name] = child;
            return acc;
        }, {});
        
        this.physics.add.overlap(this.player, this.otherPlayers, this.playersCollide);

        this.game.socket.on('playerLeft', playerName => {
            const p = this.otherPlayers.getChildren()
                .find(c => c.name == playerName)

            p.x = -100;
            this.playerNames[playerName].x = -100;
        });

        this.game.socket.on('update', update => {
            const p = this.quickAccess[update.name];

            Object.entries(update).forEach(([k, v]) => {
                p[k] = v;
            });

            update.tintTopLeft == 42495 && p.setTint(HYPER);
        });
    }

    playersCollide = (player, otherPlayer) => {
        if (otherPlayer.tintBottomRight == 42495 && player.tintBottomRight != 42495 &&  otherPlayer.team != this.game.player.team) {
            player.y = this.game.config.height - player.height;

            this.tweens.add({
                targets: player,
                tintBottomLeft: 40000,
                tintBottomRight: 40000,
                tintTopLeft: 40000,
                tintTopRight: 40000,
                ease: 'linear',
                duration: 150,
                repeat: 5,
                yoyo: true,
                onComplete: () => player.clearTint()
            })
        }
    }

    createPlayerNames() {
        this.playerNames = {};
        playerNames.forEach(p => {
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
        const { breakroom_coffee, carafe, coffee, monster, platform } = this.levelGroups;

        this.physics.add.collider(this.player, platform);
        this.physics.add.overlap(this.player, coffee, this.collectObject);
        this.physics.add.overlap(this.player, breakroom_coffee, this.collectObject);
        this.physics.add.overlap(this.player, monster, this.collectObject);
        this.physics.add.overlap(this.player, carafe, this.collectObject);
    }

    collectObject = (_, objCollidedWith) => {
        objCollidedWith.destroy();

        this.game.socket.emit('collect', {
            player: this.game.player,
            sprite: objCollidedWith.texture.key,
            id: objCollidedWith.collectibleID
        });
    };

    addTimers() {
        this.lastState = {
            walking: this.player.walking,
            jumping: this.player.jumping,
            x: this.player.x,
            y: this.player.y,
            flipX: this.player.flipX,
            tintTopRight: this.player.tintTopRight,
            tintTopLeft: this.player.tintTopLeft,
            tintBottomLeft: this.player.tintBottomLeft,
            tintBottomRight: this.player.tintBottomRight
        };

        this.time.addEvent({
            delay: 5,
            callback: () => {
                const currentUpdate = this.getPlayerUpdate();


                if (Object.keys(currentUpdate).length) {
                    this.game.socket.emit('update', {
                        ...this.game.player,
                        ...currentUpdate,
                        y: this.player.y
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

    addScoresText() {
        const { centerY, displayHeight } = this.cameras.main;
        const y = 2 + centerY - .5 * displayHeight;
        const xtremeY = centerY + .5 * displayHeight - 13;
        const { west, east, xtreme } = this.scores;

        this.westText = this.add.bitmapText(
            WEST_X,
            y,
            FONT,
            `W:${west}`,
            SCORE_SIZE,
        );

        this.westText.setTint(WEST_TEXT_COLOR);

        this.westText.setScrollFactor(0);

        this.eastText = this.add.bitmapText(
            EAST_X,
            y,
            FONT,
            `E:${east}`,
            SCORE_SIZE,
        );

        this.eastText.setTint(EAST_TEXT_COLOR);

        this.eastText.setScrollFactor(0);

        this.xtremeText = this.add.bitmapText(
            XTREME_X,
            xtremeY,
            FONT,
            `X:${xtreme}`,
            SCORE_SIZE,
        );

        this.xtremeText.setTint(XTREME_TEXT_COLOR);

        this.xtremeText.setScrollFactor(0);
    }

    addWinnerText() {
        this.winnerText = this.add.bitmapText(
            0,
            0,
            FONT,
            '',
            SCORE_SIZE * .6,
        );

        this.winnerText.setScrollFactor(0);

        this.winnerText.setTint(WINNER_TEXT_COLOR);
    }

    addAbsorbUpdates() {
        this.game.socket.on('collect', ({ player, sprite, id, west, east, xtreme, poison, hyper }) => {
            const thisPlayer = player.name == this.game.player.name;
            thisPlayer && poison && this.poison();
            thisPlayer && hyper && this.hyper();
            thisPlayer && sprite == 'carafe' && this.game.carafe_collect.play();

            const target = this.levelGroups[sprite].getChildren().find(c => c.collectibleID == id);

            target && target.destroy();

            this.scores = { west, east, xtreme };
        });
    }

    hyper() {
        this.playerSpeed = HYPER_SPEED;
        this.player.setTint(HYPER);
        this.game.hyper.play();

        setTimeout(() => {
            if (this.playerSpeed == HYPER_SPEED) {
                this.playerSpeed = PLAYER_SPEED;
                this.player.clearTint();
            }
        }, BUFF_DURATION);
    }

    poison() {
        this.playerSpeed = POISON_SPEED;
        this.player.setTint(POISONED);
        this.game.poisoned.play();

        setTimeout(() => {
            if (this.playerSpeed == POISON_SPEED) {
                this.playerSpeed = PLAYER_SPEED;
                this.player.clearTint();
                this.game.unpoisoned.play();
            }
        }, BUFF_DURATION);
    }

    update() {
        this.wrapClouds();
        this.updatePlayer();
        this.updateOtherPlayers();
        this.writePlayerNames();
        this.updateCamera();
        this.updateScores();
        this.updateWinnerText();
    }

    wrapClouds() {
        this.levelGroups.cloud.getChildren().forEach(c => {
            if (c.x > this.game.config.width + c.width / 2) {
                c.x = -(c.width / 2);
            }
        })
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
        this.game.jump.play();
    }

    playerWalking() {
        const [l, r] = [this.cursors.left.isDown, this.cursors.right.isDown];
        this.player.walking = l ? !r : r;
        l && !r && this.player.setVelocityX(this.playerSpeed * -1);
        r && !l && this.player.setVelocityX(this.playerSpeed);
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
        this.otherPlayers.getChildren().forEach(c => {
            c.walking
                ? c.anims.play(`${c.name}-walking`, true)
                : c.anims.stop(`${c.name}-walking`) || c.setFrame(0);

            c.jumping && c.setFrame(JUMPING_FRAME);
        });
    }

    writePlayerNames() {
        this.otherPlayers.getChildren()
            .concat([this.player])
            .forEach(sprite => {
                this.playerNames[sprite.name].setPosition(
                    sprite.x - PLAYER_NAME_X_OFFSET * sprite.name.length,
                    sprite.y - PLAYER_NAME_Y_OFFSET
                );
            });

    }

    updateCamera() {
        this.updateFollowOffset();
    }

    updateScores() {
        const { centerY, displayHeight } = this.cameras.main;
        const y = 2 + centerY - .5 * displayHeight;
        const xtremeY = centerY + .5 * displayHeight - 13;
        this.westText.setText(`W:${this.scores.west}`);
        this.westText.y = y;
        this.eastText.setText(`E:${this.scores.east}`);
        this.eastText.y = y;
        this.xtremeText.setText(`X:${this.scores.xtreme}`);
        this.xtremeText.y = xtremeY;
    }

    updateWinnerText() {
        const { centerY, displayHeight } = this.cameras.main;
        this.winnerText.y = centerY - displayHeight * .2;
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
}

export default Main;