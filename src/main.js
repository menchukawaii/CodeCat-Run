import kaplay from "kaplay";

kaplay();

loadSprite("cat", "sprites/player.png", {
    sliceX: 2,
    sliceY: 1,
    anims: {
        run: { from: 0, to: 1, loop: true }
    },
});

loadSprite("ob1", "sprites/ob1.png");
loadSprite("ob3", "sprites/ob3.png");
loadSprite("ob2", "sprites/ob2.png");

const FLOOR_HEIGHT = 200;
const JUMP_FORCE = 1100;
const SPEED = 480;

scene("game", () => {

    let obstacles = [];
    let is_jump = false;
    let is_in_site = true;

    const background = add([
        rect(width(), height()),
        pos(0, 0),

        body({ isStatic: true }),
        color(104, 210, 231),
    ]);

    setGravity(1600);

    const cat = add([
        sprite("cat", {
            frame: 1,
            anim: "run",
            animSpeed: 1.2
        }),
        pos(120, 40),
        scale(0.5),
        area({ shape: new Rect(vec2(30, 0), 400, 400) }), // Área más pequeña
        body(),
        rotate(),
        animate(),
        anchor("center")
    ]);

    onKeyPress("space", () => {
        if (cat.isGrounded()) {
            is_jump = true;                        
            cat.jump(JUMP_FORCE);
            cat.applyImpulse(vec2(100, 0)); //desplazamiento horizontal al saltar                        
            cat.animate("angle", [0, -15], {
                duration: 0.5,
                loops: 1
            });     
            tween(
                0,  // Ángulo inicial relativo
                -15, // Ángulo final
                0.2, // Duración (ajústala según la animación)
                (val) => cat.angle = 0 + val, // Actualiza la rotación
                easings.easeOutQuad // Suaviza la animación
            );      
        }
    });


    const floor = add([
        rect(width(), FLOOR_HEIGHT),
        pos(0, height() - FLOOR_HEIGHT),
        outline(1),
        area(),
        body({ isStatic: true }),
        color(148, 160, 50),
        "floor"
    ]);

    function createObstacleMushroom() {
        return add([
            sprite("ob1"),
            pos(width(), height() - 140),
            area({ shape: new Rect(vec2(80, 100), 500, 800) }), // Área más pequeña
            scale(0.3),
            anchor("botleft"),
            move(LEFT, SPEED),
            "obstacle", // add a tag here
        ]);
    }

    function createObstacleBasket() {
        return add([
            sprite("ob2"),
            pos(width(), height() - 140),
            area({ shape: new Rect(vec2(80, 100), 500, 600) }), // Área más pequeña
            scale(0.3),
            anchor("botleft"),
            move(LEFT, SPEED),
            "obstacle", // add a tag here
        ]);
    }

    function createObstacleStump() {
        return add([
            sprite("ob3"),
            pos(width(), height() - 140),
            area({ shape: new Rect(vec2(90, 100), 500, 900) }), // Área más pequeña
            scale(0.3),
            anchor("botleft"),
            move(LEFT, SPEED),
            "obstacle", // add a tag here
        ]);
    }

    function spawnObstacle() {

        switch (Math.floor(Math.random() * 3)) {
            case 0:
                obstacles.push(createObstacleMushroom());
                break;
            case 1:
                obstacles.push(createObstacleBasket());
                break;
            case 2:
                obstacles.push(createObstacleStump());
                break;
        }

        wait(rand(1.5, 3), () => {
            if (!cat.paused) {
                spawnObstacle();
            }
        });
    }

    spawnObstacle();

    function stopObstacles() {

        obstacles.forEach(obstacle => {
            obstacle.paused = true;
        });
    }

    cat.onCollide("obstacle", () => {
        // shake();
        addKaboom(cat.pos);
        stopObstacles();
        cat.paused = true;
        wait(1, () => {
            go("lose", score);
        });

    });
    cat.onCollide("floor", () => {
        if (is_jump) {
            cat.applyImpulse(vec2(-100, 0));
            cat.applyImpulse(vec2(-200, 0));
            is_jump = false;
            is_in_site = false
            cat.animate("angle", [-15, 0], {
                duration: 0.01,
                loops: 1
            });            
        }
    });

    let score = 0;
    const scoreLabel = add([text(score), pos(24, 24)]);

    // increment score every frame
    onUpdate(() => {
        score++;
        scoreLabel.text = score;

        if (cat.pos.x < 120 && is_in_site == false) {
            cat.applyImpulse(vec2(200, 0));
            is_in_site = true;
        }

    })

});

scene("lose", (score) => {
    const endLabel = add([text("Game Over"), pos(center()), anchor("center")]);
    endLabel.add([text(score), pos(0, 50), anchor("center")]);
    wait(1.5, () => {
        go("game");
    });

});

go("game");
