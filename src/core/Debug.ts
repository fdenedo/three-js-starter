import { Pane } from "tweakpane";

export default class Debug {
    public active: boolean;
    public pane?: Pane;

    constructor() {
        this.active = window.location.hash === '#debug';

        if (this.active) {
            this.pane = new Pane({ title: 'Debug Controls' });
        }
    }
}