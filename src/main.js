import kaplay from "kaplay";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

kaplay();

loadRoot("./"); // A good idea for Itch.io publishing later

loadSprite("cat2", "sprites/cat1.png");
loadSprite("cat", "sprites/cat.png", {
    sliceX: 2, // how many sprites are in the X axis
    sliceY: 1, // how many sprites are in the Y axis
    anims: {
        run: { from: 0, to: 1, loop: true }
    },
});

const FLOOR_HEIGHT = 200;
const JUMP_FORCE = 1200;
const SPEED = 480;

scene("game", () => {
    setGravity(1600);

    const cat = add([
        sprite("cat", {
            frame: 1, // the frame of the sprite
            // flipX: false, // flip the sprite in the X axis
            // flipY: false, // flip the sprite in the Y axis
            anim: "run", // the animation to play at the start
            animSpeed: 0.75
        }),
        pos(120, 40),
        scale(0.8),
        area(),
        body()
    ]);

    onKeyPress("space", () => {
        if (cat.isGrounded()) {
            cat.jump(JUMP_FORCE);
            // cat.applyImpulse(vec2(100, 0));
        }
    });

    const platflorm = add([
        rect(width(), FLOOR_HEIGHT),
        pos(0, height() - FLOOR_HEIGHT),
        outline(4),
        area(),
        body({ isStatic: true }),
        color(127, 200, 255),
    ]);

    function spawnTree() {
        add([
            rect(FLOOR_HEIGHT, rand(60, 200)),
            area(),
            outline(4),
            pos(width(), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            color(255, 180, 255),
            move(LEFT, SPEED),
            "tree", // add a tag here
        ]);
        wait(rand(1.2, 2.5), () => {
            spawnTree();
        });
    }

    spawnTree();

    cat.onCollide("tree", () => {
        addKaboom(cat.pos);
        shake();
        // go("lose");
    });

    let score = 0;
    const scoreLabel = add([text(score), pos(24, 24)]);

    // increment score every frame
    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    })

});

scene("lose", () => {
    add([text("Game Over"), pos(center()), anchor("center")]);
});

go("game");
