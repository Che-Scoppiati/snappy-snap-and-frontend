import { Token } from "@brian-ai/sdk";
import Link from "next/link";
import { HiOutlineExternalLink } from "react-icons/hi";
import { extractChain, formatUnits } from "viem";
import * as chains from "viem/chains";

interface TokenDetailsProps {
  token: Token | undefined;
  amount: string | undefined;
}

export const TokenDetails: React.FC<TokenDetailsProps> = ({
  token,
  amount,
}) => {
  const floatAmount = parseFloat(amount || "0");

  let amountFormatted = formatUnits(BigInt(floatAmount), token?.decimals || 1);

  // if floatAmount > 10 and has decimals, leave only 2 decimals
  if (floatAmount > 10 && amountFormatted.includes(".")) {
    amountFormatted = parseFloat(amountFormatted).toFixed(2);
  }

  const dollarAmount =
    parseFloat(token?.priceUSD || "0") * parseFloat(amountFormatted);

  // const tokenChain = extractChain({
  //   chains: Object.values(chains),
  //   id: token?.chainId as any,
  // });

  // console.log(tokenChain);

  return (
    <div className="flex gap-4 items-center">
      <img
        src={token?.logoURI || ""}
        alt="Token Logo"
        className="w-[100px] h-[100px]"
      />
      <div className="flex flex-col">
        <span className="text-3xl font-bold">
          {amountFormatted} {token?.symbol}
        </span>
        <span className="text-lg">${dollarAmount}</span>
        <span>
          <Link
            href={`https://explorer.sepolia.linea.build/tx/${token?.address}`}
            target="_blank"
          >
            <span className="flex gap-1 text-zinc-300">
              {token?.name}
              <HiOutlineExternalLink className="mt-[0.15rem]" />
            </span>
          </Link>
        </span>
      </div>
    </div>
  );
};
