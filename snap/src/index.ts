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
} from "./ui";

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
  return { id: interfaceId };
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  if (event.type === UserInputEventType.ButtonClickEvent) {
    switch (event.name) {
      case "transaction":
        await createTransactionInterface(id);
        break;
      // case "knowledge-base":
      //   await createKnowledgeBaseInterface(id);
      //   break;

      case "error-message":
        await showErrorResult(id, "ops");

      default:
        break;
    }
  }
  // await snap.request({
  //   method: "snap_manageState",
  //   params: {
  //     operation: "update",
  //     newState: {},
  //   },
  // });

  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("🔒 Page 2! "),
        text("This is the second page of the interface."),
        copyable("0x5ad11..."),
      ]),
    },
  });
};

// export const onHomePage: OnHomePageHandler = async () => {
//   const userPrompt = await snap.request({
//     method: "snap_dialog",
//     params: {
//       type: "prompt",
//       content: panel([
//         heading(`Gm, let's do something cool`),
//         text("Type below what you would like to do and I will make it happen."),
//         divider(),
//         text("For example:"),
//         text("Transfer 1 ETH to itsmide.eth"),
//       ]),
//       placeholder: "Transfer/Swap ...",
//     },
//   });

//   console.log("User prompt:", userPrompt);

//   return {
//     content: panel([
//       heading("Hello world!"),
//       text("This will be the first AI powered wallet!"),
//     ]),
//   };
// };
