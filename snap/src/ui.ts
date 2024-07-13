import {
  panel,
  heading,
  button,
  form,
  input,
  text,
  copyable,
  divider,
  spinner,
} from "@metamask/snaps-sdk";

/**
 * @description createMenuInterface return the first manu interface
 * @returns Promise<string>
 */
export async function createMenuInterface(): Promise<string> {
  return await snap.request({
    method: "snap_createInterface",
    params: {
      ui: panel([
        heading(" Gm! How can I help you?"),
        text("Ask me for a transaction operation or for information!"),
        button({ value: "Transaction", name: "transaction" }),
        button({
          value: "Knowledge Base",
          name: "knowledge-base",
          variant: "secondary",
        }),
      ]),
    },
  });
}

export async function createPreTransactionInterface(id: string) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("Hey mate, do this before continue 😅"),
        text(
          "Before proceeding with the **transaction** feature, please **connect your wallet**, so I know who is performing transactions."
        ),
        divider(),
        text(
          "You only need to do this **once** for the current account. After the connection, reopen the snap and proceed with the transaction."
        ),
        text("Click the button below to connect your wallet 👇"),
        button({ value: "Connect", name: "connect-wallet" }),
      ]),
    },
  });
}

export async function createTransactionInterface(id: string) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("What do you want to do? 🧙🏼‍♂️"),
        text(
          "Let me create a transaction for you. Type below the transaction you want to do."
        ),
        form({
          name: "transaction-form",
          children: [
            input({
              label: "Prompt",
              name: "user-prompt",
              placeholder: "Transfer 1 ETH to ...",
            }),
            button({
              value: "Generate",
              buttonType: "submit",
            }),
          ],
        }),
        divider(),
        heading("Here are some examples:"),
        text("Transfer 1 ETH to itsmide.eth"),
        text("Swap 1 ETH to USDC"),
      ]),
    },
  });
}

export async function createKnowledgeBaseInterface(id: string) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("What do you want to know? 🔮"),
        text(
          "There are no stupid questions. Ask me anything about Ethereum, DeFi, NFTs, or anything else!"
        ),
        form({
          name: "knowledge-base-form",
          children: [
            input({
              label: "Prompt",
              name: "user-prompt",
              placeholder: "What is UniSwap?",
            }),
            button({
              value: "Ask",
              buttonType: "submit",
            }),
          ],
        }),
      ]),
    },
  });
}

export async function showTransactionGenerationLoader(id: string) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("Generating a new transaction... 🧠"),
        text(
          "Please wait. This should only take a few seconds. I'm thinking..."
        ),
        spinner(),
      ]),
    },
  });
}

export async function showKnowledgeBaseLoader(id: string) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("Searching for knowledge... 🔍"),
        text("Please wait. This should only take a few seconds."),
        spinner(),
      ]),
    },
  });
}

export async function showKnowledgeBaseResult(
  id: string,
  result: {
    text: string;
    sourceDocuments: {
      pageContent: string;
      metadata: {
        description: string;
        language: string;
        source: string;
        title: string;
      };
    }[];
  }
) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("Here is what I found! 📚"),
        text(result.text),
        divider(),
        heading("Source Documents:"),
        ...result.sourceDocuments.map((doc) => {
          return panel([
            text(
              `[${doc.metadata.title} [${doc.metadata.language}]](${doc.metadata.source})`
            ),
          ]);
        }),
      ]),
    },
  });
}

export async function showTransactionResult(
  id: string,
  link: string,
  description: string
) {
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: panel([
        heading("🔒 Okay, your transaction is ready! "),
        text(description),
        divider(),
        text("Please click the button below to proceed."),
        text(`[Fire Transaction 🔥](${link})`),
      ]),
    },
  });
  // await snap.request({
  //   method: "snap_dialog",
  //   params: {
  //     type: "confirmation",
  //     content: panel([
  //       heading("🔒 Okay, your transaction is ready! "),
  //       text(description),
  //       divider(),
  //       text("Please click the button below to proceed."),
  //       text(`[Fire Transaction 🔥](${link})`),
  //     ]),
  //   },
  // });
}

/**
 * @description generate UI interface to show an error status
 * @param id - the interface ID
 * @param errorMessage - the error message to display
 */
export async function showErrorResult(
  id: string,
  errorMessage: string,
  newId: boolean = false
) {
  if (newId) {
    await snap.request({
      method: "snap_createInterface",
      params: {
        ui: panel([
          heading("❌ Oops, Something went wrong! ❌"),
          text("An error happened. The error message log is:"),
          copyable(errorMessage),
        ]),
      },
    });
  } else {
    await snap.request({
      method: "snap_updateInterface",
      params: {
        id,
        ui: panel([
          heading("❌ Oops, Something went wrong! ❌"),
          text("An error happened. The error message log is:"),
          copyable(errorMessage),
        ]),
      },
    });
  }
}

/**
 *
 * @param id
 */
export async function cleanMessages(id: string) {
  await snap.request({
    method: "snap_manageState",
    params: {
      operation: "clear",
    },
  });
}
