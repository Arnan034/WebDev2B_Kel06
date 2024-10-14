import { Routes, Route} from "react-router-dom";
import CMSSidebar from "./content/cmsSideBar";
import CMSNewDrama from "./content/cmsNewDrama";
import CMSAward from "./content/cmsAward";
import CMSCountries from "./content/cmsCountries";
import CMSValidate from "./content/cmsValidates";
import CMSGenres from "./content/cmsGenres";
import CMSActors from "./content/cmsActors";
import CMSComments from "./content/cmsComments";
import CMSUsers from "./content/cmsUsers";
import CMSBookmark from "./content/cmsBookmark";

const CMSLayout = () => {
  return (
    <div>
      <CMSSidebar /> {/* Menampilkan sidebar di layout */}
      <div className="content-cms">
        <Routes>
          
          <Route path="validate" element={<CMSValidate />} />
          <Route path="" element={<CMSNewDrama />} />
          <Route path="awards" element={<CMSAward />} />
          <Route path="countries" element={<CMSCountries />} />
          <Route path="genres" element={<CMSGenres />} />
          <Route path="actors" element={<CMSActors />} />
          <Route path="comments" element={<CMSComments />} />
          <Route path="users" element={<CMSUsers />} />
          <Route path="bookmark" element={<CMSBookmark />} />
        </Routes>
      </div>
    </div>
  );
};

const CMS = () => (
  <Routes>
    <Route path="/*" element={<CMSLayout />} /> {/* Layout CMS dengan rute wildcard */}
  </Routes>
);

export default CMS;
