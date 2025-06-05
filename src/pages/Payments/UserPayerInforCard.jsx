import React from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaGlobeAmericas,
  FaLanguage,
  FaBriefcase,
} from "react-icons/fa";

const UserPayerInforCard = () => {
  const [isOpen, setIsOpen] = React.UseState(true);
  const userInfo = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 (555) 123-4567",
    dob: "1990-01-01",
    address: "123 Main St, Anytown, USA",
    nationality: "American",
    language: "English",
    occupation: "Software Developer",
    company: "Tech Solutions Inc.",
    department: "Engineering",
    profileImage:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  };

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center mb-4">
      <Icon className="text-blue-500 mr-3" size={20} />
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div
        className="flex justify-between items-center p-4 bg-blue-600 text-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-semibold">User Information</h2>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {isOpen && (
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <img
              src={userInfo.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={FaUser} label="Full Name" value={userInfo.name} />
            <InfoItem
              icon={FaEnvelope}
              label="Email Address"
              value={userInfo.email}
            />
            <InfoItem
              icon={FaPhone}
              label="Phone Number"
              value={userInfo.phone}
            />
            <InfoItem
              icon={FaBirthdayCake}
              label="Date of Birth"
              value={userInfo.dob}
            />
            <InfoItem
              icon={FaMapMarkerAlt}
              label="Address"
              value={userInfo.address}
            />
            <InfoItem
              icon={FaGlobeAmericas}
              label="Nationality"
              value={userInfo.nationality}
            />
            <InfoItem
              icon={FaLanguage}
              label="Primary Language"
              value={userInfo.language}
            />
            <InfoItem
              icon={FaBriefcase}
              label="Occupation"
              value={userInfo.occupation}
            />
            <InfoItem
              icon={FaBriefcase}
              label="Company"
              value={userInfo.company}
            />
            <InfoItem
              icon={FaBriefcase}
              label="Department"
              value={userInfo.department}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPayerInforCard;
