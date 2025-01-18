import kaplay from "kaplay";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

kaplay();

loadRoot("./"); // A good idea for Itch.io publishing later

loadSprite("cat", "sprites/cat1.png");

scene("game", () => {
    setGravity(1600);

    const cat = add([
        sprite("cat"),
        pos(120, 40),
        scale(0.25),
        area(),
        body()
    ]);

    onKeyPress("space", () => {
        if (cat.isGrounded()) {
            cat.jump();
        }
    });

    const platflorm = add([
        rect(width(), 48),
        pos(0, height() - 48),
        outline(4),
        area(),
        body({ isStatic: true }),
        color(127, 200, 255),
    ]);

    function spawnTree() {
        add([
            rect(48, rand(24, 64)),
            area(),
            outline(4),
            pos(width(), height() - 48),
            anchor("botleft"),
            color(255, 180, 255),
            move(LEFT, 240),
            "tree", // add a tag here
        ]);
        wait(rand(0.5, 1.5), () => {
            spawnTree();
        });
    }

    spawnTree();

    cat.onCollide("tree", () => {
        addKaboom(cat.pos);
        shake();
        go("lose");
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
