export function createTeacher() {
  loadSprite("teacher_front", "sprites/teacher_front1.png");
  loadSprite("teacher_side", "sprites/teacher_side.png");
  loadSprite("teacher_back", "sprites/teacher_back.png");
  loadSprite("bean", "/examples/sprites/bean.png");
  loadSprite("mark", "/examples/sprites/mark.png");
  loadSound("bean_voice", "/examples/sounds/bean_voice.wav");
  loadSound("mark_voice", "/examples/sounds/mark_voice.wav");
  loadBitmapFont("happy", "/examples/fonts/happy_28x36.png", 28, 36);

  const teacherFaces = {
    frontface: {
      sprite: "teacher_front",
      name: "Teacher Front Face",
      sound: "bean_voice",
    },
    sideface: {
      sprite: "teacher_side",
      name: "Teacher Side Face",
      sound: "mark_voice",
    },
    backface: {
      sprite: "teacher_back",
      name: "Teacher Back Face",
      sound: "bean_voice",
    },
  };

  const teacher = add([
    sprite(teacherFaces.frontface.sprite),
    scale(0.8),
    anchor("center"),
    pos(center().sub(0, 320)),
    layer("teacher"),
  ]);

  const STATES = {
    FRONT: "front",
    SIDE: "side",
    BACK: "back",
  };

  let currentState = STATES.BACK;

  function setTeacherState(state) {
    currentState = state;
    debug.log("Setting teacher state to:", state);
    if (state === STATES.FRONT)
      teacher.use(sprite(teacherFaces.frontface.sprite));
    else if (state === STATES.SIDE)
      teacher.use(sprite(teacherFaces.sideface.sprite));
    else if (state === STATES.BACK)
      teacher.use(sprite(teacherFaces.backface.sprite));
    debug.log("Teacher sprite after state change:", teacher.sprite);
    if (state === STATES.FRONT) {
      onTeacherFront();
    }
  }

  // Placeholder function (you can implement later)
  function onTeacherFront() {
    // TODO: Add code to handle game logic when teacher is facing front
    // e.g., detect player movement -> "caught"
    debug.log("Teacher is watching!");
  }
  // Difficulty level will determine the teacher's face change
  // The hard, the teacher will change face more often, more fake turns, shorter time to stay backwords
  const difficultyLevel = 1;

  function updateDifficultyLevel() {
    // Update the difficulty level based on the current game state
    // This could be based on player progress, time elapsed, etc.
    // For now, we will just increase the difficulty level by 1
    difficultyLevel += 1;
    debug.log(`Current difficulty level: ${difficultyLevel}`);
  }

  function generateFaceTime(difficultyLevel) {
    switch (difficultyLevel) {
      case 1:
        return rand(8, 10);
      case 2:
        return rand(6, 8);
      case 3:
        return rand(4, 6);
      default:
        return 5;
    }
  }

  // Randomly switch teacher state
  function scheduleNextState() {
    let nextState;
    if (currentState === STATES.FRONT) {
      nextState = STATES.SIDE;
      debug.log("Teacher front");
    } else if (currentState === STATES.BACK) {
      nextState = STATES.SIDE;
      debug.log("Teacher back");
    } else if (currentState === STATES.SIDE) {
      nextState = Math.random() < 0.5 ? STATES.FRONT : STATES.BACK;
      debug.log("Teacher side");
    }
    setTeacherState(nextState);
    let faceTime = generateFaceTime(difficultyLevel);
    debug.log(faceTime);
    wait(rand(1, faceTime), scheduleNextState);
  }
  scheduleNextState();
  return teacher;
}
