
export function createWelcomeScene(k) {

      // Add a background layer
    k.add([
        k.rect(k.width(), k.height()), // Create a rectangle that covers the screen
        k.pos(0, 0),
        k.color(135, 206, 235), // A light sky blue color
        k.z(-1), // Set z-index to -1 to be behind everything else
    ]);

    // Add a simple text object to the center of the screen
    const title = k.add([
        k.text("Catch me if you can!", 32, {
            font: "happy",
            width: k.width() - 20, // Set a maximum width for the text
            lineSpacing: 5, // Set line spacing for better readability
        }),
        k.pos(k.center()),
        k.anchor("center"),
        k.area(),
        k.scale(1.5), // Add scale component
    ]);


    // Add a smooth hover effect for better user feedback
    title.onHover(() => {
        k.tween(title.scale, k.vec2(1.7, 1.7), 0.2, (val) => title.scale = val, k.easings.easeOutQuad);
        k.setCursor("pointer");
    });

    title.onHoverEnd(() => {
        k.tween(title.scale, k.vec2(1.5, 1.5), 0.2, (val) => title.scale = val, k.easings.easeOutQuad);
        k.setCursor("default");
    });

    // Add Start Game button
    const startButton = k.add([
        k.rect(300, 60, { radius: 8 }),
        k.pos(k.center().x, k.center().y + 100),
        k.anchor("center"),
        k.area(),
        k.color(74, 144, 226), // Modern blue background
        k.scale(1),
        "startButton"
    ]);

    const buttonText = k.add([
        k.text("Start Game", 24, {
            font: "happy",
        }),
        k.pos(k.center().x, k.center().y + 100),
        k.anchor("center"),
        k.color(255, 255, 255), // White text
        k.scale(1),
    ]);

    // Button click event
    startButton.onClick(() => {
        k.go("game"); // Transition to the game scene
    });

    // Button hover effects
    startButton.onHover(() => {
        k.tween(startButton.scale, k.vec2(1.1, 1.1), 0.2, (val) => startButton.scale = val, k.easings.easeOutQuad);
        k.tween(buttonText.scale, k.vec2(1.1, 1.1), 0.2, (val) => buttonText.scale = val, k.easings.easeOutQuad);
        startButton.color = k.rgb(94, 164, 246); // Lighter blue on hover
        k.setCursor("pointer");
    });

    startButton.onHoverEnd(() => {
        k.tween(startButton.scale, k.vec2(1, 1), 0.2, (val) => startButton.scale = val, k.easings.easeOutQuad);
        k.tween(buttonText.scale, k.vec2(1, 1), 0.2, (val) => buttonText.scale = val, k.easings.easeOutQuad);
        startButton.color = k.rgb(74, 144, 226); // Original blue
        k.setCursor("default");
    });
}