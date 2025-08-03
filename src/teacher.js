export function createTeacher() {
  // Loads all sprites
  // Representing the teacher
  loadSprite("teacher_frontface", "/sprites/teacher_front.png");
  loadSprite("teacher_sideface", "/sprites/teacher_side.png");
  loadSprite("teacher_backface", "/sprites/teacher_back.png");
  loadSprite("bean", "/examples/sprites/bean.png");
  loadSprite("mark", "/examples/sprites/mark.png");
  loadSound("bean_voice", "/examples/sounds/bean_voice.wav");
  loadSound("mark_voice", "/examples/sounds/mark_voice.wav");
  loadBitmapFont("happy", "/examples/fonts/happy_28x36.png", 28, 36);

  // Define the faces data
  const teacherFaces = {
    frontface: {
      sprite: "teacher_frontface",
      name: "Teacher Front Face",
      sound: "bean_voice",
    },
    sideface: {
      sprite: "teacher_sideface",
      name: "Teacher Side Face",
      sound: "mark_voice",
    },
    backface: {
      sprite: "teacher_backface",
      name: "Teacher Back Face",
      sound: "bean_voice",
    },
  };

  // Teacher
  const teacher = add([
    sprite(teacherFaces.frontface.sprite),
    scale(0.8),
    anchor("center"),
    pos(center().sub(0, 320)),
    layer("teacher"),
  ]);

  teacherTimer(1, 100);

  let faceTimer = 0;
  /**
   * @param {*} difficultyLevel  - The current difficulty level
   * @param {*} timeInterval - The time interval in milliseconds to update the teacher's face, default is 100 milliseconds
   */
  function teacherTimer(difficultyLevel, timeInterval = 100) {
    // Update the teacher's face every timeInterval milliseconds
    setInterval(() => {
      // Decrease the face timer by the time interval
      faceTimer -= timeInterval;
      // If the face timer is less than or equal to 0, toggle the teacher's face
      // Otherwise, return
      if (faceTimer >= timeInterval) {
        return;
      }

      toggleTeacherFace();
      if (teacher.sprite === teacherFaces.frontface.sprite) {
        faceTimer = generateGreenlightTime(difficultyLevel);
      } else if (teacher.sprite === teacherFaces.backface.sprite) {
        faceTimer = generateRedlightTime(difficultyLevel);
      }
    }, timeInterval);
  }

  /**
   * @param {number} difficultyLevel - The current difficulty level
   * @param {number} timeInterval - The time interval in milliseconds to update the teacher's face, default is 100 milliseconds
   */
  function toggleTeacherFace() {
    // get the current face
    const currentFace = teacher.sprite;
    debug.log(`Current face: ${currentFace}`);
    switch (currentFace) {
      case teacherFaces.frontface.sprite:
        teacher.use(sprite(teacherFaces.backface.sprite));
        // TODO: Play the sound associated with the back face
        break;
      case teacherFaces.sideface.sprite:
        break;
      case teacherFaces.backface.sprite:
        teacher.use(sprite(teacherFaces.frontface.sprite));
        // TODO: Play the sound associated with the front face
        break;
      default:
        break;
    }
  }
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

function generateGreenlightTime(difficultyLevel) {
  switch (difficultyLevel) {
    case 1:
      return Math.random() * (5000 - 2000) + 2000; // 2 to 5 seconds
    case 2:
      return Math.random() * (4000 - 1500) + 1500; // 1.5 to 4 seconds
    case 3:
      return Math.random() * (3000 - 1000) + 1000; // 1 to 3 seconds
    default:
      return 5000; // Default to 5 seconds
  }
}

// More difficulty levels , the longer the time
function generateRedlightTime(difficultyLevel) {
  switch (difficultyLevel) {
    case 1:
      return Math.random() * (2000 - 1000) + 1000; // 1 to 2 second
    case 2:
      return Math.random() * (3000 - 1000) + 1000; // 1 to 3 seconds
    case 3:
      return Math.random() * (3000 - 2000) + 2000; // 2 to 3 seconds
    default:
      return 3000; // Default to 3 seconds
  }
}

let isCheating = false;

// Update the on screen sprite & text
function cheating() {
  debug.log("cheating");
}
