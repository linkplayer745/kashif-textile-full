import HomePageHero from "../../components/homepage-hero-section";
import Categories from "../../components/categories";
import NewArrival from "../../components/new-arrival";
import Accessories from "../../components/accessories";
import BrowseMore from "../../components/browse-more";
import Services from "../../components/services";

export default function Home() {
  return (
    <>
      <HomePageHero />
      <Categories />
      <NewArrival />
      <Accessories />
      <BrowseMore />
      <Services />
    </>
  );
}
