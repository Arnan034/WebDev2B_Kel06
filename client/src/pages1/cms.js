import { Routes, Route} from "react-router-dom";
import ProtectedRouteCMS from "./protectedRouteCMS";
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
          
          <Route path="" element={<CMSNewDrama />} />
          <Route path="validate" element={<ProtectedRouteCMS element={<CMSValidate />} />} />
          <Route path="awards" element={<ProtectedRouteCMS element={<CMSAward />} />} />
          <Route path="countries" element={<ProtectedRouteCMS element={<CMSCountries />} />} />
          <Route path="genres" element={<ProtectedRouteCMS element={<CMSGenres />} />} />
          <Route path="actors" element={<ProtectedRouteCMS element={<CMSActors />} />} />
          <Route path="comments" element={<ProtectedRouteCMS element={<CMSComments />} />} />
          <Route path="users" element={<ProtectedRouteCMS element={<CMSUsers />} />} />
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
