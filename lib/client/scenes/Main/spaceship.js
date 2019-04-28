import { GAME_WIDTH } from 'client/game';

const COLORS = ['#49e7ff', '#6945ff'];
const BEAM_VERT_OFFSET = 10;
const BEAM_HORIZ_OFFSET_RIGHT = 30;
const BEAM_HORIZ_OFFSET_LEFT = 3;
const BEAM_WIDTH = 3;

export default class SpaceShip {
    constructor(pos, facingRight) {
        this.pos = pos;
        this.facingRight = facingRight;
        this.tip = {};
    }

    move(pos) {
        this.facingRight = pos.x > this.pos.x;
        this.pos = pos;
    }

    fire() {
        this.updateTipPosition();
        const beam = new BreakerBeam(this.tip, this.facingRight);
        this.renderBeam(beam.fire());
    }

    updateTipPosition() {
        this.tip.x = this.facingRight 
            ? this.pos.x + BEAM_HORIZ_OFFSET_RIGHT 
            : this.pos.x - BEAM_HORIZ_OFFSET_LEFT;

        this.tip.y = this.pos.y + BEAM_VERT_OFFSET;
    }
}

class BreakerBeam {
    constructor({ x, y }, facingRight) {
        this.facingRight = facingRight;
        this.origin = { x, y };
    }

    fire() {
        let length = this.facingRight 
            ? GAME_WIDTH - this.origin.x
            : this.origin.x;

        return Array.from(new Array(length*BEAM_WIDTH), this.getPixelColor);
    }

    getPixelColor() {
        const tf = Math.random() > .5;
        return COLORS[+tf];
    }
}