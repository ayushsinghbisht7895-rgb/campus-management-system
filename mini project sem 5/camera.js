

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

const openCamera = document.getElementById("openCamera");
const closeCamera = document.getElementById("closeCamera");
const captureBtn = document.getElementById("captureBtn");

const startRecord = document.getElementById("startRecord");
const stopRecord = document.getElementById("stopRecord");

const retake = document.getElementById("retake");

const downloadPhoto = document.getElementById("downloadPhoto");
const downloadVideo = document.getElementById("downloadVideo");

const sendAdmin = document.getElementById("sendAdmin");

const capturedImage = document.getElementById("capturedImage");
const photoPreview = document.getElementById("photoPreview");

const recordedVideo = document.getElementById("recordedVideo");

const locationText = document.getElementById("location");
const dateTime = document.getElementById("datetime");



let stream = null;

let mediaRecorder = null;

let recordedChunks = [];

let photoBlob = null;

let videoBlob = null;



if (openCamera) {

    openCamera.addEventListener("click", async () => {

        try {

            stream = await navigator.mediaDevices.getUserMedia({

                video: true,

                audio: true

            });

            video.srcObject = stream;

        } catch (err) {

            alert("Unable to access camera.");

            console.log(err);

        }

    });

}



if (closeCamera) {

    closeCamera.addEventListener("click", () => {

        if (!stream) return;

        stream.getTracks().forEach(track => track.stop());

        video.srcObject = null;

        stream = null;

    });

}



if (captureBtn) {

    captureBtn.addEventListener("click", () => {

        if (!stream) {

            alert("Please open camera first.");

            return;

        }

        canvas.width = video.videoWidth;

        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(video, 0, 0);

        capturedImage.src = canvas.toDataURL("image/png");

        photoPreview.src = capturedImage.src;

        capturedImage.style.display = "block";

        photoPreview.style.display = "block";

        canvas.toBlob((blob) => {

            photoBlob = blob;

        }, "image/png");

    });

}



if (startRecord) {

    startRecord.addEventListener("click", () => {

        if (!stream) {

            alert("Please open camera first.");

            return;

        }

        recordedChunks = [];

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {

            if (event.data.size > 0) {

                recordedChunks.push(event.data);

            }

        };

        mediaRecorder.onstop = () => {

            videoBlob = new Blob(recordedChunks, {

                type: "video/webm"

            });

            const url = URL.createObjectURL(videoBlob);

            recordedVideo.src = url;

            recordedVideo.style.display = "block";

        };

        mediaRecorder.start();

        startRecord.disabled = true;

        stopRecord.disabled = false;

    });

}



if (stopRecord) {

    stopRecord.addEventListener("click", () => {

        if (mediaRecorder && mediaRecorder.state !== "inactive") {

            mediaRecorder.stop();

        }

        startRecord.disabled = false;

        stopRecord.disabled = true;

    });

}



if (retake) {

    retake.addEventListener("click", () => {

        capturedImage.src = "";
        photoPreview.src = "";

        recordedVideo.src = "";

        photoBlob = null;
        videoBlob = null;

        capturedImage.style.display = "none";
        photoPreview.style.display = "none";
        recordedVideo.style.display = "none";

    });

}


if (downloadPhoto) {

    downloadPhoto.addEventListener("click", () => {

        if (!photoBlob) {

            alert("Please capture a photo first.");
            return;

        }

        const a = document.createElement("a");

        a.href = URL.createObjectURL(photoBlob);

        a.download = "CampusPhoto.png";

        a.click();

    });

}


if (downloadVideo) {

    downloadVideo.addEventListener("click", () => {

        if (!videoBlob) {

            alert("Please record a video first.");
            return;

        }

        const a = document.createElement("a");

        a.href = URL.createObjectURL(videoBlob);

        a.download = "CampusVideo.webm";

        a.click();

    });

}



function updateDateTime() {

    if (!dateTime) return;

    const now = new Date();

    dateTime.innerHTML = now.toLocaleString();

}

updateDateTime();

setInterval(updateDateTime, 1000);



if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);

            locationText.innerHTML =
                `Latitude : ${lat}<br>Longitude : ${lng}`;

        },

        () => {

            locationText.innerHTML = "Location Permission Denied";

        }

    );

} else {

    locationText.innerHTML = "Geolocation Not Supported";

}



if (sendAdmin) {

    sendAdmin.addEventListener("click", async () => {

        if (!photoBlob && !videoBlob) {

            alert("Capture a photo or record a video first.");

            return;

        }

        const formData = new FormData();

        if (photoBlob) {

            formData.append("photo", photoBlob, "CampusPhoto.png");

        }

        if (videoBlob) {

            formData.append("video", videoBlob, "CampusVideo.webm");

        }

        formData.append("location", locationText.innerText);

        formData.append("datetime", dateTime.innerText);

        try {

            const response = await fetch("upload.php", {

                method: "POST",

                body: formData

            });

            const result = await response.text();

            alert(result);

        } catch (error) {

            console.error(error);

            alert("Failed to send report.");

        }

    });

}



window.addEventListener("beforeunload", () => {

    if (stream) {

        stream.getTracks().forEach(track => track.stop());

    }

});