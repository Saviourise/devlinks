import Links, { LinkProps } from "@/app/dashboard/links/page";
import React, { useEffect, useState } from "react";
import { providedLinks } from "@/data/Links";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  idx: number;
  saving: boolean;
};

const LinkComponent = ({ idx, saving }: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<LinkProps>(
    JSON.parse(sessionStorage.getItem("links") as string)[idx]
  );
  const [url, setUrl] = useState(selectedLink.link);

  useEffect(() => {
    if (saving) {
      setDropdownOpen(false);
    }
  }, [saving]);

  useEffect(() => {
    const link = selectedLink;
    link.link = url;
    const savedLinks = JSON.parse(sessionStorage.getItem("links") as string);

    savedLinks[idx] = link as LinkProps;
    sessionStorage.setItem("links", JSON.stringify(savedLinks));
    window.dispatchEvent(new Event("storage"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    const links = JSON.parse(sessionStorage.getItem("links") || "[]");
    setSelectedLink(links[idx]);

    const listenStorageChange = () => {
      const links = JSON.parse(sessionStorage.getItem("links") || "[]");
      // console.log(links);
      setSelectedLink(links[idx]);
    };
    window.addEventListener("storage", listenStorageChange);
    return () => window.removeEventListener("storage", listenStorageChange);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-[12px] rounded-[12px] p-[20px] bg-white-border items-center">
      <div className="flex flex-row gap-[12px] items-center w-full">
        <svg
          width="12"
          height="6"
          viewBox="0 0 12 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="12" height="1" fill="#737373" />
          <rect y="5" width="12" height="1" fill="#737373" />
        </svg>
        <p className="font-[700] text-[16px] text-grey-medium flex-1">
          Link #{idx + 1}
        </p>
        <button
          className="text-[16px] text-grey-medium"
          onClick={() => {
            const savedLinks = JSON.parse(
              sessionStorage.getItem("links") as string
            );
            savedLinks.splice(idx, 1);
            sessionStorage.setItem("links", JSON.stringify(savedLinks));
            window.dispatchEvent(new Event("storage"));
          }}
        >
          Remove
        </button>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="platform" className="text-grey-dark text-[12px]">
          Platform
        </label>

        <div className="relative">
          <div
            onClick={() => setDropdownOpen((dropdownOpen) => !dropdownOpen)}
            className={`${
              dropdownOpen
                ? "border-primary-default shadow-input border-[2px] text-primary-default"
                : "border-grey-light border-[1px] text-grey-dark"
            } bg-white-default capitalize rounded-[8px] flex flex-row gap-[12px] items-center py-[12px] px-[16px] text-[16px] w-full transition-all duration-300 cursor-pointer`}
          >
            <div className=" pointer-events-none">
              {
                providedLinks.find(({ name }) => name === selectedLink.name)?.[
                  dropdownOpen ? "svgActive" : "svg"
                ]
              }
            </div>
            <span>{selectedLink.name}</span>
            {dropdownOpen ? (
              <ChevronUp size={25} className="ml-auto" />
            ) : (
              <ChevronDown size={25} className="ml-auto" />
            )}
          </div>

          {/* <!-- Dropdown menu --> */}
          <div
            id="dropdown"
            className={`z-10 ${
              dropdownOpen ? "absolute" : "hidden"
            } bg-white-default  flex flex-col items-start rounded-[12px] shadow w-full mt-[20px] h-[250px] overflow-auto`}
          >
            {providedLinks.map(({ name, svg }, index) => {
              return (
                <>
                  <button
                    onClick={() => {
                      const link = providedLinks.find(
                        (link) => link.name === name
                      );
                      setSelectedLink(link as LinkProps);
                      setDropdownOpen(false);
                      console.log(link, idx);

                      const savedLinks = JSON.parse(
                        sessionStorage.getItem("links") as string
                      );
                      savedLinks[idx] = link as LinkProps;
                      sessionStorage.setItem(
                        "links",
                        JSON.stringify(savedLinks)
                      );
                      window.dispatchEvent(new Event("storage"));
                    }}
                    value={index}
                    className="text-grey-dark py-[12px] px-[16px] w-full text-start text-[16px] flex flex-row gap-[12px] items-center transition-all duration-300 hover:text-primary-default"
                  >
                    {providedLinks[index]["svg"]}
                    <span>{name}</span>
                  </button>
                  {index !== providedLinks.length - 1 && (
                    <div className="border-b-[1px] border-b-grey-light w-[calc(100%-32px)] m-auto h-1"></div>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="link" className="text-grey-dark text-[12px]">
          Link
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.52312 10.7207C7.59304 10.7903 7.64852 10.8731 7.68637 10.9643C7.72423 11.0555 7.74371 11.1532 7.74371 11.2519C7.74371 11.3506 7.72423 11.4484 7.68637 11.5395C7.64852 11.6307 7.59304 11.7135 7.52312 11.7832L7.15187 12.1544C6.44838 12.8579 5.49425 13.2531 4.49937 13.2531C3.50449 13.2531 2.55036 12.8579 1.84687 12.1544C1.14338 11.4509 0.748169 10.4968 0.748169 9.5019C0.748169 8.50702 1.14338 7.55289 1.84687 6.8494L3.35437 5.34253C4.0303 4.66493 4.93973 4.27142 5.89639 4.2426C6.85304 4.21378 7.78451 4.55184 8.5 5.18753C8.57386 5.25319 8.63408 5.33276 8.67719 5.42169C8.72031 5.51062 8.74549 5.60717 8.7513 5.70583C8.7571 5.8045 8.74341 5.90333 8.71102 5.99671C8.67863 6.09008 8.62816 6.17616 8.5625 6.25003C8.49683 6.3239 8.41727 6.38411 8.32834 6.42723C8.2394 6.47035 8.14285 6.49552 8.04419 6.50133C7.94553 6.50713 7.84669 6.49345 7.75331 6.46105C7.65994 6.42866 7.57386 6.37819 7.5 6.31253C7.07094 5.93148 6.51252 5.72877 5.93894 5.74584C5.36537 5.76292 4.81999 5.9985 4.41437 6.4044L2.90812 7.9094C2.48609 8.33143 2.249 8.90382 2.249 9.50065C2.249 10.0975 2.48609 10.6699 2.90812 11.0919C3.33015 11.5139 3.90254 11.751 4.49937 11.751C5.0962 11.751 5.66859 11.5139 6.09062 11.0919L6.46187 10.7207C6.53153 10.6509 6.61424 10.5956 6.70529 10.5579C6.79634 10.5201 6.89393 10.5007 6.9925 10.5007C7.09106 10.5007 7.18865 10.5201 7.2797 10.5579C7.37075 10.5956 7.45346 10.6509 7.52312 10.7207ZM12.1531 1.84565C11.4491 1.14325 10.4951 0.748779 9.50062 0.748779C8.5061 0.748779 7.55218 1.14325 6.84812 1.84565L6.47687 2.2169C6.33597 2.3578 6.25682 2.54889 6.25682 2.74815C6.25682 2.94741 6.33597 3.13851 6.47687 3.2794C6.61777 3.4203 6.80886 3.49945 7.00812 3.49945C7.20738 3.49945 7.39847 3.4203 7.53937 3.2794L7.91062 2.90815C8.33265 2.48613 8.90504 2.24903 9.50187 2.24903C10.0987 2.24903 10.6711 2.48613 11.0931 2.90815C11.5151 3.33018 11.7522 3.90257 11.7522 4.4994C11.7522 5.09624 11.5151 5.66863 11.0931 6.09065L9.58625 7.59815C9.18027 8.00388 8.63459 8.23912 8.06087 8.25574C7.48715 8.27235 6.92877 8.06908 6.5 7.68753C6.42613 7.62187 6.34005 7.5714 6.24668 7.539C6.1533 7.50661 6.05446 7.49292 5.9558 7.49873C5.85714 7.50453 5.76059 7.52971 5.67165 7.57283C5.58272 7.61595 5.50316 7.67616 5.4375 7.75003C5.37183 7.8239 5.32137 7.90997 5.28897 8.00335C5.25658 8.09672 5.24289 8.19556 5.24869 8.29422C5.2545 8.39288 5.27968 8.48944 5.3228 8.57837C5.36591 8.6673 5.42613 8.74687 5.5 8.81253C6.21498 9.44807 7.14583 9.78634 8.10203 9.75811C9.05824 9.72987 9.9675 9.33727 10.6437 8.66065L12.1512 7.15378C12.8545 6.44989 13.2496 5.49571 13.25 4.50073C13.2503 3.50575 12.8558 2.55129 12.1531 1.8469V1.84565Z"
                fill="#737373"
              />
            </svg>
          </div>
          <input
            placeholder="e.g. https://www.github.com/johnappleseed"
            type="url"
            id="link"
            name="link"
            value={selectedLink.link}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            required
            className={`${
              selectedLink.error &&
              "border-red focus:outline-red focus:shadow-none pe-28"
            } border-[1px] border-grey-light rounded-[8px] py-[12px] px-[16px] text-grey-dark placeholder-grey-light text-[16px] block w-full ps-10 focus:outline-primary-default focus:shadow-input transition-all duration-300`}
          />

          <div className="absolute inset-y-0 end-5 flex items-center ps-3 pointer-events-none">
            <p className="text-[12px] text-red">{selectedLink.error}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkComponent;
