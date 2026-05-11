const URL = "https://teachablemachine.withgoogle.com/models/KfumSPqKk/"; 
// Example: https://teachablemachine.withgoogle.com/models/abcd1234/

let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load model
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup webcam
    const flip = true; 
    webcam = new tmImage.Webcam(300, 300, flip);
    await webcam.setup(); 
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Add webcam to page
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    // Create label container
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let isThumbsUp = false;

    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.childNodes[i].innerHTML =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);

if (prediction[i].className === "Thumbs Up" && prediction[i].probability > 0.9) {
            isThumbsUp = true;
        }
    }

        if (isThumbsUp) {
        document.body.style.backgroundColor = "lightgreen";
    } else {
        document.body.style.backgroundColor = "white";
    }
          
}