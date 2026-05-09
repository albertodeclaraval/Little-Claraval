import ComingSoon from './page.comingsoon';

// Para ver la app real, cambia NEXT_PUBLIC_COMING_SOON a "false" en Vercel
const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON !== 'false';

export default function Home() {
  if (isComingSoon) return <ComingSoon />;

  // === TU APP REAL ABAJO ===
  return (
    <div>
      <h1>Little Claraval</h1>
    </div>
  );
}
