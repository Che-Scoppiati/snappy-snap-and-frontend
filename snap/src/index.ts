import {
  panel,
  text,
  heading,
  copyable,
  UserInputEventType,
  OnHomePageHandler,
  OnRpcRequestHandler,
  OnUserInputHandler,
} from "@metamask/snaps-sdk";
import {
  createMenuInterface,
  createTransactionInterface,
  showErrorResult,
  showTransactionGenerationLoader,
  showTransactionResult,
} from "./ui";

const BRIAN_MIDDLEWARE_BASE_URL = process.env.BRIAN_MIDDLEWARE_BASE_URL;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case "hello":
      return snap.request({
        method: "snap_dialog",
        params: {
          type: "confirmation",
          content: panel([
            text(`Hello, **${origin}**!`),
            text("This custom confirmation is just for display purposes."),
            text(
              "But you can edit the snap source code to make it do something, if you want to!"
            ),
          ]),
        },
      });
    default:
      throw new Error("Method not found.");
  }
};

export const onHomePage: OnHomePageHandler = async () => {
  const interfaceId = await createMenuInterface();
  console.log("Homepage Interface ID:", interfaceId);
  return { id: interfaceId };
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  console.log("Interface ID:", id);
  console.log("User input event:", JSON.stringify(event));
  if (event.type === UserInputEventType.ButtonClickEvent) {
    switch (event.name) {
      case "transaction":
        await createTransactionInterface(id);
        break;
      case "knowledge-base":
        console.log("Knowledge base clicked 🟡");
        // await createKnowledgeBaseInterface(id);
        // openPopup("https://google.com");
        break;

      case "error-message":
        await showErrorResult(id, "ops");

      default:
        break;
    }
  }

  /** Handle Transaction Form */
  if (
    event.type === UserInputEventType.FormSubmitEvent &&
    event.name === "transaction-form"
  ) {
    console.log("Transaction form submitted 🔵");
    const { "user-prompt": userPrompt } = event.value;

    if (!userPrompt) {
      console.error("User prompt is empty");
      await showErrorResult(id, "Your prompt is empty");
      return;
    }

    // brian call
    try {
      await showTransactionGenerationLoader(id);
      console.log("calling brian with", BRIAN_MIDDLEWARE_BASE_URL, userPrompt);

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("🟢 Accounts:", accounts);
      // const result = await fetch(
      //   `${BRIAN_MIDDLEWARE_BASE_URL}/brian/transaction`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       prompt: userPrompt,
      //       address: accounts[0],
      //     }),
      //   }
      // );
      // const data = await result.json();
      // console.log("Brian response:", JSON.stringify(data));
      await showTransactionResult(
        id,
        "https://google.com",
        // data.data[0].data.description
        "Transaction generated"
      );
    } catch (error) {
      console.error("Brian error:", error);
      await showErrorResult(id, "Brian error");
    }
  }
};

// const openPopup = (url: string) => {
//   // Define the dimensions of the popup window
//   const width = 600;
//   const height = 400;

//   // Calculate the position of the popup to center it on the screen
//   const left = screen.width / 2 - width / 2;
//   const top = screen.height / 2 - height / 2;

//   console.log("Opening popup window with dimensions:", {
//     width,
//     height,
//     top,
//     left,
//   });

//   // Open the popup window with the specified dimensions and position
//   window.open(
//     url,
//     "_blank",
//     `width=${width},height=${height},top=${top},left=${left}`
//   );
// };
