import AvailableProduct from "~/components/AvailableProduct";
import Hero from "~/components/Header/Hero";
import LatestCollection from "~/components/LatestCollection";

function Home() {
    return (
        <div>
            <Hero />
            <LatestCollection />
            <AvailableProduct />
        </div>
    );
}

export default Home;
