import { Routes, Route} from "react-router-dom";
import CMSSidebar from "./content/cmsSideBar"; // Import Sidebar
import CMSNewDrama from "./content/cmsNewDrama";
import CMSAward from "./content/cmsAward"; // Contoh halaman Awards
import CMSCountries from "./content/cmsCountries"; // Contoh halaman Countries
import CMSValidate from "./content/cmsValidates";
import CMSGenres from "./content/cmsGenres"; // Contoh halaman
import CMSActors from "./content/cmsActors"; // Contoh halaman
import CMSComments from "./content/cmsComments"; // Contoh halaman
import CMSUsers from "./content/cmsUsers"; // Contoh halaman

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
