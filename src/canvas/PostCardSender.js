export default class PostcardSender {
  constructor() {
    this.recipient = "";
    this.sender = "postcard@ecal-mid.ch";
    this.subject = "Postcard from ECAL";
    this.endpoint = "https://creativecoding.ecal-mid.ch/send_email.php";
  }

  // Send postcard with canvas image and message
  send(mail_destinataire, message, canvas) {
    // Validate message
    if (!message) {
      this.showStatus("Please enter a message", "error");
      return Promise.reject(new Error("Message is required"));
    }

    this.recipient = mail_destinataire;

    // Convert canvas to base64 image
    const canvasImage = canvas.toDataURL("image/png");
    // Prepare form data
    const formData = new FormData();
    formData.append("recipient", this.recipient);
    formData.append("sender", this.sender);
    formData.append("subject", this.subject);
    formData.append("message", message);
    formData.append("image", canvasImage);
    // Show loading status
    this.showStatus("Sending postcard...", "");
    // Send to PHP script
    return fetch(this.endpoint, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.showStatus("Postcard sent successfully!", "success");
          return data;
        } else {
          this.showStatus(`Error: ${data.message}`, "error");
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        this.showStatus(`Error: ${error.message}`, "error");
        console.error("Error:", error);
        throw error;
      });
  }
  // Display status message
  showStatus(message, type) {
    // statusMessage.textContent = message;
    // statusMessage.className = type;
  }
}
