import EventEmitter from './utils/EventEmitter';

export default class Time extends EventEmitter {
    public readonly startTime: number;

    public current: number;
    public elapsed: number;
    public delta: number;
    public scale: number;

    private animationFrameId: number | null = null;

    constructor() {
        super();

        this.startTime  = Date.now();
        this.current    = this.startTime;
        this.elapsed    = 0;
        this.delta      = 16; // Initial value corresponds to 60fps
        this.scale      = 1;
    }

    private tick(): void {
        const currentTime = Date.now();
        const deltaUnscaled = currentTime - this.current;
        this.current = currentTime;

        this.delta = deltaUnscaled * this.scale;
        this.elapsed += this.delta;

        this.trigger('tick');

        window.requestAnimationFrame(() => this.tick());
    }

    public start(): void {
        this.animationFrameId = window.requestAnimationFrame(() => this.tick());
    }

    public pause(): void {
        this.scale = 0;
    }

    public play(): void {
        this.current = Date.now();
        this.scale = 1;
    }

    public setSpeed(newScale: number): void {
        this.scale = Math.max(0, newScale); // Ensure scale is not negative
    }

    public fastForward(duration: number): void {
        this.elapsed += duration;
        // Trigger a tick immediately to ensure all components update
        // to the new elapsed time instantly.
        this.trigger("tick");
    }

    public stop(): void {
        if (this.animationFrameId) {
            window.cancelAnimationFrame(this.animationFrameId);
        }
        this.off("tick");
    }
}