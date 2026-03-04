const helloBtn = document.getElementById('btn-hello');
const thankYouBtn = document.getElementById('btn-thankyou');
const howMuchBtn = document.getElementById('btn-howmuch');
const waterBtn = document.getElementById('btn-water');
const helpBtn = document.getElementById('btn-help');
const yesNoBtn = document.getElementById('btn-yesno');


helloBtn.addEventListener("click", function () {
    let audio = new Audio("audios/asslam-o-alaikum.mp3");
       // change icon and add animation
    helloBtn.textContent = "🔊";
    helloBtn.classList.add("speaking");

    audio.play();

    // when audio finishes
    audio.onended = function () {
        helloBtn.textContent = "🔉";
        helloBtn.classList.remove("speaking");
    }
});

thankYouBtn.addEventListener("click", function () {
   let audio = new Audio("audios/thankYou.m4a");

      thankYouBtn.textContent = "🔊";
    thankYouBtn.classList.add("speaking");

    audio.play();

    audio.onended = function () {
        thankYouBtn.textContent = "🔉";
        thankYouBtn.classList.remove("speaking");
    }
});

howMuchBtn.addEventListener("click", function () {
   let audio = new Audio("audios/howMuch.m4a");

       howMuchBtn.textContent = "🔊";
    howMuchBtn.classList.add("speaking");

    audio.play();

    audio.onended = function () {
        howMuchBtn.textContent = "🔉";
        howMuchBtn.classList.remove("speaking");
    }
});

waterBtn.addEventListener("click", function () {
    let audio = new Audio("audios/water.m4a");

       waterBtn.textContent = "🔊";
    waterBtn.classList.add("speaking");

    audio.play();

    audio.onended = function () {
        waterBtn.textContent = "🔉";
        waterBtn.classList.remove("speaking");
    }
});

helpBtn.addEventListener("click", function () {

    let audio = new Audio("audios/help.m4a");
      helpBtn.textContent = "🔊";
    helpBtn.classList.add("speaking");

    audio.play();

    audio.onended = function () {
        helpBtn.textContent = "🔉";
        helpBtn.classList.remove("speaking");
    }
});

yesNoBtn.addEventListener("click", function () {
   let audio = new Audio("audios/yesNo.m4a");

       yesNoBtn.textContent = "🔊";
    yesNoBtn.classList.add("speaking");

    audio.play();

    audio.onended = function () {
        yesNoBtn.textContent = "🔉";
        yesNoBtn.classList.remove("speaking");
    }
});