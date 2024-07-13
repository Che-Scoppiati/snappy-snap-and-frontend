import { Token } from "@brian-ai/sdk";
import Link from "next/link";
import { HiOutlineExternalLink } from "react-icons/hi";
import { extractChain, formatUnits } from "viem";
import * as chains from "viem/chains";

interface TokenDetailsProps {
  token: Token | undefined;
  amount: string | undefined;
  isFrom: boolean;
  address: string | undefined;
}

export const TokenDetails: React.FC<TokenDetailsProps> = ({
  token,
  amount,
  isFrom,
  address,
}) => {
  const intAmount = parseInt(amount || "0");

  let amountFormatted = formatUnits(BigInt(intAmount), token?.decimals || 1);

  // if floatAmount > 10 and has decimals, leave only 2 decimals
  if (parseFloat(amountFormatted) > 10 && amountFormatted.includes(".")) {
    amountFormatted = parseFloat(amountFormatted).toFixed(2);
  }

  const dollarAmount =
    parseFloat(token?.priceUSD || "0") * parseFloat(amountFormatted);

  // const tokenChain = extractChain({
  //   chains: Object.values(chains),
  //   id: token?.chainId as any,
  // });

  // console.log(tokenChain);

  const shortAddress = address?.slice(0, 6) + "..." + address?.slice(-4);

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex gap-2">
        <span>{isFrom ? "From:" : "To:"}</span>
        <span>
          <Link
            href={`https://explorer.sepolia.linea.build/address/${address}`}
            target="_blank"
          >
            <span className="flex gap-1 text-zinc-300 items-center">
              {shortAddress}
              <HiOutlineExternalLink />
            </span>
          </Link>
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <img
          src={token?.logoURI || ""}
          alt="Token Logo"
          className="w-[90px] h-[90px]"
        />
        <div className="flex flex-col">
          <span className="text-3xl font-bold">
            {amountFormatted} {token?.symbol}
          </span>
          <span className="text-lg">${dollarAmount}</span>
          <span>
            <Link
              href={`https://explorer.sepolia.linea.build/address/${token?.address}`}
              target="_blank"
            >
              <span className="flex gap-1 text-zinc-300 items-center">
                {token?.name}
                <HiOutlineExternalLink />
              </span>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
