class UI {
    constructor(scene) {
        this.scene = scene;
    }

    new(...args) {
        const [object] = args;
        return this.scene.add[object](...args.slice(1));
    }

    add(value) {
        this.container.add(value);
    }

    setParent(parent) {
        this.parent(parent);
        return this;
    }

    update() {
        this.list.forEach((container) => {
            container.update();
        });
    }
}

export default UI;
