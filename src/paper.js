export function createPaper() {
    loadBitmapFont("unscii", "public/examples/fonts/unscii_8x8.png", 8, 8);

    const paperSize = 0.4;
    let testPaper = null;
    let answers = ["", "", "", "", "", "", "", "", "", ""]; // 10 blank answers
    let selectedBlank = -1;
    let paperTexts = [];
    let isEnlarged = false;
    
    // Create single test paper on the blue rect (desk/table)
    // Blue rect is at pos(width() / 2 - 300, height() - 400) with size 600x400
    const deskX = width() / 2 - 300;
    const deskY = height() - 400;
    const deskWidth = 600;
    const deskHeight = 400;
    
    // Test questions
    const questions = [
        "1. The capital of France is ________",
        "2. 2 + 2 = ________",
        "3. The largest ocean is ________",
        "4. The moon landing was in ________", 
        "5. Chemical symbol for gold is ________",
        "6. Shakespeare wrote ________",
        "7. The speed of light is ________ m/s",
        "8. DNA stands for ________",
        "9. The smallest planet is ________",
        "10. H2O is the formula for ________"
    ];
    
    // Create the test paper positioned on the desk
    const paperX = deskX + deskWidth / 2;
    const paperY = deskY + deskHeight / 2;
    
    testPaper = add([
        rect(200, 300), // White paper rectangle
        pos(paperX, paperY),
        anchor("center"),
        color(rgb(255, 255, 255)),
        outline(2, rgb(0, 0, 0)), // Black border
        area(),
        "testPaper",
        {
            isEnlarged: false,
            originalPos: vec2(paperX, paperY),
            originalScale: vec2(1),
        }
    ]);
    
    // Add paper title when not enlarged
    const paperTitle = add([
        text("TEST PAPER", {
            font: "unscii",
            size: 8,
        }),
        pos(paperX, paperY - 20),
        anchor("center"),
        color(rgb(0, 0, 0)),
        "paperTitle",
    ]);
    
    // Hover effects
    testPaper.onHover(() => {
        if (!isEnlarged) {
            testPaper.color = rgb(240, 240, 240);
        }
    });
    
    testPaper.onHoverEnd(() => {
        if (!isEnlarged) {
            testPaper.color = rgb(255, 255, 255);
        }
    });
    
    // Click to enlarge test paper
    testPaper.onClick(() => {
        if (!isEnlarged) {
            openTestPaper();
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
            vec2(width() / 2, height() / 2),
            0.5,
            (val) => {
                testPaper.pos = val;
            },
            easings.easeOutBack
        );
        
        tween(
            testPaper.width,
            600,
            0.5,
            (val) => {
                testPaper.width = val;
            },
            easings.easeOutBack
        );
        
        tween(
            testPaper.height,
            700,
            0.5,
            (val) => {
                testPaper.height = val;
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
            testPaper.width,
            200,
            0.3,
            (val) => {
                testPaper.width = val;
            },
            easings.easeInOutSine
        );
        
        tween(
            testPaper.height,
            300,
            0.3,
            (val) => {
                testPaper.height = val;
            },
            easings.easeInOutSine
        ).then(() => {
            isEnlarged = false;
            // Recreate title
            add([
                text("TEST PAPER", {
                    font: "unscii",
                    size: 8,
                }),
                pos(testPaper.pos.x, testPaper.pos.y - 20),
                anchor("center"),
                color(rgb(0, 0, 0)),
                "paperTitle",
            ]);
        });
    }
    
    function showTestContent() {
        const startY = height() / 2 - 300;
        const lineHeight = 50;
        
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
                    size: 10,
                    width: 500,
                }),
                pos(width() / 2 - 250, questionY),
                color(rgb(0, 0, 0)),
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
                "answerText",
            ]);
            paperTexts.push(answerText);
            
            // Click handler for answer box
            answerBox.onClick(() => {
                selectBlank(index);
            });
        });
        
        // Instructions
        const instructions = add([
            text("Click on answer boxes to select, then type your answers. Press ESC to close.", {
                font: "unscii",
                size: 8,
                width: 500,
                align: "center",
            }),
            pos(width() / 2, startY + 600),
            anchor("center"),
            color(rgb(100, 100, 100)),
            "instructions",
        ]);
        paperTexts.push(instructions);
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
        paperTexts.forEach(textObj => {
            if (textObj.is && textObj.is("answerText")) {
                const index = paperTexts.findIndex(obj => 
                    obj.is && obj.is("answerBox") && obj.questionIndex === selectedBlank
                );
                if (index !== -1) {
                    const answerIndex = Math.floor((index - 1) / 3); // Calculate which answer this belongs to
                    if (answerIndex === selectedBlank) {
                        textObj.text = answers[selectedBlank];
                    }
                }
            }
        });
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
    
    return {
        testPaper: testPaper,
        answers: answers,
        openTestPaper: openTestPaper,
        closeTestPaper: closeTestPaper
    };
}
