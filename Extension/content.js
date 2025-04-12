function injectButton() {
  try {
    const existingButton = document.querySelector(".ai-reply-button");
    if (existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
      console.log("ToolBar Not Found");
      return;
    }
    console.log("Tool bar is found");

    const button = createAIButton();
    button.classList.add("ai-reply-button");

    // Create a tone selector dropdown
    const toneSelector = createToneSelector();
    toolbar.insertBefore(toneSelector, toolbar.firstChild);
    toolbar.insertBefore(button, toneSelector.nextSibling);

    // Add event listener for the AI button
    button.addEventListener("click", async () => {
      try {
        const tone = toneSelector.value;
        const content = getEmailContent(); // Automatically get the email content

        button.innerHTML = '<span class="spinner"></span> Generating...';
        button.disabled = true;

        const response = await fetch(
          "http://localhost:8080/api/email/generator",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              emailContent: content,
              tone: tone,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("API Request failed");
        }

        const generatedReply = await response.text();
        const composeBox = document.querySelector(
          '[role="textbox"][g_editable="true"]'
        );
        if (composeBox) {
          composeBox.focus();
          document.execCommand("insertText", false, generatedReply);
        } else {
          console.error("Compose box not found");
        }
      } catch (error) {
        console.error("Failed to generate reply");
      } finally {
        button.innerHTML = "AI Reply";
        button.disabled = false;
      }
    });
  } catch (error) {
    console.error("Failed to inject button");
  }
}

// Create the AI Reply button
function createAIButton() {
  const button = document.createElement("div");
  button.className = "T-I J-J5-Ji ao0 v7 T-I-atl L3";
  button.style.marginRight = "8px";
  button.innerHTML = "AI Reply";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "Generate AI Reply");
  return button;
}

// Create tone selector dropdown
function createToneSelector() {
  const selector = document.createElement("select");
  selector.classList.add("tone-selector");
  const tones = [
    "Professional",
    "Friendly",
    "Apologetic",
    "Funny",
    "Assertive",
  ];

  tones.forEach((tone) => {
    const option = document.createElement("option");
    option.value = tone.toLowerCase();
    option.innerText = tone;
    selector.appendChild(option);
  });

  return selector;
}

// Find the compose toolbar
function findComposeToolbar() {
  const selectors = [".btc", ".aDh", '[role="toolbar"]', ".gU.Up"];

  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) {
      return toolbar;
    }
  }

  return null;
}

// Get email content from the DOM automatically
function getEmailContent() {
  const emailBody = document.querySelector(".ii.gt"); // Update the selector if needed
  return emailBody ? emailBody.innerText.trim() : "";
}

// Observer to monitor DOM changes
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);

    addedNodes.forEach((node) => {
      console.log("Node added to DOM:", node);
    });

    const hasComponentElements = addedNodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('.aDh,btc,[role="dialog"]') ||
          node.querySelector('.aDh,btc,[role="dialog"]'))
    );

    if (hasComponentElements) {
      console.log("compose window detected");
      setTimeout(injectButton, 500);
    }
  }
});

// Start observing DOM changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
