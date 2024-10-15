const makeGame = (k) => {
    return k.scene("game", () => {
        const music = k.play("bg", { volume: 0.1, loop: true });

        // Dynamically adjust background to the size of the canvas
        const tileSize = 16 * 4; // Each tile is 16x16, we scale it by 4
        for (let x = 0; x < k.width(); x += tileSize) {
            for (let y = 0; y < k.height(); y += tileSize) {
                k.add([
                    k.pos(x, y),
                    k.sprite("background"),
                    k.scale(4),  // Scale the small tile up
                    k.layer("bg"),
                ]);
            }
        }
        // HUD Box (Adjusted to the dynamic width of the screen)
        const hudBox = k.add([
            k.pos(0, 0),
            k.rect(k.width(), 64),  // Use dynamic width based on canvas size
            k.outline(4),
            k.color(k.Color.fromHex("#071821")),
            k.z(10),
        ]);

        // Score (Position dynamically based on screen size)
        const score = k.add([
            k.pos(20, 20),
            k.color(k.Color.fromHex("#e0f8cf")),
            k.text("Score: 0", {
                size: 32,
                font: "press2p",
            }),
            k.z(10),
            { value: 0 },
        ]);

        // Player (Position dynamically)
        const player = k.add([
            k.pos(k.center().x, k.height() - 64),  // Dynamic position based on canvas height
            k.sprite("ship"),
            k.area(),
            k.body(),
            k.anchor("center"),
            k.scale(4),
            { speed: 800 },
            "player",
        ]);

        // Enemy generation (Position and spawning dynamically based on width)
        const makeEnemy = () => {
            return k.add([
                k.pos(k.rand(16, k.width()), 0),  // Enemies spawn randomly across the width of the screen
                k.sprite("enemy"),
                k.area(),
                k.anchor("center"),
                k.scale(4),
                {
                    speed: 100,
                    fireTimer: 0,
                    fireTime: k.rand(30, 200),
                },
                "enemy",
            ]);
        };

        // Spawn initial enemies
        for (let i = 0; i < 5; i++) {
            makeEnemy();
        }

        // Controls (Adjusted boundary checks to use dynamic canvas width/height)
        k.onKeyDown("left", () => {
            player.move(-player.speed, 0);
            if (player.pos.x <= 32) {
                player.pos.x = 32;
            }
        });

        k.onKeyDown("right", () => {
            player.move(player.speed, 0);
            if (player.pos.x >= k.width() - 32) {
                player.pos.x = k.width() - 32;
            }
        });

        k.onKeyDown("up", () => {
            player.move(0, -player.speed);
            if (player.pos.y <= 80) {
                player.pos.y = 80;
            }
        });

        k.onKeyDown("down", () => {
            player.move(0, player.speed);
            if (player.pos.y >= k.height() - 32) {
                player.pos.y = k.height() - 32;
            }
        });

        // Fire laser (Use dynamic player position)
        k.onKeyPress("space", () => {
            k.play("laser", { volume: 0.3 });
            k.add([
                k.pos(player.pos.x, player.pos.y - 64),
                k.sprite("laser"),
                k.area(),
                k.anchor("center"),
                k.offscreen({ destroy: true }),
                k.scale(4),
                {
                    speed: 1000,
                },
                "laser",
            ]);
        });

        // Game Loop
        k.onUpdate("laser", (laser) => {
            laser.move(0, -laser.speed);
        });

        k.onUpdate("bullet", (bullet) => {
            bullet.move(0, bullet.speed);
        });

        k.onUpdate("enemy", (enemy) => {
            enemy.move(0, enemy.speed);
            enemy.fireTimer++;

            if (enemy.pos.y >= k.height()) {  // Enemy moves off the bottom of the screen based on dynamic height
                k.destroy(enemy);
                makeEnemy();
            }

            if (enemy.fireTimer >= enemy.fireTime) {
                k.play("bullet", { volume: 0.3 });
                k.add([
                    k.pos(enemy.pos.x, enemy.pos.y + 32),
                    k.sprite("bullet"),
                    k.area(),
                    k.anchor("center"),
                    k.offscreen({ destroy: true }),
                    k.scale(4),
                    {
                        speed: 200,
                    },
                    "bullet",
                ]);
                enemy.fireTimer = 0;
            }
        });

        // Collision (Laser hits enemy)
        k.onCollide("laser", "enemy", (laser, enemy) => {
            k.play("explode", { volume: 0.6 });
            score.value += 1;
            score.text = "Score: " + score.value;
            k.destroy(enemy);
            k.destroy(laser);
            makeEnemy();
        });

        // Player collides with enemy or bullet
        k.onCollide("player", "enemy", (player, enemy) => {
            k.destroy(enemy);
            k.destroy(player);
            k.play("explode");
            music.stop();
            k.go("gameOver");
        });

        k.onCollide("player", "bullet", (player, bullet) => {
            k.destroy(player);
            k.destroy(bullet);
            k.play("explode");
            music.stop();
            k.go("gameOver");
        });
    });
};

export default makeGame;
