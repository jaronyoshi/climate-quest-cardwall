import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
    import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

    // 🔥 Your Firebase config
    const firebaseConfig = {
      apiKey: "AIzaSyANWovU5bG4AR9zuA8vgfiqUQqyAIwfqGs",
      authDomain: "poc-sea-level.firebaseapp.com",
      projectId: "poc-sea-level",
      storageBucket: "poc-sea-level.appspot.com",   
      messagingSenderId: "189055923417",
      appId: "1:189055923417:web:f952d3a635fd051ad93ac8",
      databaseURL: "https://poc-sea-level-default-rtdb.asia-southeast1.firebasedatabase.app" 
    };

    let app, db;

    try {
      app = initializeApp(firebaseConfig);
      db = getDatabase(app);
      console.log("Firebase initialized successfully");
    } catch (error) {
      console.error("Firebase initialization failed:", error);
    }

    async function incrementSeaLevel() {
      try {
        console.log("Scan page loaded - incrementing sea level count");
        
        if (!db) {
          throw new Error("Database not initialized");
        }

        const countRef = ref(db, "seaLevel/count");
        
        // Get current value with timeout
        const snapshot = await Promise.race([
          get(countRef),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Read timeout - check network connection")), 10000)
          )
        ]);
        
        const currentCount = snapshot.exists() ? snapshot.val() : 0;
        const newCount = currentCount + 1;
        
        console.log(`Incrementing from ${currentCount} to ${newCount}`);
        
        // Set the new value with timeout
        await Promise.race([
          set(countRef, newCount),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Write timeout - check database rules")), 10000)
          )
        ]);
        
        console.log("Successfully updated count to:", newCount);
        
      } catch (error) {
        console.error("Error updating sea level:", error);
        console.error("Full error details:", error.code, error.message);
      }
    }

    // Confetti Animation Function
    function createConfetti() {
      const confettiTypes = [
        'assets/confetti-ellipse.svg',
        'assets/confetti-star.svg',
        'assets/confetti-zigzag.svg'
      ];
      
      const colors = ['#FE991B', '#A0DCFF', '#FFF', '#FFD700', '#FF6B6B', '#4ECDC4'];
      
      // Create 50 confetti pieces
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('img');
        confetti.className = 'confetti';
        confetti.src = confettiTypes[Math.floor(Math.random() * confettiTypes.length)];
        
        // Random positioning
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-50px';
        
        // Random size
        const size = Math.random() * 15 + 15; // 15-30px
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        
        // Random animation duration and delay
        const duration = Math.random() * 2 + 3; // 3-5 seconds
        const delay = Math.random() * 0.5; // 0-0.5 second delay
        
        confetti.style.animation = `confetti-fall ${duration}s linear ${delay}s forwards`;
        
        // Add random color filter for variety
        if (Math.random() > 0.5) {
          confetti.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
        }
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
          }
        }, (duration + delay) * 1000 + 500);
      }
    }

    // Add a small delay to ensure Firebase is fully ready, then run
    setTimeout(() => {
      incrementSeaLevel();
    }, 1000);

    // Trigger confetti 500ms after page load
    setTimeout(() => {
      createConfetti();
    }, 300);
