'use client';

export default function Home({ children, }: { children: React.ReactNode }) {

  return (
    <div className="flex flex-col justify-start items-start">
      <img className="w-full h-auto" src={`/fireworksWelcome.svg`}/>
      <img className="w-full h-auto" src={`/fireworksEzy.svg`}/>
      <img className="w-full h-auto" src={`/fireworksApportioning.svg`}/>
    </div>
  );
}

