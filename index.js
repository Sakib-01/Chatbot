const chatBody = document.querySelector(".chat-body");
const messsageInput = document.querySelector(".message-input");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");

const API_KEY = "AIzaSyCTK9lZnW6ovB-YzDIy-lD8TGLV0c08FWk";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
  },
};
const createMessageElemet = (content, classes) => {
  const div = document.createElement("div");
  div.classList.add("message", classes);
  div.innerHTML = content;
  return div;
};

const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");

  //   api request
  const requestOption = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: userData.message },
            ...(userData.file.data ? [{ inline_data: userData.file }] : []),
          ],
        },
      ],
    }),
  };
  try {
    const response = await fetch(API_URL, requestOption);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    // console.log(data);
    const apiResponseText = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();
    messageElement.innerText = apiResponseText;
  } catch (error) {
    messageElement.innerText = error.message;
    messageElement.style.color = "red";
    console.log(error);
  } finally {
    // reset user file data.
    userData.file = {};
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
};

// handle outgoing message
const handleOutGoingMessage = (e) => {
  e.preventDefault();

  userData.message = messsageInput.value.trim();

  messsageInput.value = "";
  //   create and display user message
  const messageContent = `<div class="message-text"></div>${
    userData.file.data
      ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment"/>`
      : ""
  }`;
  const outgoingMessageDiv = createMessageElemet(
    messageContent,
    "user-message"
  );

  outgoingMessageDiv.querySelector(".message-text").textContent =
    userData.message;
  chatBody.appendChild(outgoingMessageDiv);

  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  setTimeout(() => {
    const messageContent = `<svg
            class="bot-avater"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 1024 1024"
          >
            <path
              d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"
            ></path>
          </svg>
          <div class="message message-text thinking">
            <div class="thinking-indicator">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>`;
    const incomingMessageDiv = createMessageElemet(
      messageContent,
      "bot-message"
    );

    // incomingMessageDiv.querySelector(".message-text").textContent =
    //   userData.message;
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    generateBotResponse(incomingMessageDiv);
  }, 600);
};

messsageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && userMessage) {
    handleOutGoingMessage(e);
  }
});

// handle file input change
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
    fileUploadWrapper.querySelector("img").style.display = "block";
    const base64String = e.target.result.split(",")[1];
    // store file data in userData
    userData.file = {
      data: base64String,
      mime_type: file.type,
    };
    // console.log(e.target.result);
    fileInput.value = "";
  };
  reader.readAsDataURL(file);
});

document.getElementById("send-message").addEventListener("click", (e) => {
  handleOutGoingMessage(e);
});

document
  .querySelector("#file-upload")
  .addEventListener("click", () => fileInput.click());
