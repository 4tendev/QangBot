import Invest from "./Index/Invest";
import SectionOne from "./Index/SectionOne";
import SectionTwo from "./Index/SectionTwo";
import SupportedExchanges from "./Index/SupportedExchanges";


export default function Home() {
  return (
    <div className="w-full max-w-6xl">
      <SectionOne />
      <SectionTwo/>
    </div>
  );
}
