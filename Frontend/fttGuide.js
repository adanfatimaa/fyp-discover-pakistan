 // show the panel


var quizButton = document.querySelector(".quiz-btn");
var quizPanel = document.getElementById("quiz-panel");

// when quiz button is clicked
quizButton.addEventListener("click", function () {

    // if already open then close it
    if (quizPanel.style.display === "block") {
        quizPanel.style.display = "none";
    } else {

        // open the panel
        quizPanel.style.display = "block";


        quizPanel.scrollIntoView({ behavior: "smooth" });
    }

});

        //  stores users answers
        var answers = {};

        var questionTopics = {
            q1: "Public displays of affection between opposite genders are considered to be inappropriate",
            q2: "You should check for holiday overlaps, as major events such as Eid can lead to closures of shops, banks etc. Public holidays can cause increased security, transportation delays, and stricter travel advisories. ",
            q3: "Always accept chai when offered, it's a sign of hospitality",
            q4: "Carry cash, most local shops and transport are cash only",
            q5: "Smaller markets may close during prayer time, though it is not a common or obligatory practice, however big malls etc remain open.",
            q6: "Pack modest clothing. Covered shoulders and knees are respectful",
            q7: "Change in diet and water can cause upset stomach and other small issues so carry basic medications with you for immediate access."
        };


        // getting all question boxes 
        var allQuestions = document.querySelectorAll(".question");


        allQuestions.forEach(function (questionBox) {

            // get the yes and no buttons inside this question box
            var yesButton = questionBox.querySelector(".yes-btn");
            var noButton = questionBox.querySelector(".no-btn");

            var questionId = questionBox.id;

            // when yes button clicked
            yesButton.addEventListener("click", function () {

                answers[questionId] = "yes";

                yesButton.classList.add("selected-yes");

                yesButton.classList.remove("selected-no");

                // remove classes from no button also just in case
                noButton.classList.remove("selected-yes");
                noButton.classList.remove("selected-no");

            });


            // when no button clicked
            noButton.addEventListener("click", function () {

                answers[questionId] = "no";

                noButton.classList.add("selected-no");

                noButton.classList.remove("selected-yes");

                // again removing from yes button
                yesButton.classList.remove("selected-yes");
                yesButton.classList.remove("selected-no");

            });

        });

        // When the Check button is clicked
        var checkButton = document.getElementById("check-btn");

        checkButton.addEventListener("click", function () {

            

            // Count yes answers and collect weak areas
            var yesCount = 0;
            var weakAreas = [];

           var questionIds = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];

            for (var i = 0; i < questionIds.length; i++) {
                var qId = questionIds[i];

                if (answers[qId] === "yes") {
                    yesCount = yesCount + 1;
                } else {
                    weakAreas.push(questionTopics[qId]);
                }
            }

            // Decide result based on score
            var title = "";
            var message = "";
            var bgColor = "";

            if (yesCount === 7) {
                title = "Fully Prepared!";
                message = "You're ready to explore Pakistan like a local. Go enjoy it!";
                bgColor = "#e8f5e9";
            } else if (yesCount >= 4) {
                title = "Almost There!";
                message = "You're mostly ready but check the areas below.";
                bgColor = "#fff8e1";
            } else if (yesCount >= 3) {
                title = "You'll Survive... Barely";
                message = "A few important things to sort out before your trip:";
                bgColor = "#fff3e0";
            } else {
                title = "Please Read This Page Again!";
                message = "Don't worry — that's what this guide is for. Sort these out first:";
                bgColor = "#fdecea";
            }
           

            // Show the result box
            var resultBox = document.getElementById("result");
            resultBox.style.display = "block";
            resultBox.style.backgroundColor = bgColor;

            
            document.getElementById("result-title").innerText = title;

            document.getElementById("result-msg").innerText = message;

            // show weak list
            var weakList = document.getElementById("weak-list");
            weakList.innerHTML = "";

            for (var j = 0; j < weakAreas.length; j++) {
                var li = document.createElement("li");
                li.innerText = "→ " + weakAreas[j];
                weakList.appendChild(li);
            }

            // Scroll down to result
            resultBox.scrollIntoView({ behavior: "smooth" });

        });