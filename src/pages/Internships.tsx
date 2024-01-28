// Internships.tsx
import React, { useState } from 'react';
import Img from '../assets/internships/Internships.svg';
import Img1 from '../assets/internships/Internships1.svg';
import SAIL from '../assets/internships/SAIL.png';
import DRDO from '../assets/internships/DRDO.png';
import Navbar from '../components/Navbar';
import { useDarkMode } from '../components/DarkMode';

interface InternshipCardProps {
  image: string;
  title: string;
  role: string;
  moreInfo: string;
  popupContent: PopupContentProps;
  onMoreInfoClick: (content: PopupContentProps) => void;
}

interface PopupContentProps {
  text: string;
  imageUrl: string;
  role: string;
  description: string;
  skill: string;
}

const InternshipCard: React.FC<InternshipCardProps> = ({ image, title, role, moreInfo, popupContent, onMoreInfoClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cardWidth, setCardWidth] = useState(96);
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`group relative z-10 h-44 w-${cardWidth} ${isDarkMode ? 'bg-emerald-800' : 'bg-green-100'} border-4 border-green-600 top-24 transform shadow-lg rounded-2xl p-2 flex items-center mb-4 gap-3 transition-all duration-300`}
      onMouseEnter={() => {
        setIsHovered(true);
        setCardWidth(120);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCardWidth(96);
      }}
    >
      <img src={image} alt="Your Alt Text" className="w-1/ h-full object-cover rounded-md" />

      <div className={`flex flex-col ml-4 w-2/3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <div className="text-xl font-bold">{title}</div>
        <div className="text-lg">{role}</div>
      </div>

      {isHovered && (
        <button
          onClick={() => onMoreInfoClick(popupContent)}
          className={`absolute right-4 top-7 transform -translate-y-1/2 ${isDarkMode ? 'bg-teal-200 text-green-800' : 'bg-gray-200 text-gray-800'} px-4 py-2 rounded-full opacity-100 transition-opacity duration-500 delay-1000`}
        >
          {moreInfo} <span className="ml-1">&#x2192;</span>
        </button>
      )}
    </div>
  );
};

const Internships: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState<PopupContentProps | null>(null);
  const { isDarkMode } = useDarkMode();

  const handleMoreInfoClick = (content: PopupContentProps) => {
    setPopupContent(content);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupContent(null);
  };

  return (
    <div id="internships" className={`flex flex-col border-y-2 border-green-300 items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-white'} relative`}>
      <Navbar />
      <div className={`flex flex-box justify-center items-center absolute top-16 left-24 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <h1 className="b text-emerald-400 text-8xl mt-10">Internships.</h1>
      </div>
      <div className={`flex flex-box justify-center items-center absolute z-50 top-24 right-72 mr-24 max-w-[500px] ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
        <p className="sb text-2xl mt-8">
          Have a look at the organisations that found me worthy enough to work for them!
        </p>
      </div>

      <div className="flex flex-col items-center">
        <InternshipCard
          image={SAIL}
          title="Steel Authority of India Limited"
          role="Flutter Developer Intern"
          moreInfo="Additional Info 1"
          popupContent={{
            text: "Steel Authority of India Limited",
            imageUrl: SAIL,
            skill: "Flutter, Node.js, OracleDB",
            role: "Flutter Developer Intern",
            description: `Led development of a cutting-edge mobile app with Flutter and Node.js, optimizing for iOS and Android. Integrated OracleDB for improved data access and efficiency, collaborating with diverse teams for success.`}}
          onMoreInfoClick={handleMoreInfoClick}
        />

        <div className="ml-4 md:ml-96 lg:right-80">
          <InternshipCard
            image={DRDO}
            title="Defence Research and Development Organisation"
            role="Research and Development Intern"
            moreInfo="Additional Info 2"
            popupContent={{
              text: "Defence Research and Development Organisation",
              imageUrl: DRDO,
              role: "Research and Development Intern",
              skill: "Python, GIS",
              description: `
              Explored terrain using QGIS and Python, enhancing efficiency in identifying ridges and spurs from DEM data. Elevated geospatial insights and streamlined terrain assessment for improved outcomes.`}}
            onMoreInfoClick={handleMoreInfoClick}
          />
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center gap-5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} bg-opacity-50 z-50">
          <div className={`bg-green-100 border-4 border-green-600 p-8 rounded-2xl shadow-md ${isDarkMode ? 'shadow-green-500 text-gray-800' : 'shadow-blue-500 text-gray-800'} flex`}>
            {popupContent?.imageUrl && (
              <div className="mr-4">
                <img src={popupContent.imageUrl} alt="Popup Image" className="w-1/ h-64 object-cover rounded-md" />
              </div>
            )}
            <div className="flex flex-col justify-between">
              <div>
                <p className="font-bold">Organisation: {popupContent?.text}</p>
                <p className="font-semibold">Role: {popupContent?.role}</p>
                <p className="font-semibold">Skills: {popupContent?.skill}</p>
                <p>Description:</p>
                <p
                  className="max-w-80 text-justify overflow-hidden"
                >
                  {popupContent?.description}
                </p>
              </div>
              <div className="flex justify-center mt-4">
                <button onClick={handleClosePopup} className={`bg-red-400 text-white px-4 py-2 rounded-full ${isDarkMode ? 'hover:bg-red-600' : 'hover:bg-red-300'}`}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-box justify-center items-center absolute bottom-0 left-0 h-2/3">
        <img src={Img} alt="Img" className="w-full h-full object-cover z-20 transition-all duration-300" />
      </div>
      <div className="flex flex-box justify-center items-center absolute top-0 right-0 h-2/6">
        <img src={Img1} alt="Img" className="w-full h-full object-cover z-20 transition-all duration-300" />
      </div>
    </div>
  );
};

export default Internships;
