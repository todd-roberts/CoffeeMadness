import level from '../../../shared/levels';
import sprites, { isCollectible } from '../../../shared/sprites';

const TILE_SIZE = 16;

const collectibleInfo = {
    allowGravity: false,
    immovable: true
};

export default class LevelBuilder {
    constructor(physics, initialCollectibles) {
        this.physics = physics;
        this.initialCollectibles = initialCollectibles;
        this.initialize();
    }

    initialize() {
        this.groups = {
            platform: this.physics.add.staticGroup(),
            cloud: this.physics.add.group(collectibleInfo),
            coffee: this.physics.add.group(collectibleInfo),
            breakroom_coffee: this.physics.add.group(collectibleInfo),
            monster: this.physics.add.group(collectibleInfo),
            carafe: this.physics.add.group(collectibleInfo)
        };
    }

    buildGroups() {


        for (let i = 0; i < level.length; i++) {
            for (let j = 0; j < level[i].length; j++) {
                const spriteToAdd = sprites.all[level[i][j]];

                if (!spriteToAdd) continue;

                const s = isCollectible(spriteToAdd)
                    ? this.getCollectibleSprite(spriteToAdd, i, j)
                    : this.getNonCollectibleSprite(spriteToAdd, i, j);

                s && this.groups[spriteToAdd].add(s);
            }
        }

        return this.groups;
    }

    getCollectibleSprite(spriteToAdd, i, j) {
        const id = `${spriteToAdd}-${i}-${j}`;

        if (!this.initialCollectibles[spriteToAdd][id].collected) {
            const s = this.createSprite(i, j, spriteToAdd, false);

            s.collectibleID = id

            return s;
        }
    }

    getNonCollectibleSprite(spriteToAdd, i, j) {
        return this.createSprite(i, j, spriteToAdd, spriteToAdd == 'platform');
    }

    createSprite(i, j, sprite, isStatic) {
        const x = j * TILE_SIZE;
        const y = i * TILE_SIZE;
        const s = this.physics.add[isStatic ? 'staticSprite' : 'sprite'](
            x + TILE_SIZE / 2,
            y + TILE_SIZE / 2,
            sprite
        );
        return s;
    }
}
