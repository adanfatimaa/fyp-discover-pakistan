
const allButtons = document.querySelectorAll('.speaker-btn');

allButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
        let audio = new Audio(btn.dataset.audio);
        btn.textContent = "🔊";
        btn.classList.add("speaking");
        audio.play();

        audio.onended = function() {
            btn.textContent = "🔉";
            btn.classList.remove("speaking");
        }
    });
});


const categoryButtons = document.querySelectorAll('.cat-btn');
const panels = document.querySelectorAll('.panel');

categoryButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
        const targetPanel = document.getElementById(btn.dataset.target);
        
        panels.forEach(function(panel) {
            if (panel === targetPanel) {
                 // if already open it close it
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";

                     targetPanel.scrollIntoView({ behavior: "smooth" });
                }
            } else {
                panel.style.display = "none";
            }
        });
        
    });
});
