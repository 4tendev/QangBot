import Invest from "./Index/Invest";
import SectionOne from "./Index/SectionOne";


export default function Home() {
  return (
    <div className="w-full max-w-6xl">
      <SectionOne />
      <Invest />
    </div>
  );
}
