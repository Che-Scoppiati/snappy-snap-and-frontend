import { getChainById } from "@/config/costants";
import { Token } from "@brian-ai/sdk";
import Link from "next/link";
import { HiOutlineExternalLink } from "react-icons/hi";
import { formatUnits } from "viem";

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

  if (parseFloat(amountFormatted) > 10 && amountFormatted.includes(".")) {
    amountFormatted = parseFloat(amountFormatted).toFixed(2);
  }

  const dollarAmount =
    parseFloat(token?.priceUSD || "0") * parseFloat(amountFormatted);

  const chain = getChainById(token?.chainId);

  const chainName = chain?.name;
  const explorerUrl = chain?.blockExplorers?.default.url;

  const shortAddress = address?.slice(0, 6) + "..." + address?.slice(-4);

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex gap-2">
        <span>{isFrom ? "From:" : "To:"}</span>
        <span>
          <Link href={`${explorerUrl}/address/${address}`} target="_blank">
            <span className="flex gap-1 text-zinc-300 items-center">
              {shortAddress}
              <HiOutlineExternalLink />
            </span>
          </Link>
        </span>
        <span>({chainName})</span>
      </div>
      <div className="flex gap-4 items-center">
        <img
          src={token?.logoURI || ""}
          alt="Token Logo"
          className="w-[90px] h-[90px] rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-3xl font-bold">
            {amountFormatted} {token?.symbol}
          </span>
          <span className="text-lg">${dollarAmount}</span>
          <span>
            <Link
              href={`${explorerUrl}/address/${token?.address}`}
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
