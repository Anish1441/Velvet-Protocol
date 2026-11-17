export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <h1 className="text-5xl md:text-7xl font-gothic font-bold tracking-widest text-crimson uppercase">
        Velvet Protocol
      </h1>
      <p className="text-lg md:text-xl font-body text-ivory/70 tracking-wide">
        The Nocturne Heist
      </p>
      <div className="mt-8 px-6 py-3 border border-brass/40 rounded text-brass/80 text-sm tracking-widest uppercase">
        C.O.R.V.U.S. is watching…
      </div>
    </main>
  );
}
