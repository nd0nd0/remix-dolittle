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
    | "price";
  value?: string | number | undefined | string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEnterKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string | undefined;
  min?: number;
  max?: number;
  checked?: boolean;
  className?: string;
}

const TypeSwitch = ({
  label,
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
      return (
        <>
          <label>{label}</label>
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

      <div className="text-sm text-red-500 absolute -bottom-5">
        {props.error}
      </div>
    </div>
  );
}
