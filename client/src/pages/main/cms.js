import { Routes, Route} from "react-router-dom";
import ProtectedRouteCMS from "../protected/protectedRouteCMS";

import CMSSidebar from "../cms/cmsSideBar";
import CMSNewDrama from "../cms/cmsNewDrama";
import CMSAward from "../cms/cmsAward";
import CMSCountries from "../cms/cmsCountries";
import CMSValidate from "../cms/cmsValidates";
import CMSGenres from "../cms/cmsGenres";
import CMSActors from "../cms/cmsActors";
import CMSComments from "../cms/cmsComments";
import CMSUsers from "../cms/cmsUsers";
import CMSBookmark from "../cms/cmsBookmark";

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
