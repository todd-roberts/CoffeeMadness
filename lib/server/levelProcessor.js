import sprites, { isCollectible } from '../shared/sprites';
import { getPointsGroups } from './gameHelpers';

class LevelProcessor {
    constructor(level) {
        this.level = level;
        this.pointsPossible = 0;
        this.collectibles = {
            ...getPointsGroups()
        };
    }

    output = () => {
        this.readCollectibles();

        return {
            pointsPossible: this.pointsPossible,
            collectibles: this.collectibles
        };
    }

    readCollectibles() {
        this.level.forEach(this.processRow);
    }

    processRow = (row, i) => {
        row.forEach((code, j) => {
            const sprite = sprites.all[code];

            if (sprite && isCollectible(sprite)) {
                this.pointsPossible += this.collectibles[sprite].pointUpdate;
                this.addToCollectibles(sprite, i, j);
            }
        });
    }

    addToCollectibles(sprite, i, j) {
        const id = `${sprite}-${i}-${j}`;

        this.collectibles[sprite][id] = { collected: false };
    }
}

export default LevelProcessor;