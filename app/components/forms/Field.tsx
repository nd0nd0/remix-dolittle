import { HTMLAttributes, forwardRef } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { twMerge } from "tailwind-merge";

interface FieldProps {
  label?: string;
  name: string;
  placeholder?: string;
  type:
    | "text"
    | "textarea"
    | "select"
    | "checkbox"
    | "number"
    | "password"
    | "email"
    | "hidden"
    | "location"
    | "tel"
    | "price";
  value?: string | number | undefined | string[];
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleEnterKeyPress?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string | undefined;
  min?: number;
  max?: number;
  checked?: boolean;
  className?: string;
  leftAddon?: string;
}

const TypeSwitch = ({
  label,
  leftAddon,
  type = "text",
  value,
  onChange = () => {},
  handleEnterKeyPress = () => {},
  error,
  name,
  placeholder,
  min,
  max,
  checked,
  className,
}: FieldProps) => {
  switch (type) {
    case "text":
    case "password":
    case "email":
    case "tel":
      return (
        <>
          {label && <label>{label}</label>}
          <div className="flex gap-2">
            {leftAddon && <p className="bg-black p-2 rounded-sm ">+256</p>}
            <input
              className={twMerge(
                className,
                `border-grey-light block w-full rounded border p-2  text-black ${
                  error && "border-red-500"
                }`
              )}
              type={type}
              onChange={(e) => {
                onChange(e);
              }}
              onKeyUp={(e) => {
                handleEnterKeyPress(e);
              }}
              name={name}
              value={value}
              placeholder={placeholder}
            />
          </div>
        </>
      );
    case "textarea":
      return (
        <>
          {label && <label>{label}</label>}
          <div className="flex gap-2">
            {leftAddon && <p className="bg-black p-2 rounded-sm ">+256</p>}
            <textarea
              className={twMerge(
                className,
                `border-grey-light block w-full rounded border p-2  text-black ${
                  error && "border-red-500"
                }`
              )}
              onChange={(e) => {
                onChange(e);
              }}
              onKeyUp={(e) => {
                handleEnterKeyPress(e);
              }}
              name={name}
              value={value}
              placeholder={placeholder}
            />
          </div>
        </>
      );
    case "checkbox":
      return (
        <>
          <input
            className={`border-grey-light block w-full rounded border p-2  text-black ${
              error && "border-red-500"
            }`}
            type={type}
            onChange={(e) => {
              onChange(e);
            }}
            onKeyUp={(e) => {
              handleEnterKeyPress(e);
            }}
            name={name}
            value={value}
            checked={checked}
          />
          <label>{label}</label>
        </>
      );
    case "number":
      return (
        <div className="flex items-center gap-4">
          <label>{label}</label>
          <input
            className={`border-grey-light block w-full rounded border p-2  text-black ${
              error && "border-red-500"
            }`}
            type={type}
            onChange={(e) => {
              onChange(e);
            }}
            onKeyUp={(e) => {
              handleEnterKeyPress(e);
            }}
            name={name}
            value={value}
            min={min}
            max={max}
          />
        </div>
      );
    case "price":
      return (
        <div className="relative flex items-center gap-4 ">
          <label>{label}</label>
          <input
            onChange={(e) => {
              onChange(e);
            }}
            onKeyUp={(e) => {
              handleEnterKeyPress(e);
            }}
            name={name}
            value={value}
            type={"number"}
            placeholder="10000 "
            className={twMerge(
              className,
              `border-grey-light block rounded border p-2  text-black ${
                error && "border-red-500"
              }`
            )}
            required
          />
          <span className=" !absolute right-1 top-1 z-10 flex h-[80%] select-none items-center rounded  py-2 px-4 text-center align-middle text-xs font-bold uppercase text-slate-500  transition-all focus:opacity-[0.85]  peer-placeholder-shown:pointer-events-none peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none active:opacity-[0.85] active:shadow-none">
            UGX
          </span>
        </div>
      );
    case "hidden":
      return <input type="hidden" name={name} value={value} />;
    case "location":
      return (
        <div className="relative flex w-full items-center gap-1">
          <label>{label}</label>
          <input
            className={`border-grey-light block w-full rounded border p-2  text-black ${
              error && "border-red-500"
            }`}
            placeholder="Kampala, Uganda "
          />
          <span className=" !absolute right-1 top-1 z-10 flex h-[80%] select-none items-center rounded   py-2 px-4 text-center align-middle text-xs font-bold uppercase text-slate-500  transition-all focus:opacity-[0.85]  peer-placeholder-shown:pointer-events-none peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none active:opacity-[0.85] active:shadow-none">
            <CiLocationArrow1 size={"1rem"} />
          </span>
        </div>
      );
    default:
      return null;
  }
};

export function Field(props: FieldProps) {
  return (
    <div className="relative">
      <TypeSwitch {...props} />

      <div className="text-sm text-red-500 absolute -bottom-12">
        {props.error}
      </div>
    </div>
  );
}
