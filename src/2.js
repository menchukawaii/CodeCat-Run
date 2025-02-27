import kaplay from "kaplay";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

kaplay();

loadRoot("./"); // A good idea for Itch.io publishing later

loadSprite("cat", "sprites/cat1.png");

scene("game", () => {
    setGravity(1200);

    let trees = [];

    const cat = add([
        sprite("cat"),
        pos(120, 40),
        scale(0.25),
        area(),
        body(),
        anchor("center")    
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
    function stopTrees() {
        trees.forEach(tree => {            
            tree.paused = true;
        });
    }

    function spawnTree() {
        let tree = add([
            rect(48, rand(24, 64)),
            area(),
            outline(4),
            pos(width(), height() - 48),
            anchor("botleft"),
            color(255, 180, 255),
            move(LEFT, 240),
            "tree", // add a tag here
        ]);
        trees.push(tree);
        wait(rand(1, 2.5), () => {
            if (!cat.paused) 
                spawnTree();
        });
    }

    spawnTree();

    cat.onCollide("tree", () => {
        stopTrees();
        cat.paused = true;
        shake();
        addKaboom(cat.pos);
        wait(1, () => {
            go("lose", score);
        });
    
    });

    let score = 0;
    const scoreLabel = add([text(score), pos(24, 24)]);
    
    // increment score every frame
    onUpdate(() => {
        if (!cat.paused)
            score++;
        scoreLabel.text = score;
    })

});

scene("lose", (score) => {    
    const endLabel = add([text("Game Over"), pos(center()), anchor("center")]);    
    endLabel.add([text(score), pos(0,50), anchor("center")]);
    wait(1.5, () => {
        go("game");        
    });

});

go("game");
