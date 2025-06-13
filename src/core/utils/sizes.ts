import EventEmitter from '@core/utils/EventEmitter';

export default class Sizes extends EventEmitter {
    width!: number;
    height!: number;
    pixelRatio!: number;
    aspectRatio!: number; 

    constructor() {
        super();

        this.recalculate();

        window.addEventListener('resize', () => {
            this.recalculate();
            this.trigger('resize');
        });
    }

    recalculate() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.aspectRatio = this.width / this.height;
    }
}