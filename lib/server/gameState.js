import { level1 } from '../shared/levels';
import { sprites } from '../shared/sprites';

const collectibleSprites = sprites.slice(3);

export default {
    west: 0,
    south: 0,
    collectibles: {
        coffee: {
            pointUpdate: 1,
        },
        breakroom_coffee: {
            pointUpdate: 0,
        },
        monster: {
            pointUpdate: 3
        },
        carafe: {
            pointUpdate: 25
        }
    },
    create() {
        this.parseLevel();
    },
    parseLevel() {
        level1.forEach((row, i) => {
            row.forEach((val, j) => {
                const sprite = sprites[val];

                if (sprite && collectibleSprites.includes(sprite)) {
                    this.collectibles[sprite][`${sprite}-${i}-${j}`] = {
                        collected: false
                    }
                }
            });
        })
    },
    getCurrent() {
        return {
            west: this.west,
            south: this.south,
            collectibles: this.collectibles
        };
    },
    applyCollect(collect) {
        const { player, sprite, id } = collect;
        const group = this.collectibles[sprite];
        const collectible = group[id];

        if (!collectible.collected) {
            collectible.collected = true;
            this[player.team] += group.pointUpdate;
            return { ...collect, west: this.west, south: this.south };
        }
    }
}