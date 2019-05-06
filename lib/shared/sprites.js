export const spriteInfo = {
    frameWidth: 16,
    frameHeight: 16,
    margin: 0,
    spacing: 0
};

export function getAnimationInfo(anims, textureName) {
    return {
        frames: anims.generateFrameNames(textureName, {
            frames: [0, 1, 2, 3, 4, 5, 6, 7]
        }),
        frameRate: 12,
        repeat: -1
    };
}

const all = [null, 'platform', 'cloud',
    'coffee', 'breakroom_coffee',
    'monster', 'carafe'];

const collectible = all.slice(3);

export function isCollectible(sprite) {
    return collectible.includes(sprite);
};

export default {
    all,
    collectible
};