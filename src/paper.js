import { showGameOverScreen } from "./gameoverScreen.js";

export function createPaper(pencilBox) {
    loadBitmapFont("unscii", "public/examples/fonts/unscii_8x8.png", 8, 8);
    loadSound("pickupPaper", "public/sounds/pickupPaper1.mp3");
    loadSound("putdownPaper", "public/sounds/putdownPaper.mp3");
    const paperSize = 0.4;
    let testPaper = null;
    let answers = ["", "", "", "", "", "", "", "", "", ""]; // 10 blank answers
    let selectedBlank = -1;
    let paperTexts = [];
    let answerTexts = []; // Track answer text objects separately
    let isEnlarged = false;
    
    // Create single test paper on the blue rect (desk/table)
    // Blue rect is at pos(width() / 2 - 300, height() - 400) with size 600x400
    const deskX = width() / 2 - 300;
    const deskY = height() - 400;
    const deskWidth = 600;
    const deskHeight = 400;
    
    // Test questions
    const questions = [
        "1. @@@",         // 3 at symbols
        "2. ##$",         // 2 hashes, 1 dollar
        "3. OO*",         // 2 letter O, 1 asterisk
        "4. @#O*",        // 1 at, 1 hash, 1 O, 1 asterisk
        "5. **@",         // 2 asterisks, 1 at
        "6. O#*",         // 1 O, 1 hash, 1 asterisk
        "7. @O*",         // 1 at, 1 O, 1 asterisk
        "8. #*#",         // 2 hashes, 1 asterisk
        "9. O@*",         // 1 O, 1 at, 1 asterisk
        "10. @*#",        // 1 at, 1 asterisk, 1 hash
    ];
    
    // Correct answers (accepting both letter and full answer)
    const correctAnswers = [
        "a",          
        "b",          
        "c",          
        "d",          
        "e",          
        "f",          
        "g",          
        "h",          
        "i",          
        "j"          
    ];
    
    // Create the test paper positioned on the desk
    const paperX = deskX + deskWidth / 2 + 200; // Offset to the right of the desk
    const paperY = deskY + deskHeight / 2;
    
    loadSprite("testPaper", "public/sprites/exampaper.png");

    testPaper = add([
        sprite("testPaper"),
        pos(paperX, paperY ),
        anchor("center"),
        scale(paperSize), // Use the paperSize variable for consistent scaling
        area(),
        layer("paper"),
        "testPaper",
        {
            isEnlarged: false,
            originalPos: vec2(paperX, paperY),
            originalScale: vec2(paperSize),
        }
    ]);
    
    // Add paper title when not enlarged
    const paperTitle = add([
        text("TEST PAPER", {
            font: "unscii",
            size: 12,
        }),
        pos(paperX - 30, paperY - 40), // Position relative to paper, moved further up
        anchor("center"),
        color(rgb(0, 0, 0)),
        layer("paper"), // Same layer as the paper
        "paperTitle",
    ]);
    
    // Hover effects
    testPaper.onHover(() => {
        if (!isEnlarged) {
            testPaper.scale = vec2(paperSize + 0.05); // Slightly enlarge on hover
        }
    });
    
    testPaper.onHoverEnd(() => {
        if (!isEnlarged) {
            testPaper.scale = vec2(paperSize); // Return to original size
        }
    });
    
    // Click to enlarge test paper
    testPaper.onClick(() => {
        if (!isEnlarged) {
            openTestPaper();
            play("pickupPaper");
        }
    });
    
    function openTestPaper() {
        isEnlarged = true;
        
        // Hide the title
        if (paperTitle) {
            destroy(paperTitle);
        }
        
        // Animate to center and enlarge
        tween(
            testPaper.pos,
            vec2(paperX, paperY),
            0.5,
            (val) => {
                testPaper.pos = val;
            },
            easings.easeOutBack
        );
        
        tween(
            testPaper.scale,
            vec2(2.0), // Scale up to 2x size
            0.5,
            (val) => {
                testPaper.scale = val;
            },
            easings.easeOutBack
        ).then(() => {
            showTestContent();
        });
    }
    
    function closeTestPaper() {
        // Clear all text
        paperTexts.forEach(textObj => {
            if (textObj && textObj.exists) {
                destroy(textObj);
            }
        });
        paperTexts = [];
        answerTexts = [];
        selectedBlank = -1;
        
        // Animate back to original position and size
        tween(
            testPaper.pos,
            testPaper.originalPos,
            0.3,
            (val) => {
                testPaper.pos = val;
            },
            easings.easeInOutSine
        );
        
        tween(
            testPaper.scale,
            testPaper.originalScale,
            0.3,
            (val) => {
                testPaper.scale = val;
            },
            easings.easeInOutSine
        ).then(() => {
            isEnlarged = false;
            // Recreate title
            add([
                text("TEST PAPER", {
                    font: "unscii",
                    size: 12,
                }),
                pos(testPaper.pos.x - 30, testPaper.pos.y - 40),
                anchor("center"),
                color(rgb(0, 0, 0)),
                layer("paper"),
                "paperTitle",
            ]);
        });
    }
    
    function showTestContent() {
        const startY = height() / 2 - 300;
        const lineHeight = 50;
        
        // Clear answer texts array
        answerTexts = [];
        
        // Add test header
        const header = add([
            text("EXAM - Fill in the blanks", {
                font: "unscii",
                size: 14,
            }),
            pos(width() / 2, startY),
            anchor("center"),
            color(rgb(0, 0, 0)),
            "testHeader",
        ]);
        paperTexts.push(header);
        
        // Add questions and answer blanks
        questions.forEach((question, index) => {
            const questionY = startY + 50 + (index * lineHeight);
            
            // Question text
            const questionText = add([
                text(question, {
                    font: "unscii",
                    size: 18,
                    width: 500,
                }),
                pos(width() / 2 - 250, questionY),
                color(rgb(0, 0, 0)),
                layer("paper"),
                "questionText",
            ]);
            paperTexts.push(questionText);
            
            // Answer input box
            const answerBox = add([
                rect(200, 25),
                pos(width() / 2 + 100, questionY),
                color(selectedBlank === index ? rgb(200, 200, 255) : rgb(240, 240, 240)),
                outline(1, rgb(0, 0, 0)),
                area(),
                layer("paper"),
                "answerBox",
                {
                    questionIndex: index
                }
            ]);
            paperTexts.push(answerBox);
            
            // Answer text
            const answerText = add([
                text(answers[index], {
                    font: "unscii",
                    size: 10,
                }),
                pos(width() / 2 + 110, questionY + 5),
                color(rgb(0, 0, 0)),
                layer("paper"),
                "answerText",
            ]);
            paperTexts.push(answerText);
            answerTexts[index] = answerText; // Store reference by index
            
            // Click handler for answer box
            answerBox.onClick(() => {
                selectBlank(index);
            });
        });
        
        // Instructions
        const instructions = add([
            text("Click on answer boxes to select, then type your answers. Press ESC to close.", {
                font: "unscii",
                size: 12,
                width: 500,
                align: "center",
            }),
            pos(width() / 2, startY + 550),
            anchor("center"),
            color(rgb(100, 100, 100)),
            "instructions",
        ]);
        paperTexts.push(instructions);
        
        // Hand-in button
        const handInButton = add([
            rect(120, 40),
            pos(width() / 2, startY + 600),
            anchor("center"),
            color(rgb(100, 200, 100)),
            outline(2, rgb(0, 100, 0)),
            area(),
            layer("paper"),
            "handInButton",
        ]);
        paperTexts.push(handInButton);
        
        const handInText = add([
            text("HAND IN", {
                font: "unscii",
                size: 12,
            }),
            pos(width() / 2, startY + 600),
            anchor("center"),
            color(rgb(0, 0, 0)),
            layer("paper"),
            "handInText",
        ]);
        paperTexts.push(handInText);
        
        // Hand-in button click handler
        handInButton.onClick(() => {
            handInExam();
        });
    }
    
    function selectBlank(index) {
        selectedBlank = index;
        updateAnswerBoxColors();
    }
    
    function updateAnswerBoxColors() {
        paperTexts.forEach(textObj => {
            if (textObj.is && textObj.is("answerBox")) {
                if (textObj.questionIndex === selectedBlank) {
                    textObj.color = rgb(200, 200, 255);
                } else {
                    textObj.color = rgb(240, 240, 240);
                }
            }
        });
    }
    
    function updateAnswerText() {
        if (selectedBlank >= 0 && selectedBlank < answerTexts.length && answerTexts[selectedBlank]) {
            answerTexts[selectedBlank].text = answers[selectedBlank];
        }
    }
    
    function calculateScore() {
        let correctCount = 0;
        
        for (let i = 0; i < Math.min(answers.length, correctAnswers.length); i++) {
            const userAnswer = answers[i].toLowerCase().trim();
            const correctAnswer = correctAnswers[i].toLowerCase().trim();
            
            if (userAnswer === correctAnswer) {
                correctCount++;
            }
        }
        
        const percentage = (correctCount / correctAnswers.length) * 100;
        return {
            correctCount: correctCount,
            totalQuestions: correctAnswers.length,
            percentage: percentage,
            passed: percentage >= 80
        };
    }
    
    function handInExam() {
        const score = calculateScore();
        
        // Close the test paper first
        closeTestPaper();
        
        // Pass the score data directly to the gameover scene
        go("gameover", {
            percentage: score.percentage,
            passed: score.passed,
            correctCount: score.correctCount,
            totalQuestions: score.totalQuestions
        });
        
        debug.log(`Exam handed in! Score: ${score.percentage}% (${score.correctCount}/${score.totalQuestions})`);
    }
    
    // Handle typing input
    onCharInput((ch) => {
        if (!isEnlarged || selectedBlank === -1) return;
        answers[selectedBlank] += ch;
        updateAnswerText();
    });
    
    onKeyPress("backspace", () => {
        if (!isEnlarged || selectedBlank === -1) return;
        answers[selectedBlank] = answers[selectedBlank].slice(0, -1);
        updateAnswerText();
    });
    
    onKeyPress("tab", () => {
        if (!isEnlarged) return;
        selectedBlank = (selectedBlank + 1) % questions.length;
        updateAnswerBoxColors();
    });
    
    // ESC key to close test paper
    onKeyPress("escape", () => {
        if (isEnlarged) {
            play("putdownPaper");
            closeTestPaper();
        }
    });
    
    // Add instruction text
    const instructionText = add([
        text("Click the test paper to start exam", {
            font: "unscii",
            size: 12,
        }),
        pos(20, height() - 60),
        color(rgb(255, 255, 255)),
        layer(),
        "paperInstruction",
    ]);
    
    // Hide test paper when pencil box is enlarged
    if (pencilBox) {
        onUpdate(() => {
            if (testPaper) {
                if (!isEnlarged) {
                    // Hide test paper when pencil box is enlarged
                    testPaper.opacity = pencilBox.isEnlarged ? 0 : 1;
                    // Disable/enable clicking when pencil box is enlarged
                    testPaper.area.enabled = !pencilBox.isEnlarged;
                    // Also hide instruction text when pencil box is open
                    instructionText.opacity = pencilBox.isEnlarged ? 0 : 1;
                    // Hide paper title when pencil box is enlarged
                    const paperTitleObj = get("paperTitle")[0];
                    if (paperTitleObj) {
                        paperTitleObj.opacity = pencilBox.isEnlarged ? 0 : 1;
                    }
                } else {
                    // When test paper is enlarged, hide all test content when pencil box is opened
                    paperTexts.forEach(textObj => {
                        if (textObj && textObj.exists) {
                            textObj.opacity = pencilBox.isEnlarged ? 0 : 1;
                            // Disable clicking on interactive elements
                            if (textObj.area) {
                                textObj.area.enabled = !pencilBox.isEnlarged;
                            }
                        }
                    });
                }
            }
        });
    }
    
    return {
        testPaper: testPaper,
        answers: answers,
        openTestPaper: openTestPaper,
        closeTestPaper: closeTestPaper,
        calculateScore: calculateScore,
        handInExam: handInExam
    };
}
