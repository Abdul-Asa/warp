import Link from "next/link";

export default function Home() {
  return (
    <div className="inset-0 absolute z-20  flex-col flex justify-center items-center">
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <h1 className="text-4xl text-transparent transform cursor-default bg-brand-text text-edge-outline font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text animate-title ">
        ASA
      </h1>
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="relative p-2 my-16 text-center animate-fade-in">
        <h2 className="text-sm text-brand-text">
          Hi👋🏾, my name is Abdullah. I’m a full-stack software developer from
          🇳🇬.
          <br />
          Welcome to my{" "}
          <Link href={"projects"} className="text-brand-accent">
            Space
          </Link>{" "}
          on the web
        </h2>
      </div>
    </div>
  );
}
