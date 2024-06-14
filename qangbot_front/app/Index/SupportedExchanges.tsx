import React from "react";
import "./style.css";
import Image from "next/image";
import getLanguage from "@/commonTsServer/getLanguage";
import dictionary from "./dictionary.json";
const SupportedExchanges = () => {
  const lang = getLanguage().lang;

  return (
    <div className="sm:ps-11 sm:px-0  flex gap-2 flex-col py-3  ">
      <div className="text-info text-xl px-8">{dictionary.supportDex[lang]}</div>
      <div dir="ltr" className="scrolling-container w-full">
        <div className="flex flex-wrap items-center gap-2  h-10 sm:max-w-96 scrolling-content">
          <svg
            className="h-10 bg-black rounded-full"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.4037 18.7649C24.3154 19.2145 24.1768 19.6178 23.9835 19.975C23.7441 20.4203 23.4038 20.8279 22.9543 21.2018C22.5257 21.5548 22.0804 21.8111 21.6267 21.9666C21.173 22.122 20.5975 22.1976 19.9043 22.1976C18.98 22.1976 18.1482 22.0086 17.4088 21.6304C16.6694 21.2523 16.1232 20.6934 15.7703 19.9539C15.3838 20.6304 14.8461 21.1724 14.1529 21.5716C13.4597 21.9708 12.5985 22.1724 11.565 22.1724C10.8886 22.1724 10.2795 22.0674 9.73753 21.8615C9.19978 21.6556 8.73766 21.3573 8.35116 20.9708C8.04448 20.664 7.80079 20.3027 7.62435 19.8951C7.4479 19.4876 7.35547 19.0212 7.35547 18.496C7.35547 17.9708 7.45631 17.496 7.65796 17.0632C7.85962 16.6304 8.1327 16.2649 8.48139 15.9666C8.82589 15.664 9.22919 15.4287 9.68291 15.2607C10.1366 15.0926 10.6114 15.0044 11.1071 15.0044C11.7373 14.9876 12.3632 14.9792 12.9808 14.9708C13.5984 14.9624 14.2243 14.9581 14.8545 14.9581V13.7103C14.8545 12.9245 14.6276 12.3489 14.1697 11.9876C13.7118 11.6262 13.1194 11.4455 12.38 11.4455C11.6406 11.4455 11.0273 11.6094 10.5399 11.9413C10.0568 12.2733 9.79215 12.8069 9.74173 13.5506L7.85122 13.2102C7.91004 12.6892 8.05286 12.2355 8.27552 11.8405C8.54439 11.3615 8.8931 10.975 9.31321 10.6724C9.73752 10.3741 10.2207 10.1514 10.7584 10.0128C11.3003 9.87411 11.8465 9.80688 12.401 9.80688C12.7413 9.80688 13.0858 9.8405 13.4429 9.91193C13.8 9.98336 14.1445 10.0842 14.4848 10.2229C14.8209 10.3615 15.136 10.5422 15.4216 10.7649C15.7073 10.9876 15.9468 11.2481 16.1485 11.538C16.535 11.0002 17.0181 10.5842 17.602 10.2901C18.186 9.99596 18.917 9.8489 19.7992 9.8489C20.8033 9.8489 21.6057 10.0296 22.2149 10.3909C22.8241 10.7523 23.3366 11.2565 23.7525 11.9035C24.1054 12.4455 24.3449 13.0338 24.4709 13.6724C24.5927 14.3111 24.6557 15.0632 24.6557 15.9287V16.5296L16.7492 16.5548V16.6472C16.7492 17.143 16.8038 17.622 16.9089 18.0926C17.0181 18.5632 17.1945 18.9792 17.4424 19.3405C17.6903 19.7018 18.0095 19.996 18.4128 20.2187C18.8162 20.4413 19.3077 20.5548 19.8959 20.5548C20.463 20.5548 21.0049 20.3867 21.5133 20.0464C22.0216 19.706 22.3619 19.1682 22.53 18.4287L24.4037 18.7649ZM11.5566 16.4624C10.9558 16.4624 10.4349 16.6346 9.998 16.9834C9.55688 17.3321 9.33842 17.8279 9.33842 18.475C9.33842 19.122 9.54848 19.6178 9.97279 19.9666C10.3971 20.3153 10.918 20.4876 11.5314 20.4876C11.9767 20.4876 12.4178 20.4203 12.8463 20.2901C13.2791 20.1598 13.6488 19.9413 13.9555 19.6304C14.4008 19.185 14.6738 18.7271 14.7621 18.2649C14.8545 17.8027 14.9007 17.3027 14.9007 16.7607V16.4371L11.5566 16.4624ZM22.656 15.0044C22.6392 14.4666 22.5762 13.975 22.4585 13.538C22.3451 13.0968 22.1561 12.7187 21.8914 12.3951C21.6729 12.1178 21.3957 11.8909 21.0596 11.7145C20.7193 11.538 20.2908 11.4497 19.7656 11.4497C19.3203 11.4497 18.9338 11.5254 18.6103 11.6808C18.2868 11.8363 18.0011 12.0422 17.7533 12.3069C17.4298 12.6472 17.1861 13.0464 17.0265 13.5086C16.8668 13.9708 16.7828 14.4708 16.7828 15.0128H22.656V15.0044Z"
              fill="white"
            ></path>
            <path
              d="M15.9979 32C7.17551 32 0 24.8235 0 16C0 7.17647 7.17551 0 15.9979 0C24.8203 0 32 7.17647 32 16C32 24.8235 24.8203 32 15.9979 32ZM15.9979 1.76891C8.15438 1.76891 1.76866 8.15126 1.76866 16C1.76866 23.8487 8.15017 30.2311 15.9979 30.2311C23.8456 30.2311 30.2271 23.8487 30.2271 16C30.2271 8.15126 23.8456 1.76891 15.9979 1.76891Z"
              fill="white"
            ></path>
          </svg>
          <img
            className="h-full"
            src="https://file.coinexstatic.com/2022-04-22/2C38A1572E832AEADCDEFD6F5D66474C.png"
            alt="Coinex"
          ></img>
        </div>
      </div>
      <Image
        alt="Decentralized  Exchange"
        width={300}
        height={300}
        className=" hidden sm:block  "
        src={"/P2P.png"}
      />
    </div>
  );
};

export default SupportedExchanges;
