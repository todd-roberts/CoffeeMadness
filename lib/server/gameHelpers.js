import sprites from '../shared/sprites';
import { pointValues } from './gameConfig';
 
export function getPointsGroups() {
    return sprites.collectible.reduce((acc, c) => {
        acc[c] = acc[c] || { pointUpdate: pointValues[c]};
        return acc;
    }, {});
};