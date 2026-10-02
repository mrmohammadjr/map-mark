import { UserRound } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import type { AccountInfo } from "@/types/types";
import Image from "next/image";
import Logo from "@/app/assets/logo.webp";
type Props = {
  account: AccountInfo;
};

export default function Header() {
  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex justify-start items-center">
        <Image src={Logo} alt="logo" className="w-14" />
        <h1 className="text-3xl font-bold text-gray-900">{APP_NAME}</h1>
      </div>
      <p className="text-green-500 text-sm my-5">
        Made for when you are lost find your self
      </p>
      {/* <div className="mt-3 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <UserRound size={20} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">
            {account.name}
          </p>
          <p className="truncate text-xs text-gray-500">{account.email}</p>
        </div>
      </div> */}
    </div>
  );
}
