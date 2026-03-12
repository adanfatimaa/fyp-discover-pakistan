const categoryButtons = document.querySelectorAll('.cat-btn');
const panels = document.querySelectorAll('.panel');

categoryButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
        const targetId = btn.dataset.target; 
        const targetPanel = document.getElementById(targetId);

        panels.forEach(function(panel) {
            if (panel === targetPanel) {
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