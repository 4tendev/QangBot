import Image from "next/image";
import React from "react";

interface ProfileImageProps {
  onClick?: () => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Image
      onClick={handleClick}
      alt="Profile"
      role="button"
      tabIndex={0}
      width={48}
      height={48}
      className="rounded-full btn btn-outline p-0 border border-info"
      src={"/avatar.png"}
    />
  );
};

export default ProfileImage;
