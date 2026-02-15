if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  const framesRight = [
    chrome.runtime.getURL("assets/cat1.png"),
    chrome.runtime.getURL("assets/cat2.png"),
    chrome.runtime.getURL("assets/cat3.png"),
     chrome.runtime.getURL("assets/cat4.png")
  ];

  const framesLeft = [
    chrome.runtime.getURL("assets/cat6.png"),
    chrome.runtime.getURL("assets/cat5.png"),
    chrome.runtime.getURL("assets/cat7.png"),
     chrome.runtime.getURL("assets/cat8.png")
  ];

  const pickedUpRight = chrome.runtime.getURL("assets/cat9.png");
  const pickedUpLeft = chrome.runtime.getURL("assets/cat10.png");

  const cat = document.createElement("img");
  cat.id = "pixel-cat";
  cat.style.display = "none"; 
  document.body.appendChild(cat);

  const text = document.createElement("div");
  text.id = "cat-text";
  text.style.display = "none";
  document.body.appendChild(text);


  let x = Math.random() * (window.innerWidth - 150) + 75;
  let y = Math.random() * (window.innerHeight - 150) + 75;

  let direction = "right";
  let frameIndex = 0;
  let visible = true;

  let state = "walk";
  let speedX = 2 + Math.random() * 2;
  let speedY = 2 + Math.random() * 2;
  
  if (Math.random() < 0.5) speedX = -speedX;
  if (Math.random() < 0.5) speedY = -speedY;

  let dragging = false;

  cat.addEventListener("mousedown", (e) => {
    e.preventDefault();
    dragging = true;
    state = "picked-up";

    const pickedUpSprite = direction === "right" ? pickedUpRight : pickedUpLeft;
    cat.src = pickedUpSprite;
    console.log("Picked up cat, direction:", direction, "sprite:", pickedUpSprite);
  });

  document.addEventListener("mouseup", () => {
    if (dragging) {
      dragging = false;
      state = "idle";
      setTimeout(() => {
        if (state === "idle") {
          changeDirection();
        }
      }, 500);
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (dragging) {
      x = e.clientX - 48; 
      y = e.clientY - 48;
      updatePosition();
    }
  });

  function updatePosition() {
    cat.style.left = x + "px";
    cat.style.top = y + "px";

    text.style.left = x + "px";
    text.style.top = (y - 30) + "px";
  }

  
  function changeDirection() {
    const angle = Math.random() * Math.PI * 2; 
    const speed = 2 + Math.random() * 2;
    
    speedX = Math.cos(angle) * speed;
    speedY = Math.sin(angle) * speed;
    
    direction = speedX > 0 ? "right" : "left";
    state = "walk";
  }


  function randomBehavior() {
    if (dragging) return;

    changeDirection();
  }

  
  setInterval(randomBehavior, 3000 + Math.random() * 4000);


  function animate() {
    const frames = direction === "right" ? framesRight : framesLeft;

    if (state === "walk") {
      cat.src = frames[frameIndex];
      frameIndex = (frameIndex + 1) % frames.length;

      x += speedX;
      y += speedY;

      if (x > window.innerWidth - 100) {
        x = window.innerWidth - 100;
        speedX = -(Math.abs(speedX));
        direction = "left";
      }
      if (x < 0) {
        x = 0;
        speedX = Math.abs(speedX); 
        direction = "right";
      }
      if (y > window.innerHeight - 100) {
        y = window.innerHeight - 100;
        speedY = -(Math.abs(speedY)); 
      }
      if (y < 0) {
        y = 0;
        speedY = Math.abs(speedY); 
      }

    } else if (state === "picked-up") {
      cat.src = direction === "right" ? pickedUpRight : pickedUpLeft;
    } else {
      cat.src = direction === "right" ? framesRight[0] : framesLeft[0];
    }

    updatePosition();
  }

  const firstImg = new Image();
  firstImg.onload = () => {
    cat.style.display = "block";
    changeDirection(); 
  };
  firstImg.onerror = () => {
    console.error("Failed to load cat sprite. Check that assets folder exists.");
  };
  firstImg.src = framesRight[0];

  setInterval(animate, 150);

  const phrases = [
    "meoww",
    "gimme attention",
    "lets cuddle",
    "feed me /:",
  ];

  function speak() {
    if (!visible) return;

    text.innerText = phrases[Math.floor(Math.random() * phrases.length)];
    text.style.display = "block";

    setTimeout(() => {
      text.style.display = "none";
    }, 2000);
  }

  setInterval(speak, 7000 + Math.random() * 3000);

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "l") {
      visible = !visible;
      cat.style.display = visible ? "block" : "none";
      text.style.display = "none";
    }
  });
}