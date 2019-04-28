import { level1 } from './levels';

const TILE_SIZE = 16;
const sprites = [null,'platform','cloud',
'coffee','breakroom_coffee',
'monster', 'carafe'];

export default class LevelCreator {
    constructor(physics) {
        this.physics = physics;
        this.initialize();
    }

    initialize() {
        this.loadLevelMap();
        this.initGroups();
    }

    loadLevelMap() {
        this.level = level1;
    }

    initGroups() {
        this.groups = {
            platform: this.physics.add.staticGroup(),
            cloud: this.physics.add.group({
                allowGravity: false,
                immovable: true
            }),
            coffee: this.physics.add.group({
                allowGravity: false,
                immovable: false
            }),
            ['breakroom_coffee']: this.physics.add.group({
                allowGravity: false,
                immovable: false
            }),
            monster: this.physics.add.group({
                allowGravity: true,
                immovable: false,

            }),
            carafe: this.physics.add.group({
                allowGravity: false,
                immovable: true
            })
        };
    }

    create() {
        for (let i = 0; i < this.level.length; i++) {
            for (let j = 0; j < this.level[i].length; j++) {
                const spriteToAdd = sprites[this.level[i][j]];
                
                if (spriteToAdd) {
                    this.groups[spriteToAdd].add(
                        this.createSprite(i, j, spriteToAdd, spriteToAdd == 'platform')
                    );
                }
            }
        }

        return this.groups;
    }

    createSprite(i, j, sprite, isStatic) {
        const x = j * TILE_SIZE;
        const y = i * TILE_SIZE;
        const s = this.physics.add[isStatic ? 'staticSprite' : 'sprite'](
            x + TILE_SIZE / 2,
            y + TILE_SIZE / 2,
            sprite,
        );
        return s;
    }
}