import { extractChain } from "viem";
import {
  mainnet,
  polygon,
  scroll,
  arbitrum,
  optimism,
  gnosis,
  linea,
  base,
  zkSync,
  aurora,
  fantom,
  avalanche,
  bsc,
  okc,
  taikoKatla,
  goerli,
  holesky,
  Chain,
  lineaSepolia,
} from "wagmi/chains";

let customMainnet: Chain = {
  ...mainnet,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://eth.blockscout.com",
      apiUrl: "https://eth.blockscout.com/api/v2",
    },
  },
};

let customPolygon: Chain = {
  ...polygon,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://polygon.blockscout.com",
      apiUrl: "https://polygon.blockscout.com/api/v2",
    },
  },
};

let customArbitrum: Chain = {
  ...arbitrum,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://arbitrum.blockscout.com",
      apiUrl: "https://arbitrum.blockscout.com/api/v2",
    },
  },
};

let customOptimism: Chain = {
  ...optimism,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://optimism.blockscout.com",
      apiUrl: "https://optimism.blockscout.com/api/v2",
    },
  },
};

let customGnosis: Chain = {
  ...gnosis,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://gnosis.blockscout.com",
      apiUrl: "https://gnosis.blockscout.com/api/v2",
    },
  },
};

let customLinea: Chain = {
  ...linea,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://explorer.linea.build",
      apiUrl: "https://explorer.linea.build/api/v2",
    },
  },
};

let customBase: Chain = {
  ...base,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://base.blockscout.com",
      apiUrl: "https://base.blockscout.com/api/v2",
    },
  },
};

let customZkSync: Chain = {
  ...zkSync,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://zksync.blockscout.com",
      apiUrl: "https://zksync.blockscout.com/api/v2",
    },
  },
};

let customAurora: Chain = {
  ...aurora,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://explorer.mainnet.aurora.dev",
      apiUrl: "https://explorer.mainnet.aurora.dev/api/v2",
    },
  },
};

let customHolesky: Chain = {
  ...holesky,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://eth-holesky.blockscout.com",
      apiUrl: "https://eth-holesky.blockscout.com/api/v2",
    },
  },
};

let customLineaSepolia: Chain = {
  ...lineaSepolia,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://explorer.sepolia.linea.build",
      apiUrl: "https://explorer.sepolia.linea.build/api/v2",
    },
  },
};

const chains = [
  customMainnet,
  customPolygon,
  scroll,
  customArbitrum,
  customOptimism,
  customGnosis,
  customLinea,
  customBase,
  customZkSync,
  customAurora,
  fantom,
  avalanche,
  bsc,
  okc,
  taikoKatla,
  goerli,
  customHolesky,
  customLineaSepolia,
] as const;

export const getChainById = (id: number | undefined) => {
  if (!id) return undefined;
  const chain = extractChain({
    chains: Object.values(chains),
    id: id,
  });
  return chain;
};

export const getExplorerUrlByChainId = (id: number | undefined) => {
  if (!id) return undefined;
  const chain = getChainById(id);
  return chain?.blockExplorers?.default.url;
};

export { chains };
