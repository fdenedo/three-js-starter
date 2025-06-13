import World from "./world/World.js";
import Experience from "./core/Experience.js"
import Fox from "./world/entities/Fox.js";
import Floor from "./world/entities/Floor.js";
import Environment from "./world/Environment.js";

const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl');

if (canvas) {
    const experience = new Experience(canvas);

    const world = new World();
    
    experience.resources.on('ready', () => {
        const floor = new Floor();
        const fox = new Fox();
        const environment = new Environment();

        world.add(floor);
        world.add(fox);
    });
    
    experience.loadWorld(world);
    experience.init();
}