import {
  panel,
  text,
  UserInputEventType,
  OnHomePageHandler,
  OnRpcRequestHandler,
  OnUserInputHandler,
} from "@metamask/snaps-sdk";
import {
  createKnowledgeBaseInterface,
  createMenuInterface,
  createPreTransactionInterface,
  createTransactionInterface,
  showErrorResult,
  showKnowledgeBaseLoader,
  showKnowledgeBaseResult,
  showTransactionGenerationLoader,
  showTransactionResult,
} from "./ui";

const BRIAN_MIDDLEWARE_BASE_URL = process.env.BRIAN_MIDDLEWARE_BASE_URL!;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL!;

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
        // check if the user has already connected the current account
        console.log("get snap state");
        const snapState = await snap.request({
          method: "snap_manageState",
          params: { operation: "get" },
        });
        console.log("snap state", snapState);
        if (snapState && snapState.alreadyConnected) {
          await createTransactionInterface(id);
        } else {
          await createPreTransactionInterface(id);
        }
        break;
      case "knowledge-base":
        console.log("Knowledge base clicked 🟡");
        await createKnowledgeBaseInterface(id);
        break;

      case "error-message":
        await showErrorResult(id, "ops");

      default:
        break;
    }
  }

  if (
    event.type === UserInputEventType.ButtonClickEvent &&
    event.name === "connect-wallet"
  ) {
    console.log("Connection form submitted 🔵");

    try {
      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      console.log("🟢 Accounts:", accounts);
      await snap.request({
        method: "snap_manageState",
        params: {
          operation: "update",
          newState: { alreadyConnected: true },
        },
      });
      await createTransactionInterface(id);
    } catch (error) {
      console.error("Connection error:", error);
      await showErrorResult(id, "Connection error");
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

      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      console.log("🟢 Accounts:", accounts);
      const result = await fetch(
        `${BRIAN_MIDDLEWARE_BASE_URL}/brian/transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: userPrompt,
            address: accounts[0],
          }),
        }
      );
      const data = await result.json();
      if (data.status !== "ok") {
        console.error("Brian error:", data);
        await showErrorResult(id, data.error.message, true);
        return;
      }
      console.log("Brian response:", JSON.stringify(data));
      console.log(
        "URL for SUBMITTING THE TX:",
        `${FRONTEND_BASE_URL}/tx/${data.id}`
      );
      await showTransactionResult(
        id,
        `${FRONTEND_BASE_URL}/tx/${data.id}`,
        data.data.data.description
      );
    } catch (error) {
      console.error("Brian error:", error);
      await showErrorResult(id, "Generic Transaction error");
    }
  }

  /** Handle Knowledge Base Form */
  if (
    event.type === UserInputEventType.FormSubmitEvent &&
    event.name === "knowledge-base-form"
  ) {
    console.log("Knowledge base form submitted 🟡");
    const { "user-prompt": userPrompt } = event.value;

    if (!userPrompt) {
      console.error("Knowledge base prompt is empty");
      await showErrorResult(
        id,
        "Your prompt is empty! I can't help you if you don't tell me what you want to know. 🤷🏼‍♂️"
      );
      return;
    }

    // brian call
    try {
      await showKnowledgeBaseLoader(id);
      console.log("calling brian with", BRIAN_MIDDLEWARE_BASE_URL, userPrompt);
      const result = await fetch(
        `${BRIAN_MIDDLEWARE_BASE_URL}/brian/knowledge-base`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: userPrompt,
          }),
        }
      );
      const data = await result.json();
      console.log("Brian response:", JSON.stringify(data));
      // const data = {
      //   status: "ok",
      //   data: {
      //     text: '"Overview"\n\nUniswap is a popular decentralized exchange protocol that enables users to swap various cryptocurrencies directly from their wallets without the need for intermediaries like traditional exchanges. It is built on the Ethereum blockchain and uses an automated market maker mechanism to facilitate trading. Uniswap has gained significant traction in the decentralized finance (DeFi) space due to its efficiency, transparency, and accessibility.\n\n"The Uniswap Protocol"\n\nThe Uniswap protocol consists of smart contracts deployed on the Ethereum blockchain that govern the exchange functions. These smart contracts are responsible for maintaining liquidity pools, determining exchange rates, and executing trades. Users interact with the protocol through decentralized applications (DApps) or interfaces that connect to the Uniswap smart contracts. The protocol is open-source, meaning that anyone can inspect the code, propose improvements, or create derivatives based on it.\n\n"Swaps"\n\nSwaps are the core feature of Uniswap and refer to the act of exchanging one cryptocurrency for another directly on the platform. Uniswap uses an automated market maker (AMM) model, specifically the constant product formula, to determine exchange rates based on the ratio of assets in a liquidity pool. This model eliminates the need for order books and counterparty risk, offering users fast and seamless trading experiences. Swaps on Uniswap can be executed with minimal slippage, making it an attractive option for traders seeking liquidity and competitive rates.\n\n"Glossary"\n\n- Liquidity Pools: Liquidity pools are pools of tokens locked in smart contracts that enable users to trade without relying on traditional order books. Liquidity providers contribute assets to these pools and earn fees based on their share of the pool\'s total liquidity.\n- Automated Market Maker (AMM): An automated market maker is a type of algorithmic trading system that determines asset prices based on predefined mathematical formulas. Uniswap uses an AMM model to facilitate trades and provide liquidity to users.\n- Smart Contracts: Smart contracts are self-executing contracts with predefined rules written in code. In the context of Uniswap, smart contracts govern the exchange functions, ensuring that trades are executed accurately and securely.\n\nIn conclusion, Uniswap is a decentralized exchange protocol that leverages smart contracts and an automated market maker mechanism to enable efficient and trustless cryptocurrency trading. By eliminating intermediaries and offering a transparent and user-friendly trading experience, Uniswap has become a cornerstone of the DeFi ecosystem."',
      //     sourceDocuments: [
      //       {
      //         pageContent: "Overview | Uniswap",
      //         metadata: {
      //           description: "Code",
      //           language: "en",
      //           source: "https://docs.uniswap.org/concepts/governance/overview",
      //           title: "Overview | Uniswap",
      //         },
      //       },
      //       {
      //         pageContent: "The Uniswap Protocol | Uniswap",
      //         metadata: {
      //           description: "Introduction",
      //           language: "en",
      //           source: "https://docs.uniswap.org/concepts/uniswap-protocol",
      //           title: "The Uniswap Protocol | Uniswap",
      //         },
      //       },
      //       {
      //         pageContent: "Swaps | Uniswap",
      //         metadata: {
      //           description: "Introduction",
      //           language: "en",
      //           source: "https://docs.uniswap.org/concepts/protocol/swaps",
      //           title: "Swaps | Uniswap",
      //         },
      //       },
      //       {
      //         pageContent: "Glossary | Uniswap",
      //         metadata: {
      //           description: "Automated Market Maker",
      //           language: "en",
      //           source: "https://docs.uniswap.org/concepts/glossary",
      //           title: "Glossary | Uniswap",
      //         },
      //       },
      //     ],
      //   },
      // };
      await showKnowledgeBaseResult(id, data.data);
    } catch (error) {
      console.error("Brian error:", error);
      await showErrorResult(id, "Brian error");
    }
  }
};
