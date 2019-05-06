import level from '../shared/levels';
import LevelProcessor from './levelProcessor';

const WAITING_PERIOD = 60000 * .5;

export default {
    init() {
        this.west = 0;
        this.south = 0;
        this.levelProcessor = new LevelProcessor(level);
        this.getObjectives();
    },
    getObjectives: function () {
        const { pointsPossible, collectibles } = this.levelProcessor.output();
        this.pointsPossible = pointsPossible;
        this.collectibles = collectibles;
    },
    getCurrent: function () {
        return {
            west: this.west,
            south: this.south,
            collectibles: this.collectibles
        };
    },
    applyCollect: function (collect) {
        const { sprite, id } = collect;

        if (!this.collectibles[sprite][id].collected) {
            return this.update(collect);
        }
    },
    update: function (collect) {
        const { player, sprite, id } = collect;

        this.collectibles[sprite][id].collected = true;

        this[player.team] += this.collectibles[sprite].pointUpdate;

        const gameOver = this.west + this.south == this.pointsPossible;

        gameOver && setTimeout(this.init.bind(this), WAITING_PERIOD);

        return this.createNotification(collect, gameOver);
    },
    createNotification: function (collect, gameOver) {
        return {
            ...collect,
            poison: collect.sprite == 'breakroom_coffee',
            hyper: collect.sprite == 'monster',
            south: this.south,
            west: this.west,
            gameOver: gameOver && WAITING_PERIOD
        };
    }
};