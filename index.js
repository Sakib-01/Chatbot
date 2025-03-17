const chatBody = document.querySelector(".chat-body");
const messsageInput = document.querySelector(".message-input");

const createMessageElemet = (content, classes) => {
  const div = document.createElement("div");
  div.classList.add("message", classes);
  div.innerHTML = content;
  return div;
};
const handleOutGoingMessage = (userMessage) => {
  const messageContent = `<div class="message-text">${userMessage}</div>`;
  const outgoingMessageDiv = createMessageElemet(
    messageContent,
    "user-message"
  );
  chatBody.appendChild(outgoingMessageDiv);
};

messsageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && userMessage) {
    handleOutGoingMessage(userMessage);
  }
});
