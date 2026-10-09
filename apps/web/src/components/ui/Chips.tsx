import { cx } from "./cx";

/** Accessible chip group backed by native checkboxes or radios inside a fieldset. */
export function Chips<T extends string | number>({
  legend,
  hint,
  name,
  type,
  options,
  value,
  onChange,
}: {
  legend: string;
  hint?: string;
  name: string;
  type: "checkbox" | "radio";
  options: { value: T; label: string }[];
  value: T[];
  onChange: (value: T[]) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-medium">{legend}</legend>
      {hint && <p className="text-sm text-muted">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = value.includes(o.value);
          return (
            <label
              key={String(o.value)}
              className={cx(
                "tap inline-flex cursor-pointer items-center rounded-full border-2 px-4 py-2 font-medium has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-[var(--focus)]",
                checked ? "border-primary bg-primary text-on-primary" : "border-border bg-surface hover:border-muted",
              )}
            >
              <input
                type={type}
                name={name}
                value={String(o.value)}
                checked={checked}
                onChange={(e) => {
                  if (type === "radio") onChange([o.value]);
                  else onChange(e.target.checked ? [...value, o.value] : value.filter((v) => v !== o.value));
                }}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
