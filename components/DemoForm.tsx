"use client";

/* Newsletter-style demo form: no backend yet — confirms via toast (same
   behavior as the prototype's data-demo-form). */

import { useToast } from "@/components/Toast";

export default function DemoForm({
  message,
  placeholder,
  idPrefix,
}: {
  message: string;
  placeholder: string;
  idPrefix: string;
}) {
  const toast = useToast();
  return (
    <form
      className="input-inline"
      style={{ marginInline: "auto" }}
      onSubmit={(e) => {
        e.preventDefault();
        toast(message);
        e.currentTarget.reset();
      }}
    >
      <label className="visually-hidden" htmlFor={`${idPrefix}-email`}>Email address</label>
      <input id={`${idPrefix}-email`} type="email" required placeholder={placeholder} />
      <button className="btn btn--gold" type="submit">Subscribe</button>
    </form>
  );
}
