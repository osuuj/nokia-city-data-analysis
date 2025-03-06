import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/ouuj_color.svg" // No need to import; it's in public/
      alt="Ouuj Logo"
      width={60}
      height={60}
      priority // Ensures fast loading
    />
  );
}
